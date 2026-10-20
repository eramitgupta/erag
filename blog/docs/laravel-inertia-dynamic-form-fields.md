---
title: Dynamic Form Fields in Laravel Inertia
headline: "Add More Fields Dynamically in Laravel Inertia With a Repeater"
description: Laravel dynamic form fields with an add more button. Build repeatable rows in Inertia, validate nested arrays, and save them to a hasMany relation.
date: 2026-10-20
package: laravel-inertia-forms
category: Tutorial
tags: [laravel, inertia, vue, react, forms]
image: /images/laravel-inertia-dynamic-form-fields.jpg
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/laravel-inertia-dynamic-form-fields.md
</div>

![Laravel Inertia invoice form with repeater rows and an add line item button](/images/laravel-inertia-dynamic-form-fields.jpg)

To add form fields dynamically in Laravel, send the repeated rows as an array (like `items[0][description]`, `items[1][description]`), validate them with nested rules such as `items.*.description`, and save each row to a related table. In a Laravel Inertia app, the Repeater field from Laravel Inertia Forms gives you the whole "add more" UI from one PHP definition: add, remove, reorder and collapse rows, plus validation rules for every row.

This guide builds an invoice form with line items, saves the rows to a `hasMany` relation and loads them back for editing.

## The short version

1. Add `Repeater::make('items')->fields([...])` to your form class.
2. Set `itemLabel()`, `addActionLabel()` and `minItems()` / `maxItems()` to fit the list.
3. The browser sends `items` as a list of rows, and the package validates every row with its fields' rules.
4. Save rows with `$invoice->items()->createMany(...)` inside a transaction.
5. For editing, bind the rows as a plain array and replace them on update.

## The "add more" problem

Most apps have at least one form where the user decides how many entries to fill in:

- invoice or order **line items**
- **team members** to invite
- several **phone numbers** or addresses
- **FAQ entries** on a landing page

Writing this by hand takes more work than it looks. You keep an array of rows in state, render inputs with the right index in each name, remove rows without breaking the indexes, and show a server error like `items.3.quantity` under the right input in the right row. Then you write the same validation again in PHP. Add drag-to-reorder and it gets bigger still.

The Repeater field handles the browser side, and its rules come from the same field definitions you already wrote.

## How to add a repeater to a Laravel Inertia form

