---
title: Laravel Inertia Form Builder Guide
headline: "Building Reusable Admin CRUD Forms With Laravel Inertia"
description: Build reusable Laravel Inertia admin forms with one PHP form class for fields, defaults, validation, model binding, permissions and create/edit screens.
date: 2026-10-11
package: laravel-inertia-forms
category: Guide
tags: [laravel, inertia, forms, admin, crud, vue, react]
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/laravel-inertia-form-builder-admin-crud.md
</div>

An admin CRUD screen usually starts small. A create page has a few inputs, an edit page copies them, and the controller saves the request. Then the two pages begin to drift. One gets a character count, the other does not. A new status option is added to create but forgotten on edit. A field is hidden for one role in Vue and still accepted by the update action.

A Laravel Inertia form builder gives those screens one shared description. Laravel Inertia Forms lets a PHP form class define fields, layout, defaults, visibility, validation hints and submit behavior. The controller binds the model, and the Vue or React page renders the schema.

This guide builds a reusable product form for an admin panel and explains where the form class should stop so that your application remains easy to test and secure.

## Install and generate a form class

Install the backend and the frontend adapter, then generate a form class:

```bash
composer require erag/inertia-forms
php artisan erag:install-inertia-forms
php artisan make:form ProductForm
```

For Vue, install the Vue adapter. For React, use the React package instead:

```bash
npm install @erag/inertia-forms-vue
```

The generated class belongs in `app/Forms/ProductForm.php`. A named class is more useful than an anonymous array because create, edit, validation and authorization can all use the same definition.

## Define fields around the admin decision

Do not add every database column automatically. An admin form should contain the decisions a staff member needs to make. Audit timestamps, internal counters and calculated values do not belong in the browser just because they exist on the model.

Here is a product form with a two-column details section and a separate availability section:

```php
<?php

namespace App\Forms;

use App\Models\Product;
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\Radio;
use Erag\InertiaForms\Fields\Slug;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\Textarea;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Fields\Toggle;
use Erag\InertiaForms\Form;

final class ProductForm extends Form
{
    public function fields(): array
    {
        $editing = $this->getModel() !== null;

        return [
            Fieldset::make('Product details')->columns(2)->fields([
                TextInput::make('name')
                    ->required()
                    ->maxLength(160),
                Slug::make('slug')
                    ->from('name')
                    ->required()
                    ->maxLength(180),
                Textarea::make('description')
                    ->rows(5)
                    ->maxLength(2000)
                    ->showCharacterCount()
                    ->columnSpan(2),
            ]),
            Fieldset::make('Availability')->fields([
                Radio::make('status')
                    ->buttons()
                    ->default('draft')
                    ->required()
                    ->options([
                        'draft' => 'Draft',
                        'published' => 'Published',
                    ]),
                Toggle::make('featured')
                    ->label('Feature this product')
                    ->authorize(fn (): bool => auth()->user()?->can('feature', Product::class) ?? false),
            ]),
            Submit::make($editing ? 'Save changes' : 'Create product')
                ->processingLabel('Saving…'),
        ];
    }
}
```

The form class now owns the names, labels, layout and frontend hints for both screens. `Slug::make('slug')->from('name')` follows the name until the user edits the slug manually. The model binding check lets the submit label change without duplicating the whole form.

## Pass a form to the create page

The create controller can pass a fresh form schema to Inertia:

```php
public function create(): Response
{
    $this->authorize('create', Product::class);

    return Inertia::render('Products/Form', [
        'form' => ProductForm::make()
            ->route('products.store'),
    ]);
}
```

The route determines the HTTP method. A named `POST` route produces a create form that submits to the correct endpoint.

The Vue page can stay small:

```vue
<script setup lang="ts">
import { Form, type FormSchema } from '@erag/inertia-forms-vue';

defineProps<{ form: FormSchema }>();
</script>

<template>
    <main class="mx-auto max-w-3xl p-6">
        <h1 class="mb-6 text-xl font-semibold">Product</h1>
        <Form :form="form" />
    </main>
</template>
```

The page does not need to list the fields or recreate the validation rules. The form component reads the schema and displays errors beside the relevant controls.

## Bind the same form to an existing model

The edit action uses `bind($product)` to populate initial values:

```php
public function edit(Product $product): Response
{
    $this->authorize('update', $product);

    return Inertia::render('Products/Form', [
        'form' => ProductForm::make()
            ->route('products.update', $product)
            ->bind($product),
    ]);
}
```

Binding is for initial data. It does not save the model and it does not replace authorization. The update action still needs a policy and a validation call.

```php
public function update(Request $request, Product $product): RedirectResponse
{
    $this->authorize('update', $product);

    $product->update(
        ProductForm::make()
            ->bind($product)
            ->validate($request),
    );

    return to_route('products.index')
        ->with('status', 'Product saved.');
}
```

