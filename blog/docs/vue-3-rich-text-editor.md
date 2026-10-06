---
title: A Dependency-Free Rich Text Editor for Vue 3
headline: "A Dependency-Free Rich Text Editor for Vue 3: Setup, Toolbars and v-model"
description: Add a Vue 3 rich text editor with v-model, per-screen toolbars, readonly mode and instance methods, using a component whose only peer dependency is Vue.
date: 2026-09-29
package: text-editor-vue
category: Tutorial
tags: [vue, rich-text-editor, wysiwyg, typescript, laravel]
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/vue-3-rich-text-editor.md
</div>

Sooner or later a form needs more than a `<textarea>`. A blog post body, a product description, a support reply: people want bold text, lists and links, and they don't want to type HTML to get them.

The usual answer is to pull in a big editor framework and then spend an afternoon wiring its extensions together. I built `@erag/text-editor-vue` because I wanted a Vue 3 rich text editor that behaves like any other form input. It uses the Composition API and the browser's native editing APIs instead of wrapping another editor, and Vue is its only peer dependency.

This post walks through installing it, binding it with `v-model`, picking a toolbar for each screen and calling it from your own buttons.

## Install the Vue 3 rich text editor

```bash
npm install @erag/text-editor-vue
```

With pnpm or Yarn, it's `pnpm add @erag/text-editor-vue` or `yarn add @erag/text-editor-vue`.

The peer dependency is `vue` at `>=3.5.0 <4`, so any current Vue 3 app is fine.

The component needs its stylesheet for the toolbar, menus, dialogs and image resize handles. Import it once in your entry file, for example `resources/js/app.ts` in a Laravel app:

```ts
import '@erag/text-editor-vue/style.css';
```

You can also import it inside the component that renders the editor. I prefer the entry file so it's loaded exactly once.

If your app uses a CSS reset that hides list markers, you don't need to fight it. The package ships scoped list styles inside `.erag-editor`, so bullets and numbers still render in the editor.

## Your first editor with v-model

Here's a complete page component, say `resources/js/Pages/Posts/Create.vue`:

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Editor } from '@erag/text-editor-vue';
import '@erag/text-editor-vue/style.css';

const body = shallowRef('<p>Start writing your post...</p>');
</script>

<template>
    <Editor v-model="body" />
</template>
```

That's the whole setup. With no `init` prop you get the full standard editor: menubar, toolbar, status bar with word count, and a resize handle.

A few details about how the content flows, because they matter once you connect it to a form:

- The model is plain HTML. Typing or running a toolbar action updates the string.
- The component emits `update:modelValue` only when the HTML actually changes, so you don't get duplicate updates.
- If you set `body.value` from outside (loading a draft, for example), the canvas updates without echoing the same value back in a loop.

I use `shallowRef` rather than `ref` here. The value is a single string, so deep reactivity buys you nothing, and the docs recommend it for large HTML strings.

## How to configure the toolbar per screen

The full editor is right for an article screen and far too much for a comment box. The `init` prop takes a partial `EditorInit` object. Anything you leave out keeps its default, and the object you pass is never mutated.

Two rules are worth knowing before you start:

1. If you pass an explicit `toolbar` or `menubar`, it's exact. The editor shows what you listed and nothing else.
2. If you pass an explicit `plugins` array, it filters plugin-backed controls. Adding `image` to the toolbar string doesn't bring images back if the `image` plugin isn't in the list.

I keep the presets in one file so every screen stays consistent. Something like `resources/js/lib/editor-presets.ts`:

```ts
import type { EditorInit } from '@erag/text-editor-vue';

export const commentEditor: EditorInit = {
    height: 220,
    menubar: false,
    statusbar: false,
    placeholder: 'Write a comment...',
    toolbar: 'bold italic underline | bullist numlist | link removeformat',
};

export const articleEditor: EditorInit = {
    height: 450,
    minHeight: 250,
    maxHeight: 800,
    placeholder: 'Type your story here...',
    menubar: ['file', 'edit', 'insert', 'format'],
    toolbar:
        'undo redo | blocks fontsize lineheight | bold italic underline strikethrough | ' +
        'forecolor backcolor | alignment | ' +
        'bullist numlist checklist outdent indent | link image table | ' +
        'hr removeformat | code preview fullscreen',
    statusbar: true,
    resize: true,
};
```

Then each page imports the preset it needs:

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Editor } from '@erag/text-editor-vue';
import { commentEditor } from '@/lib/editor-presets';

const comment = shallowRef('');
</script>

<template>
    <Editor v-model="comment" :init="commentEditor" />
</template>
```

The toolbar measures its own width, so a long toolbar in a narrow column doesn't overflow. Groups that don't fit move behind a **More** button that opens a second row. You can drop the article editor into a sidebar and it still behaves.

