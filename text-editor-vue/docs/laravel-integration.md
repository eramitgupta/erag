---
title: Laravel and Inertia.js v3 Integration
description: 'Integrate @erag/text-editor-vue with Laravel, Inertia.js v3, useHttp, Wayfinder, image uploads, validation, and secure HTML persistence.'
head:
    - - meta
      - name: keywords
        content: '@erag/text-editor-vue, Laravel Vue text editor, Inertia useHttp upload, Wayfinder editor, Laravel rich text editor'
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

# Laravel and Inertia.js v3

The editor is a normal controlled Vue component, so it works in an Inertia page without an adapter. Import the stylesheet once, keep HTML in Vue state, and use Inertia v3 `useHttp` for standalone JSON or file requests when that matches your application.

## Page example

```vue
<script setup lang="ts">
import { useHttp } from '@inertiajs/vue3';
import { computed, shallowRef, useTemplateRef } from 'vue';
import EditorImageController from '@/actions/App/Http/Controllers/EditorImageController';
import { Editor } from '@erag/text-editor-vue';
import type {
    EditorInit,
    EditorInstance,
    ImagesUploadHandler,
    MentionItem,
} from '@erag/text-editor-vue';
import '@erag/text-editor-vue/style.css';

interface ImageUploadRequest {
    file: Blob | null;
}

interface ImageUploadResponse {
    url: string;
}

const content = shallowRef('');
const editor = useTemplateRef<EditorInstance>('editor');
const imageUpload = useHttp<
    ImageUploadRequest,
    ImageUploadResponse | undefined
>({
    file: null,
});

const people: MentionItem[] = [
    {
        id: 1,
        label: 'Amit Gupta',
        description: 'Senior Software Developer',
        avatar: '/images/amit.jpg',
        value: 'amit@example.com',
    },
];

const uploadEditorImage: ImagesUploadHandler = async (blobInfo, progress) => {
    const blob = blobInfo.blob();
    imageUpload.file =
        blob instanceof File
            ? blob
            : new File([blob], blobInfo.filename(), { type: blob.type });

    try {
        const response = await imageUpload.submit(EditorImageController(), {
            onProgress: (uploadProgress) => {
                progress(uploadProgress.percentage ?? 0);
            },
        });

        if (!response?.url) {
            throw new Error('The image response did not contain a URL.');
        }

        progress(100);
        return response.url;
    } finally {
        imageUpload.file = null;
        imageUpload.defaults({ file: null });
    }
};

const editorConfig = computed<EditorInit>(() => ({
    height: 420,
    imagesUploadHandler: uploadEditorImage,
    mentions: {
        enabled: true,
        items: people,
    },
}));

function insertSignature(): void {
    editor.value?.focus();
    editor.value?.insertHtml('<p>Regards,<br><strong>Amit</strong></p>');
}
</script>

<template>
    <button type="button" @click="insertSignature">Insert signature</button>
    <Editor
        ref="editor"
        v-model="content"
        :init="editorConfig"
        aria-label="Message body"
    />
</template>
```

`useHttp` sends files as multipart data and exposes upload progress. The generated Wayfinder controller function supplies the request URL and method, avoiding hard-coded frontend routes.

## Backend expectations

The upload endpoint should validate the file, store it on an application-managed disk, and return JSON containing the public URL expected by the handler.

```php
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreEditorImageRequest;

public function __invoke(StoreEditorImageRequest $request): JsonResponse
{
    $path = $request->file('file')->storePublicly('editor-images', 'public');

    return response()->json([
        'url' => asset("storage/{$path}"),
    ]);
}
```

The Form Request should authorize the owning document and validate `file` with image MIME and size rules. Validate on the server even when the editor already checks the file in the browser.

## Saving editor HTML

Treat `modelValue` as untrusted HTML at the HTTP boundary. Validate request size, sanitize it with a maintained server-side HTML sanitizer, then store only the sanitized result. The editor's browser sanitizer is useful defense in depth but cannot protect a Laravel endpoint from direct requests.
