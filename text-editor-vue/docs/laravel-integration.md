---
title: Laravel and Inertia.js v3 Integration
description: 'Complete step-by-step guide to integrating @erag/text-editor-vue with Laravel, Inertia.js v3, useHttp, Wayfinder, image uploads & deletion, merge tags, and templates.'
head:
    - - meta
      - name: keywords
        content: '@erag/text-editor-vue, Laravel Vue text editor, Inertia useHttp upload, Wayfinder editor, Laravel rich text editor, image deletion'
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

# Laravel & Inertia.js v3 Integration Guide

This guide walks you through integrating `@erag/text-editor-vue` into a Laravel + Inertia.js v3 application step by step.

---

## Overview of Steps

1. **Step 1: Install Package & Import Styles**
2. **Step 2: Initialize Vue State & Template Ref**
3. **Step 3: Setup Frontend Image Upload & Removal Handlers (`useHttp` + Wayfinder)**
4. **Step 4: Create Backend Image Controllers (Upload & Delete)**
5. **Step 5: Setup Merge Tags & Template Replacement (Frontend)**
6. **Step 6: Create Backend Merge Tag Controller**
7. **Step 7: Assemble Reactive Editor Config (`computed<EditorInit>`)**
8. **Step 8: Render Editor Component in Vue Template**
9. **Step 9: Security & HTML Sanitization Best Practices**

---

## Step 1: Install Package & Import Styles

First, install the editor package in your project:

```bash
npm install @erag/text-editor-vue
```

In your Vue component or main layout file, import the editor styles:

```typescript
// Import default editor CSS (required for toolbar, dialogs, mentions, and chips)
import '@erag/text-editor-vue/style.css';
```

---

## Step 2: Initialize Vue State & Template Ref

Set up reactive state for the HTML content and get access to programmatic methods like `focus()`, `insertHtml()`, and `clear()`.

```typescript
<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from 'vue';
import { Editor } from '@erag/text-editor-vue';
import type { EditorInit, EditorInstance } from '@erag/text-editor-vue';
import '@erag/text-editor-vue/style.css';

// 1. Reactive state for editor content
// Note: Use shallowRef instead of ref for better performance with large HTML strings
const editorContent = shallowRef('<h2>Welcome to Text Editor 🎉</h2>');
const isDisabled = shallowRef(false);
const isReadonly = shallowRef(false);

// 2. Template Ref to call methods on the editor instance directly
const editor = useTemplateRef<EditorInstance>('editor');

// Programmatic helper actions
function insertSignature(): void {
    editor.value?.focus();
    editor.value?.insertHtml('<p>Best regards,<br><strong>Team</strong></p>');
}

function clearEditor(): void {
    editor.value?.clear();
}
</script>
```

---

## Step 3: Setup Frontend Image Upload & Removal Handlers (`useHttp` + Wayfinder)

Use Inertia v3's `useHttp` composable alongside Wayfinder's typed routes (`EditorImageController()` & `DeleteEditorImageController()`) to handle uploading and deleting image files:

```typescript
import { useHttp } from '@inertiajs/vue3';
import EditorImageController from '@/actions/App/Http/Controllers/EditorImageController';
import DeleteEditorImageController from '@/actions/App/Http/Controllers/DeleteEditorImageController';
import type { ImageDeleteInfo, ImagesUploadHandler } from '@erag/text-editor-vue';

interface ImageUploadRequest {
    file: Blob | null;
}

interface ImageUploadResponse {
    url: string;
}

// 1. HTTP helper for image upload
const imageUpload = useHttp<ImageUploadRequest, ImageUploadResponse | undefined>({
    file: null,
});

// 2. HTTP helper for image deletion
const imageDelete = useHttp({ src: '' });

// 3. Upload handler for dropped/pasted/selected images
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
            throw new Error('The image upload response did not return a valid URL.');
        }

        progress(100);
        return response.url;
    } finally {
        imageUpload.file = null;
        imageUpload.defaults({ file: null });
    }
};

// 4. Removal handler triggered when user deletes an image (@image-remove)
async function handleImageRemove(event: ImageDeleteInfo): Promise<void> {
    if (!event.src) return;

    try {
        await imageDelete.submit(DeleteEditorImageController(), {
            data: { src: event.src },
        });
        console.log('Image deleted from server storage:', event.src);
    } catch (error) {
        console.error('Failed to delete image from server:', error);
    }
}
```

---

## Step 4: Create Backend Image Controllers (Upload & Delete)

Create the controllers and form request in your Laravel app:

### 1. Form Request Validation (`StoreEditorImageRequest.php`)

```php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEditorImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => ['required', 'image', 'mimes:jpeg,png,webp,gif', 'max:5120'], // 5MB max
        ];
    }
}
```

### 2. Upload Controller (`EditorImageController.php`)

```php
namespace App\Http\Controllers;

use App\Http\Requests\StoreEditorImageRequest;
use Illuminate\Http\JsonResponse;

class EditorImageController extends Controller
{
    public function __invoke(StoreEditorImageRequest $request): JsonResponse
    {
        // Store image on public storage disk
        $path = $request->file('file')->storePublicly('editor-images', 'public');

        return response()->json([
            'url' => asset("storage/{$path}"),
        ]);
    }
}
```

### 3. Delete Controller (`DeleteEditorImageController.php`)

```php
namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DeleteEditorImageController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'src' => ['required', 'string'],
        ]);

        // Extract relative path from URL (e.g. "storage/editor-images/abc.jpg" -> "editor-images/abc.jpg")
        $path = Str::after($validated['src'], '/storage/');

        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }

        return response()->json([
            'message' => 'Image removed successfully.',
        ]);
    }
}
```

