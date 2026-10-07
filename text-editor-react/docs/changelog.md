---
title: "Changelog"
description: "Release notes for @erag/text-editor-react, including the 1.1.0 fixes for mobile layout, valid HTML output, read-only mode, tables, and sanitization."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/text-editor-react/docs/changelog.md
</div>


# Changelog

All notable changes to `@erag/text-editor-react`. Full release notes are on [GitHub Releases](https://github.com/the-erag/text-editor-react/releases).

---

## 1.1.0

A bug-fix release focused on mobile layout, valid HTML output, and read-only mode. There are no breaking API changes.

### Mobile layout

- On screens `680px` wide or narrower, the menubar and toolbar scroll sideways in a single row instead of wrapping or hiding buttons behind **More**.
- Menubar dropdowns and toolbar popovers open right under their button, stay inside the screen, open above when there is no room below, and follow the button while the bar scrolls.
- Nested submenus open to the left, or shift, when they would go off screen.
- The menubar keeps its text labels in narrow editors.

See [Responsive toolbar and menus](/editing-experience.html#responsive-toolbar-and-menus).

### Valid HTML output

- Bulleted, numbered, and check lists are no longer nested inside `<p>`.
- Dividers, tables, templates, pasted content, and `insertHtml()` split the current paragraph instead of being inserted inside it.
- Turning a list off, or outdenting out of one, puts the text back into a paragraph.
- The stray `<span style="font-family: …">` that Chrome added after list toggles and indent/outdent is removed.

See [Clean list HTML](/lists-and-indentation.html#clean-list-html).

### Formatting

- Font family and text color are kept after reload; they are saved as styled spans instead of `<font>` tags, and legacy `<font face|color>` content is converted when loaded.
- **Format → Inline code** wraps the selection in `<code>` (it used to create a `<pre>` block). Running it inside inline code removes it.
- **Unlink** works with just the caret inside the link.
- Mentions and merge tags are followed by a non-breaking space, so the next word no longer sticks to the chip at the end of a line.

### Tables

- The table size picker inserts the size you click or focus, so it works with touch and keyboard (it used to always insert 2 × 2).
- **Table → Cell → Merge cells** keeps the content of both cells.
- **Table properties** opens with the table's current values.

### Read-only mode

- Fullscreen, Print, Word count, Copy, Select all, Preview, Source code, Shortcuts, and About work while the editor is read-only; other buttons and menu items show as disabled.
- The toolbar **More** button stays usable.
- Blocked shortcuts such as `Ctrl+F` go to the browser instead of being swallowed.

See [Disabled & read-only modes](/usage.html#disabled-read-only-modes).

### Sanitizer

- `script`, `style`, `noscript`, `template`, `object`, and `embed` are removed together with their content.
- Images without a safe `src` are removed.
- Empty `style` attributes are dropped.

See [Security & Sanitization](/security.html).

### Other fixes

- The page behind an open dialog no longer scrolls, while long dialog lists still scroll inside. This also works with several dialogs or editors on one page.
- The status bar word count treats separate paragraphs as separate words.
- `Ctrl+K`, `Ctrl+Shift+P`, and `Ctrl+F` reliably open their dialogs.
- Links without a title no longer get `title=""`, and resized images no longer keep an empty `style` attribute.

---

## 1.0.0

Initial release of `@erag/text-editor-react`.
