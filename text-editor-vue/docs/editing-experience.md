---
title: Editor Workflow and Responsive UI
description: 'Understand history, clipboard handling, keyboard shortcuts, responsive toolbar overflow, status information, printing, and editor resizing.'
head:
    - - meta
      - name: keywords
        content: '@erag/text-editor-vue, Vue editor undo redo, editor clipboard, responsive toolbar, rich text editor shortcuts, editor status bar, print editor'
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

# Editor workflow and responsive UI

The editor keeps common writing actions close to the content while preserving the active selection when a menu, toolbar control, or dialog is opened.

## Undo and redo

History is available through toolbar buttons, Edit-menu actions, keyboard shortcuts, and the public `undo()` and `redo()` methods. Undo and redo controls reflect whether a matching history step is currently available.

```ts
const editorConfig: EditorInit = {
    toolbar: 'undo redo | bold italic',
    menubar: ['edit'],
};
```

Use `Ctrl+Z` or `Cmd+Z` to undo. Redo uses `Ctrl+Y`, `Cmd+Shift+Z`, or the toolbar action.

## Clipboard and paste

The Edit menu provides **Cut**, **Copy**, **Paste**, and **Paste as plain text**. Cut and copy require a non-collapsed selection inside the editor. Paste uses the browser clipboard when permission is available and falls back to content copied through the editor during the current page session.

Normal paste handling:

- Preserves allowlisted headings, lists, links, images, tables, and inline formatting.
- Sanitizes pasted HTML before insertion when `sanitize` is enabled.
- Converts plain-text line breaks to `<br>` elements.
- Uploads pasted image files when `pasteImages`, `automaticUploads`, and an uploader are configured.
- Never throws into the consumer application when clipboard permission is denied.

Browsers may reject programmatic clipboard reads unless the action follows a user gesture or the page has permission. In that case, use the operating system paste shortcut directly in the editable area.

## Keyboard shortcuts

| Action           | Windows and Linux         | macOS                   |
| ---------------- | ------------------------- | ----------------------- |
| Bold             | `Ctrl+B`                  | `Cmd+B`                 |
| Italic           | `Ctrl+I`                  | `Cmd+I`                 |
| Underline        | `Ctrl+U`                  | `Cmd+U`                 |
| Strikethrough    | `Ctrl+Shift+X`            | `Cmd+Shift+X`           |
| Link dialog      | `Ctrl+K`                  | `Cmd+K`                 |
| Undo             | `Ctrl+Z`                  | `Cmd+Z`                 |
| Redo             | `Ctrl+Y` / `Ctrl+Shift+Z` | `Cmd+Y` / `Cmd+Shift+Z` |
| Find and replace | `Ctrl+F`                  | `Cmd+F`                 |
| Preview          | `Ctrl+Shift+P`            | `Cmd+Shift+P`           |
| Shortcut help    | `Alt+0`                   | `Alt+0`                 |

Mention and merge-tag dropdowns handle `ArrowUp`, `ArrowDown`, `Home`, `End`, `Enter`, `Tab`, and `Escape`. Inside a table, `Tab` and `Shift+Tab` move between cells.

## Responsive toolbar and menus

The toolbar measures its available width with `ResizeObserver`. Complete toolbar groups that no longer fit move behind the **More** (`…`) button instead of overflowing the editor. It recalculates when the editor or its parent changes size, so the behavior also works when a narrow editor is placed inside a wide desktop viewport.

Clicking **More** adds the hidden groups as a second toolbar row directly below the primary row. It is not a floating popup. The expanded row:

- Uses the same buttons, selects, group separators, active states, and disabled states as the primary toolbar.
- Remains open while the user clicks or continues typing in the editable canvas.
- Closes when **More** is toggled again or the user interacts outside the editor toolbar/content area.
- Opens alignment, line-height, color, list-style, and case-change popovers from the selected control as usual.

The menubar responds to the editor container width rather than only the viewport width. Menu entries wrap inside the editor, and widths at or below `420px` use compact icon-only buttons with accessible labels and native title tooltips. The editor itself can shrink below the previous `260px` minimum without forcing horizontal page overflow.

Floating menus stay inside the viewport, flip when there is not enough room, close on outside interaction or `Escape`, and support arrow-key navigation. Active formatting uses selected states, while commands that cannot run are disabled.

Toolbar icons use dedicated visual symbols for numbered lists, clear formatting, links, line height, checklists, and both indent directions. Dropdown groups show the currently relevant icon, including the active alignment icon.

## Status bar and word count

With `statusbar: true`, the bottom bar shows:

- The current element path, such as `p`, `ul > li`, or `table > tbody > tr > td`.
- Current document word and character counts.
- The configurable `helpShortcutText`.
- A resize handle when `resize` is enabled.

**Tools → Word count** opens detailed document and selection statistics for words, characters with spaces, and characters without spaces.

```ts
const editorConfig: EditorInit = {
    statusbar: true,
    helpShortcutText: 'Press Alt+0 for keyboard shortcuts',
};
```

## Editor resizing

Vertical resizing is enabled by default. Numeric dimensions are pixels, and CSS length strings are also accepted.

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Editor, type EditorInit } from '@erag/text-editor-vue';

const content = shallowRef('');
const editorConfig: EditorInit = {
    height: 420,
    minHeight: 240,
    maxHeight: 720,
    resize: true,
};

function handleResize({ height }: { height: number }): void {
    console.log('Editor height:', height);
}
</script>

<template>
    <Editor v-model="content" :init="editorConfig" @resize="handleResize" />
</template>
```

The resize handle clamps the result between `minHeight` and `maxHeight` and emits `{ height }` while the user drags it.

## Print only editor content

**File → Print** creates a temporary print-only copy of the sanitized editor content, opens the browser print dialog, and removes the temporary copy after printing. The surrounding application page and editor controls are excluded. The Preview dialog also provides a Print action.

Printing still follows the browser's print settings, available fonts, and page margins.
