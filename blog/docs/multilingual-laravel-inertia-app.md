---
title: Build a Multilingual Laravel Inertia App
description: Build a multilingual Laravel Inertia app with locale middleware, a language switcher, translated validation errors and lang files that scale with your pages.
date: 2026-09-29
package: laravel-lang-sync-inertia
category: Guide
tags: [laravel, inertia, localization, i18n, vue, react]
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/multilingual-laravel-inertia-app.md
</div>

Getting `__()` to work inside a Vue or React component is the easy part. A real multilingual Laravel Inertia app needs a few more pieces: something that decides the locale on each request, a way for users to switch it, an `<html lang>` attribute that doesn't go stale, validation errors in the right language, and a `lang` folder that still makes sense at forty pages.

This guide is about those pieces. I'll use Laravel Lang Sync Inertia for the translation side, since that's what I built it for, but most of the decisions here apply whatever you use to get strings into the frontend.

If you haven't installed the package yet, start with [using Laravel translations in Inertia Vue and React](./laravel-translations-inertia-vue-react.md) or the [installation guide](https://erag.in/laravel-lang-sync-inertia/installation.html). I'll assume `syncLangFiles()` and `vueLang()` already work for you.

## How a multilingual Laravel Inertia request works

Here's the whole flow for a Hindi visitor opening the billing page:

```text
Request     -> SetLocale middleware -> App::setLocale('hi')
Controller  -> syncLangFiles(['layout', 'billing'])
Laravel     -> lang/hi/layout.php, lang/hi/billing.php
Inertia     -> page.props.lang + page.props.locale
Vue / React -> __('billing.title')
```

The important detail: `syncLangFiles()` reads the files for `App::getLocale()` at the moment you call it. So the locale must be set before your controller runs. That's a job for middleware.

## Step 1: pick the locale in middleware

I usually resolve the locale in this order: what the user picked this session, what they saved on their profile (a `locale` column on `users`, if you add one), then what their browser asks for.

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /** @var array<int, string> */
    public const SUPPORTED = ['en', 'hi', 'fr'];

    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->session()->get('locale')
            ?? $request->user()?->locale
            ?? $request->getPreferredLanguage(self::SUPPORTED);

        if (in_array($locale, self::SUPPORTED, true)) {
            App::setLocale($locale);
        }

        return $next($request);
    }
}
```

The `in_array` check matters. Never pass a raw value from the session or a header straight into `App::setLocale()`; a locale you don't have files for just gives you untranslated pages.

Register it in the `web` group, before `HandleInertiaRequests`:

```php
// bootstrap/app.php
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\SetLocale;

->withMiddleware(function (Middleware $middleware): void {
    $middleware->web(append: [
        SetLocale::class,
        HandleInertiaRequests::class,
    ]);
})
```

If you'd rather keep the locale in the URL (`/hi/billing`), read it from a route parameter in the same middleware. The package doesn't care how you choose the locale, only that `App::getLocale()` is right when the controller runs.

## Step 2: share the current locale with the frontend

The package shares translations under `lang`. The locale code itself is yours to share, and you'll want it for the switcher and for formatting. Add it in `HandleInertiaRequests`:

```php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'locale' => fn () => App::getLocale(),
        'locales' => SetLocale::SUPPORTED,
    ];
}
```

The closure is evaluated when the response is built, so it always reflects what the middleware set.

## Step 3: add a language switcher

The switcher posts the new locale, stores it, and redirects back.

```php
// routes/web.php
use App\Http\Middleware\SetLocale;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

Route::post('/locale', function (Request $request) {
    $validated = $request->validate([
        'locale' => ['required', Rule::in(SetLocale::SUPPORTED)],
    ]);

    $request->session()->put('locale', $validated['locale']);
    $request->user()?->update(['locale' => $validated['locale']]);

    return back();
})->name('locale.update');
```

On the frontend, a small component in your layout does the rest:

```vue
<!-- resources/js/components/LanguageSwitcher.vue -->
<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3';
import { vueLang } from '@erag/lang-sync-inertia';

const page = usePage<{ locale: string; locales: string[] }>();
const { __ } = vueLang();

const names: Record<string, string> = { en: 'English', hi: 'हिन्दी', fr: 'Français' };

function switchTo(event: Event) {
    const locale = (event.target as HTMLSelectElement).value;

    router.post('/locale', { locale }, { preserveScroll: true });
}
</script>

<template>
    <select :value="page.props.locale" :aria-label="__('layout.language')" @change="switchTo">
        <option v-for="locale in page.props.locales" :key="locale" :value="locale">
            {{ names[locale] }}
        </option>
    </select>
