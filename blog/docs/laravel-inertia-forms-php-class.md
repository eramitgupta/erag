---
title: Build Inertia Forms From a Single PHP Class
description: Build Laravel Inertia forms from one PHP class with erag/inertia-forms. Fields, layout, rules and permissions live in Laravel, and one component renders them.
date: 2026-09-29
package: laravel-inertia-forms
category: Tutorial
tags: [laravel, inertia, forms, vue, react]
---

A typical form in a Laravel Inertia app lives in at least three places. The rules sit in a FormRequest. The inputs, labels and `useForm` setup sit in a Vue or React page. And the glue in between, like the list of statuses for a dropdown or the default value of a checkbox, gets passed as props from the controller.

Add one field and you touch all three. Rename one and you hope you caught every spot.

I built Laravel Inertia Forms (`erag/inertia-forms`) to put the whole form in one PHP class. The class lists the fields, their layout, visibility rules, permissions and validation. The controller passes it to the page as a prop, a `<Form>` component draws it, and on submit the same class validates the request. This tutorial builds a create and edit form for blog posts from scratch.

## What you need

The package targets a current stack only: PHP 8.3 or newer, Laravel 13, Inertia 3 on both server and client, and Tailwind CSS 4. On the frontend, pick one of Vue 3.5+, React 19 or Svelte 5. Laravel 12 and Inertia 1 or 2 aren't supported, so check this before you start.

## Install Laravel Inertia Forms

Three steps: the Composer package, the npm package, and one line of CSS.

```bash
composer require erag/inertia-forms
php artisan erag:install-inertia-forms
```

The install command publishes `config/inertia-forms.php` and a stub for new form classes, then prints the next steps for your frontend. It reads your `package.json` to see which Inertia adapter you use.

Install the frontend package for your framework:

```bash
npm install @erag/inertia-forms-vue
```

On React, install `@erag/inertia-forms-react` instead.

The components are styled with Tailwind utility classes, and Tailwind only generates classes it can see. Point it at the package in `resources/css/app.css`:

```css
@import 'tailwindcss';

@source "../../node_modules/@erag/inertia-forms-vue/dist";
```

Use `inertia-forms-react` in that path if you're on React. If your forms ever show up unstyled, this line is the first thing to check. The [installation guide](https://erag.in/laravel-inertia-forms/guide/installation.html) has the Svelte version.

## Generate the form class

```bash
php artisan make:form PostForm
```

That creates `app/Forms/PostForm.php` in the `App\Forms` namespace. Replace its contents with this:

```php
<?php

namespace App\Forms;

use App\Models\Post;
use Erag\InertiaForms\Fields\DatePicker;
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\Radio;
use Erag\InertiaForms\Fields\Slug;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\Textarea;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Fields\Toggle;
use Erag\InertiaForms\Form;
use Illuminate\Validation\Rule;

class PostForm extends Form
{
    protected ?string $actionRoute = 'posts.store';

    public function fields(): array
    {
        $editing = $this->getModel() !== null;

        return [
            Fieldset::make('Content')->columns(2)->fields([
                TextInput::make('title')->required()->maxLength(160),
                Slug::make('slug')
                    ->from('title')
                    ->prefix('example.test/blog/')
                    ->required()
                    ->rule(Rule::unique('posts', 'slug')->ignore($this->getModel())),
                Textarea::make('excerpt')
                    ->rows(3)
                    ->maxLength(300)
                    ->showCharacterCount()
                    ->columnSpan(2),
            ]),
            Fieldset::make('Publishing')->fields([
                Radio::make('status')->buttons()->default('draft')->required()->options([
                    'draft' => 'Draft',
                    'scheduled' => 'Scheduled',
                    'published' => 'Published',
                ]),
                DatePicker::make('publish_at')
                    ->withTime()
                    ->minDate(now())
                    ->required()
                    ->visibleWhen('status', 'scheduled'),
                Toggle::make('featured')
                    ->help('Featured posts appear on the home page.')
                    ->authorize(fn () => auth()->user()?->can('feature', Post::class) ?? false),
            ]),
            Submit::make($editing ? 'Save changes' : 'Create post')
                ->processingLabel('Saving…')
                ->disableUntilDirty($editing),
        ];
    }
}
```

That's the entire form. A few things are doing more work than they look:

- **`Slug::make('slug')->from('title')`** fills itself in while the user types the title, and stops following once they edit it by hand.
- **`visibleWhen('status', 'scheduled')`** hides the date picker unless "Scheduled" is picked. Hidden fields also get no validation rules, so `required()` only applies when it's visible.
- **`authorize(...)`** removes the toggle for users who can't feature posts. It isn't hidden with CSS; it never reaches the browser, and a submitted value is ignored.
- **`getModel()`** tells you whether a post is bound, so one class handles create and edit.

## Routes and controller

```php
// routes/web.php
use App\Http\Controllers\PostController;

Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');
Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
Route::get('/posts/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');
Route::put('/posts/{post}', [PostController::class, 'update'])->name('posts.update');
```

