---
title: How to Block Disposable Emails in Laravel
headline: How to Block Disposable Emails in Laravel (With a Pest Test)
description: Block disposable emails in Laravel with one validation rule. Install the package, protect registration, add your own domains and keep the list synced.
date: 2026-09-29
package: laravel-disposable-email
category: Tutorial
tags: [laravel, validation, email, registration, pest]
---

You open the `users` table and half of last week's sign-ups end in `mailinator.com`, `tempmail.com` or some domain you have never heard of. None of them verified their email. Your welcome emails bounce. Your onboarding numbers look worse than they are.

Laravel's `email` rule can't help here, because a burner address is a perfectly valid email. It has an `@`, a real domain, and often a working inbox for ten minutes. The problem isn't the format. It's the domain.

This tutorial shows how to block disposable emails in Laravel with a single validation rule, using [Laravel Disposable Email](https://erag.in/laravel-disposable-email/introduction.html), a package I built for exactly this. We will install it, add it to registration, write a Pest test, and set up the domain list so it stays current.

## What the package checks

The core idea is simple: take the domain part of the address and look it up in a list of known disposable domains. The package ships with a large built-in list (the docs put it at 124,220+ domains) and it runs the lookup inside your app. There is no API call during sign-up, no API key, and nothing to go down at 2am.

On top of the built-in list you get:

- your own blacklist files for domains you want to block
- a whitelist for domains that should always pass
- subdomain matching, so blocking `tempmail.com` also blocks `mail.tempmail.com`
- optional RFC, DNS and spoofing checks through the same rule

What it does not do is prove that a mailbox exists. Only a verification email can do that. Think of this as a filter for the low-effort junk, not a replacement for email verification.

## Install the package

Require it with Composer:

```bash
composer require erag/laravel-disposable-email
```

On Laravel 11, 12 and 13, package discovery registers the service provider for you. If you have discovery turned off, add it to `bootstrap/providers.php`:

```php
use EragLaravelDisposableEmail\LaravelDisposableEmailServiceProvider;

return [
    App\Providers\AppServiceProvider::class,
    LaravelDisposableEmailServiceProvider::class,
];
```

On Laravel 10 the provider goes in the `providers` array of `config/app.php` instead.

Then run the installer:

```bash
php artisan erag:install-disposable-email
```

This publishes `config/disposable-email.php` and clears the package cache. Run it before you touch any configuration, otherwise you will be editing a file that doesn't exist yet.

## How to block disposable emails in Laravel registration

The package registers a validation rule called `disposable_email`. You add it next to your existing email rules, and that's the whole integration.

### In a Form Request

If your registration uses a Form Request, the rule goes in `rules()`:

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'disposable_email'],
            'password' => ['required', 'confirmed', 'min:8'],
        ];
    }
}
```

Keep the `email` rule. `disposable_email` on its own only checks the domain against the lists. It doesn't validate the format, so you still want Laravel's rule in front of it.

When someone submits `anna@tempmail.com`, Laravel returns its normal validation response: a redirect back with errors for a classic form, a 422 JSON response for an API call, and `form.errors.email` in an Inertia page. You don't write any extra error handling.

### In a Fortify action

If your app uses Fortify, registration validation usually lives in `app/Actions/Fortify/CreateNewUser.php` and runs through `Validator::make()`. The rule works the same way there. Find the `email` entry and append it:

```php
'email' => ['required', 'string', 'email', 'max:255', 'unique:users', 'disposable_email'],
```

### With the rule object

Some people prefer class-based rules because the IDE can find them. Use `DisposableEmailRule`:

```php
use EragLaravelDisposableEmail\Rules\DisposableEmailRule;

$request->validate([
    'email' => ['required', 'email', new DisposableEmailRule()],
]);
```

Or the facade factory, which reads a little shorter:

```php
use Disposable;

