---
title: Vue Editor Usage
description: 'Use the Editor component with Vue 3 v-model, reactive configuration, custom toolbars, disabled and readonly modes, and typed instance methods.'
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

# Basic & Reactive Usage

Learn how to use `<Editor />` in your Vue 3 application with standard `v-model` binding, custom toolbar presets, menubar options, disabled/readonly modes, and programmatic methods.

---

## Standard `v-model` Binding

Omitting the `:init` property activates the default full-featured editor configuration.

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Editor } from '@erag/text-editor-vue';
import '@erag/text-editor-vue/style.css';

const content = shallowRef(
    '<p>Welcome to <strong>@erag/text-editor-vue</strong>!</p>',
);
</script>

<template>
    <div class="editor-wrapper">
        <Editor v-model="content" />
    </div>
</template>
```

You can also explicitly pass `:model-value` and listener `@update:model-value`:

```vue
<Editor
    :model-value="content"
    :disabled="isDisabled"
    @update:model-value="content = $event"
    @click="handleClick"
/>
```

---

## Toolbar Presets

### Minimal Toolbar

For comment sections, chat boxes, or simple input forms, you can configure a minimal toolbar and hide the menubar and statusbar:

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Editor, type EditorInit } from '@erag/text-editor-vue';

const content = shallowRef('');
const minimalConfig: EditorInit = {
    height: 220,
    menubar: false,
    statusbar: false,
    toolbar: 'bold italic underline | bullist numlist | link removeformat',
};
</script>

<template>
    <Editor v-model="content" :init="minimalConfig" />
</template>
```

### Full Custom Toolbar

You can separate groups using `|` or pass specific control names:

```ts
const fullConfig: EditorInit = {
    height: 450,
    minHeight: 250,
    maxHeight: 800,
    placeholder: 'Type your story here...',
    menubar: true,
    toolbar:
        'undo redo | blocks fontfamily fontsize lineheight | bold italic underline strikethrough superscript subscript casechange | ' +
        'forecolor backcolor | alignment | ' +
        'bullist numlist checklist outdent indent | link image media table | hr removeformat | ' +
        'code preview fullscreen',
    statusbar: true,
    resize: true,
};
```

---

## Menubar Configuration

Customized menubar entries can be array-defined or hidden entirely:

```vue
<!-- Explicit menubar options -->
<Editor
    v-model="content"
    :init="{ menubar: ['file', 'edit', 'insert', 'format'] }"
/>

<!-- Hide menubar completely -->
<Editor v-model="content" :init="{ menubar: false }" />
```

---

## Disabled & Readonly Modes

`@erag/text-editor-vue` supports both `disabled` and `readonly` modes:

- **`disabled`**: Disables all interactions, toolbar buttons, and user editing canvas.
- **`readonly`**: Allows viewing, text selection, source code inspection, and preview while preventing content mutation.

```vue
<template>
    <!-- Disabled mode -->
    <Editor v-model="content" disabled />

    <!-- Readonly mode -->
    <Editor v-model="content" readonly />
</template>
```

---

## Reactive Configuration

Since Vue 3 reactivity is fully supported, you can drive the editor's `:init` settings dynamically with `ref` or `computed`:

```vue
<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { Editor, type EditorInit } from '@erag/text-editor-vue';

const isCompact = shallowRef(false);
const content = shallowRef('');

const dynamicInit = computed<EditorInit>(() => ({
    height: isCompact.value ? 260 : 500,
    menubar: !isCompact.value,
    toolbar: isCompact.value ? 'bold italic link' : true,
}));
</script>

<template>
    <button @click="isCompact = !isCompact">Toggle Mode</button>
    <Editor v-model="content" :init="dynamicInit" />
</template>
```

---

## Programmatic Control (`EditorInstance`)

Access the editor instance methods via Vue's template ref:

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { Editor, type EditorInstance } from '@erag/text-editor-vue';

const editorRef = useTemplateRef<EditorInstance>('editorRef');
const content = defineModel<string>({ default: '' });

function insertSignature() {
    editorRef.value?.focus();
    editorRef.value?.insertHtml(
        '<p>Best regards,<br><strong>Er Amit Gupta</strong></p>',
    );
}

function clearEditor() {
    editorRef.value?.clear();
}

function printHtml() {
    console.log(editorRef.value?.getHtml());
}
</script>

<template>
    <div class="actions">
        <button @click="insertSignature">Insert Signature</button>
        <button @click="clearEditor">Clear</button>
        <button @click="printHtml">Log HTML</button>
    </div>

    <Editor ref="editorRef" v-model="content" />
</template>
```

### Available Instance Methods

| Method                     | Parameters | Description                                              |
| :------------------------- | :--------- | :------------------------------------------------------- |
| `focus()`                  | none       | Focuses the editable canvas.                             |
| `blur()`                   | none       | Blurs focus from the editor.                             |
| `getHtml()`                | none       | Returns sanitized HTML string.                           |
| `setHtml(html: string)`    | `html`     | Sets editor HTML content.                                |
| `getText()`                | none       | Returns plain text content without HTML tags.            |
| `clear()`                  | none       | Replaces the content with an empty string.               |
| `insertHtml(html: string)` | `html`     | Inserts HTML fragment at current selection cursor.       |
| `insertText(text: string)` | `text`     | Inserts raw text fragment.                               |
| `selectAll()`              | none       | Selects all text inside editor.                          |
| `undo()`                   | none       | Triggers programmatic undo step.                         |
| `redo()`                   | none       | Triggers programmatic redo step.                         |
| `openSourceCode()`         | none       | Opens the HTML source code modal dialog.                 |
| `openPreview()`            | none       | Opens the sanitized preview modal dialog.                |
| `getRootElement()`         | none       | Returns the editable content root inside `.erag-editor`. |
