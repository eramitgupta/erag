---
title: Install Laravel Lang Sync Inertia for Inertia Apps
description: Install the Laravel and frontend packages needed to sync translations with Inertia Vue, React, or Svelte applications.
head:
  - ['meta', { name: 'keywords', content: 'install Laravel Lang Sync Inertia, Composer translation package Laravel, npm Inertia translations, Vue React Svelte localization setup' }]
---

# Installation

Install the package in two parts:

- `erag/laravel-lang-sync-inertia` for the Laravel backend
- `@erag/lang-sync-inertia` for Vue, React, or Svelte frontend usage

## Backend package

::: code-group

```bash [Laravel package]
composer require erag/laravel-lang-sync-inertia
```

```bash [Vue/React/Svelte package]
npm install @erag/lang-sync-inertia
```

:::

## Publish language files

If your app does not already have published language files, publish them first:

```bash
php artisan lang:publish
```

Then publish the package assets and config:

```bash
php artisan erag:install-lang
```

## After installation

Once installation is complete:

1. Create or update your language files in `lang/{locale}`.
2. Call `syncLangFiles()` before returning your Inertia response.
3. Use `lang()` in Vue, React, or Svelte to read translations on the frontend.
