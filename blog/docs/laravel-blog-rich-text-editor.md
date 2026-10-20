---
title: Build a Laravel Blog With a Rich Text Editor
headline: "Build a Laravel Blog With Inertia and a Rich Text Editor"
description: A Laravel blog tutorial with a rich text editor in Inertia and Vue 3, covering posts, a Form Request, image uploads, HTML sanitizing and a public page.
date: 2026-10-20
package: text-editor-vue
category: Tutorial
tags: [laravel, inertia, vue, editor, tutorial]
image: /images/laravel-blog-rich-text-editor.jpg
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/laravel-blog-rich-text-editor.md
</div>

![Laravel blog post editor with a rich text toolbar built with Inertia and Vue 3](/images/laravel-blog-rich-text-editor.jpg)

To build a Laravel blog with a rich text editor, store each post's body as HTML in a `posts` table, write it with the `Editor` component from `@erag/text-editor-vue` bound to an Inertia form with `v-model`, and sanitize that HTML in a Form Request before you save it. Images go to your public disk through a small upload controller, and the public post page renders the clean HTML with `v-html`. This tutorial builds the whole thing in the Laravel 13 Vue starter kit with Inertia v3 and Wayfinder.

## The short version

1. Install the editor with `npm install @erag/text-editor-vue` and run `php artisan storage:link`.
2. Create a `Post` model with `title`, `slug`, `body` and `published_at`.
3. Add routes for writing posts (signed-in users), uploading editor images and reading posts in public.
4. Sanitize and validate the body in a `SavePostRequest` Form Request.
5. Build one Vue page with a title, a slug and the `Editor` component bound to `form.body`.
6. Give the editor an `imagesUploadHandler` that sends the file to Laravel and returns its URL.
7. Render the saved HTML on a public page with `v-html`.

## Step 1: Install the editor

```bash
npm install @erag/text-editor-vue
php artisan storage:link
```

The editor's only peer dependency is Vue 3.5 or newer, which the starter kit already has. `storage:link` makes files on the `public` disk reachable under `/storage`, which is where uploaded images will live.

You will also import the editor's stylesheet, `@erag/text-editor-vue/style.css`, in the page that uses it. It styles the toolbar, dialogs and image resize handles.

## Step 2: Create the posts table and model

```bash
php artisan make:model Post -mf
```

Fill in the migration:

```php
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('title');
    $table->string('slug')->unique();
    $table->longText('body');
    $table->timestamp('published_at')->nullable();
    $table->timestamps();
});
```

Use `longText` for the body. HTML with tables and images gets long quickly, and a plain `text` column caps out at 64 KB in MySQL.

The model follows the starter kit's `User` model and uses PHP attributes:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['title', 'slug', 'body', 'published_at'])]
class Post extends Model
{
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['published_at' => 'datetime'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

Add the other side of the relation to `app/Models/User.php`, then run `php artisan migrate`:

```php
use Illuminate\Database\Eloquent\Relations\HasMany;

public function posts(): HasMany
{
    return $this->hasMany(Post::class);
}
```

## Step 3: Add the routes

In `routes/web.php`:

```php
use App\Http\Controllers\BlogController;
use App\Http\Controllers\EditorImageController;
use App\Http\Controllers\PostController;

Route::get('blog/{post:slug}', [BlogController::class, 'show'])->name('blog.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('posts', PostController::class)->only(['create', 'store', 'edit', 'update']);
    Route::post('editor-images', EditorImageController::class)->name('editor-images.store');
});
```

Writing and uploading need a signed-in user. Reading does not. Wayfinder turns these routes into typed functions in `@/routes/posts`, `@/routes/blog` and `@/actions/...`. The Vite plugin regenerates them while `npm run dev` is running, or you can run `php artisan wayfinder:generate` once.

## Step 4: Sanitize and validate the post in a Form Request

```bash
php artisan make:request SavePostRequest
```

```php
<?php

namespace App\Http\Requests;

use App\Contracts\HtmlSanitizer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class SavePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        $post = $this->route('post');

        return $post === null || $post->user()->is($this->user());
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'alpha_dash', 'max:255', Rule::unique('posts')->ignore($this->route('post'))],
            'body' => ['required', 'string', 'max:200000'],
            'published_at' => ['nullable', 'date'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $slugSource = $this->filled('slug') ? $this->input('slug') : $this->input('title');

        $this->merge([
            'slug' => is_string($slugSource) ? Str::slug($slugSource) : null,
            'body' => is_string($this->input('body'))
                ? app(HtmlSanitizer::class)->sanitize($this->input('body'))
                : null,
        ]);
    }
}
```

Three things happen here. An empty slug is built from the title. The body is cleaned **before** validation, so a body made only of `<script>` tags becomes empty and fails `required`. And the `max` rule stops someone from posting a 50 MB string.

Why sanitize on the server when the editor already has a sanitizer? The editor's built-in sanitizer runs in the browser. The [security docs](https://erag.in/text-editor-vue/security.html) are clear that it is defense in depth, not a boundary. Anyone can skip your page and send a request straight to `/posts`.

`HtmlSanitizer` is a small interface of your own:

```php
<?php

namespace App\Contracts;

interface HtmlSanitizer
{
    public function sanitize(string $html): string;
}
```

Bind a maintained HTML sanitizer library behind it, set up with an allow-list of the tags your toolbar actually produces. The guide on [storing rich text safely](./sanitize-rich-text-html-laravel.md) walks through the allow-list, the binding and the tests, so I won't repeat them here.

## Step 5: Write the controllers

`PostController` handles writing. Create and edit share one Vue page, `posts/Write`:

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\SavePostRequest;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('posts/Write', ['post' => null]);
    }

