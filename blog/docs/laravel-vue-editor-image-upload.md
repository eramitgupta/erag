---
title: Rich Text Image Uploads With Laravel and Vue
headline: "Rich Text Image Uploads With Laravel and Vue: Upload, Paste, Resize and Delete"
description: Wire a Vue editor image upload to Laravel with a form request, public disk storage, progress reporting, CSRF-safe requests and safe server-side deletion.
date: 2026-09-29
package: text-editor-vue
category: Tutorial
tags: [laravel, vue, image-upload, inertia, rich-text-editor]
---

Someone pastes a screenshot into your editor and hits save. Depending on the editor, that screenshot is now either missing, a broken icon, or a multi-megabyte base64 string sitting in your `posts.body` column.

What you actually want is boring: the file goes to your storage disk, and the HTML keeps a normal URL. `@erag/text-editor-vue` never uploads anything on its own. File uploads happen only when you give it a handler or an endpoint. That means you decide the disk, the validation and the response.

This post builds a Vue editor image upload against Laravel, end to end: the controller, two ways to send the file, limits, and deleting images without breaking saved posts. If you haven't installed the editor yet, the [installation guide](https://erag.in/text-editor-vue/installation.html) takes a minute.

## How images get into the editor

The `image` toolbar control opens a small upload card at the cursor. From there a user can:

- choose or drop a file,
- paste an image from the clipboard (when `pasteImages` is on),
- or insert an image by URL.

Before any upload, the editor checks the MIME type against `acceptedFormats` and the size against `maxImageSize`. If your upload fails, the card stays visible with an error and no broken image is inserted. That last part is the one I care about most. A half-inserted image is worse than none.

Once inserted, clicking an image shows four corner handles for resizing (aspect ratio is kept), and the normal alignment buttons align the selected image.

## The Laravel side

Start with the backend, since both frontend options post to it. Make sure the public disk is linked:

```bash
php artisan storage:link
```

A form request holds the rules. Keep them in step with what you allow in the editor:

```php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEditorImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'file' => ['required', 'image', 'mimes:jpeg,png,webp,gif', 'max:5120'],
        ];
    }
}
```

The controller stores the file and returns its URL:

```php
namespace App\Http\Controllers;

use App\Http\Requests\StoreEditorImageRequest;
use Illuminate\Http\JsonResponse;

class EditorImageController extends Controller
{
    public function __invoke(StoreEditorImageRequest $request): JsonResponse
    {
        $path = $request->file('file')->storePublicly('editor-images', 'public');

        return response()->json([
            'url' => asset("storage/{$path}"),
        ]);
    }
}
```

And the routes, behind `auth`:

```php
use App\Http\Controllers\DeleteEditorImageController;
use App\Http\Controllers\EditorImageController;

Route::middleware('auth')->group(function () {
    Route::post('/editor-images', EditorImageController::class)->name('editor-images.store');
    Route::delete('/editor-images', DeleteEditorImageController::class)->name('editor-images.destroy');
});
```

We'll write the delete controller further down.

## Option 1: upload with Inertia's useHttp and progress

