---
title: API Reference
description: 'Reference Editor props, emitted events, exposed methods, named slots, runtime exports, and payload contracts for @erag/text-editor-vue.'
head:
    - - meta
      - name: keywords
        content: '@erag/text-editor-vue, Vue 3 rich text editor, Vue editor API, EditorProps, EditorEmits, Editor slots, TypeScript text editor'
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

# API reference

This page describes the public surface of `@erag/text-editor-vue`. The examples use Vue 3, `<script setup lang="ts">`, and the package's published types.

## Runtime exports

```ts
import {
    Editor,
    defaultEditorConfig,
    sanitizeHtml,
} from '@erag/text-editor-vue';
```

| Export                        | Purpose                                                                                                                                                                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Editor`                      | The Vue component used to render the editor.                                                                                                                                                                                  |
| `defaultEditorConfig`         | The resolved default configuration. Treat it as read-only; pass your overrides through `init`.                                                                                                                                |
| `sanitizeHtml(html, options)` | Sanitizes an HTML string using explicit `allowedTags`, `allowedAttributes`, and `allowRelativeUrls` options. It returns an empty string when browser DOM APIs are unavailable; sanitize untrusted HTML on the server as well. |

Most consumers should configure `init.sanitize` and let `Editor` call the sanitizer. The direct utility is useful when preparing a browser-side preview with the same allowlist.

```ts
const safeHtml = sanitizeHtml('<p>Hello</p><script>alert(1)</script>', {
    allowedTags: ['p'],
    allowedAttributes: {},
    allowRelativeUrls: true,
});
```

## Props (`EditorProps`)

| Prop         | Type         | Default              | Description                                                                                |
| ------------ | ------------ | -------------------- | ------------------------------------------------------------------------------------------ |
| `modelValue` | `string`     | `''`                 | HTML controlled by `v-model`.                                                              |
| `init`       | `EditorInit` | package defaults     | Partial editor configuration. It is normalized reactively and is not mutated.              |
| `disabled`   | `boolean`    | `false`              | Disables editing and editor actions.                                                       |
| `readonly`   | `boolean`    | `false`              | Prevents content changes while keeping safe viewing actions available.                     |
| `id`         | `string`     | —                    | Applied to the editable content element.                                                   |
| `name`       | `string`     | —                    | Adds a hidden form input containing the current HTML.                                      |
| `ariaLabel`  | `string`     | `'Rich text editor'` | Accessible label for the editing surface. In templates, use `aria-label` or `:aria-label`. |

```vue
<Editor
    id="message-body"
    v-model="content"
    name="body"
    aria-label="Message body"
    :init="editorConfig"
    :disabled="isDisabled"
/>
```

## Events (`EditorEmits`)

| Event               | Payload               | When it is emitted                                                |
| ------------------- | --------------------- | ----------------------------------------------------------------- |
| `update:modelValue` | `string`              | HTML actually changed. Duplicate model updates are not emitted.   |
| `click`             | `MouseEvent`          | The editable area is clicked.                                     |
| `focus`             | `FocusEvent`          | The editable area receives focus.                                 |
| `blur`              | `FocusEvent`          | The editable area loses focus.                                    |
| `input`             | `InputEvent`          | A native editor input is handled.                                 |
| `change`            | `string`              | On blur, when HTML changed since the previous committed value.    |
| `keydown`           | `KeyboardEvent`       | A key is pressed in the editor.                                   |
| `paste`             | `ClipboardEvent`      | A paste action is handled.                                        |
| `ready`             | `HTMLElement`         | The editable root is connected on the client.                     |
| `selection-change`  | `Selection`           | The browser selection changes while the editor is active.         |
| `resize`            | `{ height: number }`  | The bottom resize handle changes editor height.                   |
| `mention-search`    | `MentionSearchEvent`  | A debounced mention search starts.                                |
| `mention-select`    | `MentionSelectEvent`  | A mention is inserted.                                            |
| `mention-remove`    | `MentionRemoveEvent`  | A complete mention token is removed.                              |
| `merge-tag-select`  | `MergeTagSelectEvent` | A merge tag is inserted.                                          |
| `merge-tag-remove`  | `MergeTagRemoveEvent` | A complete merge-tag token is removed.                            |
| `template-insert`   | `TemplateInsertEvent` | A configured template is inserted.                                |
| `image-remove`      | `ImageDeleteInfo`     | An image is removed after any configured delete handler succeeds. |

```vue
<Editor
    v-model="content"
    @ready="handleReady"
    @change="saveDraft"
    @resize="({ height }) => console.log(height)"
    @image-remove="handleImageRemove"
/>
```

## Exposed methods (`EditorInstance`)

Use a typed template ref when another control needs to call the editor directly.

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { Editor, type EditorInstance } from '@erag/text-editor-vue';

const editor = useTemplateRef<EditorInstance>('editor');

function insertGreeting(): void {
    editor.value?.focus();
    editor.value?.insertText('Hello ');
}
</script>

<template>
    <button type="button" @click="insertGreeting">Insert greeting</button>
    <Editor ref="editor" />
</template>
```

| Method              | Result                | Description                                            |
| ------------------- | --------------------- | ------------------------------------------------------ |
| `focus()`           | `void`                | Focuses the editable area.                             |
| `blur()`            | `void`                | Removes focus from it.                                 |
| `getHtml()`         | `string`              | Returns current normalized HTML.                       |
| `setHtml(value)`    | `void`                | Replaces content and publishes the change.             |
| `getText()`         | `string`              | Returns plain text.                                    |
| `clear()`           | `void`                | Replaces content with an empty string.                 |
| `insertHtml(value)` | `void`                | Sanitizes and inserts HTML at the saved selection.     |
| `insertText(value)` | `void`                | Escapes and inserts plain text.                        |
| `selectAll()`       | `void`                | Selects the editor content.                            |
| `undo()` / `redo()` | `void`                | Moves through editor history when possible.            |
| `openSourceCode()`  | `void`                | Opens the source-code dialog.                          |
| `openPreview()`     | `void`                | Opens the preview dialog.                              |
| `getRootElement()`  | `HTMLElement \| null` | Returns the editable root, not the outer editor shell. |

## Slots

| Slot              | Props              | Purpose                                                |
| ----------------- | ------------------ | ------------------------------------------------------ |
| `toolbar-start`   | —                  | Content before toolbar groups.                         |
| `toolbar-end`     | —                  | Content after toolbar groups.                          |
| `menubar-end`     | —                  | Content at the end of the menubar.                     |
| `statusbar-start` | —                  | Content before the status information.                 |
| `statusbar-end`   | —                  | Content after the status information.                  |
| `empty`           | —                  | Custom empty-state content inside the editable canvas. |
| `mention-item`    | `{ item, active }` | Custom mention result rendering.                       |
| `mention-loading` | `{ query }`        | Custom mention loading state.                          |
| `mention-empty`   | `{ query }`        | Custom mention empty state.                            |
| `mention-error`   | `{ query, retry }` | Custom mention error state.                            |

Slots add presentation only; editor keyboard handling and selection management remain internal.
