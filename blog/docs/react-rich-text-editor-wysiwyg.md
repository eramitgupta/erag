---
title: A Lightweight WYSIWYG Editor for React
headline: "A Lightweight WYSIWYG Editor for React: Controlled, Uncontrolled and Inertia"
description: Set up a React WYSIWYG editor for React 18 and 19 as a controlled or uncontrolled input, with Next.js, Inertia useForm, autosave and custom toolbars.
date: 2026-09-29
package: text-editor-react
category: Tutorial
tags: [react, wysiwyg, rich-text-editor, nextjs, inertia]
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/react-rich-text-editor-wysiwyg.md
</div>

Most React WYSIWYG editor setups start the same way. You install the editor, then a toolbar package, then a few extensions, and then you write an adapter so the thing behaves like a form field. By the end you have a lot of code whose only job is to make an editor act like an `<input>`.

`@erag/text-editor-react` takes the opposite approach. It's one component built on React hooks and the browser's native editing APIs, with React and React DOM as its only peer dependencies. It already behaves like an input: `value` and `onChange` if you want control, `defaultValue` and `name` if you don't.

This post sets it up in plain React, Next.js and a Laravel Inertia app, and covers the props that matter once real users start typing.

## Install the React WYSIWYG editor

```bash
npm install @erag/text-editor-react
```

With pnpm or Yarn, it's `pnpm add @erag/text-editor-react` or `yarn add @erag/text-editor-react`.

The peer dependencies are `react` and `react-dom` at `>=18.0.0 <20`, so React 18 and React 19 both work.

Import the stylesheet once. It covers the toolbar, menus, dialogs, mention and merge-tag chips, and the image resize handles:

```ts
// src/main.tsx, resources/js/app.tsx or app/layout.tsx
import '@erag/text-editor-react/style.css';
```

With Vite, that's all the setup there is. No plugin, no extra config.

## Controlled: value and onChange

This is the mode I reach for by default, because the HTML lives in your state and you can do anything with it:

```tsx
import { useState } from 'react';
import { Editor } from '@erag/text-editor-react';
import '@erag/text-editor-react/style.css';

export default function PostEditor() {
    const [body, setBody] = useState('<p>Start writing...</p>');

    return (
        <>
            <Editor value={body} onChange={setBody} ariaLabel="Post body" />
            <p className="text-sm text-gray-500">{body.length} characters of HTML</p>
        </>
    );
}
```

`onChange` receives the new HTML string, and it's only called when the HTML actually changed. If you set `body` from outside, say after loading a draft, the canvas updates without firing the same value back at you.

`ariaLabel` defaults to "Rich text editor". Set something specific when a page has more than one editor, so screen reader users can tell them apart.

## Uncontrolled: defaultValue and name

Sometimes you don't need the HTML in state at all. You just need it in a form submission. Pass `defaultValue` and `name`, and the editor renders a hidden input with the current HTML:

```tsx
<form method="post" action="/posts">
    <input name="title" />
    <Editor defaultValue="<p>Initial content</p>" name="body" ariaLabel="Post body" />
    <button type="submit">Publish</button>
</form>
```

This is the lightest way to drop an editor into an existing form. You can still read the HTML later through a `ref`, or through `onCommit`, which I'll get to below.

`defaultValue` is ignored when `value` is provided, so pick one mode per editor.

## Using it in Next.js

The editor uses hooks and browser APIs, so in the App Router it belongs in a client component. Add `'use client'` to the file that renders it:

```tsx
'use client';

import { useState } from 'react';
import { Editor } from '@erag/text-editor-react';
import '@erag/text-editor-react/style.css';

export default function ArticleEditor() {
    const [content, setContent] = useState('');

    return <Editor value={content} onChange={setContent} />;
}
```

The component is SSR-safe during initialization. What doesn't run on the server is the sanitizer, since it needs browser DOM APIs. That's one more reason to sanitize on your backend, which I cover in [storing rich text safely](./sanitize-rich-text-html-laravel.md).

## Using it with Laravel and Inertia

In an Inertia React app, keep the HTML in `useForm` so it posts with the rest of the fields and validation errors come back where you expect them. Here's a trimmed version of the page from the [Laravel integration guide](https://erag.in/text-editor-react/laravel-integration.html), as `resources/js/pages/posts/create.tsx`:

```tsx
import type { FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import { Editor, type EditorInit } from '@erag/text-editor-react';

const articleEditor: EditorInit = {
    height: 420,
    minHeight: 280,
    menubar: true,
    statusbar: true,
    placeholder: 'Write your post...',
};

export default function CreatePost() {
    const { data, setData, post, processing, errors } = useForm({
        content: '',
    });

    function save(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        post('/posts');
    }

    return (
        <form className="space-y-4" onSubmit={save}>
            <Editor
                value={data.content}
                onChange={(value) => setData('content', value)}
                init={articleEditor}
                disabled={processing}
                ariaLabel="Post content"
            />
            {errors.content && <p className="text-sm text-red-600">{errors.content}</p>}

            <button type="submit" disabled={processing}>
                {processing ? 'Saving...' : 'Save'}
            </button>
        </form>
    );
}
```

Passing `disabled={processing}` locks the toolbar and canvas while the request is in flight, so nobody edits content that's already on its way to the server.

## You don't need useMemo for init

