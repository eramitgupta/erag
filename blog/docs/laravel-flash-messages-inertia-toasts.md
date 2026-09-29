---
title: Turn Laravel Flash Messages Into Inertia Toasts
headline: Turn Laravel Flash Messages Into Inertia Toasts Without Rewriting Controllers
description: "Show Laravel flash messages in Inertia as toasts: why they vanish, which session keys the package reads, one-toast limits, validation errors and Pest tests."
date: 2026-09-29
package: laravel-inertia-toast
category: Guide
tags: [laravel, inertia, flash-messages, session, toast]
---

Your controllers end with `return back()->with('message', 'Profile updated')`. In the Blade version of the app, the layout printed that message at the top of the page. After moving to Inertia, the same controllers still run, the same data is still flashed, and the message never shows up.

Nothing is broken. Inertia just doesn't know the flash data exists. This guide explains why Laravel flash messages disappear in Inertia apps, how Laravel Inertia Toast picks up the keys you already flash, and the few edge cases worth knowing before you rely on it.

If you haven't installed the package yet, start with the [Inertia toast notifications tutorial](./laravel-inertia-toast-notifications.md). This post assumes the Vue plugin or React provider is already registered.

## Why Laravel flash messages disappear in Inertia

Flash data lives in the session for exactly one more request. In Blade, the next request renders a view, and the layout reads `session('message')` directly.

An Inertia page doesn't read the session. It renders from props. If a value isn't in the props sent to the page component, the frontend can't see it. So flash data has to be shared explicitly, usually from the `HandleInertiaRequests` middleware:

```php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'flash' => [
            'message' => fn () => $request->session()->get('message'),
        ],
    ];
}
```

That gets the value to the browser. You still need a component that watches the prop, shows something, and handles the first page load as well as later visits. It's not much code, but it's code you repeat in every app and every time you add a new flash key.

## How the package reads Laravel flash messages

Laravel Inertia Toast shares a single Inertia prop called `toast`, and you don't touch `HandleInertiaRequests` for it. On every request it resolves that prop in this order:

1. `session('toast')`, which is what the `toast()` helper writes
2. the standard flash keys, if `message` is present
3. an empty array if there's nothing to show

The standard keys are `message`, `type`, `title`, `duration` and `position`. So both of these controllers produce a toast without calling the helper at all:

```php
return back()->with([
    'type' => 'success',
    'title' => 'Success',
    'message' => 'Updated successfully',
    'duration' => 3000,
]);
```

```php
return redirect()
    ->route('dashboard')
    ->with('message', 'Welcome back')
    ->with('type', 'success')
    ->with('title', 'Login successful')
    ->with('duration', 3500)
    ->with('position', 'top-right');
```

`->with()` on a redirect flashes into the session, so `session()->flash('message', 'Welcome back')` works the same way. If you only flash `message`, the toast is shown as a `success` toast with the default duration.

## A migration path for an existing app

This is the order I'd follow when moving a Blade app, or an Inertia app with hand-rolled flash handling, over to toasts.

### 1. Install and leave controllers alone

Install the package and register the frontend. Any controller that already flashes `message` starts producing toasts right away. Click through a few create, update and delete flows and check what appears.

### 2. Audit the keys you actually flash

Search for `->with(` and `session()->flash(` in `app/Http/Controllers`. You're looking for two things.

**Keys the package doesn't read.** Only the five keys above are converted. A common one that isn't on the list is `status`. Starter kits and Fortify use it for values like `verification-link-sent`, which are codes meant for the page to interpret, not text to show a user. Leaving those alone is usually right; keep handling them in the page that expects them.

**Type values that aren't toast types.** The frontend understands exactly four types: `success`, `error`, `warning` and `info`. If your Blade app flashed Bootstrap-style values such as `danger` or `alert-success`, those won't show. Map them when you touch each controller:

```php
// Before
return back()->with('message', 'Card declined')->with('type', 'danger');

// After
return back()->with('message', 'Card declined')->with('type', 'error');
```

### 3. Use the helper in new code

For anything new, I'd call `toast()` instead of chaining `->with()`. It's one call, the arguments are named, and it can't be confused with some other `message` value:

```php
public function update(Request $request, Invoice $invoice): RedirectResponse
{
    $invoice->update($request->validate([
        'due_date' => ['required', 'date'],
    ]));

    toast(
        message: "Invoice {$invoice->number} updated",
        type: 'success',
        title: 'Saved',
    );

    return back();
}
```

The old keys keep working alongside it, so there's no big-bang rewrite. Controllers move over whenever you're editing them anyway.

## One toast per request

The shared `toast` prop is a single object, not a list. Two things follow from that:

