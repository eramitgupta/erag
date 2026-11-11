---
title: "Inertia v3 Error Handling in Laravel With Toasts"
headline: "Inertia v3 Error Handling in Laravel: Replace the Error Modal With Toasts for 403, 419 and 500"
description: "Inertia v3 error handling in Laravel: handleExceptionsUsing, httpException and networkError, with 403, 419, 429 and 500 errors shown as toasts, not modals."
date: 2026-11-11
package: laravel-inertia-toast
category: Tutorial
tags: [laravel, inertia, toast, errors, vue]
image: /images/inertia-error-handling-toasts.jpg
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/inertia-error-handling-toasts.md
</div>

![Inertia v3 error handling in Laravel showing a 403 error as a toast instead of the error modal](/images/inertia-error-handling-toasts.jpg)

Inertia v3 error handling in Laravel has two halves. On the server, `Inertia::handleExceptionsUsing()` decides what a failed response becomes: for a failed form submit, call `toast()` and `return back(303)`. In the browser, the `httpException` and `networkError` events catch everything else. Users then see a short toast instead of Inertia's modal with a raw HTML error page.

If you're coming from v2, three things changed: the `invalid` event is now `httpException`, `exception` is now `networkError`, and the Laravel adapter has a new `Inertia::handleExceptionsUsing()`. This guide sets up both halves for Vue 3 and React, on Laravel 13 with Inertia v3 and Laravel Inertia Toast.

## The short version

1. Install Laravel Inertia Toast and its Vue or React package.
2. In `AppServiceProvider::boot()`, register `Inertia::handleExceptionsUsing()`.
3. For Inertia requests that change data, map the status code to a toast with `toast()` and return `back(303)`.
4. Keep JSON responses for API clients, and Laravel's detailed page for 500s while debugging.
5. In the browser, listen for Inertia's `networkError` and `httpException` events and show a toast with `useToast()`.
6. Leave validation errors under their fields.
7. Cover it with a Pest test that asserts the redirect and the flashed toast.

## What changed in Inertia v3 error handling?

