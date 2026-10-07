---
title: "React Table Editor"
description: "Insert and edit HTML tables with a visual grid, table properties, row and column operations, cell actions, and keyboard navigation."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/text-editor-react/docs/table-editor.md
</div>


# Table Editor

`@erag/text-editor-react` includes complete table creation and editing tools built into the toolbar and menubar.

---

## Inserting Tables

Click the **Table** icon in the toolbar or navigate to **Table → Insert table** in the menubar. A grid selector allows you to choose row and column dimensions (e.g. 3x3, 4x5). The table size comes from the grid cell you click, so the picker works the same with a mouse, touch, or the keyboard (`Tab` to a cell and press `Enter`); focusing a cell highlights the size just like hovering it.

```tsx
import { useState } from 'react';
import { Editor, type EditorInit } from '@erag/text-editor-react';

const config: EditorInit = {
    tableGridSize: 10,
    toolbar: 'undo redo | blocks | bold italic | table | code',
};

export default function TableEditor() {
    const [content, setContent] = useState('');

    return <Editor value={content} onChange={setContent} init={config} />;
}
```

`tableGridSize` controls the maximum row and column count offered by the visual picker. Its default is `10`.

---

## Table Operations

When a table or table cell is focused inside the editor canvas, the Table menu unlocks full operations:

- **Row Operations**: Insert row above, Insert row below, Delete row.
- **Column Operations**: Insert column before, Insert column after, Delete column.
- **Table Deletion**: Delete entire table.
- **Cell Operations**: Cell properties, merge cells, and split cells. **Merge cells** from the Table menu joins the current cell with the next cell in the row: the content of both is kept (separated by a line break when both have text) and the column span is added up. Nothing happens when there is no next cell.
- **Table Properties**: Width, cell padding, borders, colors, and alignment through the properties dialog. The dialog opens with the table's current values.

Table-only actions remain disabled until the current selection is inside a table. Press `Tab` or `Shift+Tab` inside a cell to move forward or backward through table cells.

Table alignment is applied with table margins so left, center, and right remain visually distinct across editor widths. Cell properties separately support horizontal left/center/right alignment and vertical top/middle/bottom alignment.
