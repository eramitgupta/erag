---
title: Lists and Indentation
description: 'Create bulleted, numbered, and nested lists with indent and outdent controls that remain visible with common application CSS resets.'
head:
    - - meta
      - name: keywords
        content: '@erag/text-editor-vue, Vue editor lists, numbered list editor, nested lists, editor indentation, bulleted lists'
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

# Lists & Indentation

`@erag/text-editor-vue` supports bulleted unordered lists (`<ul>`), numbered ordered lists (`<ol>`), nested lists, and multi-level paragraph indentation.

---

## Toolbar Configuration

Add list and indentation controls to your `init.toolbar`:

```ts
const editorConfig: EditorInit = {
    toolbar:
        'undo redo | blocks | bullist numlist | outdent indent | removeformat',
};
```

---

## Detailed Controls

| Control Name        | Toolbar Keyword | HTML Element Created                      | Shortcut                  |
| :------------------ | :-------------- | :---------------------------------------- | :------------------------ |
| **Bulleted List**   | `bullist`       | `<ul><li>Item</li></ul>`                  | Standard toolbar click    |
| **Numbered List**   | `numlist`       | `<ol><li>Item</li></ol>`                  | Standard toolbar click    |
| **Increase Indent** | `indent`        | Indents current line or list item depth   | `Tab` (inside list item)  |
| **Decrease Indent** | `outdent`       | Decreases indentation depth or exits list | `Shift+Tab` (inside list) |

---

## Tailwind CSS Reset Fix

In projects using Tailwind CSS or CSS resets (such as Tailwind Preflight), standard browser `ul` list discs and `ol` numbers are often stripped globally by reset rules (`list-style: none`).

`@erag/text-editor-vue` solves this issue out of the box by applying package-scoped styles inside `.erag-editor .erag-content`. This guarantees that lists and nested levels (`disc`, `circle`, `square`, and `decimal`) render cleanly inside your editor and exported preview HTML without requiring global application CSS modifications.
