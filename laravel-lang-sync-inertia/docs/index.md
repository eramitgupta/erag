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

## Packages

Choose the package you want to install first.

::: code-group

```bash [Laravel package]
composer require erag/laravel-lang-sync-inertia

php artisan lang:publish

php artisan erag:install-lang
```

```bash [Vue/React/Svelte package]
npm install @erag/lang-sync-inertia
```

:::

## Why use it

`Laravel Lang Sync Inertia` connects Laravel translation files to your Inertia frontend without manually passing props in every response.

This package is useful when:

- your translations already live in Laravel lang files
- your frontend is built with Inertia.js
- you want the same translation flow in Vue, React, or Svelte
- you need placeholder replacement without custom glue code
