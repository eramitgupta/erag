---
title: CSS Customization
description: 'Customize the editor with package-scoped erag- classes and --erag- CSS variables for light and dark surfaces, mentions, merge tags, images, dialogs, and states.'
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

# CSS Customization & Variables

All stylesheet classes and CSS custom variables in `@erag/text-editor-vue` use the **`erag-`** prefix (`.erag-*` and `--erag-*`).

You can inspect any component element using browser DevTools (**Inspect Element**) to discover its exact `.erag-*` class name or `--erag-*` custom property, and override it directly in your application CSS.

---

## Prefix & Overriding Rules

- **Class Namespace**: Every editor component uses the `.erag-` prefix (e.g. `.erag-editor`, `.erag-toolbar`, `.erag-mention`, `.erag-merge-tag`, `.erag-dialog`).
- **CSS Custom Variables**: Variables use the `--erag-` prefix (e.g. `--erag-editor-border-color`, `--erag-editor-active-bg`).
- **Inline & Custom Overrides**: Any rule can be easily overridden in your CSS file by targeting `.erag-editor` or inline style bindings.

---

## Dark mode

The package follows the user's `prefers-color-scheme` setting automatically. The default dark palette uses a black editor surface with neutral dark panels and borders. It also supports explicit application themes through `dark` or `data-theme="dark"` on the document root. This works with common Tailwind-style theme toggles that add or remove `dark` on `<html>`.

```html
<html class="dark"></html>
```

For an explicit light or dark choice, use `data-theme` on `<html>`:

```ts
document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
```

Use `data-theme="light"` to keep the editor light even when the operating system prefers dark mode. Put the theme class or attribute on `<html>` because dialogs and table menus are teleported to `body`.

You can customize the light and dark palettes with the same prefixed variables:

```css
:root {
    --erag-editor-surface: #ffffff;
    --erag-editor-text-color: #1f2937;
}

html.dark {
    --erag-editor-surface: #000000;
    --erag-editor-text-color: #e5e5e5;
}
```

The default black palette is only a starting point. Override any `--erag-` variable in your application to match your brand:

```css
html.dark {
    --erag-editor-surface: #101827;
    --erag-editor-panel: #172033;
    --erag-editor-text-color: #f8fafc;
    --erag-editor-active-color: #22c55e;
}
```

---

## Essential CSS Variable Reference

Apply variable overrides on `.erag-editor` or globally on `:root`:

```css
.erag-editor {
    /* Core Editor Canvas */
    --erag-editor-height: 420px;
    --erag-editor-border-color: #d9dce1;
    --erag-editor-border-subtle: #e7eaf0;
    --erag-editor-border-muted: #e2e7ee;
    --erag-editor-border-strong: #cbd5e1;
    --erag-editor-active-color: #2563eb;
    --erag-editor-active-hover: #1d4ed8;
    --erag-editor-active-bg: #eaf2ff;
    --erag-editor-active-bg-hover: #eff6ff;
    --erag-editor-active-border: #bfdbfe;
    --erag-editor-focus-color: #93b4f5;
    --erag-editor-text-color: #1f2937;
    --erag-editor-text-strong: #273142;
    --erag-editor-text-secondary: #334155;
    --erag-editor-text-muted: #64748b;
    --erag-editor-text-subtle: #9ca3af;
    --erag-editor-muted-color: var(--erag-editor-text-muted);
    --erag-editor-surface: #ffffff;
    --erag-editor-panel: #f8fafc;
    --erag-editor-surface-muted: #f1f5f9;
    --erag-editor-code-bg: #f1f5f9;
    --erag-editor-hover-bg: #f0f3f7;
    --erag-editor-danger-color: #dc2626;
    --erag-editor-danger-hover: #b91c1c;
    --erag-editor-danger-text: #b42318;
    --erag-editor-tooltip-surface: #111827;
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

---

## Toolbar, menubar, and mention spacing

Responsive toolbar overflow is rendered as `.erag-toolbar__overflow-row`, a full-width second toolbar row below the primary controls. Hidden groups keep the standard `.erag-toolbar__overflow-group`, `.erag-toolbar__button`, and `.erag-toolbar__select` classes.

The menubar uses the editor as a named inline-size container. It wraps at any constrained width, and the package switches to accessible icon-only buttons at `420px` or less.

Example compact overrides:

```css
.erag-editor .erag-toolbar__overflow-row {
    padding-block: 2px;
}

.erag-editor .erag-menubar__button {
    padding: 5px 7px;
}

.erag-editor .erag-mention-dropdown__item {
    min-height: 46px;
    gap: 7px;
    padding: 5px 8px;
}

.erag-editor .erag-mention-dropdown__avatar,
.erag-editor .erag-mention-dropdown__avatar-fallback {
    width: 34px;
    height: 34px;
    flex-basis: 34px;
}
```
