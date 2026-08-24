---
title: Find and Replace
description: 'Find and replace editor text with match-case, whole-word, previous, next, replace-current, and replace-all controls.'
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

# Find & Replace

The **Find & Replace** plugin (`find-replace`) provides in-document text search and batch replacement tools.

---

## Configuration

Enable the `find-replace` plugin:

```ts
const editorConfig: EditorInit = {
    plugins: ['find-replace'],
    menubar: ['edit'],
    toolbar: 'undo redo | bold italic | removeformat',
};
```

---

## Interactive Find & Replace Dialog

Navigate to **Edit → Find and replace** or press `Ctrl+F` / `Cmd+F` while the editor is focused to open the dialog. `find-replace` is a plugin and menu action; it is not a toolbar keyword.

1. **Find Input**: Enter search term.
2. **Replace With Input**: Enter replacement string.
3. **Match Case Checkbox**: Toggle case-sensitive matching.
4. **Whole Word Checkbox**: Exclude partial-word matches.
5. **Find Next / Previous**: Step through matching occurrences in the document canvas.
6. **Replace**: Replaces the current occurrence.
7. **Replace All**: Replaces all matching occurrences and updates the document.

Previous and Next use the browser selection to show the active match. The editor does not insert permanent highlight spans into the saved HTML.
