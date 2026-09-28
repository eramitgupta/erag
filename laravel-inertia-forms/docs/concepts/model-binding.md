---
title: 'Model Binding'
description: 'Fill a form from an Eloquent model or array with bind(), including nested paths, dates, enums, and booleans.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/concepts/model-binding.md
</div>


<div class="doc-category">Core Concepts</div>

# Model Binding

Fill a form with existing values from an Eloquent model or an array with `bind()`.

```php
public function edit(Post $post): Response
{
    return Inertia::render('Posts/Edit', [
        'form' => PostForm::make()
            ->route('posts.update', $post)
            ->bind($post),
    ]);
}
```

**When to use:** edit screens. One form class can handle both "create" and "edit".

## Examples

Each example is a live form built from the PHP below it. The docs have no database, so the examples bind arrays; an Eloquent model works the same way.

### Basic

`title` and `excerpt` come from the bound array. `author` isn't in it, so the field falls back to its default.

<Example id="concepts/model-binding/basic">

<<< @/../examples/concepts/model-binding/basic.php#example

</Example>

### Nested keys

Dot-notation names read nested values, such as settings stored in a JSON column. `billing.email` is present but `null`, so it starts empty instead of using its default.

<Example id="concepts/model-binding/nested">

<<< @/../examples/concepts/model-binding/nested.php#example

</Example>

### Advanced: enums, dates and edit mode

The bound values are the kind a model with casts returns: a backed enum, Carbon dates, a collection and an integer flag. Each field converts its value for the browser. Because a model is bound, `getModel()` switches the button to "Save changes".

<Example id="concepts/model-binding/conversion">

<<< @/../examples/concepts/model-binding/conversion.php#example

</Example>

## Where initial values come from

For each field, `data()` picks the first of these that applies:

1. **The bound model or array**, when it has a value for the field name.
2. **The field's default** from `->default()`.
3. **The field's empty value** (for example `''` for text, `null` for a combobox, `[]` for a checkbox group).

```php
TextInput::make('title')->default('Untitled');

PostForm::make()->data();                         // ['title' => 'Untitled']
PostForm::make()->bind(['title' => 'Hi'])->data(); // ['title' => 'Hi']
```

### What counts as "has a value"

- **Arrays**: the key exists (checked with `Arr::has()`, dot notation supported). A key set to `null` counts as present, so the default is **not** used; the field gets its empty value.
- **Models**: the value is not `null`, or the first segment of the name is one of the model's attributes. Accessors and loaded relations work through `data_get()`.

## Nested data

Dot-notation field names read nested values and produce nested form data.

```php
TextInput::make('address.city');

PostForm::make()->bind(['address' => ['city' => 'Delhi']])->data();
// ['address' => ['city' => 'Delhi']]
```

With a model, `address.city` works with a JSON column cast to an array, or with a loaded `address` relation.

## Value conversion

Bound values are converted to what each control expects:

| Field | Conversion |
| ----- | ---------- |
| All fields | A backed enum becomes its value. `null` becomes the empty value. |
| [DatePicker](/fields/date-picker) | `DateTimeInterface` (Carbon) becomes `Y-m-d`, or `Y-m-d\TH:i` with `withTime()`. Strings are passed through unchanged. |
| [TimePicker](/fields/time-picker) | `DateTimeInterface` becomes `H:i`, or `H:i:s` with `withSeconds()`. |
| [Checkbox](/fields/checkbox) / [Toggle](/fields/toggle) | Truthy becomes the true value, falsy the false value (`1` → `true`). |
| [Combobox](/fields/combobox) `multiple()` / [CheckboxGroup](/fields/checkbox-group) | Collections and arrays become a plain list. Enum items become their values. |
| [FileUpload](/fields/file-upload) | Always starts empty. Existing files are never sent to the browser. |

::: tip Date columns
Add a `date` or `datetime` cast to your model so the value arrives as Carbon and is formatted for the input. A raw string like `2026-09-27 10:30:00` is passed through as-is.
:::

## Binding an array

`bind()` also accepts a plain array. This is handy for settings stored as JSON, or data from an API.

```php
SettingsForm::make()->bind($team->settings);
```

## Reading the bound model

Inside your form, `$this->getModel()` returns whatever was bound. Use it to tweak fields for edit mode:

```php
public function fields(): array
{
    $editing = $this->getModel() !== null;

    return [
        TextInput::make('email')->email()->required()->readonly($editing),
        TextInput::make('password')->password()->required()->authorizedUnless($editing),
        Submit::make($editing ? 'Save changes' : 'Create account'),
    ];
}
```

::: warning Model binding does not save anything
`bind()` only sets initial values. Saving is up to you:

```php
public function update(Request $request, Post $post)
{
    $post->update(PostForm::make()->bind($post)->validate($request));

    return to_route('posts.index');
}
```
:::
