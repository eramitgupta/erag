---
title: Laravel API Email Validation and 422 JSON Errors
headline: "Laravel API Email Validation: Return 422 JSON Errors and Block Disposable Emails (Laravel 13)"
description: "Laravel API email validation with Form Requests: return clean 422 JSON errors, change the error format, block disposable emails and test it all with Pest."
date: 2026-10-23
package: laravel-disposable-email
category: Tutorial
tags: [laravel, api, validation, email]
image: /images/laravel-api-email-validation.jpg
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/laravel-api-email-validation.md
</div>

![Laravel API returning a 422 JSON validation error for a disposable email address](/images/laravel-api-email-validation.jpg)

For Laravel API email validation, put the rules in a Form Request and have clients send an `Accept: application/json` header. When validation fails, Laravel responds with status 422 and a JSON body that holds a `message` and an `errors` object keyed by field name. Add the `disposable_email` rule from `erag/laravel-disposable-email` to the email field, and burner addresses get the same 422 response, checked against a list stored in your app instead of an outside service.

This guide builds a registration endpoint for a mobile app or SPA on Laravel 13 with Sanctum. It explains the exact JSON shape your client receives, shows how to change that shape, adds a small endpoint that checks an email without registering, and tests everything with Pest. The same code runs on Laravel 11 and 12.

## The short version

1. Run `php artisan install:api` to get `routes/api.php` and Sanctum.
2. Install `erag/laravel-disposable-email` and sync its domain list.
3. Validate in a Form Request: `['bail', 'required', 'string', 'max:255', 'email:rfc,dns', 'disposable_email', 'unique:users,email']`.
4. Send `Accept: application/json` from every client, or force JSON for `api/*` routes.
5. Read errors from `errors.email[0]` when the status is 422.
6. Need a different error shape? Change it once with `$exceptions->render()` in `bootstrap/app.php`, and keep status 422.
7. Add `POST /api/email/check` that returns the result of `Disposable::check()`.
8. Rate limit both routes and test them with `postJson()`.

## Set up API routes and Sanctum

A fresh Laravel app has no API routes file. One command adds it:

```bash
php artisan install:api
```

It installs Laravel Sanctum, publishes the migration for API tokens, creates `routes/api.php` and registers it in `bootstrap/app.php`. Routes in that file get the `/api` prefix and no sessions or CSRF checks, which is what token-based clients like mobile apps need.

Then add the `HasApiTokens` trait to your `User` model, next to the traits already there:

```php
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
}
```

## Install the disposable email package

```bash
composer require erag/laravel-disposable-email
php artisan erag:install-disposable-email
php artisan erag:sync-disposable-email-list
```

About 3,750 common disposable domains are bundled, so the big temporary inbox services are blocked right after you install. The sync command loads the full list, which had 136,240 domains on 12 October 2026, into `storage/app/blacklist_file`. Schedule it in `routes/console.php` so new domains are picked up:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('erag:sync-disposable-email-list')->daily();
```

## How to validate registration in a Laravel API

```bash
php artisan make:request Api/RegisterRequest
php artisan make:controller Api/RegisterController --invokable
```

The Form Request holds every rule:

```php
<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        $emailFormat = app()->runningUnitTests() ? 'email:rfc' : 'email:rfc,dns';

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['bail', 'required', 'string', 'max:255', $emailFormat, 'disposable_email', 'unique:users,email'],
            'password' => ['required', 'string', 'confirmed', Password::defaults()],
            'device_name' => ['required', 'string', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.disposable_email' => 'Please use a permanent email address. Temporary inboxes are not allowed.',
        ];
    }
}
```

Each part of the email rule has a job:

| Rule | What it does |
| --- | --- |
| `bail` | Stops at the first failed rule, so the client gets one clear message. |
| `email:rfc,dns` | Checks the format and that the domain has a mail server (an MX record). |
| `disposable_email` | Checks the domain against the list of temporary inbox services. |
| `unique:users,email` | Runs last, so the database is only queried for addresses that passed. |

Without `bail`, a value like `not-an-email` fails two rules and the client receives two messages for one field.

`bail` works on one field. To stop the whole request at the first field that fails, Laravel 13 Form Requests accept a `#[StopOnFirstFailure]` attribute on the class, imported from `Illuminate\Foundation\Http\Attributes`. On older versions, set `protected $stopOnFirstFailure = true;` instead. For a sign-up endpoint, `bail` is usually the better choice, because the client can show an error under every field at once.

