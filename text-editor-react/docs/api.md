---
title: "API Reference & Props"
description: "Reference Editor props, callback props, render props, ref methods, runtime exports, and payload contracts for @erag/text-editor-react."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/text-editor-react/docs/api.md
</div>


# API reference

This page describes the public surface of `@erag/text-editor-react`. The examples use React 18/19 function components, TypeScript, and the package's published types.

## Runtime exports

```ts
import {
    Editor,
    defaultEditorConfig,
    sanitizeHtml,
} from '@erag/text-editor-react';
```

| Export                        | Purpose                                                                                                                                                                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Editor`                      | The React component used to render the editor. It forwards a `ref` to an `EditorInstance`.                                                                                                                                    |
| `defaultEditorConfig`         | The resolved default configuration. Treat it as read-only; pass your overrides through `init`.                                                                                                                                |
| `sanitizeHtml(html, options)` | Sanitizes an HTML string using explicit `allowedTags`, `allowedAttributes`, and `allowRelativeUrls` options. It returns an empty string when browser DOM APIs are unavailable; sanitize untrusted HTML on the server as well. |

Most consumers should configure `init.sanitize` and let `Editor` call the sanitizer. The direct utility is useful when preparing a browser-side preview with the same allowlist.

```ts
const safeHtml = sanitizeHtml('<p>Hello</p><script>alert(1)</script>', {
    allowedTags: ['p'],
    allowedAttributes: {},
    allowRelativeUrls: true,
});
```

## Props (`EditorProps`)

| Prop           | Type         | Default              | Description                                                                                                                  |
| -------------- | ------------ | -------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `value`        | `string`     | —                    | Controlled HTML. Pair it with `onChange` to keep your state in sync.                                                         |
| `defaultValue` | `string`     | `''`                 | Initial HTML for uncontrolled usage. Ignored when `value` is provided.                                                       |
| `init`         | `EditorInit` | package defaults     | Partial editor configuration. Changes are detected structurally (functions are ignored), so inline objects are fine. It is never mutated. |
| `disabled`     | `boolean`    | `false`              | Disables editing and editor actions.                                                                                         |
| `readOnly`     | `boolean`    | `false`              | Prevents content changes while keeping safe viewing actions available.                                                       |
| `id`           | `string`     | —                    | Applied to the editable content element.                                                                                     |
| `name`         | `string`     | —                    | Adds a hidden form input containing the current HTML, so native form posts include it.                                      |
| `ariaLabel`    | `string`     | `'Rich text editor'` | Accessible label for the editing surface.                                                                                    |
| `className`    | `string`     | —                    | Extra class names added to the outer `.erag-editor` shell.                                                                   |

```tsx
<Editor
    id="message-body"
    value={content}
    onChange={setContent}
    name="body"
    ariaLabel="Message body"
    init={editorConfig}
    disabled={isDisabled}
    className="my-editor"
/>
```

## Callback props (`EditorEvents`)

| Callback            | Payload               | When it is called                                                    |
| ------------------- | --------------------- | -------------------------------------------------------------------- |
| `onChange`          | `string`              | HTML actually changed. Duplicate values are not reported.            |
| `onClick`           | `MouseEvent`          | The editable area is clicked.                                        |
| `onFocus`           | `FocusEvent`          | The editable area receives focus.                                    |
| `onBlur`            | `FocusEvent`          | The editable area loses focus.                                       |
| `onInput`           | `InputEvent`          | A native editor input is handled.                                    |
| `onCommit`          | `string`              | On blur, when HTML changed since the previous committed value.       |
| `onKeyDown`         | `KeyboardEvent`       | A key is pressed in the editor.                                      |
| `onPaste`           | `ClipboardEvent`      | A paste action is handled.                                           |
| `onReady`           | `HTMLElement`         | The editable root is connected on the client.                        |
| `onSelectionChange` | `Selection`           | The browser selection changes while the editor is active.            |
| `onResize`          | `{ height: number }`  | The bottom resize handle changes editor height.                      |
| `onMentionSearch`   | `MentionSearchEvent`  | A debounced mention search starts.                                   |
| `onMentionSelect`   | `MentionSelectEvent`  | A mention is inserted.                                               |
| `onMentionRemove`   | `MentionRemoveEvent`  | A complete mention token is removed.                                 |
| `onMergeTagSelect`  | `MergeTagSelectEvent` | A merge tag is inserted.                                             |
| `onMergeTagRemove`  | `MergeTagRemoveEvent` | A complete merge-tag token is removed.                               |
| `onTemplateInsert`  | `TemplateInsertEvent` | A configured template is inserted.                                   |
| `onImageRemove`     | `ImageDeleteInfo`     | An image is removed after any configured delete handler succeeds.    |

DOM event payloads are native browser events (`MouseEvent`, `FocusEvent`, and so on), not React synthetic events.

```tsx
<Editor
    value={content}
    onChange={setContent}
    onReady={handleReady}
    onCommit={saveDraft}
    onResize={({ height }) => console.log(height)}
    onImageRemove={handleImageRemove}
