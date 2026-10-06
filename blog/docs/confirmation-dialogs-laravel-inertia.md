---
title: Confirmation Dialogs in Laravel Inertia Apps
headline: How to Add a Confirm Dialog Before Deleting in Laravel Inertia (Vue or React)
description: "Build an Inertia confirm dialog for delete buttons in Laravel: await the user's choice in Vue 3 or React, send the request, then flash a toast from the server."
date: 2026-09-29
package: laravel-inertia-toast
category: Tutorial
tags: [laravel, inertia, modal, vue, react]
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/confirmation-dialogs-laravel-inertia.md
</div>

Every Inertia app with a Delete button eventually needs a confirm dialog, the "Are you sure?" step. The quick version is `if (!window.confirm('Are you sure?')) return;`, and honestly, its API is great: one line, returns a boolean, done.

The problem is everything else about it. It looks like browser chrome rather than your app, you can't give it a title or a red Delete button, and every browser renders it differently. So you build a modal component instead, and now each page has an `isOpen` ref, a `pendingId`, a confirm handler and a cancel handler, all to ask one question.

This tutorial builds an Inertia confirm dialog that keeps the one-line feel of `window.confirm()` but renders a proper styled modal. It uses Laravel Inertia Toast, which ships a promise-based `useConfirmation()` alongside its toasts, and walks through the full flow: confirm in the browser, delete on the server, show a toast after the redirect.

## Why a promise-based confirm dialog?

`window.confirm()` blocks and returns `true` or `false`. A promise-based dialog does the same thing without blocking the page:

```ts
const accepted = await confirm({
    title: 'Delete post',
    message: 'This action cannot be undone.',
    type: 'danger',
});
```

The modal opens, your function pauses at `await`, and it continues with `true` if the user confirmed or `false` if they cancelled or closed the modal. No modal state lives in your component, and the whole action reads top to bottom in one function.

## Setup

The confirmation dialog comes from the same frontend package as the toasts. If you've registered the Vue plugin or the React provider, you already have it: both mount a `ConfirmationBox` component for you. If not, the [Inertia toast notifications tutorial](./laravel-inertia-toast-notifications.md) covers installation from start to finish, or you can follow the [installation guide](https://erag.in/laravel-inertia-toast/installation.html).

## Building an Inertia confirm dialog for a delete button

Here's a posts list with a Delete button on each row. Start with the route and controller.

```php
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::delete('/posts/{post}', [PostController::class, 'destroy'])
    ->name('posts.destroy');
```

```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class PostController extends Controller
{
    public function destroy(Post $post): RedirectResponse
    {
        Gate::authorize('delete', $post);

        $post->delete();

        toast('Post deleted successfully', 'success', 'Deleted');

        return redirect()->route('posts.index');
    }
}
```

Now the page, `resources/js/Pages/Posts/Index.vue`:

```vue
<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { useConfirmation } from '@erag/inertia-toast-vue';

type Post = {
    id: number;
    title: string;
};

defineProps<{
    posts: Post[];
}>();

const { confirm } = useConfirmation();

const deletePost = async (post: Post) => {
    const accepted = await confirm({
        title: 'Delete post',
        message: `"${post.title}" will be removed. This action cannot be undone.`,
        type: 'danger',
        confirmText: 'Delete post',
        cancelText: 'Keep it',
    });

    if (!accepted) {
        return;
    }

    router.delete(`/posts/${post.id}`, {
        preserveScroll: true,
    });
};
</script>

<template>
    <ul>
        <li v-for="post in posts" :key="post.id">
            {{ post.title }}
            <button type="button" @click="deletePost(post)">Delete</button>
        </li>
    </ul>
</template>
```

I'm using a plain URL in `router.delete()`. If your app uses Ziggy's `route()` or Wayfinder, swap that in.

Walk through what happens on a click:

1. `confirm()` opens the modal and the function waits.
2. On **Keep it**, the promise resolves `false` and the function returns. Nothing is sent.
3. On **Delete post**, it resolves `true` and Inertia sends the `DELETE` request.
4. The controller deletes the post, calls `toast()`, and redirects.
5. The flash bridge picks up `props.toast` from the next page and shows "Post deleted successfully".

Notice there's no toast on cancel. The docs show `toast.info('Action cancelled')` as an option, and it's there if you want it, but I usually leave it out. The user just clicked Cancel; they know.

### The same flow in React

The React hook works the same way. The only difference is that you call `confirm` on the object `useConfirmation()` returns:

```tsx
import { router } from '@inertiajs/react';
import { useConfirmation } from '@erag/inertia-toast-react';

type Post = {
    id: number;
    title: string;
};

export default function PostsIndex({ posts }: { posts: Post[] }) {
    const confirmation = useConfirmation();

    const deletePost = async (post: Post): Promise<void> => {
        const accepted = await confirmation.confirm({
            title: 'Delete post',
            message: `"${post.title}" will be removed. This action cannot be undone.`,
            type: 'danger',
            confirmText: 'Delete post',
            cancelText: 'Keep it',
        });

        if (!accepted) {
            return;
        }

        router.delete(`/posts/${post.id}`, { preserveScroll: true });
    };

    return (
        <ul>
            {posts.map((post) => (
                <li key={post.id}>
                    {post.title}
                    <button type="button" onClick={() => deletePost(post)}>
                        Delete
                    </button>
                </li>
            ))}
        </ul>
    );
}
```

