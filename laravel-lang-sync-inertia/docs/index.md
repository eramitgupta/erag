---
title: "Laravel Lang Sync Inertia"
titleTemplate: false
description: "Use Laravel translation files directly in Inertia Vue, React, and Svelte apps with replacements, pluralization, and locale-aware helpers."
layout: home

hero:
    name: 'Laravel Lang Sync Inertia'
    text: 'Laravel translations for your Inertia frontend'
    tagline: 'Sync Laravel lang files once, then use clean Vue, React, and Svelte helpers for keys, replacements, pluralization, and direct string fallback.'
    actions:
      - theme: brand
        text: Read Docs
        link: /introduction.html
      - theme: alt
        text: GitHub
        link: https://github.com/eramitgupta/laravel-lang-sync-inertia
    image:
        src: /server-sync.svg
        alt: Laravel Lang Sync Inertia
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

<div class="home-code-section" aria-label="Code Example Preview">

::: code-group

```php [lang/en/app.php]
<?php

return [
    'name' => 'Laravel Lang Sync Inertia',
    'description' => 'Effortlessly synchronize server-side Laravel language files with Inertia frontend components.',
    'features' => 'Zero API endpoints, dynamic locale switching, and full SSR hydration.',

    'welcome' => 'Welcome to :app, :name!',
    'languages' => 'Supporting 1 language|Supporting :count languages',
];
```

```php [Controller]
<?php
namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // Sync package translations for the active locale
        syncLangFiles('app');

        return Inertia::render('Dashboard');
    }
}
```

```vue [Vue]
<script setup>
import { vueLang } from '@erag/lang-sync-inertia';

const { trans, __, transChoice } = vueLang();
</script>

<template>
    <section class="package-preview">
        <h1>{{ __('app.name') }}</h1>
        <p>{{ __('app.description') }}</p>
        <p>{{ trans('app.welcome', { app: 'Laravel', name: 'Developer' }) }}</p>
        <p>{{ transChoice('app.languages', 12) }}</p>
    </section>
</template>
```

```tsx [React]
import { reactLang } from '@erag/lang-sync-inertia';

export default function Dashboard() {
    const { trans, __, transChoice } = reactLang();

    return (
        <section className="package-preview">
            <h1>{__('app.name')}</h1>
            <p>{__('app.description')}</p>
            <p>{trans('app.welcome', { app: 'Laravel', name: 'Developer' })}</p>
            <p>{transChoice('app.languages', 12)}</p>
        </section>
    );
}
```

```svelte [Svelte]
<script module lang="ts">
import { svelteLang } from '@erag/lang-sync-inertia';

const { trans, __, transChoice } = svelteLang();
</script>

<section class="package-preview">
    <h1>{__('app.name')}</h1>
    <p>{__('app.description')}</p>
    <p>{trans('app.welcome', { app: 'Laravel', name: 'Developer' })}</p>
    <p>{transChoice('app.languages', 12)}</p>
</section>
```

```text [Output]
Laravel Lang Sync Inertia
Effortlessly synchronize server-side Laravel language files with Inertia frontend components.
Welcome to Laravel, Developer!
Supporting 12 languages
```

:::

</div>

<section class="inertia-features" aria-labelledby="features-heading">
<div class="inertia-features-intro">
  <div class="bg-points" aria-hidden="true"></div>
  <div class="inertia-features-intro-content">
    <div class="features-badge">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M4.5 0.5H0.5V4.5H4.5V0.5Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M11.5 0.5H7.5V4.5H11.5V0.5Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M4.5 7.5H0.5V11.5H4.5V7.5Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M11.5 7.5H7.5V11.5H11.5V7.5Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span>Features</span>
    </div>
    <h2 id="features-heading">Elevate Laravel translations with Inertia</h2>
    <p>Use server-side language files in Vue, React, and Svelte pages without custom JSON endpoints or repeated prop wiring.</p>
  </div>
</div>

