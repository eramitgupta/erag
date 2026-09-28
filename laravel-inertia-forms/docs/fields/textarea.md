---
title: 'Textarea'
description: 'A multi-line text field with rows, length limits, auto-resize, and a live character counter.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/fields/textarea.md
</div>


<div class="doc-category">Fields</div>

# Textarea

`Erag\InertiaForms\Fields\Textarea` renders a multi-line `<textarea>`, with optional auto-resize and a character counter.

**When to use:** comments, descriptions, bios, messages.

```php
use Erag\InertiaForms\Fields\Textarea;

Textarea::make('bio')
    ->rows(4)
    ->maxLength(500)
    ->showCharacterCount()
    ->help('Shown on your public profile.');
```

## Examples

Each example is a live form built from the PHP below it. Fill it in and press submit to see the data your controller would receive.

### Basic

A required message box, four lines tall.

<Example id="fields/textarea/basic">

<<< @/../examples/fields/textarea/basic.php#example

</Example>

### Character counter

`maxLength()` stops typing at 280 characters, and `showCharacterCount()` shows how many are used.

<Example id="fields/textarea/character-count">

<<< @/../examples/fields/textarea/character-count.php#example

</Example>

### Advanced: support ticket

Both textareas grow with their content through `autoResize()`. The description needs at least 20 characters; the second box shows how a multi-line placeholder reads.

<Example id="fields/textarea/support-ticket">

<<< @/../examples/fields/textarea/support-ticket.php#example

</Example>

## Methods

All [common field methods](/concepts/form-class#common-field-methods) are available, plus:

### `rows(int $rows)`

Visible number of text lines. Default `3`.

```php
Textarea::make('message')->rows(6);
```

### `autoResize(bool $autoResize = true)`

Grow the textarea to fit its content instead of showing a scrollbar. Manual resizing is turned off.

```php
Textarea::make('notes')->autoResize();
```

### `minLength(?int $length)` / `maxLength(?int $length)`

Minimum and maximum number of characters. Sets the HTML attributes and adds `min:`/`max:` rules.

```php
Textarea::make('review')->minLength(20)->maxLength(1000);
```

### `showCharacterCount(bool $show = true)`

Show a live counter under the textarea. With `maxLength()` it reads `42 / 500`; without, just `42`.

```php
Textarea::make('tweet')->maxLength(280)->showCharacterCount();
```

## Validation rules

| Configuration | Rules |
| ------------- | ----- |
| default | `string` |
| `minLength(20)` | adds `min:20` |
| `maxLength(500)` | adds `max:500` |

```php
Textarea::make('bio')->maxLength(200);
// ['nullable', 'string', 'max:200']
```

## Value

- Stores a string.
- Empty value: `''`.

## Standalone use

::: code-group

```vue [Vue]
<Textarea v-model="notes" :field="notesField" id="notes" :disabled="false" />
```

```tsx [React]
<Textarea field={notesField} id="notes" value={notes} disabled={false} onChange={(value) => setNotes(String(value))} />
```

```svelte [Svelte]
<Textarea field={notesField} id="notes" bind:value={notes} disabled={false} />
```

:::

Import `Textarea` from your framework package. See [Standalone Components](/frontend/standalone).
