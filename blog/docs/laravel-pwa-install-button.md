---
title: Add an Install App Button to Your Laravel Site
description: How the PWA install prompt works in Laravel. Use the built-in floating button, restyle it, handle iOS Safari, or build your own Install app button in Vue.
date: 2026-09-29
package: laravel-pwa
category: Tutorial
tags: [laravel, pwa, vue, javascript]
---

Your Laravel app is installable now. The manifest is there, the service worker is registered, and Chrome shows a tiny install icon in the address bar. Almost nobody clicks it, because almost nobody notices it.

An explicit "Install app" button fixes that. The catch is that browsers don't let you open the install dialog whenever you like. You can only show the PWA install prompt when the browser says the site is installable, and only in response to a click.

This post explains how that works, what the built-in button in [Laravel PWA](https://erag.in/laravel-pwa/install-prompt.html) does for you, how to restyle it, and how to replace it with your own button in Vue. If you haven't made the app installable yet, start with [how to turn a Laravel app into a PWA](./turn-laravel-app-into-pwa.md).

## How the PWA install prompt works in the browser

In Chromium-based browsers (Chrome, Edge and friends), the flow looks like this:

1. The browser checks that the site meets its install criteria: a valid manifest, a service worker, HTTPS.
2. If it does, and the app isn't installed already, the browser fires a [`beforeinstallprompt`](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeinstallprompt_event) event on `window`.
3. Your code calls `preventDefault()` on that event and keeps a reference to it.
4. Later, when the user clicks your button, you call `prompt()` on the saved event. The browser shows its native install dialog.
5. The event's `userChoice` promise tells you whether they accepted or dismissed it.

A few things follow from this. You don't control when the event fires, so your button has to stay hidden until it arrives. You can't call `prompt()` from a timer or on page load, because the browser wants a user action behind it. And each saved event can only be used for one prompt.

Safari on iPhone and iPad doesn't fire `beforeinstallprompt` at all. There, installing means tapping the Share button and choosing **Add to Home Screen**. The best you can do is tell people how.

## Option 1: use the built-in install button

The package handles all of the above for you. It's controlled by one key in `config/pwa.php`:

```php
'install-button' => true,
```

With it enabled, the package's client-side script does the following:

- checks whether the app is already running standalone, and stays quiet if it is
- intercepts `beforeinstallprompt`, stops the default browser behaviour and shows a floating button (`#install-button`) in the bottom-right corner
- opens the native install dialog when the button is clicked
- on iOS Safari, shows a small tip panel (`.ios-tip`) telling the visitor to tap **Share**, then **Add to Home Screen**

For a lot of apps, that's enough. You get an install flow on Android, desktop Chrome and iOS without writing any JavaScript.

## Restyle or move the floating button

The prompt sits in a fixed container with the class `.box-icon`. The package ships these styles:

```css
.box-icon {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 2147483647;
    max-width: min(320px, calc(100vw - 32px));
}
```

Look at that `z-index`. It's the largest value a browser accepts, so the button floats above everything, including your modals and toast notifications. If you already have something in the bottom-right corner, such as a chat widget or a toast stack, the two will overlap.

You can override the position in your own stylesheet. Adding `body` in front of the selector makes your rule win regardless of which stylesheet loads first:

```css
/* resources/css/app.css */
body .box-icon {
    bottom: 96px;
}

@media (min-width: 1024px) {
    body .box-icon {
        right: 32px;
    }
}
```

The [install prompt docs](https://erag.in/laravel-pwa/install-prompt.html) show the rest of the injected styles, including the round button itself.

## Option 2: build your own install button

The floating button is generic by design. Sometimes you want the install option in a specific place, like the account menu or an onboarding step, styled like the rest of your UI. In that case, turn the built-in one off:

```php
'install-button' => false,
```

The manifest and service worker keep working. Only the package's install button logic goes away, so now the `beforeinstallprompt` event is yours to handle.

### Catch the event early

This is the part people get wrong. The browser can fire `beforeinstallprompt` very early, before your Vue components mount. If you only add the listener inside a component, you can miss it.

So catch it in a small module and import it at the top of your entry file:

```ts
// resources/js/lib/installPrompt.ts
import { ref } from 'vue';

export type InstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export const installPrompt = ref<InstallPromptEvent | null>(null);

if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        installPrompt.value = event as InstallPromptEvent;
    });

    window.addEventListener('appinstalled', () => {
        installPrompt.value = null;
    });
}
```

```ts
// resources/js/app.ts
import './lib/installPrompt';
// ...the rest of your Inertia bootstrap
```

The `typeof window` check keeps the module safe if you use server-side rendering. The TypeScript type is there because `beforeinstallprompt` isn't in the standard DOM typings yet.

### The button component

Now any component can read the shared ref:

```vue
<!-- resources/js/components/InstallAppButton.vue -->
<script setup lang="ts">
import { installPrompt } from '@/lib/installPrompt';

async function install(): Promise<void> {
    const promptEvent = installPrompt.value;

    if (!promptEvent) {
        return;
    }

    await promptEvent.prompt();
    await promptEvent.userChoice;

    installPrompt.value = null;
}
</script>

<template>
    <button
        v-if="installPrompt"
        type="button"
        class="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white"
        @click="install"
    >
        Install app
    </button>
</template>
```

The button only renders while there's a saved event, so it simply doesn't exist on browsers that can't install, or once the app is already installed. After one prompt, the event is spent, which is why the ref gets cleared either way.

If you want to track installs, `userChoice` resolves to `{ outcome: 'accepted' }` or `{ outcome: 'dismissed' }`. Send that to your analytics instead of discarding it.

### Don't forget iOS

Turning off the built-in button also turns off its iOS tip. If iPhone users matter to you, add your own hint:

```ts
const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

const showIosHint = isIos && !isStandalone;
```

Then render a short line such as "Tap Share, then Add to Home Screen" when `showIosHint` is true. User-agent checks are imperfect, since recent iPads can identify as a Mac, so treat this as a helpful hint and not something your UI depends on.

## When to show the button

A few opinions, from the user's side of the screen:

- **Don't prompt on the first visit.** Nobody wants to install an app they opened ten seconds ago. A button in the menu is fine; a popup that jumps in front of the content isn't.
- **Put it where settings live.** The account menu or a settings page is where people look for "get the app".
- **Offer it after a win.** Right after someone finishes their first real task, like sending their first invoice, is a natural moment.

Keep in mind that the browser has the final say. You can't force `beforeinstallprompt` to fire, and a browser may choose not to fire it again for a while after someone dismisses the dialog.

## When you don't need a custom button

If your users are mostly on desktop and already use the app in a browser tab all day, the address bar icon plus the built-in button is plenty. Writing your own button pays off when you want the install option inside your own navigation, or when the floating button collides with other fixed UI.

## Where to go next

Start with the built-in button and fix its position if it collides with anything. Switch to your own component when you want the install option somewhere specific. For the other half of the setup, including how the manifest is generated and how to change the app name and icon from an admin screen, read [web app manifest and service worker in Laravel](./pwa-manifest-service-worker-laravel.md). The [configuration reference](https://erag.in/laravel-pwa/configuration.html) lists every option in `config/pwa.php`.
