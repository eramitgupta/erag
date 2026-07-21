---
title: Vue Editor Templates
description: 'Provide searchable, grouped HTML templates through EditorInit, preview sanitized content, insert at the caret, and handle typed template events.'
head:
    - - meta
      - name: keywords
        content: '@erag/text-editor-vue, Vue editor templates, HTML template picker, EditorTemplateItem, email template editor'
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

# Templates

The **Templates** feature allows users to insert predefined HTML snippets—such as quick email replies, proposal headers, meeting notes, and document structures—directly into the editor canvas at the active cursor position.

---

## Key Highlights

- 📋 **Preset Boilerplates**: Pre-load structured HTML templates for quick insertion.
- 🔍 **Instant Search & Category Tabs**: Search templates by title or description, and filter by custom group names.
- 👁️ **Live Preview Modal**: Preview sanitized template HTML rendering before inserting.
- 🎯 **Caret Insertion**: Inserts template content precisely at the user's saved selection cursor.

---

## Configuration & Item Properties

Define template items in `init.templates`:

```ts
import type { EditorInit, EditorTemplateItem } from '@erag/text-editor-vue';

const templateItems: EditorTemplateItem[] = [
    {
        id: 'message-received',
        label: 'Message Received',
        description: 'Confirm that a request was received.',
        group: 'Quick Replies',
        content:
            '<p>Hi {{client.name}},</p><p>We received your message and will get back to you shortly.</p>',
    },
    {
        id: 'progress-update',
        label: 'Progress Update',
        description: 'Share a brief progress update with the client.',
        group: 'Quick Replies',
        content:
            '<p>Hi {{client.name}},</p>' +
            '<p>Just a quick note to let you know we are working on your request.</p>' +
            '<p>Best regards,<br>{{consultant.name}}</p>',
    },
    {
        id: 'hero-with-link',
        label: 'Hero Header Block',
        description: 'A reusable introduction block with call to action link.',
        group: 'Hero Blocks',
        content:
            '<h2>Welcome, {{client.name}}</h2>' +
            '<p>Your proposal is ready for review.</p>' +
            '<p><a href="/proposals">Review Proposal</a></p>',
    },
];

const editorConfig: EditorInit = {
    templates: {
        enabled: true,
        items: templateItems,
    },
};
```

| Option    | Type                   | Default | Description                                     |
| --------- | ---------------------- | ------- | ----------------------------------------------- |
| `enabled` | `boolean`              | `true`  | Enables an object-based template configuration. |
| `items`   | `EditorTemplateItem[]` | `[]`    | Consumer-owned templates shown by the picker.   |

No starter templates are bundled. The Templates menu appears only when the feature is enabled and at least one item is configured.

### Template Item Interface (`EditorTemplateItem`)

| Property      | Type               | Required | Description                                                                  |
| :------------ | :----------------- | :------- | :--------------------------------------------------------------------------- |
| `id`          | `string \| number` | **Yes**  | Stable identifier for the template item.                                     |
| `label`       | `string`           | **Yes**  | Display title shown in the list and dialog.                                  |
| `content`     | `string`           | **Yes**  | HTML content string inserted into the editor.                                |
| `group`       | `string`           | Optional | Category name for group tab filtering (e.g. `Quick Replies`, `Hero Blocks`). |
| `description` | `string`           | Optional | Short summary description shown under the label.                             |

---

## Interactive Template Modal Dialog

Enabling templates adds a dynamic top-level **Templates** menubar entry when configured items exist. If `menubar` is an explicit array, include `'templates'` at the desired position.

Opening the modal presents:

1. **Search Bar**: Instant filter by template name, description, or group.
2. **Category Tabs**: Filter templates by specified `group` names.
3. **Live Preview Frame**: Displays how the template's HTML will render once inserted.
4. **Insert Button**: Inserts the selected template at the cursor location and closes the modal.

---

## Template Events

Listen to the `template-insert` event to trigger application behavior whenever a user inserts a template:

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Editor, type TemplateInsertEvent } from '@erag/text-editor-vue';

const content = shallowRef('');

function handleTemplateInsert(event: TemplateInsertEvent) {
    console.log('Inserted template ID:', event.item.id);
    console.log('Inserted template label:', event.item.label);
}
</script>

<template>
    <Editor
        v-model="content"
        :init="editorConfig"
        @template-insert="handleTemplateInsert"
    />
</template>
```
