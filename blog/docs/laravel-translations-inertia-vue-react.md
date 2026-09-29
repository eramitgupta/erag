---
title: Use Laravel Translations in Inertia Vue and React
description: Use Laravel translations in Inertia Vue and React pages with syncLangFiles(), __() and trans(), including placeholders, plurals and missing keys.
date: 2026-09-29
package: laravel-lang-sync-inertia
category: Tutorial
tags: [laravel, inertia, vue, react, localization]
---

Your Laravel translations already live in `lang/en/*.php`. Button labels, the "Welcome back, :name" line on the dashboard, the empty state for invoices. Then you move that page to Inertia and the strings end up on the wrong side of the wire. A Vue or React component can't call Laravel's `__()`.

The usual workarounds all cost something. You pass translation arrays as props from every controller. Or you copy the strings into a JavaScript i18n file and keep two dictionaries in sync by hand. Or you add an endpoint that the frontend fetches on load, and live with a flash of untranslated text.

I built Laravel Lang Sync Inertia so Laravel translations in Inertia pages work the way they do in Blade. Laravel stays the single source of truth, each controller picks the lang files its page needs, and the frontend gets `__()`, `trans()` and `transChoice()` helpers. This tutorial goes from a fresh install to a translated dashboard in both Vue and React.

## What you need

The package supports Laravel 10 to 13, Inertia 1 to 3, PHP 8.1 or newer, Vue 3 and React 18 or 19. There is a Svelte helper too, but this post sticks to Vue and React.

## Install the Composer and npm packages

The backend package gives you the `syncLangFiles()` helper. The npm package gives you the frontend helpers.

```bash
composer require erag/laravel-lang-sync-inertia
npm install @erag/lang-sync-inertia
```

If your app doesn't have published language files yet, publish Laravel's defaults first. Then publish the package config:

```bash
php artisan lang:publish
php artisan erag:install-lang
```