<div class="inertia-feature-stats" aria-label="Package capabilities">
  <div class="small-square small-square-top max-md:hidden"></div>
  <div class="small-square small-square-bottom max-md:hidden"></div>
  <div class="small-square small-square-right-top max-md:hidden"></div>
  <div class="small-square small-square-right-bottom max-md:hidden"></div>

  <div class="stat-cell"><strong>100%</strong><span>Laravel native</span></div>
  <div class="stat-cell"><strong>12</strong><span>Core features</span></div>
  <div class="stat-cell"><strong>3</strong><span>Frontend helpers</span></div>
  <div class="stat-cell"><strong>0</strong><span>Custom endpoints</span></div>
</div>

<div class="inertia-feature-grid">
<article class="inertia-feature-item">
  <div class="inertia-feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 7h13"/><path d="m14 4 3 3-3 3"/><path d="M20 17H7"/><path d="m10 14-3 3 3 3"/></svg></div>
  <span class="inertia-feature-badge">CORE SYNC</span>
  <h3>Laravel sync</h3>
  <p>Load selected Laravel language files for a page and make them available to the frontend through Inertia.</p>
</article>
<article class="inertia-feature-item">
<div class="inertia-feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 8 3 12l4 4"/><path d="m17 8 4 4-4 4"/><path d="m14 4-4 16"/></svg></div>
<span class="inertia-feature-badge">VUE REACT SVELTE</span>
<h3>Vue, React and Svelte</h3>
<p>Use dedicated Vue, React, and Svelte helpers from the package root with consistent behavior.</p>
</article>
<article class="inertia-feature-item">
<div class="inertia-feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 7h16"/><path d="M7 12h10"/><path d="M10 17h4"/><path d="M17 7v10"/></svg></div>
<span class="inertia-feature-badge">:NAME VALUES</span>
<h3>Key replacement</h3>
<p>Replace dynamic values in translated strings using the same placeholder style your Laravel app already uses.</p>
</article>
<article class="inertia-feature-item">
<div class="inertia-feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 7 4 12l4 5"/><path d="M16 7l4 5-4 5"/><path d="M12 5v14"/></svg></div>
<span class="inertia-feature-badge">OLD SYNTAX</span>
<h3>Legacy placeholders</h3>
<p>Keep older placeholder formats working while gradually moving translation lines to the Laravel convention.</p>
</article>
<article class="inertia-feature-item">
<div class="inertia-feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 7h14"/><path d="M7 7l5 5-5 5h12"/></svg></div>
<span class="inertia-feature-badge">COUNT RULES</span>
<h3>Pluralization</h3>
<p>Render the right translation for zero, singular, and plural counts using Laravel-style interval rules.</p>
</article>
<article class="inertia-feature-item">
<div class="inertia-feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 7h10v6H9"/><path d="m11 10-3 3 3 3"/><path d="M5 19h14"/></svg></div>
<span class="inertia-feature-badge">SAFE FALLBACK</span>
<h3>Missing key fallback</h3>
<p>Show the original text when a translation key is unavailable, so pages fail gracefully during development.</p>
</article>
<article class="inertia-feature-item">
<div class="inertia-feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M4 12h16"/><path d="M12 4c2 2.2 3 4.8 3 8s-1 5.8-3 8"/><path d="M12 4c-2 2.2-3 4.8-3 8s1 5.8 3 8"/></svg></div>
<span class="inertia-feature-badge">APP LOCALE</span>
<h3>Locale aware</h3>
<p>Read translations from the active Laravel locale so frontend pages follow the same language as the backend.</p>
</article>
<article class="inertia-feature-item">
<div class="inertia-feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 6h7l2 3h7v9H4z"/><path d="M8 13h8"/><path d="M8 16h5"/></svg></div>
<span class="inertia-feature-badge">DOT PATHS</span>
<h3>Nested directories</h3>
<p>Organize large translation sets in nested Laravel language directories and resolve them from frontend helpers.</p>
</article>
<article class="inertia-feature-item">
<div class="inertia-feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 6h14"/><path d="M5 12h14"/><path d="M5 18h14"/><path d="M8 4v4"/><path d="M16 10v4"/><path d="M12 16v4"/></svg></div>
<span class="inertia-feature-badge">FILE GROUPS</span>
<h3>Multiple files</h3>
<p>Share several language files together when a page needs copy from multiple translation groups.</p>
</article>
<article class="inertia-feature-item">
<div class="inertia-feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 5h14v14H5z"/><path d="M8 9h8"/><path d="M8 13h5"/><path d="M16 16l3 3"/></svg></div>
<span class="inertia-feature-badge">PAGE PROPS</span>
<h3>Shared lang prop</h3>
<p>Expose translations on the shared Inertia page data so nested components can read them without prop drilling.</p>
</article>
<article class="inertia-feature-item">
<div class="inertia-feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 4h7l3 3v13H7z"/><path d="M14 4v4h4"/><path d="M9 14h6"/><path d="M9 17h4"/></svg></div>
<span class="inertia-feature-badge">BUILD READY</span>
<h3>JSON export</h3>
<p>Generate frontend-ready JSON files from PHP lang files, then load the exported JSON automatically.</p>
</article>
<article class="inertia-feature-item">
<div class="inertia-feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 7h16"/><path d="M8 7v10"/><path d="M16 7v10"/><path d="M6 17h12"/><path d="M10 12h4"/></svg></div>
<span class="inertia-feature-badge">TYPED HELPERS</span>
<h3>TypeScript ready</h3>
<p>Typed Vue and React helpers give autocomplete for common translation calls.</p>
</article>

