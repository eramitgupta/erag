---
title: "React Editor Usage"
description: "Use the React Editor as a controlled or uncontrolled component with dynamic configuration, custom toolbars, disabled and read-only modes, and ref methods."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/text-editor-react/docs/usage.md
</div>


# Basic & Dynamic Usage

Learn how to use `<Editor />` in your React application as a controlled component with `value` and `onChange`, with custom toolbar presets, menubar options, disabled/read-only modes, and programmatic methods.

---

## Controlled `value` + `onChange`

Omitting the `init` prop activates the default full-featured editor configuration.

```tsx
import { useState } from 'react';
import { Editor } from '@erag/text-editor-react';
import '@erag/text-editor-react/style.css';

export default function App() {
    const [content, setContent] = useState(
        '<p>Welcome to <strong>@erag/text-editor-react</strong>!</p>',
    );

    return (
        <div className="editor-wrapper">
            <Editor value={content} onChange={setContent} />
        </div>
    );
}
```

`onChange` receives the new HTML string, so you can pass any handler and combine it with other props and callbacks:

```tsx
<Editor
    value={content}
    disabled={isDisabled}
    onChange={(html) => setContent(html)}
    onClick={handleClick}
/>
```

For uncontrolled usage, pass `defaultValue` instead of `value` and read the HTML later through a `ref`, `onCommit`, or the `name` hidden input:

```tsx
<Editor defaultValue="<p>Initial content</p>" name="body" />
```

---

## Toolbar Presets

### Minimal Toolbar

For comment sections, chat boxes, or simple input forms, you can configure a minimal toolbar and hide the menubar and statusbar:

```tsx
import { useState } from 'react';
import { Editor, type EditorInit } from '@erag/text-editor-react';

const minimalConfig: EditorInit = {
    height: 220,
    menubar: false,
    statusbar: false,
    toolbar: 'bold italic underline | bullist numlist | link removeformat',
};

export default function CommentBox() {
    const [content, setContent] = useState('');

    return <Editor value={content} onChange={setContent} init={minimalConfig} />;
}
```

### Full Custom Toolbar

You can separate groups using `|` or pass specific control names:

```ts
const fullConfig: EditorInit = {
    height: 450,
    minHeight: 250,
    maxHeight: 800,
    placeholder: 'Type your story here...',
    menubar: true,
    toolbar:
        'undo redo | blocks fontfamily fontsize lineheight | bold italic underline strikethrough superscript subscript casechange | ' +
        'forecolor backcolor | alignment | ' +
        'bullist numlist checklist outdent indent | link image media table | hr removeformat | ' +
        'code preview fullscreen',
    statusbar: true,
    resize: true,
};
```

---

## Menubar Configuration

Customized menubar entries can be array-defined or hidden entirely:

```tsx
{/* Explicit menubar options */}
<Editor
    value={content}
    onChange={setContent}
    init={{ menubar: ['file', 'edit', 'insert', 'format'] }}
/>

{/* Hide menubar completely */}
<Editor value={content} onChange={setContent} init={{ menubar: false }} />
```

---

## Disabled & Read-only Modes

`@erag/text-editor-react` supports both `disabled` and `readOnly` modes:

- **`disabled`**: Disables all interactions, toolbar buttons, and user editing canvas.
- **`readOnly`**: Allows viewing, text selection, source code inspection, and preview while preventing content mutation.

```tsx
<>
    {/* Disabled mode */}
    <Editor value={content} onChange={setContent} disabled />

    {/* Read-only mode */}
    <Editor value={content} onChange={setContent} readOnly />
</>
```

---

## Dynamic Configuration

The editor detects `init` changes structurally, so you can derive the configuration from component state with an inline object or `useMemo`:

```tsx
import { useMemo, useState } from 'react';
import { Editor, type EditorInit } from '@erag/text-editor-react';

export default function DynamicEditor() {
    const [isCompact, setIsCompact] = useState(false);
    const [content, setContent] = useState('');

    const dynamicInit = useMemo<EditorInit>(
        () => ({
            height: isCompact ? 260 : 500,
            menubar: !isCompact,
            toolbar: isCompact ? 'bold italic link' : true,
        }),
        [isCompact],
    );

    return (
        <>
            <button type="button" onClick={() => setIsCompact((value) => !value)}>
                Toggle Mode
            </button>
            <Editor value={content} onChange={setContent} init={dynamicInit} />
        </>
    );
}
```

---

## Programmatic Control (`EditorInstance`)

Access the editor instance methods via a React `ref`:

```tsx
import { useRef, useState } from 'react';
import { Editor, type EditorInstance } from '@erag/text-editor-react';

export default function SignatureEditor() {
    const editorRef = useRef<EditorInstance>(null);
    const [content, setContent] = useState('');

    function insertSignature() {
        editorRef.current?.focus();
        editorRef.current?.insertHtml(
            '<p>Best regards,<br><strong>Er Amit Gupta</strong></p>',
        );
    }

    function clearEditor() {
        editorRef.current?.clear();
    }

    function printHtml() {
        console.log(editorRef.current?.getHtml());
    }

    return (
        <>
            <div className="actions">
                <button type="button" onClick={insertSignature}>
                    Insert Signature
                </button>
                <button type="button" onClick={clearEditor}>
                    Clear
                </button>
                <button type="button" onClick={printHtml}>
                    Log HTML
                </button>
            </div>

            <Editor ref={editorRef} value={content} onChange={setContent} />
        </>
    );
}
```

### Available Instance Methods

| Method                     | Parameters | Description                                              |
| :------------------------- | :--------- | :------------------------------------------------------- |
| `focus()`                  | none       | Focuses the editable canvas.                             |
| `blur()`                   | none       | Blurs focus from the editor.                             |
| `getHtml()`                | none       | Returns sanitized HTML string.                           |
| `setHtml(html: string)`    | `html`     | Sets editor HTML content.                                |
| `getText()`                | none       | Returns plain text content without HTML tags.            |
| `clear()`                  | none       | Replaces the content with an empty string.               |
| `insertHtml(html: string)` | `html`     | Inserts HTML fragment at current selection cursor.       |
| `insertText(text: string)` | `text`     | Inserts raw text fragment.                               |
| `selectAll()`              | none       | Selects all text inside editor.                          |
| `undo()`                   | none       | Triggers programmatic undo step.                         |
| `redo()`                   | none       | Triggers programmatic redo step.                         |
| `openSourceCode()`         | none       | Opens the HTML source code modal dialog.                 |
| `openPreview()`            | none       | Opens the sanitized preview modal dialog.                |
| `getRootElement()`         | none       | Returns the editable content root inside `.erag-editor`. |
