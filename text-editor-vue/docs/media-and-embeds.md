---
title: Media and Secure Embeds
description: 'Insert HTML5 video, audio, poster images, and sanitized HTTPS iframe embeds using the dependency-free Vue rich text editor.'
head:
    - - meta
      - name: keywords
        content: '@erag/text-editor-vue, Vue media editor, video embed editor, audio editor, safe iframe embed, HTML5 media'
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

# Media and secure embeds

The `media` plugin inserts HTML5 video, audio, or a sanitized HTTPS iframe from a URL. It does not accept arbitrary embed markup or scripts.

## Configuration

```ts
import type { EditorInit } from '@erag/text-editor-vue';

const editorConfig: EditorInit = {
    plugins: ['media'],
    menubar: ['insert'],
    toolbar: 'media',
};
```

If you provide an explicit plugin array, include `media` or its toolbar and Insert-menu controls are filtered out.

## Insert media

Open **Insert → Media** or click the toolbar media button, then choose a type:

- **Video** inserts `<video controls>` and accepts width, height, and an optional safe poster URL.
- **Audio** inserts `<audio controls>` from a direct source URL.
- **Secure embed** inserts an `<iframe>` only for an `https://` source, with a restrictive sandbox and an accessible title.

```html
<video src="/media/demo.mp4" width="640" height="360" controls></video>

<audio src="/media/demo.mp3" controls></audio>

<iframe
    src="https://www.youtube.com/embed/example"
    width="640"
    height="360"
    sandbox="allow-same-origin allow-presentation"
    title="Embedded media"
></iframe>
```

The media dialog accepts URLs, not pasted HTML. Unsafe protocols and non-HTTPS iframe sources are rejected. `relativeUrls: false` can be used when your application requires absolute media URLs.
