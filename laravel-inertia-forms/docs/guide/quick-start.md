---
title: 'Quick Start'
description: 'Build a complete create-user form in Laravel with a PHP form class, two routes, a controller, and one Vue, React, or Svelte page.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/guide/quick-start.md
</div>


<div class="doc-category">Getting Started</div>

# Quick Start

In this guide you build a "Create user" form: a PHP class, two routes, and one page.

## 1. Generate a form class

```bash
php artisan make:form CreateUserForm
```

This creates `app/Forms/CreateUserForm.php`. Replace its contents with:

```php
<?php

namespace App\Forms;

use Erag\InertiaForms\Fields\Combobox;
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Fields\Toggle;
use Erag\InertiaForms\Form;

class CreateUserForm extends Form
{
    protected ?string $actionRoute = 'users.store';

    public function fields(): array
    {
        return [
            Fieldset::make('Account')->columns(2)->fields([
                TextInput::make('name')->required()->maxLength(100),
                TextInput::make('email')->email()->required()->rule('unique:users,email'),
                TextInput::make('password')->password()->required()->minLength(8),
                Combobox::make('role')->options([
                    'admin' => 'Admin',
                    'editor' => 'Editor',
                ])->required(),
            ]),
            Toggle::make('send_welcome_email')->default(true),
            Submit::make('Create user')->processingLabel('Creating…'),
        ];
    }
}
```

The form submits to the `users.store` route. The HTTP method (`POST`) is read from the route definition.

## 2. Add the routes

```php
use App\Forms\CreateUserForm;
use App\Http\Controllers\UserController;

Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
Route::post('/users', [UserController::class, 'store'])->name('users.store');
```

## 3. Write the controller

```php
<?php

namespace App\Http\Controllers;

use App\Forms\CreateUserForm;
use App\Models\User;
use Erag\InertiaForms\Attributes\Validate;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Users/Create', [
            'form' => CreateUserForm::make(),
        ]);
    }

    public function store(#[Validate] CreateUserForm $form): RedirectResponse
    {
        $user = User::create($form->validated());

        if ($form->validated('send_welcome_email')) {
            // Send the email...
        }

        return to_route('users.index');
    }
}
```

`#[Validate]` resolves the form from the container and validates the current request. If validation fails, Laravel redirects back and Inertia shows the errors under each field. See [Validation](/concepts/validation) for more options.

## 4. Render the page

::: code-group

```vue [Vue]
<!-- resources/js/pages/Users/Create.vue -->
<script setup lang="ts">
import { Form, type FormSchema } from '@erag/inertia-forms-vue';

defineProps<{ form: FormSchema }>();
</script>

<template>
    <div class="mx-auto max-w-2xl p-6">
        <h1 class="mb-6 text-xl font-semibold">Create user</h1>
        <Form :form="form" />
    </div>
</template>
```

```tsx [React]
// resources/js/pages/Users/Create.tsx
import { Form, type FormSchema } from '@erag/inertia-forms-react';

export default function Create({ form }: { form: FormSchema }) {
    return (
        <div className="mx-auto max-w-2xl p-6">
            <h1 className="mb-6 text-xl font-semibold">Create user</h1>
            <Form form={form} />
        </div>
    );
}
```

```svelte [Svelte]
<!-- resources/js/pages/Users/Create.svelte -->
<script lang="ts">
    import { Form, type FormSchema } from '@erag/inertia-forms-svelte';

    let { form }: { form: FormSchema } = $props();
</script>

<div class="mx-auto max-w-2xl p-6">
    <h1 class="mb-6 text-xl font-semibold">Create user</h1>
    <Form {form} />
</div>
```

:::

Open `/users/create`. You get a two-column "Account" section, a toggle, and a submit button that shows a spinner while the request runs.

## What happened

- Labels came from field names: `send_welcome_email` became "Send welcome email".
- Each field generated its own rules. For example, `email` got `required`, `string`, `email`, plus your `unique:users,email`.
- The `role` combobox only accepts `admin` or `editor`.
- The toggle started as `true` because of `->default(true)`.

## Try it

This is the form from step 1, rendered live. The route is left out because the docs have no backend, and only `required` fields are checked in the browser.

<Example id="guide/quick-start/create-user">

<<< @/../examples/guide/quick-start/create-user.php#example

</Example>

### Going further: one form for create and edit

The same form, extended with three ideas from the next pages. [Visibility](/concepts/visibility) shows the sections list only for editors. [Model binding](/concepts/model-binding) fills the form with an existing user. With a user bound, the email becomes read-only, and [authorization](/concepts/authorization) removes the password and welcome email fields.

<Example id="guide/quick-start/edit-user">

<<< @/../examples/guide/quick-start/edit-user.php#example

</Example>

## Next steps

- Learn every option of the [Form class](/concepts/form-class).
- Show fields only when needed with [Conditional Visibility](/concepts/visibility).
- Reuse the form for editing with [Model Binding](/concepts/model-binding).