'email' => ['required', 'email', Disposable::rule()],
```

All three forms do the same check. Pick the one that matches how the rest of your validation is written.

## Test it with Pest

Don't just trust that it works. A feature test takes a minute and will catch it the day someone refactors the registration request and drops the rule.

```php
<?php

use EragLaravelDisposableEmail\Facades\Disposable;

it('rejects disposable email addresses on registration', function () {
    $response = $this->post('/register', [
        'name' => 'Anna Test',
        'email' => 'anna@tempmail.com',
        'password' => 'correct-horse-battery',
        'password_confirmation' => 'correct-horse-battery',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

it('knows tempmail.com is disposable', function () {
    expect(Disposable::email('anna@tempmail.com'))->toBeTrue();
});
```

Adjust `/register` to your own route. I import the namespaced facade here because Pest files have no namespace. The second test is a quick sanity check on the list itself. `Disposable::email()` returns a boolean and doesn't do any DNS work, so it is safe to run in CI without network access.

## Add your own domains

The built-in list won't have every burner service. When you spot one that got through, drop it into a text file in the blacklist directory. By default that is `storage/app/blacklist_file`, and the package reads every `.txt` file in it:

```text
storage/app/blacklist_file/custom.txt
```

One domain per line, nothing else:

```text
abakiss.com
fakemail.org
trashbox.io
```

The opposite case happens too. Maybe your QA team uses a throwaway-style domain, or a partner's domain ended up on a public list by mistake. Put it in the whitelist in `config/disposable-email.php`:

```php
'whitelist' => [
    'trusted-test-domain.com',
],
```

Whitelist entries win over both the built-in and custom lists. The [configuration reference](https://erag.in/laravel-disposable-email/configuration.html) covers every option, including `block_subdomains` if you only want exact matches.

## Keep the domain list fresh

New burner domains show up all the time, so a list that never updates slowly gets worse. The package can pull domains from the URLs in the `remote_url` config and write them to your blacklist directory:

```bash
php artisan erag:sync-disposable-email-list
```

Put it on the scheduler in `routes/console.php` so you never have to remember:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('erag:sync-disposable-email-list')->daily();
```

Your server needs to be running Laravel's scheduler for this to fire. The [scheduling guide](https://erag.in/laravel-disposable-email/advanced/schedule.html) has the details.

If you validate a lot of emails, turn on caching in the config with `'cache_enabled' => true`. The sync and install commands clear the package cache on their own, but after editing a blacklist file by hand, run `php artisan cache:clear`.

## When you don't need this

I'd skip it in a few cases:

- **Invite-only or SSO-only apps.** If every user arrives through Google Workspace or an admin invite, there is no open sign-up form to protect.
- **Internal tools.** Your employees aren't signing up with burner inboxes.
- **Forms where a burner email is fine.** A one-time download or a support form might not care who is on the other end, and blocking can just push people away.

It also won't stop someone who creates a fresh Gmail account. That takes more effort than opening a temp inbox, which is the point: you raise the cost of junk sign-ups, you don't make them impossible.

## FAQ

### Does it call an external API when validating?

No. The lookup runs against lists stored in your app. The only network call is the sync command, and that runs when you (or the scheduler) run it.

### A disposable address still got through. What do I check?

Confirm the rule name is exactly `disposable_email`, check that the domain isn't in your whitelist, then clear the cache and sync again. `Disposable::check($email)->toArray()` shows which list matched, if any.

### Can it also check DNS records?

Yes. The rule accepts modes like `disposable_email:rfc,dns`. DNS checks are opt-in because they make a network lookup on every validation. I cover the trade-offs in [Laravel email validation: RFC, DNS and MX](./laravel-email-validation-rfc-dns.md).

## Where to go next

Add the rule to every form where new email addresses come in, not just registration. Email change forms are the usual gap. Then write the Pest test so the rule can't quietly disappear.

If your problem is specifically people restarting free trials, read [stop free trial abuse with burner email checks](./stop-free-trial-abuse-laravel.md) for a softer approach that gates the trial instead of blocking the account.
