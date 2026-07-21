---
title: Special Characters and Emoji
description: 'Insert searchable special characters and emoji from categorized, keyboard-accessible dialogs in @erag/text-editor-vue.'
head:
    - - meta
      - name: keywords
        content: '@erag/text-editor-vue, special character picker, Vue emoji picker, editor symbols, currency symbols, Greek characters'
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

# Special Characters

The **Special Characters** plugin (`special-character`) provides a searchable modal dialog for inserting mathematical symbols, currency signs, quotation marks, arrows, Greek letters, and extended Latin characters.

---

## Configuration

Enable the `special-character` plugin:

```ts
const editorConfig: EditorInit = {
    plugins: ['special-character', 'emoji'],
    menubar: ['insert'],
    toolbar: 'undo redo | blocks | bold italic | removeformat',
};
```

---

## Categories & Features

Opening **Insert → Special character** launches a categorized modal:

- 🔍 **Search Input**: Live filter across all characters by name or symbol.
- 🔣 **Category Tabs**:
    - **Currency**: `€`, `£`, `¥`, `₹`, `¢`, `¤`, `₠`, `₢`, `₣`, `₤`, `₱`
    - **Quotations**: `«`, `»`, `“`, `”`, `‘`, `’`, `‹`, `›`, `„`
    - **Mathematical**: `±`, `×`, `÷`, `≠`, `≈`, `≤`, `≥`, `∞`, `∑`, `∏`, `√`, `∂`, `∫`
    - **Symbols & Arrows**: `©`, `®`, `™`, `§`, `¶`, `†`, `‡`, `←`, `↑`, `→`, `↓`, `↔`
    - **Extended Latin & Greek**: `α`, `β`, `γ`, `δ`, `λ`, `π`, `Ω`, `Æ`, `Ø`, `Å`

Clicking any symbol instantly inserts it at the active editor selection caret and closes the dialog.

## Emoji picker

**Insert → Emoji** opens a separate searchable, categorized emoji picker. `special-character` and `emoji` are plugin names; neither is a toolbar keyword. Keep both in `plugins` when you want both Insert-menu actions.

Emoji categories include **Smileys & People**, **Animals & Nature**, **Food & Drink**, **Activity**, **Travel & Places**, **Objects**, **Symbols**, and **Flags**. Search matches the emoji label, and selecting a result inserts its Unicode value at the saved caret.
