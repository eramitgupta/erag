---
title: Laravel Lang Sync Inertia
description: Use Laravel translation files directly in Inertia Vue and React apps with replacements, pluralization, and locale-aware helpers.
head:
    - [
          'meta',
          {
              name: 'keywords',
              content: 'Laravel Lang Sync Inertia, Inertia.js translations, Laravel i18n, Vue translations, React translations, localization package',
          },
      ]
layout: home

hero:
    name: 'Laravel Lang Sync Inertia'
    text: 'Laravel translations for your Inertia frontend'
    tagline: 'Sync Laravel lang files once, then use clean Vue, React, and Svelte helpers for keys, replacements, pluralization, and direct string fallback.'
    image:
        src: /hero-orb.svg
        alt: Laravel Lang Sync Inertia

features:
    - icon: '↔'
      title: 'Laravel sync'
      details: 'Call `syncLangFiles()` in a controller and share selected Laravel lang files with the Inertia page.'
    - icon: '◆'
      title: 'Vue, React and Svelte'
      details: 'Use dedicated Vue, React, and Svelte entry points with the same helper names and behavior.'
    - icon: '⌘'
      title: 'Key replacement'
      details: 'Use Laravel-style replacements like `Welcome, :name` with `__()` or `trans()`.'
    - icon: '♢'
      title: 'Legacy placeholders'
      details: 'Existing strings like `Welcome, {name}` keep working while you move to Laravel-style placeholders.'
    - icon: '∑'
      title: 'Pluralization'
      details: 'Use `transChoice()` or `trans_choice()` with Laravel intervals like `{0}`, `{1}`, and `[2,*]`.'
    - icon: '↵'
      title: 'Direct strings'
      details: 'Calls like `__("I love programming.")` return the original text when no key is found.'
    - icon: '◐'
      title: 'Locale aware'
      details: 'Translations are loaded from `lang/{locale}` using Laravel’s current application locale.'
    - icon: '▣'
      title: 'Nested directories'
      details: 'Load files like `lang/en/admin/users.php` with `syncLangFiles("admin.users")` and resolve `__("admin.users.name")`.'
    - icon: '⇪'
      title: 'JSON export'
      details: 'Generate frontend-ready JSON files from PHP lang files, then load the exported JSON automatically.'
    - icon: '✓'
      title: 'TypeScript ready'
      details: 'Typed Vue and React helpers give autocomplete for common translation calls.'
---

## Quick example

The backend decides which language files should be available for the page.
After that, your frontend can read translations with a very small API.

- Call `syncLangFiles()` in the controller.
- Keep translations in Laravel language files.
- Use `lang()` in Vue, React, or Svelte.
- Render translations with `__()` or `trans()`.

::: code-group

```php [Controller]
<?php
namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        syncLangFiles('auth');

        return Inertia::render('Dashboard');
    }
}
```

```php [lang/en/auth.php]
<?php

return [
    'greeting' => 'Welcome back',
    'welcome' => 'Welcome, :name',
];
```

```vue [Vue]
<script setup>
import { lang } from '@erag/lang-sync-inertia/vue';

const { __, trans } = lang();
</script>

<template>
    <h1>{{ __('auth.greeting') }}</h1>
    <p>{{ trans('auth.welcome', { name: 'Amit' }) }}</p>
</template>
```

```tsx [React]
import { lang } from '@erag/lang-sync-inertia/react';

export default function Dashboard() {
    const { __, trans } = lang();

    return (
        <section>
            <h1>{__('auth.greeting')}</h1>
            <p>{trans('auth.welcome', { name: 'Amit' })}</p>
        </section>
    );
}
```

```svelte [Svelte]
<script module lang="ts">
import { lang } from '@erag/lang-sync-inertia/svelte';

const { __, trans } = lang();
</script>

<section>
    <h1>{__('auth.greeting')}</h1>
    <p>{trans('auth.welcome', { name: 'Amit' })}</p>
</section>
```

:::

Nested Laravel language directories are also supported:

```php
syncLangFiles('admin.users');
```

This reads `lang/{locale}/admin/users.php`, then your frontend can call:

```ts
__('admin.users.name');
```

<div class="home-container">
<section class="home-desc">
<h2>Translation Syncing Made Simple</h2>
<p>Laravel Lang Sync Inertia is an open-source package built to bridge the translation gap in hybrid Inertia.js architectures. Instead of writing custom JSON endpoints or copying translations manually to your frontend directory, it automates localization file syncing. The package loads, parses, and formats your existing server-side PHP array translations into lightweight frontend modules. With ready-to-use helpers for Vue, React, and Svelte, your client-side views stay perfectly synchronized with Laravel's active locale dynamically.</p>
</section>

<section class="home-faq">
<h2>Frequently Asked Questions</h2>

<details class="faq-item">
<summary>Why use this package over manual prop sharing?</summary>
<div class="faq-content">
<p>While you can manually pass translation objects through Inertia middleware, doing so for entire language libraries can result in massive payload sizes. This package handles automatic dynamic syncing, locale matching, legacy placeholder fallbacks, and localized frontend hooks efficiently without manual setup.</p>
</div>
</details>

<details class="faq-item">
<summary>How does locale determination work?</summary>
<div class="faq-content">
<p>The package automatically respects Laravel's dynamic runtime locale. When you update the locale via app()->setLocale() on the server, the corresponding lang files will be dynamically loaded and shared with Inertia frontend hooks on the next render cycle.</p>
</div>
</details>

<details class="faq-item">
<summary>Can I bundle translations for production caching?</summary>
<div class="faq-content">
<p>Yes. The package includes artisan exporter commands to compile PHP translation files into JSON assets, allowing them to be cached in the browser or via Service Workers for offline capabilities.</p>
</div>
</details>

<details class="faq-item">
<summary>Does it support pluralization and replacements?</summary>
<div class="faq-content">
<p>Absolutely. It implements full pluralization interval support (using transChoice helper rules) and parameter replacement matching standard Laravel behavior in Vue, React, and Svelte.</p>
</div>
</details>
</section>
</div>
