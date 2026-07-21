---
title: Editor Configuration
description: 'Explore every EditorInit option for layout, toolbar, menubar, formatting, plugins, uploads, security, mentions, merge tags, and templates.'
head:
    - - meta
      - name: keywords
        content: '@erag/text-editor-vue, Vue 3 rich text editor, EditorInit, Vue editor configuration, rich text editor options, custom toolbar'
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

# Configuration reference

Pass a partial `EditorInit` object through the `init` prop. Missing properties use package defaults, arrays replace default arrays, and the supplied object is never mutated. Reactive `ref`, `reactive`, or `computed` values are supported.

```vue
<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { Editor, type EditorInit } from '@erag/text-editor-vue';

const compact = shallowRef(false);
const content = shallowRef('');
const init = computed<EditorInit>(() => ({
    height: compact.value ? 280 : 420,
    menubar: !compact.value,
    toolbar: compact.value ? 'bold italic | link' : true,
}));
</script>

<template>
    <Editor v-model="content" :init="init" />
</template>
```

## Layout and behavior

| Option             | Type                                        | Default                  | Description                                                           |
| ------------------ | ------------------------------------------- | ------------------------ | --------------------------------------------------------------------- |
| `height`           | `number \| string`                          | `420`                    | Initial editor height. Numbers are pixels.                            |
| `minHeight`        | `number \| string`                          | `240`                    | Minimum resize height.                                                |
| `maxHeight`        | `number \| string`                          | —                        | Optional maximum resize height.                                       |
| `width`            | `number \| string`                          | —                        | Optional editor width.                                                |
| `placeholder`      | `string`                                    | `'Write something...'`   | Empty-editor hint.                                                    |
| `menubar`          | `boolean \| EditorMenuName[]`               | `true`                   | All menus, no menu, or an exact ordered menu list.                    |
| `toolbar`          | `boolean \| string \| EditorToolbarGroup[]` | `true`                   | Default toolbar, no toolbar, compact string, or typed groups.         |
| `statusbar`        | `boolean`                                   | `true`                   | Shows element path, counts, help text, and resize handle.             |
| `branding`         | `boolean`                                   | `false`                  | Reserved presentation flag.                                           |
| `promotion`        | `boolean`                                   | `false`                  | Reserved presentation flag.                                           |
| `resize`           | `boolean`                                   | `true`                   | Enables vertical resizing from the status bar.                        |
| `readonly`         | `boolean`                                   | `false`                  | Configuration-level readonly mode. The prop can also enable it.       |
| `autofocus`        | `boolean`                                   | `false`                  | Focuses the editable root after client mount when editing is allowed. |
| `spellcheck`       | `boolean`                                   | `true`                   | Passes native spellcheck behavior to the editable area.               |
| `direction`        | `'ltr' \| 'rtl'`                            | `'ltr'`                  | Text direction.                                                       |
| `contentStyle`     | `string`                                    | `''`                     | Inline CSS declarations applied to the editable root.                 |
| `contentClass`     | `string`                                    | `''`                     | Additional class names applied to the editable root.                  |
| `helpShortcutText` | `string`                                    | `'Press Alt+0 for help'` | Status-bar help text.                                                 |

## Formatting choices

| Option              | Type                     | Default                                  | Description                                       |
| ------------------- | ------------------------ | ---------------------------------------- | ------------------------------------------------- |
| `fontFamilyFormats` | `FontFamilyOption[]`     | 13 common families                       | `{ label, value }` options for the font selector. |
| `fontSizeFormats`   | `FontSizeOption[]`       | `8pt` through `36pt`                     | `{ label, value }` options for font size.         |
| `lineHeightFormats` | `LineHeightOption[]`     | `1` through `2`                          | `{ label, value }` options for line height.       |
| `blockFormats`      | `BlockFormatOption[]`    | paragraph, headings 1–6, pre, blockquote | Available block selector entries.                 |
| `textColors`        | `string[]`               | package color palette                    | Text-color choices.                               |
| `backgroundColors`  | `string[]`               | package color palette                    | Highlight-color choices.                          |
| `dateFormats`       | `DateTimeFormatOption[]` | ISO, numeric, long                       | Date options generated at insertion time.         |
| `timeFormats`       | `DateTimeFormatOption[]` | 24-hour, 12-hour                         | Time options generated at insertion time.         |

```ts
const init: EditorInit = {
    fontFamilyFormats: [
        { label: 'Arial', value: 'Arial' },
        { label: 'Georgia', value: 'Georgia' },
    ],
    lineHeightFormats: [
        { label: 'Compact', value: '1.2' },
        { label: 'Comfortable', value: '1.6' },
    ],
    dateFormats: [
        {
            label: 'Long date',
            type: 'date',
            options: { year: 'numeric', month: 'long', day: 'numeric' },
        },
    ],
};
```

## Plugins

`plugins` defaults to every supported plugin. An explicit array filters controls that are marked as plugin-backed, including links, images, media, tables, source code, preview, fullscreen, find and replace, special characters, emoji, anchors, date-time, merge tags, and templates.