This part is specific to the React version. The `init` prop is compared structurally, and function values are ignored for change detection. So passing a fresh inline object on every render is fine:

```tsx
<Editor
    value={content}
    onChange={setContent}
    init={{
        height: isCompact ? 260 : 500,
        menubar: !isCompact,
        toolbar: isCompact ? 'bold italic link' : true,
    }}
/>
```

The editor also always calls the latest handler functions you pass in config (like an image upload handler), so you don't get stale closures when those handlers read state. `useMemo` still works if you prefer it. It's just not required.

## Choosing a toolbar

Leave out `init` and you get the full editor. For smaller surfaces, hide the menubar and status bar and list only the controls you want. An explicit toolbar string is exact: you get those controls and nothing else.

```ts
import type { EditorInit } from '@erag/text-editor-react';

export const replyEditor: EditorInit = {
    height: 220,
    menubar: false,
    statusbar: false,
    toolbar: 'bold italic underline | bullist numlist | link removeformat',
};
```

Groups are separated with `|`. If the toolbar doesn't fit its container, whole groups move behind a **More** button instead of overflowing, so the same preset works in a narrow sidebar. The [usage docs](https://erag.in/text-editor-react/usage.html) show a full toolbar string with every control.

## Autosave with onCommit

`onChange` fires on every change, which is too often for a network request. `onCommit` fires on blur, and only when the HTML changed since the last commit. That's a natural point for autosave:

```tsx
import { useState } from 'react';
import { Editor } from '@erag/text-editor-react';

interface DraftEditorProps {
    initialHtml: string;
    onSaveDraft: (html: string) => Promise<void>;
}

export function DraftEditor({ initialHtml, onSaveDraft }: DraftEditorProps) {
    const [status, setStatus] = useState('Saved');

    async function handleCommit(html: string): Promise<void> {
        setStatus('Saving...');
        await onSaveDraft(html);
        setStatus('Saved');
    }

    return (
        <Editor
            defaultValue={initialHtml}
            onCommit={handleCommit}
            statusbarEnd={<span className="text-xs">{status}</span>}
        />
    );
}
```

`statusbarEnd` is one of the render props for adding your own UI: there's also `toolbarStart`, `toolbarEnd`, `menubarEnd`, `statusbarStart` and `emptyState`. They add presentation only. Keyboard handling and selection stay inside the editor.

One detail that trips people up: DOM callbacks like `onFocus`, `onBlur` and `onKeyDown` receive native browser events, not React synthetic events. Type your handlers with `FocusEvent`, not `React.FocusEvent`.

## Calling the editor from outside

A `ref` gives you the instance methods:

```tsx
import { useRef } from 'react';
import { Editor, type EditorInstance } from '@erag/text-editor-react';

export default function SupportReply() {
    const editor = useRef<EditorInstance>(null);

    function insertSignature(): void {
        editor.current?.focus();
        editor.current?.insertHtml('<p>Best regards,<br><strong>Support Team</strong></p>');
    }

    return (
        <>
            <button type="button" onClick={insertSignature}>
                Insert signature
            </button>
            <Editor ref={editor} defaultValue="" name="reply" />
        </>
    );
}
```

`insertHtml()` sanitizes the fragment and inserts it at the saved selection. `insertText()` escapes plain text. `getHtml()`, `getText()`, `setHtml()`, `clear()`, `undo()` and `redo()` do what their names say. The [API reference](https://erag.in/text-editor-react/api.html) lists them all.

## Read-only and disabled

- `readOnly` prevents changes but still allows selecting text, source view and preview. Good for showing published content to people who can't edit it.
- `disabled` turns off all interaction, including the toolbar.

Note the casing: in React it's `readOnly`, matching the native input prop.

## When a lighter option is better

- **Plain text fields.** A `<textarea>` is easier to validate and render. Don't reach for a WYSIWYG because it looks nicer.
- **Markdown audiences.** Developers often prefer writing Markdown. Store it and render it.
- **Custom block editors.** If you're building a Notion-style editor with your own node types, you want an editor framework designed for extensions. This package is a finished component you configure through `init`.

Also be aware that it sits on native `contenteditable`, so browsers differ in small ways, and clipboard access depends on permissions and user gestures.

## FAQ

### Does it support mentions, merge tags and image uploads?

Yes. All three are optional and configured through `init`. Mentions and merge tags are off by default, and image uploads only happen when you provide an upload handler or URL. The [Laravel integration guide](https://erag.in/text-editor-react/laravel-integration.html) shows all of them in one page.

### How do I get plain text for an excerpt or search index?

Call `getText()` on the ref. It returns the content without HTML tags, which is what you want for excerpts, notifications and search.

### Is the HTML safe to render as-is?

Not on its own. The editor sanitizes in the browser, but anyone can send HTML straight to your API. Sanitize on the server before you store or render it.

### Does it follow dark mode?

By default it follows the operating system's `prefers-color-scheme`. If your app has its own theme toggle, set `class="dark"` or a `data-theme` attribute on `<html>` and the editor follows that instead.

## Where to go next

Pick controlled or uncontrolled based on whether you need the HTML in state, give each screen its own small toolbar preset, and add server-side sanitizing before the first save. If you're building templated emails next, [email templates with merge tags](./email-templates-merge-tags-react.md) builds on this setup.