<div class="small-square small-square-bottom max-md:hidden"></div>
<div class="small-square small-square-right-bottom max-md:hidden"></div>
</div>
</section>

<section class="home-flow" aria-labelledby="home-flow-heading">
  <div class="small-square small-square-top max-md:hidden"></div>
  <div class="small-square small-square-bottom max-md:hidden"></div>
  <div class="small-square small-square-right-top max-md:hidden"></div>
  <div class="small-square small-square-right-bottom max-md:hidden"></div>

  <div class="home-flow-copy">
    <div class="workflow-badge">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
        <path d="M6.5 10v4a2 2 0 0 0 2 2h5.5" />
      </svg>
      <span>Workflow</span>
    </div>
    <h2 id="home-flow-heading">From Laravel lang files to<br>Inertia pages</h2>
    <p>The backend chooses the translation files for the current route, Inertia shares them with the page, and the frontend helpers resolve text for Vue, React, or Svelte components.</p>
  </div>
  <div class="home-flow-steps">
    <div>
      <strong>1</strong>
      <h3>Pick language files</h3>
      <p>Keep translations in Laravel and select only the groups a page needs.</p>
    </div>
    <div>
      <strong>2</strong>
      <h3>Share through Inertia</h3>
      <p>The package places translated data into the page payload using Laravel's active locale.</p>
    </div>
    <div>
      <strong>3</strong>
      <h3>Render in components</h3>
      <p>Frontend helpers read the shared data and handle replacements, pluralization, and fallbacks.</p>
    </div>
  </div>
</section>

<div class="home-container">
  <div class="small-square small-square-top max-md:hidden"></div>
  <div class="small-square small-square-right-top max-md:hidden"></div>
  <div class="small-square small-square-bottom max-md:hidden"></div>
  <div class="small-square small-square-right-bottom max-md:hidden"></div>

  <section class="home-desc">
    <h2>Translation Syncing Made Simple</h2>
    <p>Laravel Lang Sync Inertia is an open-source package built to bridge the translation gap in hybrid Inertia.js architectures. Instead of writing custom JSON endpoints or copying translations manually to your frontend directory, it automates localization file syncing. The package loads, parses, and formats your existing server-side PHP array translations into lightweight frontend modules. With ready-to-use helpers for Vue, React, and Svelte, your client-side views stay perfectly synchronized with Laravel's active locale dynamically.</p>
  </section>

  <section class="home-faq" aria-labelledby="faq-heading">
    <h2 id="faq-heading">Frequently Asked Questions</h2>
    <p class="faq-subtext">Find answers to common questions about Laravel Lang Sync Inertia, performance, SSR, and frontend integrations.</p>

<details class="faq-item" open>
<summary>Why use this package over manual prop sharing in HandleInertiaRequests?</summary>
<div class="faq-content">
<p>While you can manually pass translation objects through Inertia middleware, sharing entire language files bloats every Inertia page payload and slows down initial page loads. <strong>Laravel Lang Sync Inertia</strong> selectively loads only the files required for the current route, automatically detects the active locale, resolves nested directories, and provides zero-overhead frontend helpers for Vue 3, React, and Svelte.</p>
</div>
</details>

