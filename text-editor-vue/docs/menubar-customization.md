---
title: "Menubar Customization"
description: "Configure, reorder, hide, and reactively update File, Edit, View, Insert, Format, Tools, Table, Help, merge-tag, and template menus."
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

# Menubar Customization

The top menubar provides desktop-style application menus: **File**, **Edit**, **View**, **Insert**, **Merge tag**, **Templates**, **Format**, **Tools**, **Table**, and **Help**. You can reorder menus, select specific menus to display, or toggle visibility dynamically.

---

## Overview of Menubar Items

```ts
import type { EditorInit, EditorMenuName } from '@erag/text-editor-vue';

// 1. Display all default menus
const defaultConfig: EditorInit = {
    menubar: true,
};

// 2. Specify custom menu items & order
const customConfig: EditorInit = {
    menubar: [
        'file',
        'edit',
        'insert',
        'merge-tags',
        'templates',
        'format',
        'tools',
        'table',
    ],
};

// 3. Hide menubar completely
const noMenubarConfig: EditorInit = {
    menubar: false,
};
```

---

## All Available Menubar Menus (`EditorMenuName`)

| Menu Name     | Configuration Keyword | Sub-menu Items & Features                                                                                                                       |
| :------------ | :-------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| **File**      | `'file'`              | **New document**, **Print**, and **Preview**.                                                                                                   |
| **Edit**      | `'edit'`              | **Undo**, **Redo**, **Cut**, **Copy**, **Paste**, **Paste as plain text**, **Select all**, and **Find and replace**.                            |
| **View**      | `'view'`              | **Source code**, **Preview**, and **Fullscreen**.                                                                                               |
| **Insert**    | `'insert'`            | **Image**, **Link**, **Media**, **Table**, **Checklist**, **Special character**, **Emoji**, **Horizontal line**, **Anchor**, and **Date/time**. |
| **Merge tag** | `'merge-tags'`        | Triggers the right slide-out panel for grouped merge tags (`client.name`, `proposal.number`, etc.).                                             |
| **Templates** | `'templates'`         | Opens the searchable template picker modal with live preview.                                                                                   |
| **Format**    | `'format'`            | Inline styles, change case, nested formats, blocks, alignment, line height, and clear formatting.                                               |
| **Tools**     | `'tools'`             | **Source code** and detailed **Word count** statistics.                                                                                         |
| **Table**     | `'table'`             | Insert/properties/delete plus context-sensitive cell, row, and column operations.                                                               |
| **Help**      | `'help'`              | Keyboard shortcuts and the About dialog.                                                                                                        |

---

## Detailed Sub-Menu Breakdown

### 1. File Menu (`'file'`)

- **New document**: Clears canvas content.
- **Preview**: Opens the view-only modal dialog.
- **Print**: Triggers browser print dialog for sanitized canvas content.

### 2. Edit Menu (`'edit'`)

- **Undo / Redo**: Step back or forward through history.
- **Cut / Copy / Paste**: Standard clipboard operations.
- **Paste as plain text**: Inserts clipboard text without copied HTML formatting.
- **Select all**: Selects all text inside the canvas.
- **Find and replace**: Opens the `Ctrl+F` search & replace modal.

### 3. View Menu (`'view'`)

- **Source code**: Opens the editable, sanitized HTML source dialog.
- **Preview**: Opens a read-only rendering of the current document.
- **Fullscreen**: Uses the Fullscreen API with a CSS fallback.

### 4. Insert Menu (`'insert'`)

- **Image**: File picker, URL uploader, and aspect ratio resizing.
- **Media**: Video, audio, and iframe embed code tab.
- **Table**: 10x10 interactive table insertion grid.
- **Checklist**: Inserts an interactive checkbox list when the `lists` plugin is enabled.
- **Link & Anchor**: Hyperlink dialog and internal page bookmarks.
- **Special character**: Categorized symbol picker (Math, Currency, Arrows, etc.).
- **Horizontal line**: Section divider (`<hr>`).
- **Date/time**: Insert formatted timestamp.
- **Emoji**: Searchable categorized emoji picker.

### 5. Format Menu (`'format'`)

- **Text Styles**: Bold, Italic, Underline, Strikethrough, Superscript, Subscript, and Inline code.
- **Change Case**: UPPERCASE, lowercase, Title Case.
- **Formats**: Nested heading, inline, block, and alignment groups.
- **Blocks**: Paragraph, Heading 1–6, Preformatted, and Blockquote.
- **Alignment**: Left, center, right, and justify.
- **Line height**: Uses the reactive values from `lineHeightFormats`.
- **Clear Formatting**: Strips inline tags and inline styles (`removeformat`).

### 6. Tools Menu (`'tools'`)

- **Source code**: Opens the same source dialog as the View menu.
- **Word count**: Shows document and selected-text counts for words and characters.

### 7. Table Menu (`'table'`)

- **Table Operations**: Insert row above/below, delete row, insert column before/after, delete column, merge/split cells, edit table properties, and delete the table.
- Table-only actions remain disabled until the caret is inside a table cell.

### 8. Help Menu (`'help'`)

- **Keyboard shortcuts**: Displays the built-in shortcut reference (`Alt+0`).
- **About**: Shows the package description, installed version, GitHub repository, and documentation link.

The **Merge tag** and **Templates** menus appear only when their plugin, feature configuration, and item list are all available. If `menubar` is an explicit array, include `'merge-tags'` or `'templates'` to place the matching menu.

---

## Responsive layout and menu icons

The menubar wraps according to the editor's actual container width. In compact editors (`420px` wide or less), labels are visually hidden and the icon buttons keep their `aria-label` and `title`, so the complete menubar stays usable without overflowing its border.

The first dropdown level displays an icon for each action or category. Nested submenus keep their text, active check, shortcut, and direction arrow but omit repeated icons to preserve space.

---

## Reactive Menubar Toggle

Toggle menubar visibility dynamically using Vue reactive state (matching `Dashboard.vue`):

```vue
<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { Editor, type EditorInit } from '@erag/text-editor-vue';

const showMenubar = shallowRef(true);
const content = shallowRef('');

const editorConfig = computed<EditorInit>(() => ({
    height: 420,
    menubar: showMenubar.value,
    toolbar: 'bold italic | bullist numlist | link image',
}));
</script>

<template>
    <div class="mb-4">
        <label class="flex items-center gap-2 text-sm">
            <input v-model="showMenubar" type="checkbox" /> Show Menubar
        </label>
    </div>

    <Editor v-model="content" :init="editorConfig" />
</template>
```