For the full option list, including fonts, colors and date formats, see the [configuration reference](https://erag.in/text-editor-vue/configuration.html).

## Changing the config at runtime

`init` is reactive. Pass a `computed` and the editor follows it. This is handy for a "compact mode" toggle or for switching presets based on a user setting:

```vue
<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { Editor, type EditorInit } from '@erag/text-editor-vue';

const isCompact = shallowRef(false);
const body = shallowRef('');

const editorConfig = computed<EditorInit>(() => ({
    height: isCompact.value ? 260 : 500,
    menubar: !isCompact.value,
    toolbar: isCompact.value ? 'bold italic link' : true,
}));
</script>

<template>
    <button type="button" @click="isCompact = !isCompact">Toggle compact mode</button>
    <Editor v-model="body" :init="editorConfig" />
</template>
```

`toolbar: true` means "the default toolbar", which is a nice way to fall back without repeating the long string.

## Readonly or disabled?

These two look similar and do different jobs:

- `disabled` turns off everything: toolbar buttons, menus and the editing canvas. Use it while a form is submitting.
- `readonly` blocks changes but still lets people select text, open the source view and use preview. Use it for "view the published version" screens or for users without edit permission.

```vue
<Editor v-model="body" :disabled="isSaving" />
<Editor v-model="body" readonly />
```

## Calling the editor from your own buttons

Sometimes a button outside the editor needs to act on it: insert a signature, clear the content, or read the plain text for an excerpt. Grab the instance with a template ref:

```vue
<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue';
import { Editor, type EditorInstance } from '@erag/text-editor-vue';

const body = shallowRef('');
const editor = useTemplateRef<EditorInstance>('editor');

function insertSignature(): void {
    editor.value?.focus();
    editor.value?.insertHtml('<p>Best regards,<br><strong>The Support Team</strong></p>');
}

function logExcerpt(): void {
    console.log(editor.value?.getText().slice(0, 160));
}
</script>

<template>
    <div class="flex gap-2">
        <button type="button" @click="insertSignature">Insert signature</button>
        <button type="button" @click="editor?.clear()">Clear</button>
        <button type="button" @click="logExcerpt">Log excerpt</button>
    </div>

    <Editor ref="editor" v-model="body" />
</template>
```

`insertHtml()` sanitizes the fragment and inserts it at the saved selection, so the signature lands where the cursor was, even though the user just clicked a button outside the editor. `insertText()` escapes its input, which is what you want for anything user-provided. The [API reference](https://erag.in/text-editor-vue/api.html) lists every method, event and slot.

## Sending the HTML to Laravel

Because the value is just a string, it goes into your form like any other field. In an Inertia page, bind `v-model` to the field on your form object and post it as usual.

For a classic form post, set the `name` prop. The editor adds a hidden input with the current HTML:

```vue
<Editor v-model="body" name="body" />
```

Whichever way it reaches the server, treat it as untrusted input. The editor has a browser-side allow-list sanitizer, but anyone can skip your frontend and post HTML straight to the route. Sanitize again in Laravel before you store it. I wrote up how in [storing rich text safely](./sanitize-rich-text-html-laravel.md).

## Themes

The stylesheet follows the operating system's `prefers-color-scheme` by default. If your app has its own theme switch, put `class="dark"`, `data-theme="dark"` or `data-theme="light"` on the `<html>` element and the editor follows that instead.

## When you don't need this

A rich text editor is the wrong tool more often than people admit:

- **Plain text is enough.** Short bios, titles, notes that never need formatting. A `<textarea>` is simpler to validate, store and render.
- **Your users write Markdown.** Developers and technical writers often prefer it. Store Markdown and render it; don't force a WYSIWYG on them.
- **You need pixel-identical behavior everywhere.** The editor is built on native `contenteditable`, and browsers have small differences in how they handle editing commands. Clipboard access also depends on browser permissions.

It's also a single-user component bound to one HTML string. The docs don't describe real-time collaborative editing, so if several people must type in the same document at once, you need a different kind of tool.

## FAQ

### Does it work with SSR?

The component is SSR-safe during initialization. Browser-only features, including the sanitizer, need the DOM, so they only run on the client.

### Does it support image uploads?

Yes, but the upload goes through a handler or URL you provide. The editor never picks a storage location for you. See [image uploads with Laravel and Vue](./laravel-vue-editor-image-upload.md) for a full example.

### Is it typed?

The package ships TypeScript declarations. `EditorInit`, `EditorInstance` and the event payload types are all exported, as the examples above show.

### Can people mention users or insert placeholders?

Both are built in and off by default. [Mentions and merge tags in a Vue editor](./mentions-merge-tags-vue-editor.md) covers them.

## Where to go next

Start with one screen. Replace a single `<textarea>` with `<Editor v-model>`, give it a small toolbar preset, and add server-side sanitizing before you save anything. Once that works, the [installation guide](https://erag.in/text-editor-vue/installation.html) and [usage docs](https://erag.in/text-editor-vue/usage.html) cover the rest of the options when you need them.