/>
```

## Instance methods (`EditorInstance`)

Pass a typed `ref` when another control needs to call the editor directly.

```tsx
import { useRef } from 'react';
import { Editor, type EditorInstance } from '@erag/text-editor-react';

export default function Composer() {
    const editor = useRef<EditorInstance>(null);

    function insertGreeting(): void {
        editor.current?.focus();
        editor.current?.insertText('Hello ');
    }

    return (
        <>
            <button type="button" onClick={insertGreeting}>
                Insert greeting
            </button>
            <Editor ref={editor} />
        </>
    );
}
```

| Method              | Result                | Description                                            |
| ------------------- | --------------------- | ------------------------------------------------------ |
| `focus()`           | `void`                | Focuses the editable area.                             |
| `blur()`            | `void`                | Removes focus from it.                                 |
| `getHtml()`         | `string`              | Returns current normalized HTML.                       |
| `setHtml(value)`    | `void`                | Replaces content and publishes the change.             |
| `getText()`         | `string`              | Returns plain text.                                    |
| `clear()`           | `void`                | Replaces content with an empty string.                 |
| `insertHtml(value)` | `void`                | Sanitizes and inserts HTML at the saved selection.     |
| `insertText(value)` | `void`                | Escapes and inserts plain text.                        |
| `selectAll()`       | `void`                | Selects the editor content.                            |
| `undo()` / `redo()` | `void`                | Moves through editor history when possible.            |
| `openSourceCode()`  | `void`                | Opens the source-code dialog.                          |
| `openPreview()`     | `void`                | Opens the preview dialog.                              |
| `getRootElement()`  | `HTMLElement \| null` | Returns the editable root, not the outer editor shell. |

## Render props (`EditorSlots`)

Custom UI is passed as `ReactNode` props or render functions.

| Prop                   | Type                                              | Purpose                                                |
| ---------------------- | ------------------------------------------------- | ------------------------------------------------------ |
| `toolbarStart`         | `ReactNode`                                       | Content before toolbar groups.                         |
| `toolbarEnd`           | `ReactNode`                                       | Content after toolbar groups.                          |
| `menubarEnd`           | `ReactNode`                                       | Content at the end of the menubar.                     |
| `statusbarStart`       | `ReactNode`                                       | Content before the status information.                 |
| `statusbarEnd`         | `ReactNode`                                       | Content after the status information.                  |
| `emptyState`           | `ReactNode`                                       | Custom empty-state content inside the editable canvas. |
| `renderMentionItem`    | `({ item, active }) => ReactNode`                 | Custom mention result rendering.                       |
| `renderMentionLoading` | `({ query }) => ReactNode`                        | Custom mention loading state.                          |
| `renderMentionEmpty`   | `({ query }) => ReactNode`                        | Custom mention empty state.                            |
| `renderMentionError`   | `({ query, retry }) => ReactNode`                 | Custom mention error state.                            |

```tsx
<Editor
    value={content}
    onChange={setContent}
    toolbarEnd={<span className="toolbar-hint">Draft</span>}
    renderMentionItem={({ item, active }) => (
        <span className={active ? 'is-active' : undefined}>{item.label}</span>
    )}
/>
```

Render props add presentation only; editor keyboard handling and selection management remain internal.
