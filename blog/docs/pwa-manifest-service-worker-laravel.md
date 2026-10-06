---
title: Web App Manifest and Service Worker in Laravel
description: What the web app manifest and service worker do in a Laravel PWA, how config/pwa.php becomes manifest.json, and how to change the name and icon at runtime.
date: 2026-09-29
package: laravel-pwa
category: Guide
tags: [laravel, pwa, manifest, service-worker]
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/pwa-manifest-service-worker-laravel.md
</div>

Two files decide whether a website behaves like an app: the web app manifest and the service worker. When a PWA misbehaves, it's almost always one of the two, and knowing which one saves a lot of guessing.

The manifest answers "what is this app?" Its name, icon, colours and how it should open. The service worker answers "what happens between the page and the network?" Caching, offline pages and anything that runs in the background.

This guide explains both in the context of a Laravel app using [Laravel PWA](https://erag.in/laravel-pwa/introduction.html): how the web app manifest in Laravel gets generated, when it needs regenerating, how to change it at runtime from an admin panel, and what the service worker does and doesn't do. For the step-by-step setup, see [how to turn a Laravel app into a PWA](./turn-laravel-app-into-pwa.md).

## What the web app manifest does

The [web app manifest](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest) is a JSON file the browser reads to learn about your app. A `<link rel="manifest">` tag in the page points to it. When someone installs the app, the browser uses it to create the home screen icon, the splash screen and the app window.

These are the fields the package manages, and what each one changes on screen:

| Field | What the user sees |
| --- | --- |
| `name` | Full name on the splash screen and in app lists |
| `short_name` | Label under the home screen icon, where space is tight |
| `description` | Descriptive text some platforms show about the app |
| `background_color` | Splash screen background while the app starts |
| `theme_color` | Colour of the toolbar and title bar |
| `display` | `fullscreen`, `standalone`, `minimal-ui` or `browser` |
| `icons` | The app icon, from `logo.png` |

The `display` value has the biggest effect on how the app feels. `fullscreen` (the package default) hides everything, including the phone's status bar, which suits games and kiosk screens. `standalone` removes the browser UI but keeps the status bar, which is what most business apps want. `minimal-ui` keeps a small set of navigation controls, and `browser` opens it like a normal tab.

## How the web app manifest in Laravel gets generated

You never edit `manifest.json` directly. The flow is:

1. You describe the app in the `manifest` array of `config/pwa.php`.
2. You run `php artisan erag:update-manifest`.
3. The package writes `manifest.json` to the root of `public/`.
4. `@PwaHead` in your layout outputs the link to it, along with icon and mobile meta tags.

The [configuration page](https://erag.in/laravel-pwa/configuration.html) shows the default array.

The detail that trips people up is step 2. The browser reads the generated file, not your config. Change `theme_color`, forget the command, and nothing happens.

### Deploying the generated file

Because `manifest.json` is a generated file in `public/`, decide how it gets to production. There are two sensible options:

- **Commit it.** Run the command locally after config changes and commit the output. Simple, and the file is always there after a deploy.
- **Generate it during deploy.** Add `php artisan erag:update-manifest` to your deploy script, after your config is in place. This is the better option if any manifest values come from environment variables that differ per environment.

What doesn't work is doing neither and hoping it's there.

## Change the manifest at runtime with the PWA facade

Sometimes the app name or colours should be editable by an admin, not hard-coded in config. The `PWA` facade has an `update()` method for that:

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use EragLaravelPwa\Facades\PWA;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AppBrandingController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:60'],
            'short_name' => ['required', 'string', 'max:12'],
            'theme_color' => ['required', 'hex_color'],
        ]);

        PWA::update([
            'name' => $validated['name'],
            'short_name' => $validated['short_name'],
            'theme_color' => $validated['theme_color'],
            'background_color' => $validated['theme_color'],
        ]);

        return back()->with('status', 'App branding updated.');
    }
}
```

`update()` merges the values you pass with the existing manifest configuration and rewrites `manifest.json` straight away. No Artisan command needed.

Two things to keep in mind:

- **`public/` must be writable** by the web server user. If it's read-only, the update throws a file permission error. On some hosting setups the deploy user and the web server user are different, so check this on the real server.
- **There's one manifest per app.** The file lives at a single path in `public/`, so every visitor gets the same one. If you run a multi-tenant app on one codebase and want per-tenant branding, the facade will overwrite one tenant's settings with another's. That needs a different approach than a single generated file.

The [facade docs](https://erag.in/laravel-pwa/facade.html) show a complete `update()` call with every manifest key.

## Update the icon from an upload form

The icon is always `public/logo.png`. To let an admin replace it, the package has a `processLogo()` helper on the core `PWA` class. Note that this is a different class from the facade above:

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use EragLaravelPwa\Core\PWA;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AppLogoController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $response = PWA::processLogo($request);

        if ($response['status']) {
            return back()->with('success', $response['message']);
        }

        return back()->withErrors($response['errors'] ?? ['Logo upload failed.']);
    }
}
```

The upload field must be named `logo`. The helper validates the file (PNG only, at least 512x512 pixels, no larger than 1024 KB) and replaces `public/logo.png` if it passes. The [logo upload docs](https://erag.in/laravel-pwa/logo-upload.html) include the matching form.

## What the service worker does

The service worker is a script the browser runs separately from your page. Once registered, it sits between the page and the network and can answer requests itself.

`@RegisterServiceWorkerScript`, placed before `</body>`, registers the package's worker. From then on it:

- caches static assets such as stylesheets and scripts on the first load
- intercepts failed navigations and shows an offline fallback page when a visitor goes offline and opens a route that isn't cached

That offline page is the difference between your branded "you're offline" screen and the browser's own error page.

Set `'debug' => true` (it follows `APP_DEBUG` by default) to have the worker log its activity to the browser console. For Livewire apps using `wire:navigate`, set `'livewire-app' => true` so the registration script only runs once instead of on every page transition.

## What the service worker doesn't do

Be clear about the scope here. The docs don't describe options for custom caching strategies per route, background sync or push notifications. The package gives you asset caching and an offline fallback, which covers the "installable app with a decent offline screen" case well.

If you need offline data entry that syncs when the connection returns, that's application logic you'd build yourself on top of a service worker you control. Don't promise it to a client just because the app is installable.

## Debugging checklist

When something looks wrong, check it in this order:

1. **DevTools > Application > Manifest.** Are the values the ones you expect? If not, regenerate `manifest.json`.
2. **DevTools > Application > Service workers.** Is a worker active for your origin? If not, check HTTPS and the directive in your layout.
3. **Stale values.** Browsers cache both files. During development, tick "Update on reload" for service workers and use "Clear site data". Installed apps may keep an old name or icon for a while after you change it, since the browser decides when to refresh them.

## Where to go next

Keep branding in `config/pwa.php` if it rarely changes, and switch to `PWA::update()` once an admin needs to edit it. Decide now whether `manifest.json` is committed or generated on deploy. When you're ready to ask people to install, [add an install app button](./laravel-pwa-install-button.md) that fits your layout.
