---
title: Code, Preview and Fullscreen
description: 'Edit sanitized HTML source, preview and print editor content, and use native or fallback fullscreen editing modes in Vue 3.'
head:
    - - meta
      - name: keywords
        content: '@erag/text-editor-vue, Vue 3 rich text editor, HTML source editor, Vue editor preview, print editor content, fullscreen editor'
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

# Code, Preview & Fullscreen

`@erag/text-editor-vue` includes tools for HTML source code editing, live sanitized previewing, and distraction-free fullscreen writing.

---

## Configuration

Enable `code`, `preview`, and `fullscreen` plugins:

```ts
const editorConfig: EditorInit = {
    plugins: ['code', 'preview', 'fullscreen'],
    toolbar: 'undo redo | blocks | bold italic | code preview fullscreen',
};
```

---

## 1. Source Code View (`code`)

Clicking the **Source Code** (`code`) button or opening **Tools → Source code** launches an interactive HTML code modal.

- Displays raw sanitized HTML structure.
- Allows developers or power users to inspect and directly edit HTML tags.
- Applying changes re-sanitizes and updates the active editor canvas.

Programmatic invocation:

```ts
editor.value?.openSourceCode();
```

---

## 2. Live Preview (`preview`)

Clicking **Preview** (`preview`) or opening **File → Preview** launches a modal dialog rendering the sanitized document inside a clean view-only frame.

- Prevents accidental edits while reviewing.
- Shows exact layout rendering without editor toolbars or chrome.
- Includes a **Print** button that prints only the preview content.

Programmatic invocation:

```ts
editor.value?.openPreview();
```

You can also choose **File → Print** without opening Preview. The editor creates a temporary print-only portal, calls the browser print dialog, and cleans the portal afterward so the surrounding application page is not part of the printed document.

---

## 3. Fullscreen Editing Mode (`fullscreen`)

Clicking **Fullscreen** (`fullscreen`) expands the editor canvas across the full browser viewport.

- Hides surrounding page elements and navigation sidebars.
- Uses native browser Fullscreen API with automatic fallback for restricted environments.
- The browser's Escape behavior or clicking the Fullscreen button again exits native fullscreen. The CSS fallback can be toggled with the same editor button.