Install the package first. The [installation guide](https://erag.in/laravel-inertia-forms/guide/installation.html) covers the Tailwind `@source` line.

```bash
composer require erag/inertia-forms
php artisan erag:install-inertia-forms
npm install @erag/inertia-forms-vue
```

Then generate the form with `php artisan make:form InvoiceForm`:

```php
<?php

namespace App\Forms;

use Erag\InertiaForms\Fields\DatePicker;
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\Repeater;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Form;

class InvoiceForm extends Form
{
    protected ?string $actionRoute = 'invoices.store';

    public function fields(): array
    {
        $editing = $this->getModel() !== null;

        return [
            Fieldset::make('Invoice')->columns(2)->fields([
                TextInput::make('customer_name')->required()->maxLength(120),
                DatePicker::make('due_on')->required(),
            ]),

            Repeater::make('items')
                ->label('Line items')
                ->itemLabel('Line')
                ->addActionLabel('Add line item')
                ->titleFrom('description')
                ->columns(4)
                ->minItems(1)
                ->maxItems(50)
                ->default([['quantity' => 1]])
                ->fields([
                    TextInput::make('description')->required()->maxLength(200)->columnSpan(2),
                    TextInput::make('quantity')->number()->min(1)->max(1000)->required(),
                    TextInput::make('unit_price')->number()->min(0)->step(0.01)->prefix('$')->required(),
                ]),

            Submit::make($editing ? 'Save invoice' : 'Create invoice')->processingLabel('Saving…'),
        ];
    }
}
```

`default([['quantity' => 1]])` starts a new invoice with one row. Missing fields get their empty value, so the row becomes `description: ''`, `quantity: 1`, `unit_price: ''`. The due date uses the package's date picker, which has its own [Laravel Inertia date picker guide](./laravel-inertia-date-picker.md).

The page doesn't know anything about the fields, so one page serves create and edit:

```vue
<!-- resources/js/pages/Invoices/Form.vue -->
<script setup lang="ts">
import { Form, type FormSchema } from '@erag/inertia-forms-vue';

defineProps<{ form: FormSchema }>();
</script>

<template>
    <div class="mx-auto max-w-4xl p-6">
        <Form :form="form" />
    </div>
</template>
```

```tsx
// resources/js/pages/Invoices/Form.tsx
import { Form, type FormSchema } from '@erag/inertia-forms-react';

export default function InvoiceFormPage({ form }: { form: FormSchema }) {
    return (
        <div className="mx-auto max-w-4xl p-6">
            <Form form={form} />
        </div>
    );
}
```

Here's what users get. The **Add line item** button appends a row straight away and focuses its first field. Each row is a card with a header, which shows the description once it's typed, or "Line 2" until then. Clicking the header collapses the row, and **Collapse all** / **Expand all** toggles every row. Rows can be dragged by the **⋮⋮** handle or moved with the up and down buttons, and the trash button deletes one.

## Repeater options at a glance

| Method | What it does |
| --- | --- |
| `fields([...])` | The fields in each row. Names are relative to the row, so `description` is stored as `items.0.description`. |
| `itemLabel('Line')` | The name of one row, used in titles ("Line 2"), the add button and error messages. Defaults to "Item". |
| `titleFrom('description')` | Shows that field's value in the row header once it's filled in. |
| `columns(4)` | Lays each row's fields out in a grid of 1 to 6 columns. Fields use `columnSpan()` as usual. |
| `addActionLabel('Add line item')` | Text of the add button. Defaults to "Add" plus the item label in lower case. |
| `minItems(1)` / `maxItems(50)` | Disables the delete buttons at the minimum and the add button at the maximum. The server checks both. |
| `reorderable()`, `addable()`, `deletable()`, `collapsible()` | All on by default. Pass `false` to turn off moving, adding, deleting or collapsing. |
| `collapsed()` | Starts existing rows collapsed, which helps with long lists. |

## How the data arrives in Laravel

Without file uploads, Inertia sends the form as JSON. The repeater's value is a plain list of rows:

```json
{
    "customer_name": "Acme Ltd",
    "due_on": "2026-11-15",
    "items": [
        { "description": "Logo design", "quantity": "1", "unit_price": "450" },
        { "description": "Business cards", "quantity": "2", "unit_price": "35.50" }
    ]
}
```

Number inputs send the typed text as a string, and the `numeric` rule accepts it. In a controller, `$request->input('items')` gives you an array of arrays, and `$request->input('items.1.unit_price')` gives you `"35.50"`.

`$form->validated('items')` returns the same shape, with one difference: each row keeps only its own fields. If someone adds an `invoice_id` or `is_paid` key to a row in the browser's dev tools, it is dropped before it reaches your database.

## How to validate nested arrays in Laravel

In plain Laravel, you validate a list of rows with the `*` wildcard:

```php
$request->validate([
    'items' => ['required', 'array', 'min:1', 'max:50'],
    'items.*.description' => ['required', 'string', 'max:200'],
    'items.*.quantity' => ['required', 'numeric', 'min:1', 'max:1000'],
    'items.*.unit_price' => ['required', 'numeric', 'min:0'],
]);
```

The repeater builds the same checks from your field definitions, so you don't write this list at all:

| Attribute | Rules |
| --- | --- |
| `items` | `nullable` (or `required`), `array`, `min:1`, `max:50` |
| `items.*` | `array` |
| `items.N.description` | `required`, `string`, `max:200`, for every submitted row |
| `items.N.quantity` | `required`, `numeric`, `min:1`, `max:1000` |
| `items.N.unit_price` | `required`, `numeric`, `min:0` |

Instead of a wildcard, the package writes one set of rules per submitted row: `items.0.description`, `items.1.description`, and so on. That has two benefits. A field you hide with `visibleWhen()` inside one row is skipped for that row only, because visibility is checked against the row's own values. And error messages name the row, like "The Description (Line 2) field is required."

With `minItems(1)` (or `required()`), an empty list fails. When the server returns errors for a row, that row opens and gets a red border, so users don't hunt through collapsed cards. To see the full rule list for some data, call `InvoiceForm::make()->rules($data)`.

The post on [one set of validation rules for Laravel and Inertia](./shared-validation-laravel-inertia.md) covers the rules for the other field types.

## How to save repeater rows to a hasMany relation

Line items belong in their own table, so you can total, search and report on them. Add a `position` column to keep the order the user chose:

```php
Schema::create('invoice_items', function (Blueprint $table) {
    $table->id();
    $table->foreignId('invoice_id')->constrained()->cascadeOnDelete();
    $table->string('description');
    $table->unsignedInteger('quantity');
    $table->decimal('unit_price', 10, 2);
    $table->unsignedSmallInteger('position')->default(0);
    $table->timestamps();
});
```

The `Invoice` model gets the relation, and `InvoiceItem` lists its fillable columns:

```php
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['customer_name', 'due_on'])]
class Invoice extends Model
{
    protected function casts(): array
    {
        return ['due_on' => 'date'];
    }

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }
}

#[Fillable(['description', 'quantity', 'unit_price', 'position'])]
class InvoiceItem extends Model
{
    protected function casts(): array
    {
        return ['quantity' => 'integer', 'unit_price' => 'decimal:2'];
    }
}
```

Now the controller. The invoice and its rows are saved in one transaction, so a failure never leaves an invoice without lines:

```php
<?php

namespace App\Http\Controllers;

use App\Forms\InvoiceForm;
use App\Models\Invoice;
use Erag\InertiaForms\Attributes\Validate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Invoices/Form', [
            'form' => InvoiceForm::make(),
        ]);
    }

    public function store(#[Validate] InvoiceForm $form): RedirectResponse
    {
        $invoice = DB::transaction(function () use ($form) {
            $invoice = Invoice::create(Arr::except($form->validated(), 'items'));

            $this->saveItems($invoice, $form->validated('items'));

            return $invoice;
        });

        return to_route('invoices.edit', $invoice);
    }

    /**
     * @param  array<int, array{description: string, quantity: string, unit_price: string}>  $items
     */
    private function saveItems(Invoice $invoice, array $items): void
    {
        $invoice->items()->createMany(
            collect($items)
                ->values()
                ->map(fn (array $item, int $position) => [...$item, 'position' => $position])
                ->all()
        );
    }
}
```

`createMany()` creates one `InvoiceItem` per row and fills in `invoice_id` for you. The row's index becomes its `position`.

## How to load the rows back for editing

`bind()` accepts a model or a plain array. Here a plain array is the clearest choice, because you control exactly which keys each row has:

```php
public function edit(Invoice $invoice): Response
{
    return Inertia::render('Invoices/Form', [
        'form' => InvoiceForm::make()
            ->route('invoices.update', $invoice)
            ->bind([
                'customer_name' => $invoice->customer_name,
                'due_on' => $invoice->due_on,
                'items' => $invoice->items()
                    ->orderBy('position')
                    ->get(['description', 'quantity', 'unit_price'])
                    ->toArray(),
            ]),
    ]);
}
```

The bound rows replace the `default()` row, and the Carbon date is formatted for the date picker. Because something is bound, `getModel()` is no longer `null`, so the button reads "Save invoice".

For the update, the simplest correct approach is to replace the rows:

```php
public function update(Invoice $invoice, #[Validate] InvoiceForm $form): RedirectResponse
{
    DB::transaction(function () use ($invoice, $form) {
        $invoice->update(Arr::except($form->validated(), 'items'));

        $invoice->items()->delete();
        $this->saveItems($invoice, $form->validated('items'));
    });

    return back();
}
```

`#[Validate]` is fine here because none of the rules depend on the bound invoice. The routes:

```php
Route::get('invoices/create', [InvoiceController::class, 'create'])->name('invoices.create');
Route::post('invoices', [InvoiceController::class, 'store'])->name('invoices.store');
Route::get('invoices/{invoice}/edit', [InvoiceController::class, 'edit'])->name('invoices.edit');
Route::put('invoices/{invoice}', [InvoiceController::class, 'update'])->name('invoices.update');
```

Replacing rows gives them new IDs. If other records point at a line item, like a refund that references one line, keep the IDs instead. Add `Hidden::make('id')` to the row fields, bind the `id`, then update rows through `$invoice->items()->whereKey($id)`, create rows without an ID and delete the rest. Always look the ID up through the invoice, because a hidden value can be changed in the browser.

## More "add more" examples

Phone numbers, capped at three:

```php
Repeater::make('phones')
    ->itemLabel('Phone')
    ->columns(3)
    ->maxItems(3)
    ->fields([
        Combobox::make('type')->options(['mobile' => 'Mobile', 'work' => 'Work', 'home' => 'Home'])->required(),
        TextInput::make('number')->tel()->required()->columnSpan(2),
    ]);
```

Team members, in a short list that doesn't need collapsing:

```php
Repeater::make('members')
    ->itemLabel('Member')
    ->titleFrom('name')
    ->columns(2)
    ->collapsible(false)
    ->fields([
        TextInput::make('name')->required(),
        TextInput::make('email')->email()->required(),
    ]);
```

Exactly three references. `addable(false)` and `deletable(false)` remove the buttons, and `minItems(3)` with `maxItems(3)` makes the server reject any other count:

```php
Repeater::make('references')
    ->itemLabel('Reference')
    ->minItems(3)
    ->maxItems(3)
    ->addable(false)
    ->deletable(false)
    ->default([['name' => ''], ['name' => ''], ['name' => '']])
    ->fields([
        TextInput::make('name')->required(),
        TextInput::make('phone')->tel(),
    ]);
```

## When a JSON column is enough

Not every list needs its own table. FAQ entries on a landing page or a user's social links are only ever shown with their parent. Store them in a `json` column with an `array` cast:

```php
$page->update(['faq' => $form->validated('faq')]);
```

Because the validated rows keep only known keys, the value is safe to store as it is, and `bind($page)` fills the repeater straight from the column. Use a separate table when you need to query, sum or link to individual rows.

## Common problems and fixes

### An empty list passes validation

Without `required()` or `minItems(1)`, the field gets `nullable`, so no rows is a valid answer. Add one of them.

### Rows come back in a different order

The database doesn't promise any order. Save a `position` column and sort by it when you load the rows.

### Old rows are still there after editing

Your update creates the new rows but never removes the old ones. Delete and recreate them inside a transaction, or sync by ID as described above.

### The add button is greyed out

The list has reached `maxItems()`. Raise the limit or remove it.

### A repeater inside a repeater doesn't work

Nesting a Repeater (or Blocks) inside a Repeater row isn't supported yet. Move the inner list to its own form, or flatten it into a single row.

### Every row is saved with position 0

`createMany()` uses mass assignment. If `position` isn't in the model's fillable list, Laravel quietly drops it (or throws a `MassAssignmentException` if your app uses `Model::shouldBeStrict()`). Add every column you pass to the fillable list.

## Frequently asked questions

### How do I add more fields dynamically in Laravel?

Name the inputs as an array, like `items[0][name]`, add or remove rows in the browser, and validate them with `items.*` rules. In a Laravel Inertia app, a Repeater field gives you the add, remove and reorder UI plus the rules from one PHP definition.

### How do I validate an array of inputs in Laravel?

Use the `*` wildcard, for example `'items.*.email' => ['required', 'email']`, plus `array`, `min` and `max` on the list itself. The Repeater generates the same checks per row and names the row in each error message.

### How do I save multiple rows to a hasMany relation?

Call `$parent->items()->createMany($rows)` with the validated rows. Wrap it in `DB::transaction()` together with the parent, so both are saved or neither is.

### Can users reorder the rows?

Yes. Rows can be dragged by their handle or moved with the up and down buttons. Save a `position` column so the new order survives a reload, or call `reorderable(false)` to lock the order.

### Can I limit how many rows a user adds?

Yes. `maxItems()` disables the add button at the limit and `minItems()` disables delete at the minimum. The server checks both, so a crafted request can't get around them.

### Can I show a field in only some rows?

Yes. `visibleWhen()` works inside a row and is checked against that row's own values. Hidden fields in a row are skipped during validation for that row.

### Does the Repeater work with React and Svelte?

Yes. The PHP form class is the same for all three. Install `@erag/inertia-forms-react` or `@erag/inertia-forms-svelte` and render the same `<Form>` component.

## Build your first repeater

```bash
composer require erag/inertia-forms
php artisan erag:install-inertia-forms
npm install @erag/inertia-forms-vue
```

- **Repeater docs:** [erag.in/laravel-inertia-forms/fields/repeater.html](https://erag.in/laravel-inertia-forms/fields/repeater.html)
- **Validation:** [erag.in/laravel-inertia-forms/concepts/validation.html](https://erag.in/laravel-inertia-forms/concepts/validation.html)
- **GitHub:** [eramitgupta/laravel-Inertia-forms](https://github.com/eramitgupta/laravel-Inertia-forms)
- **Next steps:** show fields only when they apply with [conditional forms](./inertia-forms-permissions-conditional-fields.md), or split a long form into steps with [multi-step form wizards](./multi-step-form-wizard-laravel-inertia.md).
