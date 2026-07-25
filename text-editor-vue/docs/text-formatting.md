---
title: Rich Text Formatting
description: 'Configure headings, fonts, sizes, bold, italic, underline, colors, alignment, change case, and clear-formatting controls in the Vue editor.'
head:
    - - meta
      - name: keywords
        content: '@erag/text-editor-vue, rich text formatting, Vue formatting toolbar, editor fonts, text colors, heading editor'
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

# Text Formatting

`@erag/text-editor-vue` uses native browser editing commands for standard rich-text formatting and Range/Selection APIs for selection-aware editor interactions. Standard commands currently use `document.execCommand` for broad contenteditable behavior and native undo integration.

---

## Formatting Controls & Toolbar Items

Include any of the following formatting keywords in your `init.toolbar` string:

```ts
const editorConfig: EditorInit = {
    toolbar:
        'undo redo | blocks fontfamily fontsize | ' +
        'bold italic underline strikethrough superscript subscript casechange | ' +
        'forecolor backcolor | ' +
        'lineheight alignment | ' +
        'removeformat',
};
```

---

## Detailed Control List

| Toolbar Control       | Keyword         | Function                                                                                                      |
| :-------------------- | :-------------- | :------------------------------------------------------------------------------------------------------------ |
| **Blocks / Headings** | `blocks`        | Dropdown menu to convert paragraph into `<h1>` through `<h6>`, `<p>`, `<blockquote>`, or `<pre>` code blocks. |
| **Font Family**       | `fontfamily`    | Select a configured family such as Arial, Georgia, Courier New, Times New Roman, or Verdana.                  |
| **Font Size**         | `fontsize`      | Select font sizes (e.g. 8pt to 36pt).                                                                         |
| **Line Height**       | `lineheight`    | Opens one grouped dropdown using the configured `lineHeightFormats`.                                          |
| **Bold**              | `bold`          | Toggles `<strong>` / `<b>` bold text formatting (`Ctrl+B` / `Cmd+B`).                                         |
| **Italic**            | `italic`        | Toggles `<em>` / `<i>` italic text formatting (`Ctrl+I` / `Cmd+I`).                                           |
| **Underline**         | `underline`     | Toggles `<u>` underline formatting (`Ctrl+U` / `Cmd+U`).                                                      |
| **Strikethrough**     | `strikethrough` | Toggles `<del>` / `<s>` strikethrough formatting.                                                             |
| **Superscript**       | `superscript`   | Toggles `<sup>` superscript text (e.g. x<sup>2</sup>).                                                        |
| **Subscript**         | `subscript`     | Toggles `<sub>` subscript text (e.g. H<sub>2</sub>O).                                                         |
| **Change Case**       | `casechange`    | Dropdown menu offering **UPPERCASE**, **lowercase**, and **Title Case** conversions.                          |
| **Text Color**        | `forecolor`     | Color picker dropdown for text foreground color.                                                              |
| **Background Color**  | `backcolor`     | Color picker dropdown for text highlight / background fill color.                                             |
| **Alignment Group**   | `alignment`     | One dropdown containing left, center, right, and justify with matching icons.                                 |
| **Align Left**        | `alignleft`     | Aligns text paragraph to the left.                                                                            |
| **Align Center**      | `aligncenter`   | Centers text paragraph.                                                                                       |
| **Align Right**       | `alignright`    | Aligns text paragraph to the right.                                                                           |
| **Justify**           | `alignjustify`  | Justifies text across full container width.                                                                   |
| **Remove Formatting** | `removeformat`  | Strips inline formatting, styles, and tags from selection.                                                    |

The Format menubar also provides **Inline code** and **Line height**. The current inline-code action changes the selected block to `<pre>`. Line-height choices come from `lineHeightFormats`, are available from both the toolbar and menubar, and are applied as an inline `line-height` style.

```ts
const editorConfig: EditorInit = {
    lineHeightFormats: [
        { label: 'Compact', value: '1.2' },
        { label: 'Normal', value: '1.5' },
        { label: 'Relaxed', value: '2' },
    ],
};
```

The grouped `alignment` control is the default toolbar presentation. The individual `alignleft`, `aligncenter`, `alignright`, and `alignjustify` keywords remain available when separate buttons are preferred.

Bold, italic, underline, and similar commands can establish the format used for subsequent typing when the caret is collapsed. **Change case** requires an active text selection. **Clear formatting** removes formatting from the selection and resets the active block to a paragraph.

The default families are Arial, Book Antiqua, Comic Sans MS, Courier New, Georgia, Helvetica, Impact, Symbol, Tahoma, Terminal, Times New Roman, Trebuchet MS, and Verdana. Default sizes are `8pt`, `10pt`, `12pt`, `14pt`, `18pt`, `24pt`, and `36pt`.