    public function store(SavePostRequest $request): RedirectResponse
    {
        $post = $request->user()->posts()->create($request->validated());

        return to_route('posts.edit', $post);
    }

    public function edit(Request $request, Post $post): Response
    {
        abort_unless($post->user()->is($request->user()), 403);

        return Inertia::render('posts/Write', [
            'post' => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'body' => $post->body,
                'published_at' => $post->published_at?->format('Y-m-d\TH:i'),
            ],
        ]);
    }

    public function update(SavePostRequest $request, Post $post): RedirectResponse
    {
        $post->update($request->validated());

        return to_route('posts.edit', $post);
    }
}
```

`BlogController` is the public side. It returns a 404 for drafts and for posts scheduled in the future:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function show(Post $post): Response
    {
        abort_unless($post->published_at?->isPast(), 404);

        return Inertia::render('blog/Show', [
            'post' => [
                'title' => $post->title,
                'body' => $post->body,
                'author' => $post->user->name,
                'published_at' => $post->published_at->toFormattedDateString(),
            ],
        ]);
    }
}
```

A `/blog` index page is one more route and method: query posts whose `published_at` has passed and link to each one with `show(post.slug)` from `@/routes/blog`.

## Step 6: Handle image uploads inside the editor

The editor never uploads files on its own. It only uploads when you give it an `imagesUploadHandler` or an `imagesUploadUrl`. Your handler gets the image, sends it to Laravel and returns the final URL. That URL is what ends up in the `<img>` tag, so your `body` column holds short links to files on your own disk.