```ts
const init: EditorInit = {
    plugins: ['history', 'formatting', 'lists', 'link'],
    menubar: ['edit', 'format'],
    toolbar: 'undo redo | bold italic | bullist numlist | link',
};
```

Feature names are listed in [`EditorPluginName`](/types.html#editorpluginname). A plugin-backed toolbar item still needs its plugin in the array; adding its toolbar keyword alone does not bypass filtering. Core history, formatting, and list controls are selected directly through `toolbar` and `menubar` in the current release, while their plugin names remain valid configuration values.

## Images and uploads

| Option                    | Type                                               | Default                    | Description                                                                     |
| ------------------------- | -------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------- |
| `acceptedFormats`         | `string[]`                                         | JPEG, PNG, WebP, GIF       | Allowed image MIME types.                                                       |
| `maxImageSize`            | `number`                                           | `5 * 1024 * 1024`          | Maximum bytes per image.                                                        |
| `uploadFieldName`         | `string`                                           | `'file'`                   | Multipart field used by the URL uploader.                                       |
| `uploadHeaders`           | `Record<string, string>`                           | `{}`                       | Headers used by the URL uploader. Do not set multipart `Content-Type` manually. |
| `uploadCredentials`       | `RequestCredentials`                               | `'same-origin'`            | Fetch credential mode.                                                          |
| `imagesUploadUrl`         | `string`                                           | —                          | Endpoint for the built-in Fetch uploader.                                       |
| `imagesUploadHandler`     | `ImagesUploadHandler`                              | —                          | Consumer-controlled custom uploader.                                            |
| `imagesDeleteHandler`     | `ImagesDeleteHandler`                              | —                          | Optional server cleanup callback before editor removal.                         |
| `resolveUploadedImageUrl` | `(response: unknown) => string \| Promise<string>` | built-in common URL lookup | Resolves the URL uploader response. Use it for your response shape.             |
| `automaticUploads`        | `boolean`                                          | `true`                     | Automatically uploads selected or pasted files.                                 |
| `pasteImages`             | `boolean`                                          | `true`                     | Accepts image files from the clipboard.                                         |
| `imageFilePicker`         | `boolean`                                          | `true`                     | Shows file selection in the inline image card.                                  |
| `imageUrlInput`           | `boolean`                                          | `true`                     | Shows URL insertion in the inline image card.                                   |
| `imageResize`             | `boolean`                                          | `true`                     | Enables four-corner image resizing.                                             |
| `imageDefaultWidth`       | `number`                                           | `640`                      | Maximum initial inserted width in pixels.                                       |

See [image uploads and resizing](/image-upload.html) for complete handlers.

## Content and security

| Option              | Type                       | Default           | Description                                                                      |
| ------------------- | -------------------------- | ----------------- | -------------------------------------------------------------------------------- |
| `sanitize`          | `boolean`                  | `true`            | Applies the internal browser allowlist sanitizer.                                |
| `allowedTags`       | `string[]`                 | package allowlist | HTML elements preserved by the sanitizer.                                        |
| `allowedAttributes` | `Record<string, string[]>` | package allowlist | Attributes preserved per tag; `'*'` applies to all allowed tags.                 |
| `relativeUrls`      | `boolean`                  | `true`            | Allows safe relative link and media URLs.                                        |
| `removeScriptHost`  | `boolean`                  | `false`           | Reserved compatibility option; current insertion does not rewrite hosts with it. |
| `convertUrls`       | `boolean`                  | `true`            | Reserved compatibility option; current insertion preserves accepted URL values.  |

Client-side sanitization is not a server security boundary. See [security and sanitization](/security.html).

## Tables and optional features

| Option          | Type                               | Default | Description                                                                |
| --------------- | ---------------------------------- | ------- | -------------------------------------------------------------------------- |
| `tableGridSize` | `number`                           | `10`    | Maximum rows and columns shown by the table grid picker.                   |
| `mentions`      | `boolean \| MentionConfig`         | `false` | Enables the fixed `@` autocomplete.                                        |
| `mergeTags`     | `boolean \| MergeTagConfig`        | `false` | Enables the fixed <code>&#123;&#123;</code> autocomplete and dynamic menu. |
| `templates`     | `boolean \| EditorTemplatesConfig` | `false` | Enables the configured template picker.                                    |

Each optional feature is documented on its own page with item and event examples.

## Normalized aliases

Camel case is the primary API. These compatibility aliases are normalized once before merging:

| Alias                   | Preferred option      |
| ----------------------- | --------------------- |
| `content_style`         | `contentStyle`        |
| `font_family_formats`   | `fontFamilyFormats`   |
| `font_size_formats`     | `fontSizeFormats`     |
| `line_height_formats`   | `lineHeightFormats`   |
| `images_upload_url`     | `imagesUploadUrl`     |
| `images_upload_handler` | `imagesUploadHandler` |
| `images_delete_handler` | `imagesDeleteHandler` |
| `automatic_uploads`     | `automaticUploads`    |
| `relative_urls`         | `relativeUrls`        |
| `remove_script_host`    | `removeScriptHost`    |
| `convert_urls`          | `convertUrls`         |

If both forms are supplied, the camel-case value wins.
