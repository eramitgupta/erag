---
title: "Laravel Lang Sync Inertia"
titleTemplate: false
description: "Use Laravel translation files directly in Inertia Vue, React, and Svelte apps with replacements, pluralization, and locale-aware helpers."
layout: home

hero:
    name: 'Laravel Lang Sync Inertia'
    text: 'Laravel translations for your Inertia frontend'
    tagline: 'Sync Laravel lang files once, then use clean Vue, React, and Svelte helpers for keys, replacements, pluralization, and direct string fallback.'
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

<section class="inertia-features" aria-labelledby="features-heading">
<div class="inertia-features-intro">
<span>Features</span>
<h2 id="features-heading">Elevate Laravel translations with Inertia</h2>
<p>Use server-side language files in Vue, React, and Svelte pages without custom JSON endpoints or repeated prop wiring.</p>
</div>

<div class="inertia-feature-stats" aria-label="Package capabilities">
<div><strong>12</strong><span>core features</span></div>
<div><strong>3</strong><span>frontend helpers</span></div>
<div><strong>1</strong><span>Laravel source</span></div>
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
</div>
</section>

<section class="home-flow" aria-labelledby="home-flow-heading">
<div class="home-flow-copy">
<span>Workflow</span>
<h2 id="home-flow-heading">From Laravel lang files to Inertia pages</h2>
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
