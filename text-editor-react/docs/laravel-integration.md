---
title: "Laravel and Inertia.js v3 Integration"
description: "Integrate @erag/text-editor-react with Laravel and Inertia.js v3 (React), useForm, useHttp, Wayfinder, image uploads, merge tags, and templates."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/text-editor-react/docs/laravel-integration.md
</div>


# Laravel & Inertia.js v3 Integration Guide

This guide walks you through integrating `@erag/text-editor-react` into a Laravel + Inertia.js v3 (React) application step by step.

---

## Overview of Steps

1. **Step 1: Install Package & Import Styles**
2. **Step 2: Initialize React State & Editor Ref (`useForm` + `useRef`)**
3. **Step 3: Setup Frontend Image Upload & Removal Handlers (`useHttp` + Wayfinder)**
4. **Step 4: Create Backend Image Controllers (Upload & Delete)**
5. **Step 5: Setup Merge Tags & Template Replacement (Frontend)**
6. **Step 6: Create Backend Merge Tag Controller**
7. **Step 7: Assemble the Editor Config (`EditorInit`)**
8. **Step 8: Render the Editor Component in Your Inertia Page**
9. **Step 9: Security & HTML Sanitization Best Practices**

---

## Step 1: Install Package & Import Styles

First, install the editor package in your project (`react` and `react-dom` 18 or newer are peer dependencies and are already present in an Inertia React app):

```bash
npm install @erag/text-editor-react
```

Import the editor styles once in your Inertia entry point, `resources/js/app.tsx` (or in the page component that renders the editor):

```tsx
// resources/js/app.tsx
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

// Import default editor CSS (required for toolbar, dialogs, mentions, and chips)
import '@erag/text-editor-react/style.css';

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });
        return pages[`./pages/${name}.tsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
```

---

## Step 2: Initialize React State & Editor Ref (`useForm` + `useRef`)

Create an Inertia page such as `resources/js/pages/editor-demo.tsx`. Keep the HTML content in an Inertia `useForm` object so it can be posted to Laravel, and use a React ref to call programmatic methods like `focus()`, `insertHtml()`, and `clear()`.

```tsx
// resources/js/pages/editor-demo.tsx
import { useRef, useState, type FormEvent } from 'react';
import { useForm, useHttp } from '@inertiajs/react';
import { Editor } from '@erag/text-editor-react';
import type { EditorInit, EditorInstance } from '@erag/text-editor-react';

export default function EditorDemo() {
    // 1. Form state for editor content (posted to Laravel in Step 8)
    const { data, setData, post, processing, errors } = useForm({
        content: '<h2>Welcome to Text Editor 🎉</h2>',
    });
    const [isDisabled, setIsDisabled] = useState(false);
    const [isReadonly, setIsReadonly] = useState(false);

    // 2. Ref to call methods on the editor instance directly
    const editor = useRef<EditorInstance>(null);

    // Programmatic helper actions
    function insertSignature(): void {
        editor.current?.focus();
        editor.current?.insertHtml('<p>Best regards,<br><strong>Team</strong></p>');
    }

    function clearEditor(): void {
        editor.current?.clear();
    }

    // Step 3, Step 5 and Step 7 code goes here, inside the component.

    // Step 8: return the page markup.
}
```

The code in Steps 3, 5, 7, and 8 lives inside this component body, because hooks such as `useHttp` must be called at the top level of a React component.

---

## Step 3: Setup Frontend Image Upload & Removal Handlers (`useHttp` + Wayfinder)

Use Inertia v3's `useHttp` hook alongside Wayfinder's typed routes (`EditorImageController()` & `DeleteEditorImageController()`) to handle uploading and deleting image files:

```tsx
import EditorImageController from '@/actions/App/Http/Controllers/EditorImageController';
import DeleteEditorImageController from '@/actions/App/Http/Controllers/DeleteEditorImageController';
import type {
    ImageDeleteInfo,
    ImagesUploadHandler,
} from '@erag/text-editor-react';

interface ImageUploadRequest {
    file: Blob | null;
}

interface ImageUploadResponse {
    url: string;
}

// Inside the EditorDemo component:

// 1. HTTP helper for image upload
const imageUpload = useHttp<
    ImageUploadRequest,
    ImageUploadResponse | undefined
>({
    file: null,
});

// 2. HTTP helper for image deletion
const imageDelete = useHttp({ src: '' });

// 3. Upload handler for dropped/pasted/selected images
const uploadEditorImage: ImagesUploadHandler = async (blobInfo, progress) => {
    const blob = blobInfo.blob();
    imageUpload.setData(
        'file',
        blob instanceof File
            ? blob
            : new File([blob], blobInfo.filename(), { type: blob.type }),
    );

    try {
        const response = await imageUpload.submit(EditorImageController(), {
            onProgress: (uploadProgress) => {
                progress(uploadProgress.percentage ?? 0);
            },
        });

        if (!response?.url) {
            throw new Error(
                'The image upload response did not return a valid URL.',
            );
        }

        progress(100);
        return response.url;
    } finally {
        imageUpload.setData('file', null);
        imageUpload.setDefaults({ file: null });
    }
};