The backend comes straight from the [Laravel integration guide](https://erag.in/text-editor-vue/laravel-integration.html). A Form Request with the file rules:

```php
<?php

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

`authorize()` can return `true` here because the route already sits behind `auth`. The controller stores the file and returns its URL:

```php
<?php

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

The frontend handler lives in the page you build next.

## Step 7: Build the write page with v-model

Create `resources/js/pages/posts/Write.vue`. The form uses Inertia's `useForm`, the body is bound to the editor with `v-model`, and image uploads go through Inertia v3's `useHttp`:

```vue
<script setup lang="ts">
import { Editor } from '@erag/text-editor-vue';
import type { EditorInit, ImagesUploadHandler } from '@erag/text-editor-vue';
import '@erag/text-editor-vue/style.css';
import { Head, useForm, useHttp } from '@inertiajs/vue3';
import EditorImageController from '@/actions/App/Http/Controllers/EditorImageController';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store, update } from '@/routes/posts';

interface Post {
    id: number;
    title: string;
    slug: string;
    body: string;
    published_at: string | null;
}

interface ImageUploadRequest {
    file: Blob | null;
}

interface ImageUploadResponse {
    url: string;
}

const props = defineProps<{ post: Post | null }>();

const form = useForm({
    title: props.post?.title ?? '',
    slug: props.post?.slug ?? '',
    body: props.post?.body ?? '',
    published_at: props.post?.published_at ?? '',
});

const imageUpload = useHttp<ImageUploadRequest, ImageUploadResponse | undefined>({
    file: null,
});

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

const editorConfig: EditorInit = {
    height: 520,
    minHeight: 320,
    menubar: false,
    placeholder: 'Write your post...',
    toolbar:
        'undo redo | blocks | bold italic underline strikethrough | ' +
        'bullist numlist | link image table | hr removeformat | code preview fullscreen',
    acceptedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxImageSize: 5 * 1024 * 1024,
    automaticUploads: true,
    pasteImages: true,
    imagesUploadHandler: uploadEditorImage,
};

function submit(): void {
    form.submit(props.post ? update(props.post.id) : store(), { preserveScroll: true });
}
</script>

<template>
    <Head :title="post ? 'Edit post' : 'New post'" />

    <form class="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4" @submit.prevent="submit">
        <div class="grid gap-2">
            <Label for="title">Title</Label>
            <Input id="title" v-model="form.title" required />
            <InputError :message="form.errors.title" />
        </div>

        <div class="grid gap-2">
            <Label for="slug">Slug</Label>
            <Input id="slug" v-model="form.slug" placeholder="Leave empty to use the title" />
            <InputError :message="form.errors.slug" />
        </div>

        <div class="grid gap-2">
            <Label for="body">Body</Label>
            <Editor
                id="body"
                v-model="form.body"
                :init="editorConfig"
                :disabled="form.processing"
                aria-label="Post body"
            />
            <InputError :message="form.errors.body" />
        </div>

        <div class="grid gap-2">
            <Label for="published_at">Publish at (leave empty for a draft)</Label>
            <Input id="published_at" v-model="form.published_at" type="datetime-local" />
            <InputError :message="form.errors.published_at" />
        </div>

        <Button type="submit" class="self-start" :disabled="form.processing">
            {{ post ? 'Save changes' : 'Create post' }}
        </Button>
    </form>
</template>
```

A few details worth knowing:

- **`v-model` is all the editor needs.** It emits `update:modelValue` only when the HTML really changes, so the form only updates when the content does.
- **`id="body"`** goes on the editable area, so the `Label` points at the right element.
- **`:disabled="form.processing"`** locks the toolbar and canvas while the post is saving.
- **The upload handler** reports real progress through `onProgress`. If it throws, the image stays out of the document and the upload card shows an error, so a failed upload never leaves a broken image behind.
- **Before any upload**, the editor checks `acceptedFormats` and `maxImageSize`. Those match the `mimes` and `max:5120` rules on the server. Keep the two in step.

The toolbar string lists only what a blog post needs. Every name in it is a documented toolbar item. The guide to [toolbar UX in the Vue editor](./text-editor-vue-toolbar-ux.md) covers how to pick a toolbar for each screen.

## Step 8: Show the post safely with v-html

The starter kit picks a layout per page in `resources/js/app.ts`. Public blog pages shouldn't get the signed-in app sidebar, so give them no layout, the same as the welcome page:

```ts
layout: (name) => {
    switch (true) {
        case name === 'Welcome':
        case name.startsWith('blog/'):
            return null;
        // ...keep the starter kit's other cases
    }
},
```

Then create `resources/js/pages/blog/Show.vue`:

```vue
<script setup lang="ts">
import { Head } from '@inertiajs/vue3';

defineProps<{
    post: {
        title: string;
        body: string;
        author: string;
        published_at: string;
    };
}>();
</script>

<template>
    <Head :title="post.title" />

    <article class="mx-auto max-w-3xl px-4 py-12">
        <h1 class="text-3xl font-semibold">{{ post.title }}</h1>
        <p class="mt-2 text-sm text-muted-foreground">{{ post.author }} · {{ post.published_at }}</p>

        <!-- The body was sanitized by SavePostRequest before it was saved. -->
        <div class="post-body mt-8" v-html="post.body" />
    </article>
</template>

<style scoped>
.post-body :deep(h2) { margin-top: 2rem; font-size: 1.5rem; font-weight: 600; }
.post-body :deep(p) { margin-top: 1rem; line-height: 1.75; }
.post-body :deep(ul),
.post-body :deep(ol) { margin-top: 1rem; padding-left: 1.5rem; list-style: revert; }
.post-body :deep(img) { max-width: 100%; height: auto; }
</style>
```

`v-html` inserts the string as real HTML with no escaping. That is exactly why the body is sanitized on the way in: every row in `posts.body` is already clean, so every page that shows it is safe by default. The title and author still use normal text interpolation, which Vue escapes.

The `:deep()` selectors matter. Vue's scoped styles don't reach content inserted with `v-html`, and Tailwind's base styles remove list bullets and heading sizes.

## Step 9: Test it with Pest

```php
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

it('creates a post with a slug and a sanitized body', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('posts.store'), [
            'title' => 'My First Post',
            'slug' => '',
            'body' => '<p>Hello</p><script>alert(1)</script>',
        ])
        ->assertRedirect();

    $post = $user->posts()->sole();

    expect($post->slug)->toBe('my-first-post')
        ->and($post->body)->not->toContain('<script');
});

it('uploads editor images to the public disk', function () {
    Storage::fake('public');

    $this->actingAs(User::factory()->create())
        ->postJson(route('editor-images.store'), [
            'file' => UploadedFile::fake()->image('photo.jpg'),
        ])
        ->assertOk()
        ->assertJsonStructure(['url']);

    expect(Storage::disk('public')->allFiles('editor-images'))->toHaveCount(1);
});
```

The first test proves the slug and the sanitizer run. The second proves uploads land on the right disk and return the `url` key the handler expects.

## Common problems and fixes

### Uploaded images show as broken

The file was saved, but `/storage` doesn't point to it. Run `php artisan storage:link`, and remember to run it on your server after deploying.

### Big images fail with a server error instead of a friendly message

PHP rejects the request before Laravel sees it. Make sure `upload_max_filesize` and `post_max_size` in `php.ini` are larger than 5 MB, so the editor's `maxImageSize` and the `max:5120` rule decide instead.

### The editor has no toolbar styling

The stylesheet isn't loaded. Add `import '@erag/text-editor-vue/style.css'` to the page, or once in `resources/js/app.ts`.

### Lists and headings look flat on the public page

The editor's list and heading styles are scoped to `.erag-editor`, so they don't apply on your public page. Style the article yourself with `:deep()`, as in Step 8.

### The body is empty after saving, or "The body field is required"

Your sanitizer's allow-list is removing tags the editor produces. Click the `code` button in the toolbar to open the source view, check which tags and attributes your content uses, and allow those.

### The public post page shows the app sidebar

The `blog/` case is missing from the layout callback in `resources/js/app.ts`.

## Frequently asked questions

### How do I add a rich text editor to a Laravel app?

Install `@erag/text-editor-vue`, import its stylesheet, and bind the `Editor` component to an Inertia form field with `v-model`. The field holds an HTML string that you post to Laravel like any other input.

### Should I store rich text as HTML in Laravel?

Yes, for a blog. The editor gives you HTML, and you render HTML, so storing it in a `longText` column keeps things simple. Sanitize it once before saving and every page that reads it stays safe.

### Is it safe to use v-html for blog posts in Vue?

Only for HTML you have sanitized on the server. `v-html` doesn't escape anything, so never use it on raw user input. Keep using normal text output for titles, names and excerpts.

### How do I upload images in a Laravel WYSIWYG editor?

Set `imagesUploadHandler` in the editor's `init` config. The handler posts the file to a Laravel route, the controller stores it on the `public` disk and returns `{ "url": "..." }`, and the handler returns that URL to the editor.

### What happens to uploaded images when I remove them from a post?

By default, removing an image only changes the HTML and the file stays on disk. The editor supports an `imagesDeleteHandler` for deleting files, but deleting right away can break posts that are already published. The [Vue image upload guide](./laravel-vue-editor-image-upload.md) covers both choices.

### Does the editor work with Inertia SSR?

The docs say the component is SSR-safe during setup. Its browser sanitizer can't run on the server, which is one more reason to sanitize in Laravel.

### Can I use the same editor for comments?

Yes. Pass a smaller `init`, for example `menubar: false`, `statusbar: false` and a toolbar like `'bold italic | bullist numlist | link'`. The [Vue 3 editor introduction](./vue-3-rich-text-editor.md) shows more presets.

## Start your Laravel blog

```bash
npm install @erag/text-editor-vue
php artisan storage:link
```

- **Documentation:** [Laravel and Inertia integration](https://erag.in/text-editor-vue/laravel-integration.html), [image uploads](https://erag.in/text-editor-vue/image-upload.html) and [configuration](https://erag.in/text-editor-vue/configuration.html)
- **GitHub:** [eramitgupta/text-editor-vue](https://github.com/eramitgupta/text-editor-vue)
- **Next step:** lock down your HTML with [storing rich text safely](./sanitize-rich-text-html-laravel.md).