The `dns` mode makes a real DNS lookup. It needs network access and PHP's `intl` extension, which is why the test suite uses `email:rfc` only. Recent Laravel 13 releases also include `Validator::fakeDnsLookups()`. Call it at the start of a test and the `dns` check gets a fake answer while every other check still runs, so you could keep `email:rfc,dns` in every environment. The [RFC, DNS and MX guide](./laravel-email-validation-rfc-dns.md) explains what each mode costs.

The package can also run the format checks itself, as `disposable_email:rfc,dns`. That's one rule instead of two, but with the string rule every failure returns the same "unauthorized email provider" message, even a simple typo in the domain. Keeping Laravel's `email` rule separate gives each problem its own message. If you'd rather use one rule, the rule object `Disposable::rule('rfc', 'dns')` returns Laravel's normal "must be a valid email address" message for format problems.

The controller only runs after validation passes:

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\RegisterRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;

class RegisterController extends Controller
{
    public function __invoke(RegisterRequest $request): JsonResponse
    {
        $user = User::create($request->safe()->only(['name', 'email', 'password']));

        event(new Registered($user));

        return response()->json([
            'user' => $user->only(['id', 'name', 'email']),
            'token' => $user->createToken($request->validated('device_name'))->plainTextToken,
        ], 201);
    }
}
```

The default `User` model hashes the password through its `hashed` cast. `createToken()` comes from Sanctum, and the client sends the token back as `Authorization: Bearer <token>` on later requests.

And the routes:

```php
// routes/api.php
use App\Http\Controllers\Api\EmailCheckController;
use App\Http\Controllers\Api\RegisterController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', RegisterController::class)->middleware('throttle:register');
Route::post('/email/check', EmailCheckController::class)->middleware('throttle:email-check');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
```

## What a Laravel 422 validation error looks like in JSON

Send a burner address, with the other fields valid:

```bash
curl -X POST https://example.com/api/register \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"name":"Asha","email":"someone@mailinator.com","password":"secret-password-123","password_confirmation":"secret-password-123","device_name":"Pixel"}'
```

Laravel answers with status `422 Unprocessable Content`:

```json
{
    "message": "Please use a permanent email address. Temporary inboxes are not allowed.",
    "errors": {
        "email": [
            "Please use a permanent email address. Temporary inboxes are not allowed."
        ]
    }
}
```

How to read it:

- **`errors`** has one key per failed field. Each value is an array of messages, so clients should show the first one.
- **`message`** repeats the first error. When there are more errors, Laravel adds a count, like "(and 2 more errors)".
- **Nested fields** use dot keys, such as `contacts.0.email`, when you validate arrays.

In a Vue, React or plain TypeScript client, the handling is the same everywhere:

```ts
type ValidationErrors = Record<string, string[]>;

async function register(payload: Record<string, string>): Promise<ValidationErrors | null> {
    const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
    });

    if (response.status === 422) {
        const body: { message: string; errors: ValidationErrors } = await response.json();

        return body.errors;
    }

    return null;
}