Most error handling guides were written for Inertia v1 or v2, and their code no longer matches v3. The [v3 upgrade guide](https://inertiajs.com/docs/v3/getting-started/upgrade-guide) and [error handling docs](https://inertiajs.com/docs/v3/advanced/error-handling) list these changes:

| Inertia v2 | Inertia v3 |
| --- | --- |
| `router.on('invalid', ...)` | `router.on('httpException', ...)` |
| `router.on('exception', ...)` | `router.on('networkError', ...)` |
| Global listeners only | Also per visit, with the new `onHttpException` and `onNetworkError` callbacks |
| Your own `$exceptions->respond()` callback in `bootstrap/app.php` | `Inertia::handleExceptionsUsing()`, with an `ExceptionResponse` that has `render()`, `withSharedData()` and `statusCode()` |
| Axios responses in event details | Inertia's built-in XHR client. `event.detail.response` has `status`, `data` and `headers` |

If you're upgrading, the event names are a find and replace. Everything below uses the v3 names.

## How does Inertia v3 error handling work by default?

Inertia expects every response to be an Inertia page. When Laravel answers with something else, like its HTML error page, Inertia can't render it as a page. Here is what users see by default:

| What went wrong | Status | Default result in Inertia v3 |
| --- | --- | --- |
| Validation failed | redirect with errors | Errors appear in `form.errors`. This one is fine. |
| Policy or gate denied the action | 403 | A modal showing Laravel's 403 page |
| Record already deleted | 404 | A modal showing the 404 page |
| CSRF token expired | 419 | A modal showing "Page Expired" |
| Rate limit hit | 429 | A modal showing "Too Many Requests" |
| Bug in your code | 500 | A modal with the error page, or the stack trace in debug mode |
| No connection | none | A `networkError` event. Nothing visible happens |

The modal is a development tool. It is handy when you can read a stack trace. In production, with `APP_DEBUG=false`, a customer who clicks **Delete** gets the same modal with Laravel's plain "Server Error" page inside it. It also pops up for background requests, like a deferred prop that fails to load, which is the problem Matthieu Napoli describes in [his article on fixing Inertia error handling](https://mnapoli.fr/fixing-inertia-error-handling/). His fix returns JSON for 500s and shows a toast from the `invalid` listener, which is `httpException` in v3.

This guide takes a mixed route, so every request type gets the answer that suits it:

| Request | While developing (`APP_DEBUG=true`) | In production |
| --- | --- | --- |
| Form submit fails with 403, 404, 419 or 429 | Toast on the same page | Toast on the same page |
| Form submit fails with 500 | Modal with the stack trace | Toast on the same page |
| Page visit fails with 403 or 404 | `ErrorPage` component | `ErrorPage` component |
| Page visit fails with 500 or 503 | Laravel's debug page | `ErrorPage` component |
| Partial reload or deferred prop fails | Modal | Toast from `httpException` |
| No connection at all | Toast from `networkError` | Toast from `networkError` |

For actions, the trick is that Laravel always answers with something Inertia understands: a redirect.

## Install Laravel Inertia Toast

```bash
composer require erag/laravel-inertia-toast
npm install ./vendor/erag/laravel-inertia-toast/vue
```

For React, install `./vendor/erag/laravel-inertia-toast/react` instead. The Laravel package registers its own middleware and shares a `toast` prop with every Inertia response. On the frontend, register the plugin in `resources/js/app.ts` with `app.use(ToastPlugin)` inside `withApp`, or wrap the React app in `InertiaToastProvider`. The [toast setup guide](./laravel-inertia-toast-notifications.md) has both entry files.

## How do I turn Laravel errors into toasts for Inertia?

Register one exception callback in `app/Providers/AppServiceProvider.php`:

```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\ExceptionResponse;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Toast copy for failed Inertia actions, keyed by HTTP status.
     *
     * @var array<int, array{type: string, title: string, message: string}>
     */
    private const ACTION_ERRORS = [
        403 => ['type' => 'error', 'title' => 'Not allowed', 'message' => "You don't have permission to do that."],
        404 => ['type' => 'warning', 'title' => 'Not found', 'message' => 'That item no longer exists. It may have been deleted.'],
        419 => ['type' => 'warning', 'title' => 'Page expired', 'message' => 'Your session expired. Please try again.'],
        429 => ['type' => 'warning', 'title' => 'Slow down', 'message' => 'Too many attempts. Please wait a minute and try again.'],
        500 => ['type' => 'error', 'title' => 'Something went wrong', 'message' => "We couldn't finish that. Please try again."],
    ];

    public function boot(): void
    {
        Inertia::handleExceptionsUsing(function (ExceptionResponse $response) {
            $status = $response->statusCode();
            $request = $response->request;

            if ($request->expectsJson()) {
                return null;
            }

            if ($status >= 500 && config('app.debug')) {
                return null;
            }

            if ($request->inertia() && ! $request->isMethod('GET') && isset(self::ACTION_ERRORS[$status])) {
                $error = self::ACTION_ERRORS[$status];

                toast($error['message'], $error['type'], $error['title'], 5000);

                return back(303);
            }

            if (in_array($status, [403, 404, 500, 503], true) && ! $request->hasHeader('X-Inertia-Partial-Component')) {
                return $response->render('ErrorPage', ['status' => $status])->withSharedData();
            }

            return null;
        });
    }
}
```

Read it from top to bottom:

- **`expectsJson()`** returns early for API clients and `fetch` calls that ask for JSON. They keep Laravel's normal JSON errors. Inertia's own requests ask for HTML, so they continue.
- **The debug check** keeps Laravel's error page, with the stack trace, for 500s while `APP_DEBUG=true`. In production the user gets a toast instead.
- **The toast branch** only runs for Inertia requests that change data: `POST`, `PUT`, `PATCH` and `DELETE`. `toast()` flashes the message to the session, and `back(303)` sends the browser to the page it came from with a `GET`.
- **The last branch** renders an `ErrorPage` component for page visits, which is what the [Inertia v3 error handling docs](https://inertiajs.com/docs/v3/advanced/error-handling) recommend. [Translated Laravel Inertia error pages](./laravel-translated-error-pages-inertia.md) builds that component in Vue and React. If you don't have one yet, delete the branch and Laravel's own error pages are used.
- **The partial reload check** skips the error page for requests that only refresh some props, which is what deferred props and `router.reload({ only: [...] })` send. Replacing the whole screen because one prop failed is too much, so these fall through to the browser listener below and become a toast.
- **`return null`** keeps Laravel's original response for everything else, including validation redirects, which also pass through this callback.

Two package details matter here. The fourth argument of `toast()` is the duration in milliseconds, and the default of 3000 is short for an error people need to read. Always pass a title too: when a toast has no title, the Vue bridge uses the type, so the heading would read "error".

### Why toasts for actions and pages for visits?

A failed action, like a delete or a save, happened on a page that still works. Sending the user back to it with "You don't have permission to do that." keeps them where they were, and they can carry on.

A failed page visit has no page to go back to. If someone opens `/invoices/99` and it doesn't exist, a toast on the previous page would be confusing, and search engines need the real 404 status. That's why `GET` requests get an error page.

### Why back(303)?

`back()` redirects to the URL in the `Referer` header, which Inertia sends with every request. The `303` tells the browser to follow it with `GET`. Inertia's middleware normally turns a `302` after `PUT`, `PATCH` or `DELETE` into a `303`, but a 419 is thrown by the CSRF check, before Inertia's middleware has run. Setting `303` yourself works for every case.

### One callback for the whole app

`handleExceptionsUsing()` registers Laravel's `$exceptions->respond()` callback, and Laravel keeps only one. If `bootstrap/app.php` or another provider already registers one, the later registration wins. Merge everything into this single callback.

## Which errors can become toasts?

`toast()` writes to the session, and the session starts inside the `web` middleware group. Errors thrown after that point work, earlier ones don't:

| Status | Typical cause | Works as a toast? |
| --- | --- | --- |
| 403 | `Gate::authorize()`, a policy, `abort(403)` | Yes |
| 404 | Route model binding on an action, such as deleting a record twice | Yes |
| 419 | CSRF token mismatch | Yes |
| 429 | The `throttle` middleware on a route | Yes |
| 500 | An exception in your controller or service | Yes, outside debug mode |
| 503 | `php artisan down` | No, maintenance mode stops the request before the session starts |
| 404 | A URL that matches no route | No, routing fails before the `web` group runs |

The last two fall through to the `ErrorPage` branch, which is the right answer for them anyway.

### Are 419 errors still a thing in Laravel 13?

Less often. Laravel 13's CSRF middleware, `PreventRequestForgery`, accepts a request without checking the token when the browser sends `Sec-Fetch-Site: same-origin`. Modern browsers send that header to secure origins, so on an HTTPS site an expired token rarely causes a 419 anymore. You still see them on plain-HTTP domains, in older browsers, and on Laravel 12 and below, so keep the branch.

## How do I catch network errors in Vue?

Some failures never reach Laravel. The Wi-Fi drops, a proxy times out, or nginx rejects an upload with a 413 before PHP runs. Inertia reports these in the browser with two events:

- **`networkError`** fires when the request fails completely. By default Inertia throws the error.
- **`httpException`** fires when a response isn't an Inertia response, such as an HTML error page from nginx. By default Inertia opens the modal.

In Vue, `useToast()` from the [Vue 3 composable and plugin](https://erag.in/laravel-inertia-toast/vue.html) keeps its state at module level, so it works in a plain TypeScript file. Create `resources/js/lib/requestErrorToasts.ts`:

```ts
import { useToast } from '@erag/inertia-toast-vue';
import { router } from '@inertiajs/vue3';

export function initializeRequestErrorToasts(): void {
    const toast = useToast();

    router.on('networkError', (event) => {
        event.preventDefault();
        toast.error("We couldn't reach the server. Check your connection and try again.", 'Connection problem', 6000);
    });

    router.on('httpException', (event) => {
        if (import.meta.env.DEV) {
            return;
        }

        event.preventDefault();
        toast.error(`The server sent an unexpected response (${event.detail.response.status}). Please try again.`, 'Request failed', 6000);
    });
}
```

Call it in `resources/js/app.ts`, after `createInertiaApp()`:

```ts
import { initializeRequestErrorToasts } from '@/lib/requestErrorToasts';

// ...createInertiaApp({ ... }) with the toast plugin in withApp

initializeRequestErrorToasts();
```

`event.preventDefault()` cancels Inertia's default: no thrown error, no modal. The `import.meta.env.DEV` check keeps the modal while you run `npm run dev`, because that is when the raw response is most useful to you.

## How do I catch network errors in React?

In React, `useToast()` is a hook, so register the listeners in a component that renders nothing. Create `resources/js/components/request-error-toasts.tsx`:

```tsx
import { useToast } from '@erag/inertia-toast-react';
import { router } from '@inertiajs/react';
import { useEffect } from 'react';

export function RequestErrorToasts() {
    const { error } = useToast();

    useEffect(() => {
        const removeNetworkListener = router.on('networkError', (event) => {
            event.preventDefault();
            error("We couldn't reach the server. Check your connection and try again.", 'Connection problem', 6000);
        });

        const removeHttpListener = router.on('httpException', (event) => {
            if (import.meta.env.DEV) {
                return;
            }

            event.preventDefault();
            error(`The server sent an unexpected response (${event.detail.response.status}). Please try again.`, 'Request failed', 6000);
        });

        return () => {
            removeNetworkListener();
            removeHttpListener();
        };
    }, [error]);

    return null;
}
```

Render it inside the provider in `resources/js/app.tsx`:

```tsx
<InertiaToastProvider position="top-right">
    <RequestErrorToasts />
    {app}
</InertiaToastProvider>
```

`router.on()` returns a function that removes the listener, so the cleanup never leaves a duplicate behind.

## Should validation errors be toasts too?

No. A validation error belongs under its field, where it stays visible while the user fixes it. Inertia already puts it in `form.errors`, and none of the code above touches it. If you want a short "Some fields need your attention" summary on top, add it per form with `onError`, as shown in [turning Laravel flash messages into Inertia toasts](./laravel-flash-messages-inertia-toasts.md). [Toast notification UX](./toast-notification-ux-best-practices.md) explains why toasts and field errors do different jobs.

## How do I test the error toasts?

The callback is plain Laravel, so a feature test covers it. Create `tests/Feature/ActionErrorToastTest.php`:

```php
<?php

use Illuminate\Support\Facades\Route;

beforeEach(function () {
    Route::middleware('web')->delete('/_test/forbidden', fn () => abort(403));
});

it('turns a 403 on an Inertia action into a toast and a redirect', function () {
    $this->from('/dashboard')
        ->withHeader('X-Inertia', 'true')
        ->delete('/_test/forbidden')
        ->assertStatus(303)
        ->assertRedirect('/dashboard')
        ->assertSessionHas('toast.type', 'error')
        ->assertSessionHas('toast.title', 'Not allowed');
});

it('keeps the JSON error for API requests', function () {
    $this->deleteJson('/_test/forbidden')->assertForbidden();
});
```

`from()` sets the `Referer` header that `back()` reads, and the `X-Inertia` header makes the request look like an Inertia visit. Run it with `php artisan test --compact --filter=ActionErrorToastTest`. The [Inertia CRUD tutorial](./laravel-inertia-crud-toast-notifications.md) has more toast tests for successful actions.

## Common problems and fixes

- **The modal still appears in production.** The callback returned `null` for that request. Check that it is a non-`GET` Inertia request with a status in `ACTION_ERRORS`, and that no other `respond()` callback replaced yours. Run `php artisan optimize:clear` after deploying.
- **The toast never shows after a 419.** The form posted without Inertia, as a plain HTML form. The callback only handles Inertia requests, and the toast bridge only reads toasts after Inertia visits. Send the form through `useForm()` or the `Form` component.
- **The user lands on the home page.** `back()` found no `Referer` and used its fallback. Pass your own: `back(303, [], route('dashboard'))`.
- **The heading says "error" in lowercase.** The toast has no title. Pass the third argument to `toast()`.
- **All later toasts jump to another corner.** A toast with a `position` moves the container for every toast after it. Set the position once when you register the plugin or provider, and leave it out of `toast()`.

## Frequently asked questions

### How do I handle errors globally in Inertia?

Use two places. On the server, `Inertia::handleExceptionsUsing()` decides what each failed response becomes. In the browser, `router.on('networkError')` and `router.on('httpException')` catch what never reaches Laravel. Together they cover every failed visit.

### How do I fix "419 Page Expired" in Inertia?

Catch the 419 in `handleExceptionsUsing()`, flash a message with `toast()`, and `return back(303)`. The user sees "Your session expired" on the same page and can submit again with a fresh token.

### Why does Inertia show a modal with an HTML page?

The response wasn't an Inertia response. Laravel returned its HTML error page, and Inertia shows non-Inertia responses in a modal so you can debug them. Return a redirect or an Inertia page instead.

### How do I show a custom 404 page with Inertia?

Render a page component from `Inertia::handleExceptionsUsing()`, like the `ErrorPage` branch in the callback above, and create that component in `resources/js/pages`. Inertia keeps the real 404 status on the response. [Translated Laravel Inertia error pages](./laravel-translated-error-pages-inertia.md) builds the component in Vue and React, with titles in every language your app supports.

### Does this work without Laravel Inertia Toast?

The server callback works with any flash message. Inertia v3's `Inertia::flash()` plus your own component can show it. The package saves you that component, the shared prop and the `useToast()` helper for the browser side.

### Can I use this with the PWA offline page?

Yes. If you added the offline fallback from the [Laravel Inertia PWA guide](./laravel-inertia-pwa.md), both listeners receive `networkError`, so a link click would flash the toast and then load the offline page. Track the visit method with `router.on('start')`, as that guide does, and only show the toast when the method isn't `get`.

## Add it to your Inertia app

```bash
composer require erag/laravel-inertia-toast
npm install ./vendor/erag/laravel-inertia-toast/vue
```

- [Laravel backend docs](https://erag.in/laravel-inertia-toast/laravel.html) for every `toast()` argument
- [Vue 3 composable and plugin](https://erag.in/laravel-inertia-toast/vue.html) and [React usage](https://erag.in/laravel-inertia-toast/react.html)
- [GitHub](https://github.com/eramitgupta/laravel-inertia-toast)
