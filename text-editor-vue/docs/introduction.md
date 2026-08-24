---
title: Introduction
description: 'Learn what @erag/text-editor-vue provides, how its controlled HTML model works, and which native browser APIs and editing features it uses.'
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

# Introduction

`@erag/text-editor-vue` is a dependency-free rich text editor component for Vue 3. The package uses Vue's Composition API and native browser editing APIs instead of wrapping another editor framework. Vue is its only peer dependency.

## What it includes

- Controlled HTML content through `v-model` or `model-value` plus `update:model-value`.
- Container-responsive menubar and toolbar controls for grouped alignment, line height, styled lists, checklists, links, media, tables, code, preview, and fullscreen.
- Optional mentions, merge tags, and consumer-provided templates.
- Consumer-controlled image upload and deletion callbacks, URL uploads with Fetch, paste uploads, alignment, and four-corner resizing.
- Source editing, sanitized preview, print, find and replace, special characters, emoji, and date/time insertion.
- Disabled and readonly modes, keyboard shortcuts, ARIA labels, selection preservation, and typed events.
- Automatic light/dark themes from the operating system, with explicit `html.dark` and `data-theme` overrides.
- ESM output, generated TypeScript declarations, and package-scoped `erag-` CSS.

## How content flows

The editor is a controlled Vue component:

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Editor } from '@erag/text-editor-vue';
import '@erag/text-editor-vue/style.css';

const content = shallowRef('<p>Hello</p>');
</script>

<template>
    <Editor v-model="content" />
</template>
```

Typing or running an editor action updates the generated HTML. The component emits `update:modelValue` only when that HTML changes. A new external model value updates the canvas without publishing the same value back in a loop.

## Defaults and explicit configuration

Omitting `init` enables the full standard editor. Passing a partial object keeps defaults for omitted properties. Explicit toolbar and menubar choices are exact, and explicit plugin arrays filter plugin-backed controls instead of silently restoring excluded features.

```ts
import type { EditorInit } from '@erag/text-editor-vue';

const commentEditor: EditorInit = {
    height: 240,
    menubar: false,
    statusbar: false,
    plugins: ['history', 'formatting', 'lists', 'link'],
    toolbar: 'bold italic | bullist numlist checklist | link',
};
```

## Browser API limitations

Native `contenteditable` and editing commands have small browser differences. Clipboard operations require a user gesture and can be blocked by permissions. Fullscreen uses the Fullscreen API with a CSS fallback. Image uploads require a handler or URL supplied by your application.

The component is SSR-safe during initialization, but browser-only utilities cannot sanitize on the server. Always sanitize untrusted HTML again at your backend boundary.

## Feature documentation map

| Package area                                                                     | Documentation                                                                                                                                               |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Controlled HTML, reactive config, disabled/readonly, methods                     | [Basic and reactive usage](/usage.html), [API reference](/api.html)                                                                                         |
| Menubar, toolbar overflow, history, clipboard, shortcuts, status, resize, print  | [Menubar customization](/menubar-customization.html), [Workflow and responsive UI](/editing-experience.html)                                                |
| Headings, fonts, colors, line height, case, list styles, checklists, indentation | [Text formatting](/text-formatting.html), [Lists, checklists, and indentation](/lists-and-indentation.html)                                                 |
| Links, anchors, video, audio, iframe, and tables                                 | [Links and anchors](/links-and-anchors.html), [Media and embeds](/media-and-embeds.html), [Table editor](/table-editor.html)                                |
| Mentions, merge tags, and consumer-defined templates                             | [Mentions](/mentions.html), [Merge tags](/merge-tags.html), [Templates](/templates.html)                                                                    |
| File/URL/paste image uploads, alignment, resize, and deletion                    | [Image uploads](/image-upload.html)                                                                                                                         |
| Emoji, symbols, horizontal rules, and date-time                                  | [Special characters and emoji](/special-characters.html), [Horizontal rules and date-time](/horizontal-rules-and-datetime.html)                             |
| Source HTML, preview, fullscreen, find, and replace                              | [Code, preview, and fullscreen](/code-and-preview.html), [Find and replace](/find-and-replace.html)                                                         |
| Sanitization, scoped CSS, themes, public types, and Laravel integration          | [Security](/security.html), [CSS customization](/css-customization.html), [TypeScript types](/types.html), [Laravel and Inertia](/laravel-integration.html) |

## Next steps

Start with [installation](/installation.html), continue to [basic usage](/usage.html), and review the [editor workflow and responsive UI](/editing-experience.html). Use the [configuration reference](/configuration.html) for the complete option list.