// errors?.email?.[0] → "Please use a permanent email address. ..."
```

To show these messages as toast notifications in a Vue app, see [how to show API error messages as toasts in Vue 3](./vue-3-api-error-toasts.md).

## How to always return JSON from Laravel API routes

The `Accept: application/json` header is what tells Laravel the client wants JSON. Without it, a failed Form Request is treated like a browser form: Laravel sends a 302 redirect back to the previous page. Mobile developers usually meet this as "the API returns HTML".

Fix the clients, and also make Laravel answer every `api/*` request with JSON in `bootstrap/app.php`:

```php
use Illuminate\Http\Request;

->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->shouldRenderJsonWhen(function (Request $request, Throwable $e) {
        return $request->is('api/*') || $request->expectsJson();
    });
})
```

Now validation errors, 404s and 429s from your API always come back as JSON, whatever headers the client forgets.

## How to customize the validation error response in a Laravel API

Laravel's default shape suits most clients. If your mobile team expects an extra field, such as a `success` flag or an error code, change it in one place. Add a `render()` callback inside the same `withExceptions()` block in `bootstrap/app.php`:

```php
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

// Inside ->withExceptions(), next to shouldRenderJsonWhen():
$exceptions->render(function (ValidationException $e, Request $request) {
    if ($request->is('api/*')) {
        return response()->json([
            'success' => false,
            'code' => 'validation_failed',
            'message' => $e->getMessage(),
            'errors' => $e->errors(),
        ], $e->status);
    }
});
```

Laravel runs this callback before its own validation handling. For any other path the callback returns nothing, so your web forms keep their normal redirect with errors.

Add fields next to `message` and `errors` rather than renaming them. Clients written for Laravel keep working, and `assertJsonValidationErrors()` in your tests still finds the `errors` key. To change the shape for one endpoint only, override `failedValidation()` in that Form Request and throw an `HttpResponseException` that wraps your JSON response.

Whatever the shape, keep status 422. A 400 says the request itself was broken, such as invalid JSON, while 422 says the request was understood but the data didn't pass. That difference is what clients check to decide whether to show the messages under the form.

## How to change the validation message

The `messages()` method above changes the message for this request only. Other options:

- **App-wide:** run `php artisan lang:publish` and add `'disposable_email' => '...'` to `lang/en/validation.php`. Every form and endpoint using the rule picks it up.
- **Rule object:** if you use `new DisposableEmailRule()` or `Disposable::rule()`, the `messages()` key is `email.disposable_email_rule`, because Laravel names it after the class.
- **Field name:** add an `attributes()` method returning `['email' => 'email address']` to change how `:attribute` reads in every message.

Messages follow the app's current locale, so an API serving several languages can set the locale per request in a middleware and return translated errors.

## How to check an email without registering

Sometimes a client wants an early answer: a mobile app that asks for the email on its own screen, or an SPA that warns before the user fills in the rest. A small endpoint does this with `Disposable::check()`:

```bash
php artisan make:controller Api/EmailCheckController --invokable
```

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use EragLaravelDisposableEmail\Facades\Disposable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailCheckController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255'],
        ]);

        $result = Disposable::check($validated['email']);

        return response()->json([
            'email' => $validated['email'],
            'disposable' => $result->disposable(),
            'domain' => $result->domain(),
            'matched_domain' => $result->matchedDomain(),
        ]);
    }
}
```

A request for `someone@mail.mailinator.com` returns:

```json
{
    "email": "someone@mail.mailinator.com",
    "disposable": true,
    "domain": "mail.mailinator.com",
    "matched_domain": "mailinator.com"
}
```

`matched_domain` shows which list entry caught it. Here it's the parent domain, because the package blocks subdomains of listed domains by default. For a normal address, `disposable` is `false` and `matched_domain` is `null`.

`Disposable::check()` returns a result object with these methods:

| Method | Returns |
| --- | --- |
| `disposable()` | `true` when the domain is on a disposable list |
| `domain()` | The domain taken from the email |
| `matchedDomain()` | The list entry that matched, or `null` |
| `source()` | `built-in`, `custom` or `whitelist`, or `null` |
| `whitelisted()` | `true` when your whitelist let the domain through |
| `toArray()` | All four values in one array |

A few deliberate choices in this endpoint:

- **It uses POST, not GET.** Email addresses in URLs end up in server logs, browser history and analytics tools.
- **It leaves out `source()`.** Which list matched is useful in your logs, not for the public.
- **It doesn't say whether the email is registered.** That would let anyone test which addresses have accounts.
- **It's only a hint.** The register endpoint still runs `disposable_email`, so a client that skips the check gains nothing.

If you only need a yes or no, `Disposable::email($email)` returns a boolean.

## How to rate limit Laravel API routes

The routes above use two named limiters. Define them in the `boot()` method of `app/Providers/AppServiceProvider.php`:

```php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

public function boot(): void
{
    RateLimiter::for('register', function (Request $request) {
        return Limit::perHour(10)->by($request->ip());
    });

    RateLimiter::for('email-check', function (Request $request) {
        return Limit::perMinute(20)->by($request->user()?->id ?: $request->ip());
    });
}
```

When a client goes over the limit, Laravel returns status 429 with `{"message": "Too Many Attempts."}` and a `Retry-After` header saying how many seconds to wait. Mobile apps should read that header instead of retrying in a loop. Without a limit, the check endpoint quietly becomes a free disposable-email API for anyone who finds it.

Laravel doesn't throttle API routes by default. To add one limit to every route in `routes/api.php`, call `$middleware->throttleApi()` in `bootstrap/app.php` and define a limiter named `api`. For the other layers that stop fake accounts, see [how to stop spam registrations in Laravel](./laravel-prevent-spam-registrations.md). If people sign up through your API to grab free trials, [stopping free trial abuse](./stop-free-trial-abuse-laravel.md) goes further.

## Test it with Pest

```php
use App\Models\User;

function registrationPayload(array $overrides = []): array
{
    return array_merge([
        'name' => 'Asha',
        'email' => 'asha@example.com',
        'password' => 'secret-password-123',
        'password_confirmation' => 'secret-password-123',
        'device_name' => 'Pixel',
    ], $overrides);
}

it('rejects a disposable email with a 422 response', function () {
    $this->postJson('/api/register', registrationPayload(['email' => 'someone@mailinator.com']))
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email' => 'Temporary inboxes are not allowed']);

    expect(User::where('email', 'someone@mailinator.com')->exists())->toBeFalse();
});

it('returns one message for a malformed email', function () {
    $this->postJson('/api/register', registrationPayload(['email' => 'not-an-email']))
        ->assertUnprocessable()
        ->assertJsonCount(1, 'errors.email');
});

it('registers a real address and returns a token', function () {
    $this->postJson('/api/register', registrationPayload())
        ->assertCreated()
        ->assertJsonStructure(['user' => ['id', 'name', 'email'], 'token']);
});

it('reports disposable domains from the check endpoint', function () {
    $this->postJson('/api/email/check', ['email' => 'someone@mail.mailinator.com'])
        ->assertOk()
        ->assertJson([
            'disposable' => true,
            'domain' => 'mail.mailinator.com',
            'matched_domain' => 'mailinator.com',
        ]);
});

it('rate limits the check endpoint', function () {
    foreach (range(1, 20) as $attempt) {
        $this->postJson('/api/email/check', ['email' => 'asha@example.com'])->assertOk();
    }

    $this->postJson('/api/email/check', ['email' => 'asha@example.com'])->assertTooManyRequests();
});
```

`postJson()` sends the `Accept: application/json` header for you, just like a well-behaved client. `assertJsonValidationErrors()` checks that the `email` key exists and that one of its messages contains the given text. The malformed-email test proves `bail` works: one message, not two.

## Common problems and fixes

- **The API returns a redirect or an HTML page.** The client didn't send `Accept: application/json`. Add the header, and add the `shouldRenderJsonWhen()` callback shown above.
- **"CSRF token mismatch" (419).** The route is in `routes/web.php`. Token-based API routes belong in `routes/api.php`, which has no CSRF check.
- **Two messages for one email field.** Add `bail` as the first rule.
- **Tests fail after you change the error format.** `assertJsonValidationErrors()` reads the `errors` key by default. Keep that key, or pass your own key as the second argument.
- **A typo in the domain says "unauthorized email provider".** You're using the string rule `disposable_email:rfc,dns`. Split it into `email:rfc,dns` plus `disposable_email`, or use `Disposable::rule('rfc', 'dns')`.
- **Real addresses fail on the server but pass locally.** That's the `dns` mode. Check the server can resolve DNS and that `intl` is loaded for the PHP version serving requests: `php -m | grep intl`.
- **A burner address gets through.** Run the sync command, run `php artisan cache:clear` if caching is on, and inspect `Disposable::check($email)->toArray()` to see what matched.

## Frequently asked questions

### How do I return validation errors as JSON in Laravel?

Validate with a Form Request or `$request->validate()` and send the request with `Accept: application/json`. Laravel then returns a 422 response with `message` and `errors` instead of redirecting. To force JSON for all API routes, use `shouldRenderJsonWhen()` in `bootstrap/app.php`.

### Should a Laravel API return 400 or 422 for validation errors?

Return 422, "Unprocessable Content", which is what Laravel sends by default. It means the request was well-formed but the data didn't pass validation, while 400 means the request itself was broken, such as invalid JSON. Clients should treat 422 as "show these messages to the user", not as a server error.

### How do I change the format of Laravel validation errors in an API?

Add a `render()` callback for `ValidationException` inside `withExceptions()` in `bootstrap/app.php` and return your own `response()->json()` for `api/*` requests. Keep the `message` and `errors` keys and the 422 status, and add any extra fields next to them. For a single endpoint, override `failedValidation()` in its Form Request instead.

### What is the difference between bail and stopOnFirstFailure?

`bail` stops checking one field after its first failed rule, so that field gets one message. `stopOnFirstFailure` stops the whole request at the first field that fails, so the client only gets errors for that one field. In Laravel 13 you can set it with the `#[StopOnFirstFailure]` attribute on a Form Request.

### How do I validate an email in a Laravel API?

Use `email:rfc` for the format, add `dns` if you want to require a mail server, and put `bail` first so clients get one message. Add `unique:users,email` last for registration.

### How do I block disposable emails in a Laravel API?

Install `erag/laravel-disposable-email` and add `disposable_email` to the email rules in your Form Request. Burner addresses fail with a normal 422 JSON error, so your clients need no extra code.

### Does the disposable email check call an external API?

No. The domain list is stored inside your app, and checks are local lookups. The only network request is the sync command that refreshes the list, which you run on a schedule.

### Can I check if an email is disposable without validating a whole form?

Yes. `Disposable::check($email)` returns a result with `disposable()`, `domain()` and `matchedDomain()`, and `Disposable::email($email)` returns a plain boolean. Wrap either in a small rate-limited endpoint.

### Why does my Laravel API return a 302 redirect instead of JSON?

Laravel decided the request came from a browser form, usually because the `Accept: application/json` header is missing. Add the header in your client, or make `api/*` routes always render JSON.

## Protect your API sign-ups

```bash
composer require erag/laravel-disposable-email
php artisan erag:install-disposable-email
php artisan erag:sync-disposable-email-list
```

- **Manual and API validation docs:** [erag.in/laravel-disposable-email/validation/manual-api.html](https://erag.in/laravel-disposable-email/validation/manual-api.html)
- **Detailed result object:** [erag.in/laravel-disposable-email/runtime/result.html](https://erag.in/laravel-disposable-email/runtime/result.html)
- **RFC and DNS modes:** [erag.in/laravel-disposable-email/advanced/rfc-dns.html](https://erag.in/laravel-disposable-email/advanced/rfc-dns.html)
- **GitHub:** [eramitgupta/laravel-disposable-email](https://github.com/eramitgupta/laravel-disposable-email)
- **Related:** building forms in Livewire instead? See [how to block disposable emails in Livewire forms](./livewire-disposable-email-validation.md).
