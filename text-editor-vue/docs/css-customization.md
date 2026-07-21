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
    --erag-editor-border-color: #d9dce1;
    --erag-editor-active-color: #2563eb;
    --erag-editor-active-bg: #eaf2ff;
    --erag-editor-text-color: #1f2937;
    --erag-editor-surface: #ffffff;
    --erag-editor-panel: #f8fafc;
    --erag-editor-radius: 9px;

    /* Mentions (@) & Merge Tags ({{ }}) */
    --erag-mention-active-background: #0f766e;
    --erag-mention-chip-background: #ccfbf1;
    --erag-mention-chip-color: #0f766e;
    --erag-merge-tag-chip-background: #e0f2fe;
    --erag-merge-tag-chip-color: #0369a1;

    /* Dialog Modals */
    --erag-image-resize-color: #2563eb;
    --erag-image-resize-handle-size: 10px;
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
