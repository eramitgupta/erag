---
title: CSS Customization
description: 'Customize the editor with package-scoped erag- classes and --erag- CSS variables for surfaces, mentions, merge tags, images, dialogs, and states.'
head:
    - - meta
      - name: keywords
        content: '@erag/text-editor-vue, Vue editor CSS, erag CSS variables, rich text editor styling, editor theme customization'
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

# CSS Customization & Variables

All stylesheet classes and CSS custom variables in `@erag/text-editor-vue` use the **`erag-`** prefix (`.erag-*` and `--erag-*`).

You can inspect any component element using browser DevTools (**Inspect Element**) to discover its exact `.erag-*` class name or `--erag-*` custom property, and override it directly in your application CSS.

---

## Prefix & Overriding Rules

- **Class Namespace**: Every editor component uses the `.erag-` prefix (e.g. `.erag-editor`, `.erag-toolbar`, `.erag-mention`, `.erag-merge-tag`, `.erag-dialog`).
- **CSS Custom Variables**: Variables use the `--erag-` prefix (e.g. `--erag-editor-border-color`, `--erag-editor-active-bg`).
- **Inline & Custom Overrides**: Any rule can be easily overridden in your CSS file by targeting `.erag-editor` or inline style bindings.

---

## Essential CSS Variable Reference

Apply variable overrides on `.erag-editor` or globally on `:root`:

```css
.erag-editor {
    /* Core Editor Canvas */
    --erag-editor-height: 420px;
    --erag-editor-border-color: #d9dce1;
    --erag-editor-active-color: #2563eb;
    --erag-editor-active-bg: #eaf2ff;
    --erag-editor-text-color: #1f2937;
    --erag-editor-muted-color: #6b7280;
    --erag-editor-surface: #ffffff;
    --erag-editor-panel: #f8fafc;
    --erag-editor-radius: 9px;
    --erag-editor-shadow: 0 10px 28px rgb(15 23 42 / 14%);

    /* Mentions (@) */
    --erag-mention-chip-background: #eaf2ff;
    --erag-mention-chip-color: #1659a7;
    --erag-mention-active-background: #1677e8;
    --erag-mention-active-color: #ffffff;
    --erag-mention-border-color: #d6d9de;
    --erag-mention-dropdown-max-height: 320px;
    --erag-mention-dropdown-width: 280px;
    --erag-mention-hover-card-min-height: 68px;
    --erag-mention-hover-card-width: 240px;
    --erag-mention-shadow: 0 8px 24px rgb(0 0 0 / 12%);

    /* Merge Tags ({{ }}) */
    --erag-merge-tag-chip-background: #eef2ff;
    --erag-merge-tag-chip-color: #3730a3;
    --erag-merge-tag-active-background: #1677e8;
    --erag-merge-tag-active-color: #ffffff;
    --erag-merge-tag-dropdown-max-width: 420px;
    --erag-merge-tag-dropdown-width: 320px;
    --erag-merge-tag-sidebar-width: 380px;

    /* Image Upload & Resize */
    --erag-image-delete-background: #dc2626;
    --erag-image-resize-color: #2563eb;
    --erag-image-resize-handle-size: 12px;
    --erag-image-upload-actions-space: 46px;
    --erag-image-upload-background: #f8fbff;
    --erag-image-upload-border: #8bb0f8;
    --erag-image-upload-color: #3974e8;
    --erag-image-upload-shadow: 0 7px 20px rgb(15 23 42 / 16%);
    --erag-image-upload-z-index: 60;
}
```

---

## Overriding via Inspect Element

To customize any specific element or state:

1. Right-click the editor element in your browser and select **Inspect**.
2. Identify the `.erag-*` selector (for example, `.erag-mention` or `.erag-dialog`).
3. Add your custom override in your application CSS:

```css
/* Custom Mention Chip Override */
.erag-editor .erag-mention {
    background-color: #ccfbf1;
    color: #0f766e;
    border-radius: 6px;
}
```

Load your override stylesheet after `@erag/text-editor-vue/style.css`. Avoid `!important`; the package only reserves it for fullscreen behavior where browser and application layout rules may otherwise win.