If your app runs Inertia v3 with Wayfinder, this is the approach the [Laravel integration guide](https://erag.in/text-editor-vue/laravel-integration.html) uses. The `imagesUploadHandler` receives a blob wrapper and a `progress` callback, and must return the final URL. Throwing keeps the image out of the document.

```vue
<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { useHttp } from '@inertiajs/vue3';
import { Editor, type EditorInit, type ImagesUploadHandler } from '@erag/text-editor-vue';
import EditorImageController from '@/actions/App/Http/Controllers/EditorImageController';

interface ImageUploadRequest {
    file: Blob | null;
}

interface ImageUploadResponse {
    url: string;
}

const body = shallowRef('');

const imageUpload = useHttp<ImageUploadRequest, ImageUploadResponse | undefined>({
    file: null,
});

const uploadEditorImage: ImagesUploadHandler = async (blobInfo, progress) => {
    const blob = blobInfo.blob();
    imageUpload.file =
        blob instanceof File ? blob : new File([blob], blobInfo.filename(), { type: blob.type });

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

const editorConfig = computed<EditorInit>(() => ({
    acceptedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxImageSize: 5 * 1024 * 1024,
    automaticUploads: true,
    pasteImages: true,
    imageDefaultWidth: 640,
    imagesUploadHandler: uploadEditorImage,
}));
</script>

<template>
    <Editor v-model="body" :init="editorConfig" />
</template>
```

Two things I like about this route. You get real upload progress, and `useHttp` sends the request the same way the rest of your Inertia app does, so CSRF is handled for you.

The blob wrapper (`ImageBlobInfo`) also exposes `name()`, `base64()` and a few others, but `blob()` and `filename()` are all you need here. A custom handler gets progress reporting but no abort signal, so if you need to cancel a slow upload, that's on your side.

## Option 2: the built-in URL uploader

If you're not on Inertia, or you'd rather not write a handler, give the editor an endpoint. It uses native Fetch with an `AbortController`:

```ts
import type { EditorInit } from '@erag/text-editor-vue';

function xsrfToken(): string {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);

    return match ? decodeURIComponent(match[1]) : '';
}

export const editorConfig: EditorInit = {
    imagesUploadUrl: '/editor-images',
    uploadFieldName: 'file',
    uploadCredentials: 'same-origin',
    uploadHeaders: {
        Accept: 'application/json',
        'X-XSRF-TOKEN': xsrfToken(),
    },
    resolveUploadedImageUrl: (response: unknown) => {
        const data = response as { url?: string };

        if (!data.url) {
            throw new Error('The upload response did not contain an image URL.');
        }

        return data.url;
    },
};
```

The `X-XSRF-TOKEN` header is the Laravel part. Routes in `web.php` are CSRF-protected, and Laravel accepts the value of its `XSRF-TOKEN` cookie in that header ([CSRF docs](https://laravel.com/docs/csrf#csrf-x-xsrf-token)). Without it you'll get a 419 and wonder why.

Don't set `Content-Type` yourself. The browser adds the multipart boundary, and a hand-written header breaks it. The trade-off with this option: Fetch doesn't expose upload progress, so the card shows an indeterminate loading state until the request finishes.

`uploadFieldName` defaults to `'file'`, which already matches the form request. I set it anyway so the link between the two is obvious to whoever reads the code next.

## Keep the client and server limits in sync

The editor's `acceptedFormats` and `maxImageSize` are there for user experience: a clear error before a 5 MB upload even starts. They don't protect anything. Anyone can post straight to `/editor-images`.

The form request is the real rule. Review the two together whenever one changes. If `maxImageSize` says 5 MB and the rule says `max:2048`, users see a confusing server error instead of the friendly one.

## Deleting images from storage

Select an image and the overlay shows a delete action. What happens next depends on your config:

- With no handler, only the HTML is removed. The file stays on disk.
- With `imagesDeleteHandler`, the editor waits for your callback. If it rejects, the image stays in the document.
- The `image-remove` event fires once, after a successful removal, with `src`, `alt`, `width` and `height`.

The delete controller in the docs is intentionally short. Before shipping it, I'd lock it down so a request can only delete files inside `editor-images/`:

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

        $path = Str::after($validated['src'], '/storage/');

        if (! Str::startsWith($path, 'editor-images/') || Str::contains($path, '..')) {
            abort(422, 'This image cannot be removed.');
        }

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }

        return response()->json(['message' => 'Image removed.']);
    }
}
```

That still lets any signed-in user delete any editor image if they know its URL. In a multi-user app, record each upload in a table with the uploader's ID and check ownership here. I've left it out to keep the example readable, not because it's optional.

### Should you delete on remove at all?

This trade-off is easy to miss. Deleting eagerly happens before the post is saved. Picture someone editing a published article: they remove an image, change their mind about the whole edit, and close the tab. The published article still has that `<img>`, and you've just deleted its file.

For new drafts, eager deletion is fine. For content that's already published, I prefer not to delete on remove. Instead, a scheduled cleanup job can compare files in `editor-images/` with the URLs that appear in saved content and remove the orphans. It's more work, but it can't break a live page.

## When you don't need uploads

If images are rare, turn off file uploads and keep URL insertion:

```ts
const editorConfig: EditorInit = {
    imageFilePicker: false,
    pasteImages: false,
    imageUrlInput: true,
};
```

If images don't belong in the content at all, leave `image` out of your toolbar string. No endpoint, no storage, nothing to clean up.

And if you store files on S3, the only change is in the controller: store to that disk and return `Storage::disk('s3')->url($path)` instead of the `asset()` URL.

## FAQ

### Can users paste screenshots?

Yes. With `pasteImages` and `automaticUploads` both true, pasted image files go through the same uploader as picked files. What the clipboard contains varies by browser.

### Why is my image smaller than the original?

`imageDefaultWidth` (640 by default) is the maximum initial width. The editor won't enlarge a smaller image past its natural size, and users can resize from the corners.

### Do I still need to sanitize the saved HTML?

Yes. Uploads cover the files, not the markup. The `src` of an image is user input like everything else in the body. See [storing rich text safely](./sanitize-rich-text-html-laravel.md).

## Where to go next

Wire the backend first and test it with a plain `curl` or a Pest test, then pick Option 1 if you're on Inertia or Option 2 if you're not. The [image upload docs](https://erag.in/text-editor-vue/image-upload.html) have the full option table, and [the Vue 3 editor tutorial](./vue-3-rich-text-editor.md) covers toolbars if you want to hide the image button on some screens.
