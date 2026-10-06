---
title: Toast Notifications in Laravel Inertia Apps
headline: How to Add Toast Notifications to a Laravel Inertia App (Vue or React)
description: Add Inertia toast notifications to Laravel with a toast() helper in your controllers and one plugin for Vue 3 or React. Full setup, options and fixes.
date: 2026-09-29
package: laravel-inertia-toast
category: Tutorial
tags: [laravel, inertia, toast, vue, react]
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/laravel-inertia-toast-notifications.md
</div>

You save a post, the controller redirects to the index page, and the user sees nothing. The record was created, but there is no "Saved" message anywhere on the screen.

In a Blade app you would flash a message and print it in the layout. In an Inertia app it takes more work: share the flash data as a prop, watch that prop in a persistent layout, build a toast component, handle the very first page load, and then copy all of it into your next project.

That wiring is what Laravel Inertia Toast replaces. You call `toast()` in a controller, register one plugin on the frontend, and Inertia toast notifications show up after redirects with no page-level code. The same package also gives you a `useToast()` composable for client-side messages and a promise-based confirmation dialog.

This tutorial walks through the full setup for Vue 3 and React, the options you can set per toast, and what to check when a toast doesn't appear.

## What you need before you start

The package supports:

- PHP 8.1 or newer
- Laravel 10, 11, 12 or 13
- `inertiajs/inertia-laravel` `^1.3`, `^2.0` or `^3.0`
- Vue 3 with `@inertiajs/core` and `@inertiajs/vue3` at `^2.0` or `^3.0`
- React 18 or 19 with `@inertiajs/react` at `^2.0` or `^3.0`

One naming note, because people mix these up. This is a Laravel + Inertia package with a PHP half and a JavaScript half. If you have a standalone Vue 3 app with no Laravel backend, you want its sibling `@erag/vue-toastification` instead, which I cover in [toast notifications in Vue 3](./vue-3-toast-notifications.md).

## Step 1: Install the Laravel package

```bash
composer require erag/laravel-inertia-toast
```

Package discovery registers the service provider for you, and there is no middleware to add by hand. From here on, every Inertia response can carry a shared `toast` prop.

## Step 2: Install the frontend package

The frontend code ships inside the Composer package, so you install it from your `vendor` directory. Pick the one that matches your stack:

```bash
# Vue 3
npm install ./vendor/erag/laravel-inertia-toast/vue

# React
npm install ./vendor/erag/laravel-inertia-toast/react
```

Run `composer require` first. The npm command points at a folder that only exists once Composer has installed the package.

## Step 3: Register it in your Inertia entry file

### Vue 3

Open `resources/js/app.ts` (or `app.js`) and add the plugin next to Inertia's own:

```ts
import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import ToastPlugin from '@erag/inertia-toast-vue';
import '@erag/inertia-toast-vue/style.css';

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.vue', { eager: true });
        return pages[`./Pages/${name}.vue`];
    },
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ToastPlugin, {
                position: 'bottom-right',
            })
            .mount(el);
    },
});
```

The plugin mounts three components for you: `ToastContainer`, `ConfirmationBox` and `FlashToastBridge`. You never place them in a layout yourself, which also means they keep working on pages that don't use your main layout.

### React

For React, wrap the app once in `InertiaToastProvider`:

```tsx
import { createInertiaApp } from '@inertiajs/react';
import { InertiaToastProvider } from '@erag/inertia-toast-react';
import '@erag/inertia-toast-react/style.css';

createInertiaApp({
    withApp(app) {
        return (
            <InertiaToastProvider position="bottom-right">
                {app}
            </InertiaToastProvider>
        );
    },
});
```

There is also a standalone `initializeToast({ position: 'bottom-right' })` if you don't want to wrap the tree, but the provider is the recommended setup. The [installation guide](https://erag.in/laravel-inertia-toast/installation.html) shows both.

## How to send a toast from a Laravel controller

With the frontend registered, a toast is one line before your redirect:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
        ]);

        Post::create($validated);

        toast('Post created successfully', 'success', 'Created');

        return redirect()->route('posts.index');
    }
}
```

The helper flashes a payload into the session. The next Inertia response includes it as `props.toast`, and the frontend shows it. No shared props to write, no watcher in a layout.

### Setting options per toast

Here is the full signature:

```php
toast(
    string $message,
    string $type = 'success',
    ?string $title = null,
    int $duration = 3000,
    ?string $position = null
): void;
```

- `type` is one of `success`, `error`, `warning` or `info`.
- `duration` is in milliseconds. A value of `0` keeps the toast on screen until it is removed on the client.
- `position` overrides the plugin's default for this one toast. Valid values are `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center` and `bottom-right`.

Named arguments read well once you pass more than two values:

```php
toast('Invoice sent to the customer', 'success', 'Sent');

