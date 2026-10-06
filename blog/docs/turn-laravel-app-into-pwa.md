---
title: How to Turn a Laravel App Into a PWA
description: A step-by-step Laravel PWA setup. Install the package, configure the manifest, add a 512x512 logo, register the service worker and test it over HTTPS.
date: 2026-09-29
package: laravel-pwa
category: Tutorial
tags: [laravel, pwa, blade, inertia, livewire]
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/turn-laravel-app-into-pwa.md
</div>

Sooner or later a client or a user asks whether there's an app for this. You have a working Laravel app, and the last thing you want is a second codebase in the app stores just so people can get an icon on their home screen.

A Laravel PWA (Progressive Web App) covers most of that request. The site becomes installable, opens in its own window without browser chrome, and shows a proper offline screen instead of the browser's "no internet" page. It's still your Laravel app, deployed the same way.

Doing it by hand means writing a manifest JSON file, generating icons, registering a service worker and building an install button. This tutorial turns a Laravel app into a PWA with [Laravel PWA](https://erag.in/laravel-pwa/introduction.html), a package I maintain that generates those pieces from a config file.

## What you get from a Laravel PWA setup

After the steps below, your app will have:

- a `manifest.json` in `public/`, generated from `config/pwa.php`
- meta tags, icon links and the manifest link in your layout's `<head>`
- a service worker registered on every page
- an offline fallback page when the network drops
- an optional floating install button, plus an "Add to Home Screen" hint on iOS Safari

It works with plain Blade, Livewire and Inertia (Vue or React). I'll show Blade first, then the changes for the other two.

## Before you start: HTTPS

Service workers only run in a secure context. If your site is served over plain HTTP, the worker won't register and no install prompt will appear. This is a browser rule, not a package limitation.

On your own machine, `localhost` counts as secure, so local testing works. To test on a real phone, or on a staging server, you need a proper HTTPS certificate on that domain.

## Step 1: Install the package

```bash
composer require erag/laravel-pwa
```

On Laravel 11, 12 and 13, package discovery registers the service provider automatically. If you need to register it manually, it goes in `bootstrap/providers.php`:

```php
use EragLaravelPwa\EragLaravelPwaServiceProvider;

return [
    App\Providers\AppServiceProvider::class,
    EragLaravelPwaServiceProvider::class,
];
```

On Laravel 8, 9 and 10, add `EragLaravelPwa\EragLaravelPwaServiceProvider::class` to the `providers` array in `config/app.php`.

Then publish the config:

```bash
php artisan erag:install-pwa
```

This copies `config/pwa.php` into your app.

## Step 2: Describe your app in config/pwa.php

Open `config/pwa.php`. The `manifest` array is what ends up in the browser's manifest file. Replace the defaults with your own app's details:

```php
return [
    'install-button' => true,

    'manifest' => [
        'name' => 'Invoice Desk',
        'short_name' => 'Invoices',
        'background_color' => '#0f172a',
        'display' => 'standalone',
        'description' => 'Create, send and track invoices.',
        'theme_color' => '#0f172a',
        'icons' => [
            [
                'src' => 'logo.png',
                'sizes' => '512x512',
                'type' => 'image/png',
            ],
        ],
    ],

    'debug' => env('APP_DEBUG', false),

    'livewire-app' => false,
];
```

A few choices worth thinking about:

- **`short_name`** is what appears under the icon on a phone's home screen. Keep it short, or it gets cut off.
- **`display`** accepts `fullscreen`, `standalone`, `minimal-ui` or `browser`. The package defaults to `fullscreen`. For a business app I usually pick `standalone`, which keeps the phone's status bar visible and feels more like a normal app.
- **`theme_color`** tints the browser toolbar and the app's title bar. Match it to your header.

The [configuration docs](https://erag.in/laravel-pwa/configuration.html) explain each option.

## Step 3: Add the logo

The icon file name is fixed. Put a PNG at `public/logo.png`, at least 512x512 pixels. A square image with some padding around the logo looks best, since some platforms place icons inside circles or rounded squares.

## Step 4: Generate the manifest

Every time you change the `manifest` array, regenerate the file:

```bash
php artisan erag:update-manifest
```

This reads your config and writes `manifest.json` to the root of the `public` directory. Forgetting this step is the most common reason a name or colour change "doesn't work".

## Step 5: Add the directives to your layout

Two Blade directives connect everything. `@PwaHead` goes inside `<head>` and outputs the manifest link, icon tags and mobile meta tags. `@RegisterServiceWorkerScript` goes just before `</body>` and registers the service worker.

Here is a typical `resources/views/layouts/app.blade.php`:

```blade
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    @PwaHead

    <title>{{ config('app.name') }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    {{ $slot }}

    @RegisterServiceWorkerScript
</body>
</html>
```

That's the whole setup for a Blade app.

### Inertia (Vue or React)

With Inertia, the root Blade view stays mounted while users move between pages, so you add the directives once to `resources/views/app.blade.php`:

```blade
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    @PwaHead
    @vite(['resources/js/app.ts'])
    @inertiaHead
</head>
<body class="font-sans antialiased">
    @inertia
    @RegisterServiceWorkerScript
</body>
```

The service worker registers on the first load and stays active for the rest of the session. The [framework integration guide](https://erag.in/laravel-pwa/frameworks.html) has the React version.

### Livewire with wire:navigate

With `wire:navigate`, Livewire can run layout scripts again on each page transition. Set this in `config/pwa.php`:

```php
'livewire-app' => true,
```

The package then adds `data-navigate-once` to its registration script, so Livewire runs it only on the first page load.

## Step 6: Check that it works

Open the site in Chrome and open DevTools.

1. **Application > Manifest** should show your name, colours and icon. If it's empty or shows old values, run `php artisan erag:update-manifest` again and hard-reload.
2. **Application > Service workers** should list an active worker for your origin.
3. With `install-button` enabled, a floating install button appears in the bottom-right corner once the browser decides the site is installable. Chrome also shows an install icon in the address bar.
4. To test offline mode, tick **Offline** in the Network tab and navigate to a page you haven't visited yet. You should see the package's offline fallback page instead of the browser error.

If something is off, the `debug` option (it follows `APP_DEBUG` by default) makes the service worker log what it's doing to the browser console.

## Common problems

**The service worker never registers.** Almost always HTTPS. Check the address bar. Also confirm `@RegisterServiceWorkerScript` is actually in the layout that renders the page you're testing.

**Config changes don't show up.** Run `php artisan erag:update-manifest`. The browser reads `public/manifest.json`, not your config file.

**The old icon or name sticks around.** Browsers cache the manifest and service worker. In DevTools, use **Application > Storage > Clear site data** while developing.

## When a PWA isn't worth it

A PWA is a good fit when people use your app often, on phones, and would like a one-tap way back in. It's less useful when:

- your users work at a desk with the app open in a browser tab all day anyway
- you need an app store listing for discovery or company policy reasons
- you need offline data entry that syncs later. The package gives you an offline fallback page and caches static assets, which is not the same thing as working offline with your data.

Be honest with the client about that last one. "Installable" and "works offline" are different promises.

## FAQ

### Do I need to run erag:update-manifest after replacing logo.png?

Yes. Replace `public/logo.png` with a PNG of at least 512x512 pixels, then run `php artisan erag:update-manifest` so the manifest icons are regenerated.

### Which Laravel versions does it support?

The [installation guide](https://erag.in/laravel-pwa/installation.html) covers registration for Laravel 8 through 13. On 11 and later, package discovery handles it for you.

### Can I test it on my phone against my local machine?

Only over HTTPS. `localhost` is treated as secure on the machine itself, but a phone reaching your laptop by IP address or a local domain needs a valid certificate before the service worker will register.

## Where to go next

Once the basics work, decide how you want to ask people to install. The [install app button guide](./laravel-pwa-install-button.md) covers the built-in button, iOS Safari and writing your own. If you want to understand what the manifest and service worker are actually doing, or update the app name and icon from an admin panel, read [web app manifest and service worker in Laravel](./pwa-manifest-service-worker-laravel.md).