- Calling `toast()` twice in the same request flashes to the same session key, so the second call replaces the first.
- If a request sets both `toast` and `message`, the `toast` value wins, because it's checked first.

I treat that as a design constraint rather than a bug. One action should produce one message. For bulk operations, build a single summary:

```php
$sentCount = $invoices->count() - $failedCount;

if ($failedCount === 0) {
    toast("{$sentCount} invoices sent", 'success', 'Done');
} else {
    toast("{$sentCount} sent, {$failedCount} failed", 'warning', 'Partly done', 0);
}
```

A `duration` of `0` keeps the warning on screen until it's removed on the client, which suits a message people need to act on.

## What about validation errors?

Validation failures don't go through flash messages in the same way. Laravel redirects back with an error bag, and Inertia exposes it as the `errors` prop and on `form.errors` when you use `useForm`. The package doesn't turn those into toasts, and I think that's correct. A field error belongs under the field, where it stays visible while the user fixes it.

If you want a short summary toast as well, trigger it on the client when the request fails, and let the controller send the success toast:

```vue
<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { useToast } from '@erag/inertia-toast-vue';

const toast = useToast();

const form = useForm({
    name: '',
    email: '',
});

const submit = () => {
    form.put('/settings/profile', {
        preserveScroll: true,
        onError: () => {
            toast.error('Some fields need your attention', 'Not saved');
        },
    });
};
</script>

<template>
    <form @submit.prevent="submit">
        <input v-model="form.name" type="text" />
        <p v-if="form.errors.name">{{ form.errors.name }}</p>

        <input v-model="form.email" type="email" />
        <p v-if="form.errors.email">{{ form.errors.email }}</p>

        <button type="submit" :disabled="form.processing">Save</button>
    </form>
</template>
```

## Inspecting the resolved payload

When a toast isn't what you expected, the `InertiaToast` facade shows you what the package resolved from the session:

```php
use InertiaToast;

$toast = InertiaToast::flash();
```

It returns the same array the frontend receives: the `toast` payload, the converted standard keys, or an empty array. The shape is documented in the [API reference](https://erag.in/laravel-inertia-toast/api-reference.html).

## Testing flashed toasts with Pest

Because everything goes through the session, normal session assertions cover it. The helper stores an array under `toast`, so dot notation reaches individual fields:

```php
use App\Models\Invoice;
use App\Models\User;

it('flashes a toast after updating an invoice', function () {
    $user = User::factory()->create();
    $invoice = Invoice::factory()->create();

    $this->actingAs($user)
        ->put("/invoices/{$invoice->id}", ['due_date' => '2026-10-31'])
        ->assertRedirect()
        ->assertSessionHas('toast.type', 'success')
        ->assertSessionHas('toast.title', 'Saved');
});
```

For controllers still on the older style, assert the plain keys instead, for example `->assertSessionHas('message', 'Updated successfully')`. The test doesn't care which style produced the toast, only that the session holds what the frontend will read.

## Trade-offs to know about

- **`message` is a generic key.** If your code or another package flashes `message` for a different purpose, it will now show as a toast. The audit in step 2 is how you catch that.
- **It works on redirects and Inertia visits.** A JSON response to a `fetch()` call never reaches the flash bridge. Use `useToast()` on the client for those.
- **One message per request.** Covered above. If you truly need several, a toast is probably the wrong component.

## FAQ

### Do I need to change HandleInertiaRequests?

No. The package shares its `toast` prop on its own, and there is no middleware to register. If you already share a `flash` prop for other reasons, it can stay; the two don't interact. Once every message goes through toasts, you can delete your old flash sharing and the component that displayed it.

### Does this work the same with React?

Yes. The Laravel side is identical. On the frontend, the React package's `InertiaToastProvider` mounts the same flash bridge that the Vue plugin does, so flashed messages appear without extra code. The [installation guide](https://erag.in/laravel-inertia-toast/installation.html) shows both setups.

### Can I keep a flashed message on screen until the user closes it?

Flash a `duration` of `0`, either with `->with('duration', 0)` or as the fourth argument to `toast()`. I'd reserve that for warnings and errors that ask the user to do something.

## Where to go next

The [Laravel usage docs](https://erag.in/laravel-inertia-toast/laravel.html) list every supported flash key with more controller examples. Laravel's own docs cover [flash data in the session](https://laravel.com/docs/session#flash-data) if you want the details of how long it lives.

Many flashed messages follow a destructive action, like "Post deleted". For asking before that request goes out, see [confirmation dialogs in Laravel Inertia apps](./confirmation-dialogs-laravel-inertia.md).
