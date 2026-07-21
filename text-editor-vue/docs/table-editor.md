---
title: Vue Table Editor
description: 'Insert and edit HTML tables with a visual grid, table properties, row and column operations, cell actions, and keyboard navigation.'
head:
    - - meta
      - name: keywords
        content: '@erag/text-editor-vue, Vue table editor, rich text editor tables, HTML table grid, table row column editing'
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

# Table Editor

`@erag/text-editor-vue` includes complete table creation and editing tools built into the toolbar and menubar.

---

## Inserting Tables

Click the **Table** icon in the toolbar or navigate to **Table → Insert table** in the menubar. A grid selector allows you to choose row and column dimensions (e.g. 3x3, 4x5).

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Editor, type EditorInit } from '@erag/text-editor-vue';

const content = shallowRef('');
const config: EditorInit = {
    tableGridSize: 10,
    toolbar: 'undo redo | blocks | bold italic | table | code',
};
</script>

<template>
    <Editor v-model="content" :init="config" />
</template>
```

`tableGridSize` controls the maximum row and column count offered by the visual picker. Its default is `10`.

---

## Table Operations

When a table or table cell is focused inside the editor canvas, the Table menu unlocks full operations:

- **Row Operations**: Insert row above, Insert row below, Delete row.
- **Column Operations**: Insert column before, Insert column after, Delete column.
- **Table Deletion**: Delete entire table.
- **Cell Operations**: Cell properties, merge cells, and split cells.
- **Table Properties**: Width, cell padding, borders, colors, and alignment through the properties dialog.

Table-only actions remain disabled until the current selection is inside a table. Press `Tab` or `Shift+Tab` inside a cell to move forward or backward through table cells.