</template>
```

Why this works without a full page reload: `back()` sends Inertia to the current page again. That request goes through `SetLocale` with the new session value, the controller calls `syncLangFiles()` again, and the fresh props carry the Hindi strings. The helpers read from page props, so the UI updates.

Language names are written in their own language on purpose. Someone who can't read the current UI language can still find theirs.

## Step 4: keep `<html lang>` in sync

The default `app.blade.php` sets the `lang` attribute on `<html>` from `app()->getLocale()`. That runs once, on the first full page load. After an Inertia visit switches the locale, the attribute still says `en`, and screen readers will pronounce Hindi text with English rules.

Fix it in your root layout with a watcher:

```ts
import { usePage } from '@inertiajs/vue3';
import { watch } from 'vue';

const page = usePage<{ locale: string }>();

watch(
    () => page.props.locale,
    (locale) => {
        document.documentElement.lang = locale;
        document.documentElement.dir = ['ar', 'ur', 'he'].includes(locale) ? 'rtl' : 'ltr';
    },
    { immediate: true },
);
```

The `dir` line only matters once you add a right-to-left language, but it's cheap to have in place. In React, the same logic goes in a `useEffect` that depends on `usePage().props.locale`.

## Step 5: validation messages are already handled

This one surprises people. Laravel builds validation error messages on the server, in the active locale, and Inertia sends them to the page as `errors`. So if `lang/hi/validation.php` exists, a Hindi user gets Hindi errors with no frontend work.

What you do need:

- Run `php artisan lang:publish` so `lang/en/validation.php` exists, then create the matching file for every other locale.
- Translate field names in the `attributes` array of each `validation.php`, otherwise you get "email फ़ील्ड आवश्यक है" with an English field name in the middle.

You only need `syncLangFiles('validation')` if you want to show those lines client-side yourself. For server errors, don't bother.

## Organizing lang files as the app grows

A few rules that keep things manageable:

**One group per feature.** `lang/en/billing.php`, `lang/en/settings/profile.php`. The nested one loads with `syncLangFiles('settings.profile')` and its keys look like `settings.profile.title`. See the [Laravel usage page](https://erag.in/laravel-lang-sync-inertia/laravel.html) for nested directories.

**One shared layout group.** Navigation, the language switcher label, the footer. Include it in each controller's call, for example `syncLangFiles(['layout', 'billing'])`. It's a little repetitive; a base controller method that adds `layout` for you is a reasonable way to avoid forgetting it.

**Don't sync everything.** Every group you sync goes into that page's payload. A settings page doesn't need your marketing copy.

**Make missing lines visible.** When a key is missing, the helper returns the key itself. An untranslated line shows up as `billing.empty_state` on screen, which is ugly but hard to miss in review.

## Plurals and numbers across languages

`transChoice()` understands Laravel's exact and range syntax:

```php
// lang/fr/billing.php
'seats' => '{0} Aucun siège|{1} Un siège|[2,*] :count sièges',
```

I write explicit ranges like this for every locale rather than the short `one|many` form. The choice then depends only on the count and the ranges you wrote, which is easy to reason about when a translator hands you a file.

Numbers, currencies and dates aren't translation strings, so format them with the browser's `Intl` API and the shared locale:

```ts
const price = new Intl.NumberFormat(page.props.locale, {
    style: 'currency',
    currency: 'INR',
}).format(149900);
```

MDN's [Intl.NumberFormat reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) covers the options.

## Test the locale switch

A feature test catches the most common regression: someone reorders the middleware and the switcher quietly stops working. Inertia's testing helpers make it short:

```php
use Inertia\Testing\AssertableInertia as Assert;

it('renders the billing page in Hindi after switching', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('locale.update'), ['locale' => 'hi'])
        ->assertRedirect();

    $this->actingAs($user)
        ->get(route('billing.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('locale', 'hi')
            ->where('lang.billing.title', __('billing.title', [], 'hi')));
});
```

The last assertion compares the synced line with Laravel's own `__()` for the same locale, so the test doesn't break every time a translator edits the wording.

## When this setup is more than you need

If you have two locales and twenty strings, a session value and a hand-written switcher might be all the structure you need; skip the profile column and the browser detection. And if your multilingual pages are mostly public marketing pages that need to rank per language, locale-prefixed URLs with `hreflang` tags are worth the extra routing work over a session-based switch.

## Where to go next

Wire up the middleware first, then the switcher, then walk through each page and add its `syncLangFiles()` call. If you also need translations outside Inertia pages, the package can export your lang files to JSON, which I cover in [sharing Laravel lang files with your frontend](./laravel-lang-files-frontend-json.md). The [API reference](https://erag.in/laravel-lang-sync-inertia/api.html) has every helper signature.
