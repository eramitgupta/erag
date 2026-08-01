---
title: Installation
description: 'Install @erag/text-editor-vue, configure its Vue peer dependency, import the editor stylesheet, and review its Node.js build requirements.'
head:
    - - meta
      - name: keywords
        content: '@erag/text-editor-vue, install Vue text editor, npm Vue editor, Vue editor CSS, Vue 3 rich text editor package'
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

# Installation

You can install `@erag/text-editor-vue` using your preferred package manager.

## Install Package

::: code-group

```bash [npm]
npm install @erag/text-editor-vue
```

```bash [pnpm]
pnpm add @erag/text-editor-vue
```

```bash [yarn]
yarn add @erag/text-editor-vue
```

:::

### Peer Dependencies

Ensure your project has Vue 3 installed:

```json
{
    "peerDependencies": {
        "vue": ">=3.5.0 <4"
    }
}
```

The package itself requires Node.js 24 or newer for local development, building, and publishing:

```bash
node --version
# v24.0.0 or newer
```

Node.js is not used by the editor at browser runtime.

---

## Import Stylesheet

The component requires its package stylesheet for toolbar layout, menus, dialogs, mentions, merge tags, image resize handles, and the built-in light/dark theme tokens.

Import the CSS stylesheet once in your main application entry point (e.g., `main.ts`, `app.ts`, or layout file):

```ts
import '@erag/text-editor-vue/style.css';
```

The stylesheet follows `prefers-color-scheme: dark` by default with a black editor surface. To control the theme yourself, add `class="dark"`, `data-theme="dark"`, or `data-theme="light"` to the document's `<html>` element. See [CSS customization](/css-customization.html#dark-mode) for palette overrides.

Alternatively, you can import it directly inside your Vue component `<script setup>`:

```vue
<script setup lang="ts">
import { Editor } from '@erag/text-editor-vue';
import '@erag/text-editor-vue/style.css';
</script>
```

---

## CSS reset compatibility

If your application uses a CSS reset, list markers inside standard lists (`<ul>`, `<ol>`) might normally be hidden.

`@erag/text-editor-vue` includes scoped marker and indentation styles inside `.erag-editor`, ensuring list items and numbers render cleanly without conflicts.