The form validates only its own fields and returns the data shape the model update expects. For a create action, use `#[Validate]` on the form parameter or call `ProductForm::make()->validate($request)` explicitly.

## Keep database rules with the form when they belong to the field

Field helpers cover common rules such as required, email, length and options. Add a Laravel rule when the field needs a database constraint:

```php
use Illuminate\Validation\Rule;

Slug::make('slug')
    ->from('name')
    ->required()
    ->rule(Rule::unique('products', 'slug')->ignore($this->getModel()));
```

Using the bound model for `ignore()` is important on edit. Without it, a product can fail validation because its slug already belongs to itself.

Keep complex business decisions in a policy, service or action class. A form class is a good home for field validation and presentation metadata; it should not become the place where inventory is reserved, payment is captured or a dozen related models are updated.

## Handle permissions in the schema and the action

The `featured` toggle in the example is removed for users who cannot feature products. That keeps unauthorized controls out of the browser. The controller and policy still protect the update endpoint if a user sends a forged value.

For a group of internal fields, authorize the entire fieldset:

```php
Fieldset::make('Internal settings')
    ->authorize(fn (): bool => auth()->user()?->isAdmin() ?? false)
    ->fields([
        Toggle::make('is_verified'),
        TextInput::make('internal_code'),
    ]),
```

If a hidden field already has a value on the model, decide whether it should remain unchanged or be cleared when an authorized user can no longer see it. A form should not accidentally erase an internal value simply because the current editor lacks a field.

## Use a shared form page for create and edit

One `Products/Form.vue` page is usually enough when the schema includes its own action and method. It reduces duplicated markup and makes a field change visible in one place.

The page can still receive a separate `product` prop for a heading, breadcrumbs or a link back to the product list. Keep those page-level concerns outside the form definition. The form class describes the form; the page describes its place in the admin area.

If create and edit genuinely have different workflows, use two form classes or a clear mode in one class. Do not hide major business differences behind dozens of `if ($editing)` branches. Reuse should reduce confusion, not conceal it.

## Think about model casting and dates

Bound values need to match what the field expects. Add `date` or `datetime` casts to the model for date pickers so Carbon values can be formatted correctly. For a status enum, make sure the model and form agree on the stored value rather than the display label.

For JSON settings, bind an array and use dot-notation field names when appropriate. For files, remember that existing files should not automatically be sent back to the browser; show existing attachments separately and let the upload field handle new files.

## Test the form as behavior

The most useful Laravel Inertia form builder tests cover behavior rather than every label:

- an authorized user receives the create schema;
- an unauthorized user cannot open the create or edit action;
- an editor without the feature ability does not receive the featured field;
- invalid data returns errors for the expected fields;
- a duplicate slug is rejected on create and allowed for the same model on edit;
- a valid create stores the fields exposed by the form;
- a forged internal or unauthorized value does not change the model;
- an edit form is populated with the bound product.

You can assert the serialized schema when a field’s presence matters. Then add feature tests for the controller and database result. This catches both UI drift and unsafe request handling.

## Common form builder mistakes

### Copying create and edit forms

Copying starts quickly and becomes two sources of truth. Use one form class with `bind()` unless the workflows genuinely differ.

### Passing every model attribute to the browser

A form is a user interface, not a database dump. Expose only fields an authorized person needs to edit.

### Assuming `bind()` saves the model

It only supplies initial values. Call `validate()` and persist the returned data in the controller or action.

### Using frontend visibility as authorization

`v-if` and disabled controls do not protect a route. Use form authorization and Laravel policies together.

### Forgetting the unique edit exception

A unique slug or code must ignore the current model during update. Otherwise every edit looks like a duplicate.

### Putting heavy business logic in `fields()`

Field definitions should be predictable when the schema is serialized. Move side effects and multi-model operations into an action or service.

### Can the same form render in React?

Yes. Pass the same serialized schema to `@erag/inertia-forms-react` and render its `Form` component. The PHP definition and validation behavior remain on the server.

### Is a form builder suitable for every form?

It is a good fit for repeated admin, settings and CRUD forms with shared rules. A highly custom marketing interaction or a canvas-like editor may be clearer as a dedicated frontend component.

### Where should authorization live?

Use the form class to remove unauthorized fields from the schema, and use Laravel policies or controller authorization to protect the route. Both layers have a different job.

A Laravel Inertia form builder is valuable when it removes duplication without hiding the application’s rules. Define the fields once, bind the model for edits, validate on the server, authorize at both schema and action boundaries and keep complex business operations outside the form. Your admin screens stay consistent while the code remains understandable to the next person who changes a field.