// 4. Removal handler triggered when user deletes an image (onImageRemove)
async function handleImageRemove(event: ImageDeleteInfo): Promise<void> {
    if (!event.src) return;

    try {
        imageDelete.setData('src', event.src);
        await imageDelete.submit(DeleteEditorImageController());
        console.log('Image deleted from server storage:', event.src);
    } catch (error) {
        console.error('Failed to delete image from server:', error);
    }
}
```

`setData` on a `useHttp` instance is applied immediately to the data that the next `submit()` sends, so the file and `src` values are included in the request made right after it.

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

```tsx
import ReplaceEditorMergeTagsController from '@/actions/App/Http/Controllers/ReplaceEditorMergeTagsController';
import type { TemplateInsertEvent } from '@erag/text-editor-react';

interface MergeTagReplacementRequest {
    content: string;
    merge_tags: { tag: string; value: string }[];
}

interface MergeTagReplacementResponse {
    html: string;
}

// Inside the EditorDemo component:
const mergeTagHttp = useHttp<
    MergeTagReplacementRequest,
    MergeTagReplacementResponse | undefined
>({ content: '', merge_tags: [] });

async function handleTemplateInsert(event: TemplateInsertEvent): Promise<void> {
    const originalContent = editor.current?.getHtml() ?? data.content;

    try {
        mergeTagHttp.setData({
            content: originalContent,
            merge_tags: [
                { tag: 'client.name', value: 'Olivia Bennett' },
                { tag: 'proposal.number', value: 'PROP-2026-001' },
            ],
        });

        const response = await mergeTagHttp.submit(
            ReplaceEditorMergeTagsController(),
        );

        if (response?.html) {
            // Only apply the replacement if the user has not edited the content meanwhile
            setData((current) =>
                current.content === originalContent
                    ? { ...current, content: response.html }
                    : current,
            );
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

## Step 7: Assemble the Editor Config (`EditorInit`)

Define the full configuration object combining toolbar items, mention items, merge tags, templates, and the image upload handler. Static lists can live outside the component; the config itself is built inside the component so it can reference `uploadEditorImage`. Recreating the object on every render is fine: the editor compares configuration structurally and always calls the latest handler functions.

```tsx
import type { MentionItem, MergeTagItem } from '@erag/text-editor-react';

// Outside the component:
const mentionItems: MentionItem[] = [
    {
        id: 1,
        label: 'Damon Cross',
        description: 'Backend Developer',
        value: 'damon@example.com',
    },
    {
        id: 2,
        label: 'Ava Mitchell',
        description: 'Product Designer',
        value: 'ava@example.com',
    },
];

const mergeTagItems: MergeTagItem[] = [
    { name: 'Client name', value: 'client.name', group: 'Client' },
    { name: 'Proposal number', value: 'proposal.number', group: 'Proposal' },
];

// Inside the EditorDemo component:
const editorConfig: EditorInit = {
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
                label: 'Welcome Email',
                description: 'Onboarding template',
                content: '<p>Dear {{ client.name }}, welcome!</p>',
            },
        ],
    },
    toolbar:
        'undo redo | blocks fontfamily fontsize lineheight | ' +
        'bold italic underline strikethrough | ' +
        'forecolor backcolor | alignment | ' +
        'bullist numlist checklist outdent indent | link image media table | ' +
        'hr removeformat | code preview fullscreen',
};
```

---

## Step 8: Render the Editor Component in Your Inertia Page

Return the markup from the `EditorDemo` component. The editor is a controlled component: `value` reads from the form data and `onChange` writes back with `setData`. Submitting posts the HTML to your own Laravel route (replace `/posts` with your store route or its Wayfinder action):

```tsx
function save(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    post('/posts');
}

return (
    <form className="space-y-4 p-4" onSubmit={save}>
        {/* Control buttons */}
        <div className="flex gap-2">
            <button
                type="button"
                disabled={isDisabled || isReadonly}
                className="btn-primary"
                onClick={insertSignature}
            >
                Insert Signature
            </button>
            <button
                type="button"
                disabled={isDisabled || isReadonly}
                className="btn-secondary"
                onClick={clearEditor}
            >
                Clear Editor
            </button>
        </div>

        {/* Main Editor Component */}
        <Editor
            ref={editor}
            value={data.content}
            onChange={(value) => setData('content', value)}
            init={editorConfig}
            disabled={isDisabled}
            readOnly={isReadonly}
            ariaLabel="Rich text editor"
            onMentionSelect={(e) => console.log('Mention added:', e.item)}
            onMentionRemove={(e) => console.log('Mention removed:', e.item)}
            onImageRemove={handleImageRemove}
            onTemplateInsert={handleTemplateInsert}
        />
        {errors.content && <p className="text-sm text-red-600">{errors.content}</p>}

        <button type="submit" className="btn-primary" disabled={processing}>
            {processing ? 'Saving...' : 'Save'}
        </button>
    </form>
);
```

---

## Step 9: Security & HTML Sanitization Best Practices

When persisting HTML generated by rich text editors:

1. **Server-Side Sanitization**: Always sanitize the submitted `content` on the server before saving to the database using an HTML sanitizer library (e.g. `HTMLPurifier`). Browser-side sanitization is good defense-in-depth, but API endpoints must validate independently.
2. **Strict File Upload Rules**: Always enforce MIME types (`image/jpeg`, `image/png`, etc.) and maximum file sizes (e.g. `max:5120`) in Laravel Form Requests.
3. **Escape Replacements**: Always wrap merge tag values with `e()` during backend template replacement to prevent script injection.