```php
<?php

namespace App\Http\Controllers;

use App\Forms\PostForm;
use App\Models\Post;
use Erag\InertiaForms\Attributes\Validate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Posts/Form', [
            'form' => PostForm::make(),
        ]);
    }

    public function store(Request $request, #[Validate] PostForm $form): RedirectResponse
    {
        $request->user()->posts()->create($form->validated());

        return to_route('posts.index');
    }

    public function edit(Post $post): Response
    {
        return Inertia::render('Posts/Form', [
            'form' => PostForm::make()->route('posts.update', $post)->bind($post),
        ]);
    }

    public function update(Request $request, Post $post): RedirectResponse
    {
        $post->update(PostForm::make()->bind($post)->validate($request));

        return to_route('posts.index');
    }
}
```

The HTTP method comes from the route. `posts.update` is a `Route::put()`, so the edit form submits with `PUT` without you saying so.

`#[Validate]` resolves the form and validates the current request before `store()` runs. In `update()` I validate manually instead. The attribute builds a fresh form with no bound model, and here the unique rule on `slug` needs the post to ignore it. The [validation docs](https://erag.in/laravel-inertia-forms/concepts/validation.html) call this out too.

For `bind($post)` to fill the date picker properly, give the model a `datetime` cast on `publish_at`. Carbon values are formatted for the field; raw strings are passed through as they are.

## Render the form in Vue or React

One page serves both create and edit, because the page doesn't know anything about the fields.

```vue
<!-- resources/js/pages/Posts/Form.vue -->
<script setup lang="ts">
import { Form, type FormSchema } from '@erag/inertia-forms-vue';

defineProps<{ form: FormSchema }>();
</script>

<template>
    <div class="mx-auto max-w-3xl p-6">
        <Form :form="form" />
    </div>
</template>
```

```tsx
// resources/js/pages/Posts/Form.tsx
import { Form, type FormSchema } from '@erag/inertia-forms-react';

export default function PostFormPage({ form }: { form: FormSchema }) {
    return (
        <div className="mx-auto max-w-3xl p-6">
            <Form form={form} />
        </div>
    );
}
```

Open `/posts/create` and you get a two-column Content section, a segmented status control, a date picker that appears for scheduled posts, and a submit button with a spinner.

## What you didn't have to write

This is the part that sold me on the approach, and why I use it for admin screens:

- **Labels.** Field names become readable labels: `publish_at` becomes "Publish at" and `featured` becomes "Featured".
- **Rules.** `title` gets `required`, `string` and `max:160` from its configuration. `status` only accepts its three option values. You add only the rules the fields can't infer, like the unique slug.
- **Errors.** Laravel's validation errors appear under each field, and the first invalid field is scrolled into view.
- **State.** `<Form>` uses Inertia's `useForm` internally, tracks dirty state, and on the edit screen the button stays disabled until something changes.
- **Visibility on both sides.** The browser and the server evaluate `visibleWhen()` with the same logic, so they agree on what's required.

If you want to react to a save, `<Form>` emits events. In Vue that's `@success`, `@error` and `@finish`; in React, `onSuccess`, `onError` and `onFinish`. The [Form component page](https://erag.in/laravel-inertia-forms/frontend/form-component.html) lists them all, plus `onBeforeSubmit` for quick client-side checks.

## How the form reaches the browser

There's no magic in the prop. A form instance is `Arrayable` and `JsonSerializable`, so Inertia turns it into a plain JSON schema: the fieldsets, each field's type and options, the initial `data`, the visibility conditions, the `action` URL and the `method`. On the page it arrives typed as `FormSchema`.

Two things follow from that. First, authorization happens during serialization, so a user without the `feature` permission gets a schema with no `featured` field at all. Second, you can inspect exactly what the browser gets with `PostForm::make()->toArray()` in Tinker, or look at the [serialized schema reference](https://erag.in/laravel-inertia-forms/reference/schema.html) for the full shape.

## Test the form class

Because the form is a plain PHP class, a Pest test can check its rules without a browser:

```php
use App\Forms\PostForm;

it('limits post titles to 160 characters', function () {
    expect(PostForm::make()->rules()['title'])
        ->toBe(['required', 'string', 'max:160']);
});
```

A feature test that posts to `posts.store` with a missing title and calls `assertSessionHasErrors('title')` covers the round trip through `#[Validate]`.

## When a PHP form class is the wrong tool

It's not for every screen:

- **Heavily custom layouts.** If a designer handed you a form where every field sits somewhere unusual, the fieldset grid will fight you. The package exports the field components for standalone use, or you can write that one form by hand.
- **Lots of client-only logic.** Live previews, fields driven by browser-only state, or calculations that never touch the server belong in a component you control.
- **Older stacks.** Laravel 12 and Inertia 2 aren't supported, and the styling assumes Tailwind 4.

For CRUD screens, settings pages and admin panels, where forms are mostly data entry and the backend should own the rules, it removes a lot of repetitive code.

## Where to go next

Walk through the [quick start](https://erag.in/laravel-inertia-forms/guide/quick-start.html) if you want a smaller first form. Then read [one set of validation rules for Laravel and Inertia](./shared-validation-laravel-inertia.md) to see exactly which rules each field generates, or turn a long form into steps with [multi-step form wizards in Laravel Inertia](./multi-step-form-wizard-laravel-inertia.md).