That creates `config/inertia-lang.php`. The defaults are fine for this tutorial. If your lang files live somewhere other than `base_path('lang')`, the [configuration page](https://erag.in/laravel-lang-sync-inertia/config.html) shows how to change `lang_path`.

## Write the language files

We'll translate a small dashboard: a title, a greeting with the user's name, and a line that counts unpaid invoices. Create one file per locale.

```php
<?php

// lang/en/dashboard.php
return [
    'title' => 'Dashboard',
    'welcome' => 'Welcome back, :name!',
    'unpaid_invoices' => '{0} No unpaid invoices|{1} One unpaid invoice|[2,*] :count unpaid invoices',
];
```

```php
<?php

// lang/hi/dashboard.php
return [
    'title' => 'डैशबोर्ड',
    'welcome' => 'वापसी पर स्वागत है, :name!',
    'unpaid_invoices' => '{0} कोई बकाया इनवॉइस नहीं|{1} एक बकाया इनवॉइस|[2,*] :count बकाया इनवॉइस',
];
```

Nothing here is package-specific. These are plain Laravel lang files with Laravel's `:name` placeholders and its pipe syntax for plurals. That's the point: the same file keeps working in Blade, mail and notifications.

## Share Laravel translations with the Inertia page

Call `syncLangFiles()` in the controller before you return the Inertia response.

```php
<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        syncLangFiles('dashboard');

        return Inertia::render('Dashboard', [
            'userName' => $request->user()->name,
            'unpaidCount' => Invoice::whereNull('paid_at')->count(),
        ]);
    }
}
```

Here's what happens on that call:

1. Laravel reads `lang/{locale}/dashboard.php` for the current `App::getLocale()`.
2. The package shares the array through Inertia under `page.props.lang.dashboard`.
3. The frontend helpers read from `page.props.lang`, so a key like `dashboard.title` resolves.

You don't add a `lang` prop yourself. The page props you pass (`userName`, `unpaidCount`) stay about the page.

A page that needs more than one group gets an array, and nested folders use dot notation:

```php
syncLangFiles(['dashboard', 'invoices']);

// reads lang/{locale}/admin/auth.php, keys look like admin.auth.name
syncLangFiles('admin.auth');
```

## Use the translations in a Vue page

Import `vueLang()` from the package root and pull out the helpers you need.

```vue
<!-- resources/js/pages/Dashboard.vue -->
<script setup lang="ts">
import { vueLang } from '@erag/lang-sync-inertia';

defineProps<{ userName: string; unpaidCount: number }>();

const { __, trans, transChoice } = vueLang();
</script>

<template>
    <section>
        <h1>{{ __('dashboard.title') }}</h1>
        <p>{{ trans('dashboard.welcome', { name: userName }) }}</p>
        <p>{{ transChoice('dashboard.unpaid_invoices', unpaidCount) }}</p>
    </section>
</template>
```

With an English locale and three unpaid invoices, that renders "Dashboard", "Welcome back, Asha!" and "3 unpaid invoices". Switch the Laravel locale to `hi` and the same component renders the Hindi lines, because the controller now reads `lang/hi/dashboard.php`.

## The same page in React

The React helper is `reactLang()`, called inside the component.

```tsx
// resources/js/pages/Dashboard.tsx
import { reactLang } from '@erag/lang-sync-inertia';

type Props = { userName: string; unpaidCount: number };

export default function Dashboard({ userName, unpaidCount }: Props) {
    const { __, trans, transChoice } = reactLang();

    return (
        <section>
            <h1>{__('dashboard.title')}</h1>
            <p>{trans('dashboard.welcome', { name: userName })}</p>
            <p>{transChoice('dashboard.unpaid_invoices', unpaidCount)}</p>
        </section>
    );
}
```

Same keys, same output. If your team has one Vue app and one React app on the same backend, both read the same lang files.

## `__()`, `trans()` or `transChoice()`?

All three read the same data. The difference is intent:

- `__('dashboard.title')` is the quick lookup. It also accepts a replacements object.
- `trans('dashboard.welcome', { name })` is for lines that always have placeholders. I use it whenever there's a `:name` in the string, because it makes the call site obvious.
- `transChoice('dashboard.unpaid_invoices', count)` picks the right segment for the count and fills in `:count`. `trans_choice()` is an alias if you prefer Laravel's spelling.

The exact and interval forms (`{0}`, `{1}`, `[2,*]`) work, and so does the short `one|many` form like `'There is one apple|There are :count apples'`.

### The placeholder mistake everyone makes once

Replacements must be an object. This works:

```ts
trans('dashboard.welcome', { name: 'Asha' });
```

This doesn't replace anything:

```ts
__('dashboard.welcome', 'Asha');
```

Older lang files that use `{name}` instead of `:name` still work. For new lines, stick to `:name` so the string behaves the same in PHP.

### Missing keys fall back to the key

If a key isn't in the synced data, the helper returns the string you passed. That means Laravel's "translation string as key" style works:

```ts
__('Save changes'); // "Save changes"
```

It also means a forgotten `syncLangFiles()` call shows up as raw keys like `dashboard.title` on screen. Annoying, but easy to spot in development.

## Reading the raw `lang` prop

Sometimes you want the whole object, for example to loop over a list of FAQ entries stored in a lang file. It's a normal Inertia prop:

```ts
import { usePage } from '@inertiajs/vue3';

const { lang } = usePage().props;
```

In React, import `usePage` from `@inertiajs/react` instead. The [API reference](https://erag.in/laravel-lang-sync-inertia/api.html) lists the TypeScript types for this object.

## When you don't need this

Be honest with yourself about the size of the problem:

- **Single-language apps.** If there's no second locale on the roadmap, hardcoded copy in components is simpler.
- **Strings that never touch PHP.** If a string only exists in the frontend and never appears in mail, notifications or validation, a frontend-only i18n library is a fair choice.
- **Code that isn't an Inertia page.** The helpers read from Inertia page props. For a standalone script or widget, the package can export your lang files to JSON instead. I cover that in [sharing Laravel lang files with your frontend](./laravel-lang-files-frontend-json.md).

The one trade-off to accept: you call `syncLangFiles()` in each controller that needs translations, and you only get the groups you asked for. I prefer that over shipping every lang file on every visit, but it's a call you have to remember.

## FAQ

### Does this work with Inertia SSR?

Yes. The translations are part of the page props, so they're already there when the server renders the page. No extra request, no flash of untranslated text.

### Can child components use the helpers too?

Yes. The translations sit on the shared page props, so any component rendered inside the page can call `vueLang()` or `reactLang()` itself. A `Sidebar.vue` or `InvoiceRow.tsx` doesn't need the strings passed down as props, as long as the controller synced the group they use.

### Should I sync every lang file on every page?

No. Each group you sync is added to that page's payload. Sync the groups the page uses, plus any shared layout strings.

### Is there a Svelte version?

Yes, `svelteLang()` from the same package. It needs Svelte 5 and `@inertiajs/svelte` v3. See the [Svelte guide](https://erag.in/laravel-lang-sync-inertia/svelte.html).

## Where to go next

You now have translated pages, but the locale is still whatever `config/app.php` says. The next step is letting users pick their language, keeping `<html lang>` in sync and sorting out validation messages. That's all in [building a multilingual Laravel Inertia app](./multilingual-laravel-inertia-app.md). For the full list of helpers, keep the [Vue guide](https://erag.in/laravel-lang-sync-inertia/vue.html) or the [React guide](https://erag.in/laravel-lang-sync-inertia/react.html) open while you work.
