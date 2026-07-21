---
title: Image Upload, Resize and Removal
description: 'Upload, paste, insert, resize, align, and remove editor images with native Fetch, custom handlers, progress, validation, and server callbacks.'
head:
    - - meta
      - name: keywords
        content: '@erag/text-editor-vue, Vue image upload editor, image resize handles, ImagesUploadHandler, image delete callback, Fetch image upload'
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

# Image uploads, resizing, and removal

The image control opens a compact upload card at the saved caret position. A user can choose or drop a file into that card, paste an image when enabled, or insert a safe URL. File uploads happen only when your application supplies `imagesUploadHandler` or `imagesUploadUrl`.

## Configuration

```ts
import type { EditorInit } from '@erag/text-editor-vue';

const editorConfig: EditorInit = {
    acceptedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxImageSize: 5 * 1024 * 1024,
    automaticUploads: true,
    pasteImages: true,
    imageFilePicker: true,
    imageUrlInput: true,
    imageResize: true,
    imageDefaultWidth: 640,
};
```

The editor validates MIME type and file size before upload. Generated object URLs are revoked by the package. A failed upload leaves the upload card visible with an error and does not insert a broken image.

## Custom upload handler

Use a custom handler when your application owns the request. Return the final image URL; throwing keeps the image out of the document.

```ts
import type { ImagesUploadHandler } from '@erag/text-editor-vue';

const uploadImage: ImagesUploadHandler = async (blobInfo, progress) => {
    const body = new FormData();
    body.append('file', blobInfo.blob(), blobInfo.filename());

    progress(10);

    const response = await fetch('/api/editor-images', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body,
    });

    if (!response.ok) {
        throw new Error('Image upload failed.');
    }

    const data = (await response.json()) as { url?: string };
    if (!data.url) {
        throw new Error('The upload response did not contain a URL.');
    }

    progress(100);
    return data.url;
};

const editorConfig: EditorInit = {
    imagesUploadHandler: uploadImage,
};
```

`ImageBlobInfo` exposes `id()`, `name()`, `filename()`, `blob()`, `base64()`, and `blobUri()`. A custom handler receives progress reporting but not an abort signal, so cancellation of its own network request remains the consumer's responsibility.

## URL-based uploader

The built-in uploader uses native Fetch, `AbortController`, your field name, headers, credentials, and response resolver.

```ts
const editorConfig: EditorInit = {
    imagesUploadUrl: '/api/editor-images',
    uploadFieldName: 'image',
    uploadHeaders: { Accept: 'application/json' },
    uploadCredentials: 'same-origin',
    resolveUploadedImageUrl: (response: unknown) => {
        const data = response as { data?: { url?: string } };
        if (!data.data?.url) {
            throw new Error(
                'The upload response did not contain an image URL.',
            );
        }

        return data.data.url;
    },
};
```

Do not set the multipart `Content-Type` header yourself; the browser adds the required boundary. Fetch does not expose upload progress, so the built-in URL request uses an indeterminate loading state until completion.

## Resize and align

Click an inserted image to show its selection outline and four corner handles. Drag any corner to resize while preserving the aspect ratio. `imageDefaultWidth` is the initial maximum width; the natural image is not enlarged beyond it.

While an image is selected, the existing left, center, and right alignment controls apply to the image. Set `imageResize: false` to disable the overlay and resize handles.

## Remove an image from the server

The selected-image overlay includes a delete action. With no handler, it removes only the editor HTML. With `imagesDeleteHandler`, the editor waits for your callback before removing the image; if the callback rejects, the image remains.

```ts
import type {
    EditorInit,
    ImageDeleteInfo,
    ImagesDeleteHandler,
} from '@erag/text-editor-vue';

const deleteImage: ImagesDeleteHandler = async (image) => {
    const response = await fetch('/api/editor-images', {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ src: image.src }),
    });

    if (!response.ok) {
        throw new Error('Image deletion failed.');
    }
};

const editorConfig: EditorInit = {
    imagesDeleteHandler: deleteImage,
};

function handleImageRemove(image: ImageDeleteInfo): void {
    console.log('Removed:', image.src, image.width, image.height);
}
```

```vue
<Editor
    v-model="content"
    :init="editorConfig"
    @image-remove="handleImageRemove"
/>
```

The event is emitted once, after successful editor removal. The payload contains `src`, `alt`, rendered `width`, and rendered `height`.

## Paste behavior

When `pasteImages` and `automaticUploads` are true, pasted image files use the configured uploader. Normal pasted HTML is sanitized and inserted once. Clipboard permissions and available image data vary by browser.
