---
title: Laravel Inertia CRUD Tutorial With Toasts
headline: "Laravel Inertia CRUD Tutorial: Create, Edit and Delete With Toast Notifications"
description: Build a Laravel Inertia CRUD with Laravel 13, Inertia v3 and Vue 3. Create, edit, delete and paginate posts, with toast messages and a delete confirm.
date: 2026-10-20
package: laravel-inertia-toast
category: Tutorial
tags: [laravel, inertia, vue, crud, notifications]
image: /images/laravel-inertia-crud-toast-notifications.jpg
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/laravel-inertia-crud-toast-notifications.md
</div>

![Laravel Inertia CRUD app showing a posts list, an edit form and a success toast](/images/laravel-inertia-crud-toast-notifications.jpg)

A Laravel Inertia CRUD needs five pieces: a model with a migration, resource routes, Form Requests for validation, a controller that returns Inertia pages and redirects, and Vue pages for the list, create and edit screens. This tutorial builds all five for a `Post` resource on Laravel 13, Inertia v3 and Vue 3. It uses [Laravel Inertia Toast](https://erag.in/laravel-inertia-toast/) so every create, update and delete ends with a clear toast message, and every delete asks "Are you sure?" first.

## The short version

1. Install the toast package: `composer require erag/laravel-inertia-toast`, then `npm install ./vendor/erag/laravel-inertia-toast/vue`.
2. Register `ToastPlugin` in `resources/js/app.ts`.
3. Generate the model, migration, factory, controller and Form Requests with one Artisan command.
4. Add `Route::resource('posts', PostController::class)->except('show')`.
5. Call `toast()` before each redirect in `store`, `update` and `destroy`.
6. Build `Index.vue`, `Create.vue` and `Edit.vue` in `resources/js/pages/posts` with Inertia's `Form` component and Wayfinder routes.
7. Ask before deleting with `useConfirmation()`.

I'm using the official Laravel Vue starter kit (Laravel 13, Inertia v3, Wayfinder and Fortify login). If your app started somewhere else, the Laravel half is the same and only a few import paths change.

## What you will build

- A list of posts at `/posts`, ten per page, with Previous and Next links
- Create and edit pages that show validation errors under each field
- A toast after every create, update and delete
- An info toast when someone saves the edit form without changing anything
- A styled "Delete this post?" dialog before anything is removed
- An error toast when the delete request can't reach the server
- Two Pest tests that prove the toasts are sent

## Step 1: Install Laravel Inertia Toast

```bash
composer require erag/laravel-inertia-toast
npm install ./vendor/erag/laravel-inertia-toast/vue
```

The Laravel package registers itself through package discovery and adds its own middleware, so there is nothing to put in `bootstrap/app.php`. The Vue package ships inside the Composer package, which is why the npm path points into `vendor`. Run Composer first, or that folder won't exist yet.

## Step 2: Register the toast plugin in app.ts

The starter kit's `resources/js/app.ts` has no `setup()` function, because Inertia v3's Vite plugin resolves and mounts your pages for you. To add a Vue plugin, use the `withApp` callback:

```ts
import { createInertiaApp } from '@inertiajs/vue3';
import ToastPlugin from '@erag/inertia-toast-vue';
import '@erag/inertia-toast-vue/style.css';
// ...keep the starter kit's other imports

createInertiaApp({
    // ...keep title, layout and progress as they are
    withApp(app, { ssr }) {
        if (ssr) {
            return;
        }

        app.use(ToastPlugin, {
            position: 'top-right',
        });
    },
});
```

Why the `ssr` check? Inertia v3 can render pages on the server, and `withApp` runs there too. The plugin adds its toast area and dialog straight to `document.body`, and there is no `document` on the server. Toasts only matter in the browser, so skipping the plugin on the server is safe.

The plugin mounts three things for you: `ToastContainer`, `ConfirmationBox` and `FlashToastBridge`. The bridge is the important one for CRUD. It reads `props.toast` after every Inertia visit, so a toast you flash before a redirect appears on the next page with no code in your layout. The [Laravel Inertia toast setup guide](./laravel-inertia-toast-notifications.md) covers React and older entry files.

## Step 3: Create the Post model, migration and factory

```bash
php artisan make:model Post --migration --factory --controller --resource --requests
```

That one command creates the model, a migration, a factory, a resource controller and two Form Requests, `StorePostRequest` and `UpdatePostRequest`. Fill in the migration:

```php
public function up(): void
{
    Schema::create('posts', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('body');
        $table->timestamps();
    });
}
```

Laravel 13 lets you list fillable columns with a PHP attribute, the same way the starter kit's `User` model does. Here is `app/Models/Post.php`:

```php
<?php

namespace App\Models;

use Database\Factories\PostFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title', 'body'])]
class Post extends Model
{
    /** @use HasFactory<PostFactory> */
    use HasFactory;
}
```

Give the factory some fake data so you can test pagination:

```php
public function definition(): array
{
    return [
        'title' => fake()->sentence(),
        'body' => fake()->paragraphs(3, true),
    ];
}
```

```bash
php artisan migrate
php artisan tinker --execute 'App\Models\Post::factory()->count(25)->create();'
```

Twenty-five posts give you three pages to click through.

## Step 4: Add the resource routes

In `routes/web.php`, add one line inside the starter kit's existing `auth` group:

```php
use App\Http\Controllers\PostController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');

    Route::resource('posts', PostController::class)->except('show');
});
```

`Route::resource()` registers the routes `posts.index`, `posts.create`, `posts.store`, `posts.edit`, `posts.update` and `posts.destroy`. We skip `show` because the edit page is enough here, so delete the generated `show()` method too.

Wayfinder turns these routes into TypeScript functions in `@/routes/posts` and `@/actions/App/Http/Controllers/PostController`. The starter kit's Vite plugin regenerates them while `npm run dev` is running. If it isn't running, use `php artisan wayfinder:generate`.

## Step 5: Validate input with Form Requests

Generated Form Requests start with `authorize()` returning `false`, which blocks every request with a 403. Change it and add your rules in `app/Http/Requests/StorePostRequest.php`:

```php
<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:10000'],
        ];
    }
}
```

Give `UpdatePostRequest` the same two methods. Returning `true` lets any logged-in user manage every post, which suits a single-admin blog. If posts belong to users, write a policy and return `$this->user()->can('update', $this->route('post'))` instead.

When validation fails, Laravel redirects back and Inertia passes the messages to the page as `errors`. You'll show those under each field, not in a toast.

## Step 6: Write the controller and send toasts

Here is the full `app/Http/Controllers/PostController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('posts/Index', [
            'posts' => Post::query()
                ->select(['id', 'title', 'created_at'])
                ->latest()
                ->paginate(10)
                ->withQueryString(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('posts/Create');
    }

    public function store(StorePostRequest $request): RedirectResponse
    {
        Post::create($request->validated());

        toast('Your new post is saved.', 'success', 'Post created');

        return to_route('posts.index');
    }

    public function edit(Post $post): Response
    {
        return Inertia::render('posts/Edit', [
            'post' => $post->only(['id', 'title', 'body']),
        ]);
    }

    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        $post->fill($request->validated());

        if (! $post->isDirty()) {
            toast('You did not change anything.', 'info', 'No changes');

            return back();
        }

        $post->save();

        toast('Your changes are saved.', 'success', 'Post updated');

        return to_route('posts.index');
    }

    public function destroy(Post $post): RedirectResponse
    {
        try {
            $post->delete();
        } catch (QueryException $exception) {
            report($exception);

            toast('This post could not be deleted. Please try again.', 'error', 'Delete failed', 6000);

            return back();
        }

        toast('The post was deleted.', 'success', 'Post deleted');

        return to_route('posts.index');
    }
}
```

A few things worth knowing:

- **The `toast()` signature** is `toast($message, $type = 'success', $title = null, $duration = 3000, $position = null)`. The type is `success`, `error`, `warning` or `info`, and the duration is in milliseconds.
- **Always pass a title.** If you leave it out, the Vue bridge uses the type as the heading, so the toast says "success" in lowercase.
- **Call `toast()` right before a redirect.** It flashes the payload into the session, and the next Inertia page receives it as `props.toast`.
- **The "No changes" check** uses `isDirty()` after `fill()`. It answers the user's real question: did my click do anything?
- **The `QueryException` catch** matters once posts have related rows. If you later add comments with a foreign key, the database may refuse the delete. The user sees a clear error toast for six seconds instead of an error page, and `report()` still logs the problem for you.
- **`only()` on the edit page** sends just the three fields the form needs, not every column.

## Step 7: Build the posts list with pagination and delete

Create `resources/js/pages/posts/Index.vue`. The starter kit applies `AppLayout` to it automatically:

```vue
<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import { useConfirmation, useToast } from '@erag/inertia-toast-vue';
import { Button } from '@/components/ui/button';
import { create, destroy, edit, index } from '@/routes/posts';

type Post = {
    id: number;
    title: string;
    created_at: string;
};

type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

defineProps<{
    posts: Paginated<Post>;
}>();

defineOptions({
    layout: {
        breadcrumbs: [{ title: 'Posts', href: index() }],
    },
});

const { confirm } = useConfirmation();
const toast = useToast();

const deletePost = async (post: Post) => {
    const accepted = await confirm({
        title: 'Delete this post?',
        message: `"${post.title}" will be removed for good.`,
        confirmText: 'Delete',
        cancelText: 'Keep it',
        type: 'danger',
    });

    if (!accepted) {
        return;
    }

    router.delete(destroy(post.id), {
        preserveScroll: true,
        onNetworkError: () => {
            toast.error('Check your connection and try again.', 'Could not delete');
        },
    });
};
</script>

<template>
    <Head title="Posts" />

    <div class="space-y-6 p-4">
        <div class="flex items-center justify-between">
            <h1 class="text-xl font-semibold">Posts</h1>
            <Button as-child>
                <Link :href="create()">New post</Link>
            </Button>
        </div>

        <p v-if="posts.data.length === 0" class="text-sm text-muted-foreground">
            No posts yet. Create your first one.
        </p>

        <ul v-else class="divide-y rounded-lg border">
            <li
                v-for="post in posts.data"
                :key="post.id"
                class="flex items-center justify-between gap-4 p-4"
            >
                <Link :href="edit(post.id)" class="font-medium hover:underline">
                    {{ post.title }}
                </Link>
                <Button variant="destructive" size="sm" @click="deletePost(post)">
                    Delete
                </Button>
            </li>
        </ul>

        <nav v-if="posts.last_page > 1" class="flex items-center justify-between text-sm">
            <Link v-if="posts.prev_page_url" :href="posts.prev_page_url">Previous</Link>
            <span v-else />
            <span>Page {{ posts.current_page }} of {{ posts.last_page }}</span>
            <Link v-if="posts.next_page_url" :href="posts.next_page_url">Next</Link>
            <span v-else />
        </nav>
    </div>
</template>
```

Laravel's paginator arrives as one object with `data`, `current_page`, `last_page`, `prev_page_url`, `next_page_url` and a few more keys. Plain Previous and Next links are the simplest way to use it.

Here is what happens when someone clicks Delete:

1. `confirm()` opens the dialog and the function waits at `await`.
2. **Keep it** resolves `false`, so the function stops. Nothing is sent.
3. **Delete** resolves `true`, and `router.delete()` sends the request using the Wayfinder route.
4. The controller deletes the post, flashes "Post deleted" and redirects. The bridge shows the toast.
5. If the request never reaches the server, `onNetworkError` shows an error toast from the browser with `useToast()`.

So the server reports what happened on the server, and the browser reports what happened in the browser. The [confirmation dialog guide](./confirmation-dialogs-laravel-inertia.md) goes deeper into dialog types and the React version.

## Step 8: Build the create page with the Form component

Create `resources/js/pages/posts/Create.vue`. It follows the same pattern as the starter kit's profile settings page:

```vue
<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import PostController from '@/actions/App/Http/Controllers/PostController';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { create, index } from '@/routes/posts';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Posts', href: index() },
            { title: 'New post', href: create() },
        ],
    },
});
</script>

<template>
    <Head title="New post" />

    <Form
        v-bind="PostController.store.form()"
        class="max-w-2xl space-y-6 p-4"
        v-slot="{ errors, processing }"
    >
        <div class="grid gap-2">
            <Label for="title">Title</Label>
            <Input id="title" name="title" />
            <InputError :message="errors.title" />
        </div>

        <div class="grid gap-2">
            <Label for="body">Body</Label>
            <textarea
                id="body"
                name="body"
                rows="8"
                class="rounded-md border bg-transparent px-3 py-2 text-sm"
            />
            <InputError :message="errors.body" />
        </div>

        <Button :disabled="processing">Create post</Button>
    </Form>
</template>
```

`PostController.store.form()` gives the `Form` component the right URL and method. The component reads each field by its `name`, sends the request, and hands you `errors` and `processing`. There's no `useForm()` state to declare for a simple form like this.

Notice there is no toast for validation errors. The user is looking at the form, so the message belongs right under the field. [Toast notification UX best practices](./toast-notification-ux-best-practices.md) explains why.

## Step 9: Build the edit page

`resources/js/pages/posts/Edit.vue` is almost the same file. It receives the post and fills the fields with its current values:

```vue
<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import PostController from '@/actions/App/Http/Controllers/PostController';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index } from '@/routes/posts';

defineProps<{
    post: { id: number; title: string; body: string };
}>();

defineOptions({
    layout: {
        breadcrumbs: [{ title: 'Posts', href: index() }],
    },
});
</script>

<template>
    <Head title="Edit post" />

    <Form
        v-bind="PostController.update.form(post.id)"
        class="max-w-2xl space-y-6 p-4"
        v-slot="{ errors, processing }"
    >
        <div class="grid gap-2">
            <Label for="title">Title</Label>
            <Input id="title" name="title" :default-value="post.title" />
            <InputError :message="errors.title" />
        </div>

        <div class="grid gap-2">
            <Label for="body">Body</Label>
            <textarea
                id="body"
                name="body"
                rows="8"
                :value="post.body"
                class="rounded-md border bg-transparent px-3 py-2 text-sm"
            />
            <InputError :message="errors.body" />
        </div>

        <Button :disabled="processing">Save changes</Button>
    </Form>
</template>
```

`update.form(post.id)` builds the URL for this post and handles method spoofing for you. HTML forms can only send GET and POST, so Wayfinder adds `_method=PUT` and Laravel treats the request as a PUT.

## Step 10: Test the toasts with Pest

The `toast()` helper stores its payload in the session under `toast`, so normal session assertions work:

```php
<?php

use App\Models\Post;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

it('creates a post and flashes a success toast', function () {
    $this->post(route('posts.store'), [
        'title' => 'Hello Inertia',
        'body' => 'My first post.',
    ])
        ->assertRedirect(route('posts.index'))
        ->assertSessionHas('toast.type', 'success')
        ->assertSessionHas('toast.title', 'Post created');

    expect(Post::where('title', 'Hello Inertia')->exists())->toBeTrue();
});

it('deletes a post and flashes a toast', function () {
    $post = Post::factory()->create();

    $this->delete(route('posts.destroy', $post))
        ->assertRedirect(route('posts.index'))
        ->assertSessionHas('toast.title', 'Post deleted');

    $this->assertModelMissing($post);
});
```

Save them as `tests/Feature/PostTest.php` and run `php artisan test --compact tests/Feature/PostTest.php`.

## Common problems and fixes

### Saving a post returns "This action is unauthorized"

The generated Form Request still returns `false` from `authorize()`. Return `true`, or a real policy check.

### The toast heading says "success" instead of a title

You called `toast()` without a title. Pass one as the third argument, like `toast('Saved.', 'success', 'Post updated')`.

### The toast appears twice

You called `toast()` and then returned `Inertia::render()` instead of a redirect. Flashed data lives for the current request and the next one, so the toast shows now and again on the next visit. Always redirect after `toast()`.

### The settings pages show a different-looking toast

If your starter kit's `app.ts` calls `initializeFlashToast()`, the kit has a small toast of its own, fed by `Inertia::flash()` in the profile and password controllers. It reads different data, so it doesn't clash with this package. For one consistent style, switch those two calls to `toast()` and remove the initializer.

### "document is not defined" during server-side rendering

The plugin was registered on the server. Keep the `if (ssr) { return; }` check in `withApp`.

### The delete dialog never opens

Check that `useConfirmation()` is imported from `@erag/inertia-toast-vue` and that the plugin is registered. The plugin is what mounts the dialog.

## Frequently asked questions

### How do I make a CRUD app with Laravel, Inertia and Vue?

Create a model and migration, register `Route::resource()`, validate with Form Requests, and return `Inertia::render()` from `index`, `create` and `edit`. Then build one Vue page per screen. Actions that change data, like `store`, `update` and `destroy`, redirect after saving, and that redirect is the right moment to flash a toast.

### Do I need an API for a Laravel Inertia CRUD?

No. Inertia controllers return pages and redirects, just like a Blade app. There are no JSON endpoints, no API tokens and no client-side router to maintain.

### Should I use the Form component or useForm in Inertia v3?

Both work. The `Form` component is less code for simple forms because it reads inputs by `name`, and it's what the starter kit uses. Pick `useForm()` when you need the form data in your script, for example to show a live preview.

### How do I show a success message after saving in Laravel Inertia?

Call `toast('Saved.', 'success', 'Post updated')` before your redirect. Laravel Inertia Toast shares it as `props.toast`, and the Vue plugin shows it on the next page.

### Should validation errors be shown as toasts?

Usually not. Show them under each field with the `errors` object from the `Form` component. Keep toasts for the result of an action: created, updated, deleted, or failed.

### Does this Laravel Inertia CRUD work with React?

Yes. The Laravel side is identical. Install `./vendor/erag/laravel-inertia-toast/react`, wrap your app in `InertiaToastProvider`, and use `useToast()` and `useConfirmation()` from `@erag/inertia-toast-react`.

### How do I confirm before deleting in Inertia?

Call `await confirm({ ... })` from `useConfirmation()` and only send `router.delete()` when it resolves `true`. Let the controller send the final success toast after the redirect.

## Ship your CRUD with clear feedback

You now have a full Laravel Inertia CRUD where every action tells the user what happened: a toast for each result, inline errors for bad input, and a confirm step before anything is deleted.

```bash
composer require erag/laravel-inertia-toast
npm install ./vendor/erag/laravel-inertia-toast/vue
```

- **Documentation:** [erag.in/laravel-inertia-toast](https://erag.in/laravel-inertia-toast/), including the [Laravel helper guide](https://erag.in/laravel-inertia-toast/laravel.html) and [confirmation modals](https://erag.in/laravel-inertia-toast/modal-usage.html)
- **GitHub:** [eramitgupta/laravel-inertia-toast](https://github.com/eramitgupta/laravel-inertia-toast). A star helps other developers find it.
- **Next step:** add an image field to this form with the guide to [file uploads in Laravel Inertia](./laravel-inertia-file-upload.md).