## Confirm in the browser, report from the server

The pattern above splits the work on purpose. The browser asks the question; Laravel reports the result. I'd avoid showing a success toast on the client right after `router.delete()`, because at that point you don't know yet whether the delete worked. The controller does, so the controller sends the toast. That's also what the [Vue usage docs](https://erag.in/laravel-inertia-toast/vue.html) recommend: use `useConfirmation()` before destructive requests, then let Laravel return the final success toast.

## Picking the right modal type

The `type` option sets the intent and the button styling. There are four:

| Type | Use it for | Example |
| --- | --- | --- |
| `danger` | Destructive actions | Delete a post, remove a team member |
| `warning` | Risky actions | Log out with unsaved changes, discard a draft |
| `info` | Neutral confirmation | Send an invoice to a customer |
| `success` | Positive confirmation | Publish a post |

Here's `warning` for leaving an edit screen with unsaved work:

```ts
const discardDraft = async () => {
    const accepted = await confirm({
        title: 'Discard changes?',
        message: 'Your edits to this post have not been saved.',
        confirmText: 'Discard',
        cancelText: 'Keep editing',
        type: 'warning',
    });

    if (accepted) {
        router.visit('/posts');
    }
};
```

## Writing dialog copy people actually read

A dialog that says "Are you sure?" with **OK** and **Cancel** trains people to click OK without reading. A few rules I follow:

- **The title names the action.** "Delete post", not "Are you sure?".
- **The message names the thing and the consequence.** Include the post title or invoice number so a misclick is obvious.
- **The confirm button repeats the verb.** "Delete post" beats "Yes" or "OK", because the button alone tells you what happens.
- **The cancel button can be friendly.** "Keep it" or "Keep editing" is clearer than "No".

`confirmText` and `cancelText` are optional, so it's tempting to skip them. For destructive actions, set both.

## A confirm dialog is not authorization

This one is easy to forget. The modal is a UX step; it stops accidental clicks, not deliberate requests. Anyone can send `DELETE /posts/5` without ever seeing your button. That's why the controller above calls `Gate::authorize('delete', $post)` before deleting. Keep your policies and validation on the server no matter what the frontend asks.

## Custom icon and styling

Pass an SVG string as `icon` to replace the default icon:

```ts
await confirm({
    title: 'Archive project?',
    message: 'Archived projects are hidden from the dashboard.',
    type: 'info',
    icon: `<svg viewBox="0 0 24 24">...</svg>`,
});
```

For colours and shapes, override the modal's classes in your own stylesheet. Every class is prefixed with `erag-`, so they won't clash with Tailwind or Bootstrap:

```css
.erag-modal {
    border-radius: 20px;
}

.erag-btn-confirm {
    background-color: #dc2626;
}
```

The [styling guide](https://erag.in/laravel-inertia-toast/styling.html) lists the rest, including `.erag-modal-backdrop`, `.erag-modal-title` and `.erag-btn-cancel`.

## When a confirm dialog is the wrong tool

Confirmation has a cost. Ask too often and people stop reading. I skip it in these cases:

- **Frequent, reversible actions.** Archiving, marking as read, moving between lists. Do the action and make it easy to undo.
- **Very destructive actions that need more than yes or no.** Deleting a whole workspace is often confirmed by typing its name. The options here are `title`, `message`, `confirmText`, `cancelText`, `type` and `icon`, so this is a yes/no dialog with no input field. Build a dedicated form for that case.
- **Apps without Laravel and Inertia.** If you have a standalone Vue 3 app, the same promise pattern exists in `@erag/vue-toastification`, covered in [promise-based confirm modals in Vue 3](./promise-confirm-modal-vue-3.md).

## FAQ

### What does confirm() return if the user closes the modal?

`false`, the same as clicking Cancel. Your code only has to handle two outcomes, which is why the `if (!accepted) return;` guard is all you need.

### Does it work with Inertia's useForm?

Yes. The confirm step happens before any request, so it doesn't care how you send it. Await `confirm()` first, then call `form.delete()`, `form.post()` or `router.delete()` as you normally would.

### Can I use it for actions that aren't deletes?

Yes, and the docs list several: logging out, discarding changes, and publishing or submitting something important. Match the `type` to the risk, and keep `danger` for things that can't be undone, so the red button keeps its meaning.

## Where to go next

The [modal usage docs](https://erag.in/laravel-inertia-toast/modal-usage.html) have the full options table and a logout example in both Vue and React. Pick one destructive action in your app, swap its `window.confirm()` for `confirm()`, and move its success message into the controller.
