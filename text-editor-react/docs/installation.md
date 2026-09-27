---
title: "Installation & Setup Guide"
description: "Install @erag/text-editor-react, configure its React and React DOM peer dependencies, import the editor stylesheet, and review its Node.js build requirements."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/text-editor-react/docs/installation.md
</div>


# Installation

You can install `@erag/text-editor-react` using your preferred package manager.

## Install Package

::: code-group

```bash [npm]
npm install @erag/text-editor-react
```

```bash [pnpm]
pnpm add @erag/text-editor-react
```

```bash [yarn]
yarn add @erag/text-editor-react
```

:::

### Peer Dependencies

Ensure your project has React 18 or React 19 installed together with React DOM:

```json
{
    "peerDependencies": {
        "react": ">=18.0.0 <20",
        "react-dom": ">=18.0.0 <20"
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

Import the CSS stylesheet once in your main application entry point (e.g., `main.tsx`, `app.tsx`, or a root layout file):

```ts
import '@erag/text-editor-react/style.css';
```

The stylesheet follows `prefers-color-scheme: dark` by default with a black editor surface. To control the theme yourself, add `class="dark"`, `data-theme="dark"`, or `data-theme="light"` to the document's `<html>` element. See [CSS customization](/css-customization.html#dark-mode) for palette overrides.

Alternatively, you can import it directly inside the React component that renders the editor:

```tsx
import { Editor } from '@erag/text-editor-react';
import '@erag/text-editor-react/style.css';
```

---

## Framework setup

- **Vite (React 18/19)**: Import the component and stylesheet as shown above. No extra plugin or configuration is required.
- **Next.js (App Router)**: The editor uses hooks and browser APIs, so add the `'use client'` directive at the top of the component file that renders `<Editor />`. Import the stylesheet in that file or in `app/layout.tsx`.
- **Inertia.js (React)**: Use the editor inside any page in `resources/js/pages`. See [Laravel and Inertia](/laravel-integration.html) for a `useForm` example.

```tsx
'use client';

import { useState } from 'react';
import { Editor } from '@erag/text-editor-react';
import '@erag/text-editor-react/style.css';

export default function PostEditor() {
    const [content, setContent] = useState('');

    return <Editor value={content} onChange={setContent} />;
}
```

---

## CSS reset compatibility

If your application uses a CSS reset, list markers inside standard lists (`<ul>`, `<ol>`) might normally be hidden.

`@erag/text-editor-react` includes scoped marker and indentation styles inside `.erag-editor`, ensuring list items and numbers render cleanly without conflicts.