toast(
    message: 'The payment gateway timed out. Please try again.',
    type: 'error',
    title: 'Payment failed',
    duration: 6000,
    position: 'top-center',
);

toast('Your trial ends in 3 days', 'warning', 'Trial ending', 0);
```

I keep success toasts at the default and give errors more time, since an error message is usually longer and more likely to need a second read.

## Showing toasts from the frontend with useToast()

Not every message needs a trip to the server. Copying an invite link, a failed clipboard write, or a background task finishing in the browser are all purely client-side. For those, use `useToast()`:

```vue
<script setup lang="ts">
import { useToast } from '@erag/inertia-toast-vue';

const props = defineProps<{
    inviteUrl: string;
}>();

const toast = useToast();

const copyInviteLink = async () => {
    try {
        await navigator.clipboard.writeText(props.inviteUrl);
        toast.success('Invite link copied', 'Copied');
    } catch {
        toast.error('Your browser blocked clipboard access', 'Copy failed');
    }
};
</script>

<template>
    <button type="button" @click="copyInviteLink">
        Copy invite link
    </button>
</template>
```

The React hook has the same name and methods, imported from `@erag/inertia-toast-react`.

The type methods all take `(message, title?, duration?, position?)`. There is also `toast.show(type, title, message, duration?, position?)`. Notice that `show()` puts the title *before* the message, which is the opposite of the shortcut methods. That's easy to trip over, so I stick to `success()`, `error()`, `warning()` and `info()` unless the type comes from a variable. `toast.setPosition(position)` changes the default position at runtime, and `toast.remove(id)` removes a toast.

## Server toast or client toast?

A simple rule: if the server decides whether the action worked, the server sends the toast.

| Situation | What to use |
| --- | --- |
| A record was created, updated or deleted, then you redirect | `toast()` in the controller |
| An action that never hits the server (copy, local filter) | `useToast()` |
| A destructive action that needs a "yes" first | `useConfirmation()`, then a server toast |
| A form field failed validation | An inline error under the field, not a toast |

The third row has its own post: [confirmation dialogs in Laravel Inertia](./confirmation-dialogs-laravel-inertia.md) covers the confirm-then-delete flow in Vue and React.

## How the toast reaches the page

It helps to know what happens under the hood when you debug. `FlashToastBridge` does two things:

1. On the first load, it reads the `data-page` payload Inertia rendered into the HTML. That's why a toast flashed before a full page load, such as right after logging in, still appears.
2. After that, it listens for `inertia:success` events and checks `page.props.toast` on every visit.

The payload itself is small:

```json
{
    "id": "6612af5b4f145",
    "type": "success",
    "title": "Saved",
    "message": "Profile updated successfully",
    "duration": 3000,
    "position": "top-right"
}
```

The full shape and types are in the [API reference](https://erag.in/laravel-inertia-toast/api-reference.html).

## Inertia toast notifications not showing? Check these first

When a toast doesn't appear, it is almost always one of these:

- **The plugin or provider isn't registered.** Check `app.use(ToastPlugin)` in Vue, or `InertiaToastProvider` in React.
- **The stylesheet isn't imported.** Each frontend package has its own `style.css`.
- **The request didn't end with an Inertia response or redirect.** A `response()->json()` returned to a `fetch()` call never goes through the flash bridge. Show those results with `useToast()` instead.
- **The page payload has no `props.toast`.** Look at the Inertia response in your browser's network tab.
- **The toast never closes.** Its `duration` is `0`, which is by design.
- **The position is wrong.** The plugin option is only the default; a toast's own `position` wins.

## When you don't need this package

A few honest cases where I'd skip it:

- **Your app isn't Laravel + Inertia.** Use a standalone toast library. For Vue 3 that's `@erag/vue-toastification`, linked above.
- **You already have a toast component you like.** Sharing one flash prop from `HandleInertiaRequests` and watching it in your layout is a small amount of code. Another dependency might not be worth it.
- **Your pages mostly talk to JSON endpoints.** The server-side helper only helps with redirect and visit flows, which is what the package was designed around. If most of your requests are `fetch()` calls, you'd only be using the client half.

## Where to go next

If your controllers already use `->with('message', ...)`, you may not need to rewrite them. The package reads those keys too, and [turning Laravel flash messages into Inertia toasts](./laravel-flash-messages-inertia-toasts.md) explains how.

For everything on the PHP side, the [Laravel usage docs](https://erag.in/laravel-inertia-toast/laravel.html) list the helper, the facade and the supported flash keys. To change colours or widths, the [styling guide](https://erag.in/laravel-inertia-toast/styling.html) lists every `erag-` class you can override.