<details class="faq-item">
<summary>Does it support Server-Side Rendering (SSR)?</summary>
<div class="faq-content">
<p>Yes, full Inertia SSR support is built-in. Translations are resolved and injected into shared Inertia page props on the Laravel server before the frontend SSR bundle executes. This ensures your server-rendered HTML contains the correct translated strings and hydrates seamlessly in the browser with zero flash of untranslated content (FOUC).</p>
</div>
</details>

<details class="faq-item">
<summary>How does runtime locale switching work?</summary>
<div class="faq-content">
<p>The package automatically detects Laravel's dynamic runtime locale (configured via <code>App::setLocale()</code> or your custom locale middleware). When a user updates their language, Inertia reloads the page props with the new locale's translation keys, and frontend hooks update the UI reactively.</p>
</div>
</details>

<details class="faq-item">
<summary>Does it support parameter replacements and pluralization (transChoice)?</summary>
<div class="faq-content">
<p>Yes. It mirrors Laravel's native translation engine completely across Vue, React, and Svelte:</p>
<ul>
<li><strong>Replacements:</strong> Supports dynamic placeholder substitution, like <code>trans('auth.welcome', { name: 'John' })</code>.</li>
<li><strong>Pluralization:</strong> Supports pipe-separated count rules and interval ranges via <code>transChoice('cart.items', count)</code>.</li>
</ul>
</div>
</details>

<details class="faq-item">
<summary>Can I bundle or pre-compile translations for production?</summary>
<div class="faq-content">
<p>Yes. The package includes an Artisan export command (<code>php artisan lang:sync-export</code>) that pre-compiles PHP translation files into static JSON assets, eliminating disk I/O and reducing server memory usage under high traffic.</p>
</div>
</details>

<details class="faq-item">
<summary>Can I organize translations into nested folders and subdirectories?</summary>
<div class="faq-content">
<p>Yes. You can structure language files in subdirectories (such as <code>lang/en/admin/settings.php</code>). You can sync them by path (e.g. <code>syncLangFiles('admin/settings')</code>) and reference them seamlessly using dot notation (e.g. <code>__('admin.settings.title')</code>).</p>
</div>
</details>

<details class="faq-item">
<summary>Is TypeScript supported with autocompletion?</summary>
<div class="faq-content">
<p>Yes. The frontend package <code>@erag/lang-sync-inertia</code> is written in TypeScript and provides complete type definitions. Helpers like <code>vueLang()</code>, <code>reactLang()</code>, and <code>svelteLang()</code> offer typed signatures for translation keys, replacement parameters, and plural counts.</p>
</div>
</details>

<details class="faq-item">
<summary>What happens if a translation key is missing?</summary>
<div class="faq-content">
<p>The package implements a safe two-tier fallback strategy:</p>
<ol>
<li>Checks for the key in the currently active locale.</li>
<li>Falls back to the configured fallback locale (e.g., <code>'en'</code> in <code>config/app.php</code>).</li>
<li>If still not found, it gracefully returns the key string itself (e.g., <code>'messages.welcome'</code>) rather than throwing an exception.</li>
</ol>
</div>
</details>

<details class="faq-item">
<summary>Does it support both PHP array files and JSON translation files?</summary>
<div class="faq-content">
<p>Yes. Laravel Lang Sync Inertia natively parses both standard PHP array translation files (<code>lang/{locale}/*.php</code>) and root JSON localization files (<code>lang/{locale}.json</code>) frequently used in modern Laravel projects.</p>
</div>
</details>

<details class="faq-item">
<summary>How do I install and get started?</summary>
<div class="faq-content">
<p>Installation takes less than two minutes via Composer and npm:</p>
<div class="faq-install-box">
<div class="faq-install-row"><span class="faq-install-tag">Backend</span><code>composer require eramitgupta/laravel-lang-sync-inertia</code></div>
<div class="faq-install-row"><span class="faq-install-tag">Frontend</span><code>npm install @erag/lang-sync-inertia</code></div>
</div>
<p>Then call <code>syncLangFiles('auth')</code> in your controller and use <code>vueLang()</code>, <code>reactLang()</code>, or <code>svelteLang()</code> in your frontend components.</p>
</div>
</details>
  </section>
</div>
