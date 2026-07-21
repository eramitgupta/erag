---
title: Links and Anchors
description: 'Insert, edit, validate, and remove safe links, configure new-window behavior, and add generated bookmark anchors in the Vue editor.'
head:
    - - meta
      - name: keywords
        content: '@erag/text-editor-vue, Vue editor links, rich text link dialog, HTML anchors, safe URL editor'
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

# Links & Anchors

`@erag/text-editor-vue` provides interactive dialog modals for inserting, editing, and managing hyperlinks and internal page anchors.

---

## Toolbar & Menubar Configuration

Add `link` and `anchor` controls to your configuration:

```ts
const editorConfig: EditorInit = {
    plugins: ['link', 'anchor'],
    menubar: ['insert'],
    toolbar: 'undo redo | blocks | bold italic | link removeformat',
};
```

---

## Link Insertion & Edit Dialog

Clicking the **Link** icon in the toolbar or navigating to **Insert → Link** opens the Link Modal Dialog with the following options:

1. **URL (`href`)**: Target hyperlink web address or mailto URL.
2. **Text to Display**: Text label inserted inside `<a href="...">Text</a>`.
3. **Title Attribute**: Accessibility tooltip title attribute.
4. **Open in New Tab (`target="_blank"`)**: Adds `target="_blank"` and `rel="noopener noreferrer"` for external links.

### Modifying Existing Links

Positioning your caret inside an existing link and clicking the **Link** button re-populates the dialog with existing values for quick editing. Click **Unlink** in the dialog or toolbar to strip the `<a>` tag while keeping the text intact.

---

## Anchors (`anchor`)

Anchors create an empty bookmark element with a generated ID. `anchor` is an Insert-menu action rather than a toolbar keyword.

1. Place the caret where the bookmark should live.
2. Select **Insert → Anchor** from the menubar.
3. Read the generated `id` from the HTML source when creating a matching `#id` link.

```html
<a id="generated-id" name="anchor"></a>
```
