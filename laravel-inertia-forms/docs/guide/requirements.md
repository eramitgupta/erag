---
title: 'Requirements'
description: 'Versions needed to use Laravel Inertia Forms: PHP 8.3+, Laravel 13, Inertia 3, Tailwind CSS 4, and Vue 3.5+, React 19, or Svelte 5.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/guide/requirements.md
</div>


<div class="doc-category">Getting Started</div>

# Requirements

| Dependency   | Version         |
| ------------ | --------------- |
| PHP          | 8.3 or newer    |
| Laravel      | 13.x            |
| Inertia.js   | 3.x (server and client adapter) |
| Tailwind CSS | 4.x             |

Pick **one** frontend framework:

| Framework | Version | npm package                  |
| --------- | ------- | ---------------------------- |
| Vue       | 3.5+    | `@erag/inertia-forms-vue`    |
| React     | 19      | `@erag/inertia-forms-react`  |
| Svelte    | 5       | `@erag/inertia-forms-svelte` |

The frontend packages declare the Inertia client adapter for their framework (for example `@inertiajs/react` 3.x) as a peer dependency. They use Inertia's `useForm` helper to submit.

::: warning Older versions
Laravel 12 and below, and Inertia 1.x or 2.x, are not supported. The PHP package requires `illuminate/*` `^13.0`.
:::
