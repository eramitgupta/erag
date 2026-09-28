---
title: 'Installation'
description: 'Install the Composer package and the Vue, React, or Svelte package, then add one @source line so Tailwind CSS 4 styles the forms.'
head:
    - - meta
      - name: robots
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    - - meta
      - name: googlebot
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    - - meta
      - name: bingbot
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/guide/installation.md
</div>


<div class="doc-category">Getting Started</div>

# Installation

Installation has three steps: the Composer package, the npm package, and one line of CSS.

## 1. Install the PHP package

```bash
composer require erag/inertia-forms
```

Then run the install command:

```bash
php artisan erag:install-inertia-forms
```

It publishes `config/inertia-forms.php` and `stubs/inertia-form.stub`, then prints the next steps for your frontend. It reads `package.json` to find your Inertia adapter, so it shows only the Vue, React or Svelte package you need. Files you already published are kept; add `--force` to replace them.

The service provider is registered automatically through Laravel package discovery. It adds the `erag:install-inertia-forms` and `make:form` Artisan commands and the `inertia-forms` config.

## 2. Install the frontend package

Install the package for your framework:

::: code-group

```bash [Vue]
npm install @erag/inertia-forms-vue
```

```bash [React]
npm install @erag/inertia-forms-react
```

```bash [Svelte]
npm install @erag/inertia-forms-svelte
```

:::

## 3. Let Tailwind scan the package

The components are styled with Tailwind CSS 4 utility classes. Tailwind only generates classes it can see, so point it at the package's built files with an `@source` directive in your main CSS file (usually `resources/css/app.css`):

::: code-group

```css [Vue]
@import 'tailwindcss';

@source "../../node_modules/@erag/inertia-forms-vue/dist";
```

```css [React]
@import 'tailwindcss';

@source "../../node_modules/@erag/inertia-forms-react/dist";
```

```css [Svelte]
@import 'tailwindcss';

@source "../../node_modules/@erag/inertia-forms-svelte/dist";
```

:::

The path is relative to the CSS file. From `resources/css/app.css`, `../../` points to the project root. Adjust it if your CSS file lives elsewhere.

::: tip Forms look unstyled?
The `@source` line is missing or the path is wrong. Fix the path and restart `npm run dev`.
:::

## AI agents (Laravel Boost)

The package ships [Laravel Boost](https://laravel.com/docs/boost) guidelines and an `inertia-forms-development` skill. If your app uses Boost, load them into your agent (Claude Code, Cursor, Codex, and others):

```bash
php artisan boost:install
```

Already set up Boost? Run `php artisan boost:update --discover` to pick up the new package.

## Publishing files one by one

`erag:install-inertia-forms` already published both files. To publish (or re-publish) just one of them:

```bash
# config/inertia-forms.php
php artisan vendor:publish --tag=inertia-forms-config

# stubs/inertia-form.stub (used by make:form)
php artisan vendor:publish --tag=inertia-forms-stubs
```

See [Artisan Command & Config](/reference/artisan-config) for what they contain.

## Next step

Build your first form in the [Quick Start](/guide/quick-start).
