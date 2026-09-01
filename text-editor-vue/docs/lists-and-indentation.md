---
title: "Lists, Checklists, and Indentation"
description: "Create styled bulleted and numbered lists, interactive checklists, and nested content with indent and outdent controls."
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

# Lists, Checklists & Indentation

`@erag/text-editor-vue` supports styled bulleted lists (`<ul>`), styled numbered lists (`<ol>`), interactive checklists, nested lists, and multi-level paragraph indentation.

---

## Toolbar Configuration

Add list and indentation controls to your `init.toolbar`:

```ts
const editorConfig: EditorInit = {
    toolbar:
        'undo redo | blocks | bullist numlist checklist outdent indent | removeformat',
};
```

---

## Detailed Controls

| Control Name        | Toolbar Keyword | Result                                    | Shortcut                  |
| :------------------ | :-------------- | :---------------------------------------- | :------------------------ |
| **Bulleted List**   | `bullist`       | `<ul><li>Item</li></ul>` with style menu  | Standard toolbar click    |
| **Numbered List**   | `numlist`       | `<ol><li>Item</li></ol>` with style menu  | Standard toolbar click    |
| **Checklist**       | `checklist`     | Interactive checkbox list                 | Standard toolbar click    |
| **Increase Indent** | `indent`        | Indents current line or list item depth   | `Tab` (inside list item)  |
| **Decrease Indent** | `outdent`       | Decreases indentation depth or exits list | `Shift+Tab` (inside list) |

The Decrease Indent and Increase Indent buttons use matching filled format-indent icons. The arrow points left for decrease and right for increase.

---

## Bulleted and numbered style groups

`bullist` and `numlist` are separate dropdown controls and keep their own list icon. Each dropdown presents a visual preview grid:

- **Bulleted list:** default, circle, disc, and square markers.
- **Numbered list:** decimal, lower alpha, lower Greek, lower Roman, upper alpha, and upper Roman markers.

Selecting a preview creates or updates the current list and applies its `list-style-type`. Arrow keys navigate the preview grid, `Home` and `End` jump to the first or last style, and `Escape` closes it.

---

## Interactive checklists

Add `checklist` to the toolbar and keep the `lists` plugin enabled. The same action is also available through **Insert → Checklist**.

- Clicking the command converts the current unordered list into a checklist.
- Clicking it again inside an active checklist converts the content back to a normal unordered list.
- Every item contains a native checkbox whose checked state is persisted in the editor HTML.
- `Enter` after a non-empty item creates the next checklist item.
- `Enter` on an empty checklist item exits the list and creates a paragraph.
- Checkboxes are non-interactive in disabled and readonly editors.

Checklist HTML uses package-specific data attributes:

```html
<ul data-erag-checklist="true">
    <li data-erag-checklist-item="true">
        <input
            type="checkbox"
            data-erag-checklist-checkbox="true"
            contenteditable="false"
        />
        Prepare release notes
    </li>
</ul>
```

---

## Tailwind CSS Reset Fix

In projects using Tailwind CSS or CSS resets (such as Tailwind Preflight), standard browser `ul` list discs and `ol` numbers are often stripped globally by reset rules (`list-style: none`).

`@erag/text-editor-vue` solves this issue out of the box by applying package-scoped styles inside `.erag-editor__content`. This guarantees that lists and nested levels render cleanly inside the editor without requiring global application CSS modifications.
