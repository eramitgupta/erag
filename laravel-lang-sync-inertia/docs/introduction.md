---
title: 'Introduction & Concepts'
description: 'Learn how Laravel Lang Sync Inertia bridges PHP localization files to frontend Inertia components without duplicated translation keys.'
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

<div class="doc-category">Getting Started</div>

# Introduction

**Laravel Lang Sync Inertia** is a lightweight, zero-latency bridge between Laravel's native backend translation ecosystem and Inertia.js frontend applications. It enables you to seamlessly use server-side PHP language files inside **Vue**, **React**, and **Svelte** components — with **zero custom API endpoints**, **dynamic locale switching**, and **native SSR hydration**.

Traditionally, localized Inertia applications face a frustrating dilemma: either manually pass translation arrays via `Inertia::render()` props on every controller, expose asynchronous REST endpoints that cause layout shifts (FOUC), or maintain duplicate translation files in JavaScript that constantly fall out of sync with Laravel's validation messages.

**Laravel Lang Sync Inertia** eliminates that friction completely by treating Laravel as your **single source of truth** and automatically delivering translation dictionaries directly through Inertia's shared page props.

## The Localization Bridge

Inertia acts as the glue connecting Laravel with your modern frontend frameworks. **Laravel Lang Sync Inertia** is the complementary glue for your translations.

Instead of manually passing translation arrays in every controller, exposing custom REST endpoints, or duplicating translation files across PHP and JavaScript, this package seamlessly connects your existing language files to your client components.

<div class="bridge-grid">
  <div class="bridge-card">
    <div class="bridge-header">
      <span class="bridge-icon">🎯</span>
      <h4>Single Source of Truth</h4>
    </div>
    <p>Manage all translations in standard Laravel <code>lang/{locale}</code> files. Never maintain duplicate dictionaries in JavaScript.</p>
  </div>

  <div class="bridge-card">
    <div class="bridge-header">
      <span class="bridge-icon">⚡</span>
      <h4>Zero API Overhead</h4>
    </div>
    <p>Translations pass directly through Inertia's shared page props. No Axios calls, loading spinners, or runtime delays.</p>
  </div>

  <div class="bridge-card">
    <div class="bridge-header">
      <span class="bridge-icon">💬</span>
      <h4>Familiar Helper API</h4>
    </div>
    <p>Use standard <code>__()</code> and <code>trans()</code> helpers in Vue, React, and Svelte with full placeholder support.</p>
  </div>

  <div class="bridge-card">
    <div class="bridge-header">
      <span class="bridge-icon">🚀</span>
      <h4>Full SSR Compatibility</h4>
    </div>
    <p>Translations are pre-hydrated on the server, eliminating layout shifts and flashes of untranslated text (FOUC).</p>
  </div>
</div>

## How It Works

The architecture follows a simple 4-step pipeline from your backend language files to your frontend components:

<div class="doc-flow-grid">
  <div class="doc-flow-card">
    <div class="doc-flow-number">1</div>
    <h4>Define Language Files</h4>
    <p>Write standard Laravel translation files in <code>lang/{locale}/app.php</code>.</p>
  </div>
  <div class="doc-flow-card">
    <div class="doc-flow-number">2</div>
    <h4>Sync in Controller</h4>
    <p>Call <code>syncLangFiles()</code> in controllers.</p>
  </div>
  <div class="doc-flow-card">
    <div class="doc-flow-number">3</div>
    <h4>Inertia Prop Share</h4>
    <p>Translations are attached automatically to <code>page.props.lang</code>.</p>
  </div>
  <div class="doc-flow-card">
    <div class="doc-flow-number">4</div>
    <h4>Render in Frontend</h4>
    <p>Use <code>__()</code> or <code>trans()</code> in Vue, React, or Svelte components.</p>
  </div>
</div>

## Compatibility & Support

**Laravel Lang Sync Inertia** follows semantic versioning and actively supports modern Laravel and Inertia stacks:

| Ecosystem / Framework | Supported Versions              | Status                                                                           |
| :-------------------- | :------------------------------ | :------------------------------------------------------------------------------- |
| **Laravel**           | 10.x, 11.x, 12.x, 13.x          | <span class="status-pill"><span class="status-dot"></span> Active Support</span> |
| **Inertia.js**        | 1.x, 2.x                        | <span class="status-pill"><span class="status-dot"></span> Active Support</span> |
| **Vue**               | 3.x (Composition & Options API) | <span class="status-pill"><span class="status-dot"></span> Active Support</span> |
| **React**             | 18.x, 19.x                      | <span class="status-pill"><span class="status-dot"></span> Active Support</span> |
| **Svelte**            | 4.x, 5.x                        | <span class="status-pill"><span class="status-dot"></span> Active Support</span> |
| **PHP**               | 8.1, 8.2, 8.3, 8.4+             | <span class="status-pill"><span class="status-dot"></span> Active Support</span> |

## Next Steps

Ready to get started with **Laravel Lang Sync Inertia**? Follow the guides below:

<div class="doc-next-grid">
  <a href="./installation.html" class="doc-next-card">
    <div class="doc-next-card-title">
      <span>Installation</span>
      <span>→</span>
    </div>
    <div class="doc-next-card-desc">Install the Composer and npm packages in under two minutes.</div>
  </a>
  <a href="./config.html" class="doc-next-card">
    <div class="doc-next-card-title">
      <span>Configuration</span>
      <span>→</span>
    </div>
    <div class="doc-next-card-desc">Customize default locales, language directories, and middleware behavior.</div>
  </a>
  <a href="./laravel.html" class="doc-next-card">
    <div class="doc-next-card-title">
      <span>Laravel Usage</span>
      <span>→</span>
    </div>
    <div class="doc-next-card-desc">Learn how to call helper functions and register global Inertia middleware.</div>
  </a>
  <a href="./vue.html" class="doc-next-card">
    <div class="doc-next-card-title">
      <span>Frontend Guides</span>
      <span>→</span>
    </div>
    <div class="doc-next-card-desc">Explore step-by-step guides for Vue, React, and Svelte components.</div>
  </a>
</div>