---

## Step 5: Setup Merge Tags & Template Replacement (Frontend)

When a template is inserted (containing merge tags like <code>&#123;&#123; client.name &#125;&#125;</code>), send the HTML to Laravel to replace placeholder tags with actual dynamic database values:

```typescript
import ReplaceEditorMergeTagsController from '@/actions/App/Http/Controllers/ReplaceEditorMergeTagsController';
import type { TemplateInsertEvent } from '@erag/text-editor-vue';

const mergeTagHttp = useHttp({ content: '', merge_tags: [] });

async function handleTemplateInsert(event: TemplateInsertEvent): Promise<void> {
    const originalContent = editorContent.value;

    try {
        const response = await mergeTagHttp.submit(
            ReplaceEditorMergeTagsController(),
            {
                data: {
                    content: originalContent,
                    merge_tags: [
                        { tag: 'client.name', value: 'Olivia Bennett' },
                        { tag: 'proposal.number', value: 'PROP-2026-001' },
                    ],
                },
            }
        );

        if (response?.html && editorContent.value === originalContent) {
            editorContent.value = response.html;
        }
    } catch (error) {
        console.error('Merge tag replacement failed:', error);
    }
}
```

---

## Step 6: Create Backend Merge Tag Controller

Create `ReplaceEditorMergeTagsController.php` in Laravel:

```php
namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReplaceEditorMergeTagsController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'content' => ['required', 'string'],
            'merge_tags' => ['array'],
            'merge_tags.*.tag' => ['required', 'string'],
            'merge_tags.*.value' => ['required', 'string'],
        ]);

        $content = $validated['content'];

        // Replace double-braced tags safely with escaped values
        foreach ($validated['merge_tags'] as $tag) {
            $safeValue = e($tag['value']);
            $content = str_replace("{{ {$tag['tag']} }}", $safeValue, $content);
            $content = str_replace("{{{$tag['tag']}}}", $safeValue, $content);
        }

        return response()->json([
            'html' => $content,
        ]);
    }
}
```

---

## Step 7: Assemble Reactive Editor Config (`computed<EditorInit>`)

Define the full configuration object combining toolbar items, mention items, merge tags, templates, and the image upload handler:

```typescript
const mentionItems = [
    { id: 1, label: 'Damon Cross', description: 'Backend Developer', value: 'damon@example.com' },
    { id: 2, label: 'Ava Mitchell', description: 'Product Designer', value: 'ava@example.com' },
];

const mergeTagItems = [
    { name: 'Client name', value: 'client.name', group: 'Client' },
    { name: 'Proposal number', value: 'proposal.number', group: 'Proposal' },
];

const editorConfig = computed<EditorInit>(() => ({
    height: 420,
    minHeight: 280,
    menubar: true,
    statusbar: true,
    placeholder: 'Type something, @ to mention, or {{ for merge tags...',
    acceptedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxImageSize: 5 * 1024 * 1024,
    automaticUploads: true,
    pasteImages: true,
    imageFilePicker: true,
    imageUrlInput: true,
    imagesUploadHandler: uploadEditorImage,
    mentions: {
        enabled: true,
        debounce: 200,
        limit: 8,
        items: mentionItems,
    },
    mergeTags: {
        enabled: true,
        limit: 10,
        items: mergeTagItems,
    },
    templates: {
        enabled: true,
        items: [
            {
                id: 'welcome-email',
                title: 'Welcome Email',
                description: 'Onboarding template',
                content: '<p>Dear {{ client.name }}, welcome!</p>',
            },
        ],
    },
    toolbar:
        'undo redo | blocks fontfamily fontsize | ' +
        'bold italic underline strikethrough | ' +
        'forecolor backcolor | alignleft aligncenter alignright alignjustify | ' +
        'bullist numlist outdent indent | link image media table | ' +
        'hr removeformat | code preview fullscreen',
}));
```

---

## Step 8: Render Editor Component in Vue Template

Add the HTML markup in your Vue component template:

```vue
<template>
    <div class="space-y-4 p-4">
        <!-- Control buttons -->
        <div class="flex gap-2">
            <button
                type="button"
                :disabled="isDisabled || isReadonly"
                class="btn-primary"
                @click="insertSignature"
            >
                Insert Signature
            </button>
            <button
                type="button"
                :disabled="isDisabled || isReadonly"
                class="btn-secondary"
                @click="clearEditor"
            >
                Clear Editor
            </button>
        </div>

        <!-- Main Editor Component -->
        <Editor
            ref="editor"
            v-model="editorContent"
            :init="editorConfig"
            :disabled="isDisabled"
            :readonly="isReadonly"
            aria-label="Rich text editor"
            @mention-select="(e) => console.log('Mention added:', e.item)"
            @mention-remove="(e) => console.log('Mention removed:', e.item)"
            @image-remove="handleImageRemove"
            @template-insert="handleTemplateInsert"
        />
    </div>
</template>
```

---

## Step 9: Security & HTML Sanitization Best Practices

When persisting HTML generated by rich text editors:

1. **Server-Side Sanitization**: Always sanitize `editorContent` on the server before saving to the database using an HTML sanitizer library (e.g. `HTMLPurifier`). Browser-side sanitization is good defense-in-depth, but API endpoints must validate independently.
2. **Strict File Upload Rules**: Always enforce MIME types (`image/jpeg`, `image/png`, etc.) and maximum file sizes (e.g. `max:5120`) in Laravel Form Requests.
3. **Escape Replacements**: Always wrap merge tag values with `e()` during backend template replacement to prevent script injection.


