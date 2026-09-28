---
title: 'Text Input'
description: 'Single-line inputs for text, email, password, number, URL, phone, and search, with prefixes, suffixes, and length or number limits.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/fields/text-input.md
</div>


<div class="doc-category">Fields</div>

# Text Input

`Erag\InertiaForms\Fields\TextInput` renders a single-line `<input>`. It covers text, email, password, number, URL, phone, and search inputs.

**When to use:** names, emails, passwords, amounts, short answers.

```php
use Erag\InertiaForms\Fields\TextInput;

TextInput::make('name')->required()->maxLength(100);
TextInput::make('email')->email()->required();
TextInput::make('price')->number()->min(0)->step(0.01)->prefix('$');
```

## Examples

Each example is a live form built from the PHP below it. Fill it in and press submit to see the data your controller would receive.

### Basic

A required name with a length limit, and an email input that also adds the `email` rule.

<Example id="fields/text-input/basic">

<<< @/../examples/fields/text-input/basic.php#example

</Example>

### Types, prefix and suffix

`number()` with `step()` for decimals, `prefix()` / `suffix()` for units and fixed URL parts, a `password()` with its own autocomplete, and a `search()` input with a `clearable()` × button. The prefix and suffix are not part of the submitted value.

<Example id="fields/text-input/types">

<<< @/../examples/fields/text-input/types.php#example

</Example>

### Advanced: contact details

A two-column block with autocomplete hints for the browser, a `tel()` field that opens the number pad on phones, and a budget limited with `min()` / `max()`.

<Example id="fields/text-input/contact">

<<< @/../examples/fields/text-input/contact.php#example

</Example>

## Methods

All [common field methods](/concepts/form-class#common-field-methods) are available, plus:

### `type(string $type)`

Set the HTML input type directly. The default is `text`.

```php
TextInput::make('code')->type('text');
```

### `email()`

Shortcut for `type('email')`. Adds the `email` validation rule.

```php
TextInput::make('email')->email();
```

### `password()`

Shortcut for `type('password')`. Sets `autocomplete="current-password"` unless you set your own.

```php
TextInput::make('password')->password()->autocomplete('new-password');
```

### `number()`

Shortcut for `type('number')`. Switches validation to `numeric` and uses `min()`/`max()` instead of `minLength()`/`maxLength()`.

```php
TextInput::make('quantity')->number()->min(1)->max(99);
```

### `url()`

Shortcut for `type('url')`. Adds the `url` validation rule.

```php
TextInput::make('website')->url()->prefix('https://');
```

### `tel()`

Shortcut for `type('tel')`. Mobile keyboards show a number pad.

```php
TextInput::make('phone')->tel();
```

### `search()`

Shortcut for `type('search')`.

```php
TextInput::make('keyword')->search();
```

### `minLength(?int $length)` / `maxLength(?int $length)`

Minimum and maximum number of characters. Sets the HTML attributes and adds `min:`/`max:` rules (for non-number types).

```php
TextInput::make('username')->minLength(3)->maxLength(20);
```

### `min(int|float|null $value)` / `max(int|float|null $value)`

Smallest and largest allowed number. Sets the HTML attributes and adds `min:`/`max:` rules (for `number()` only).

```php
TextInput::make('age')->number()->min(18)->max(120);
```

### `step(int|float|string|null $step)`

The HTML `step` attribute, for example `0.01` for prices or `'any'`. It is not validated on the server.

```php
TextInput::make('price')->number()->step(0.01);
```

### `prefix(?string $prefix)` / `suffix(?string $suffix)`

Text shown inside the input box before or after the value. The text is only visual and is not part of the value.

```php
TextInput::make('domain')->prefix('https://')->suffix('.example.com');
TextInput::make('budget')->number()->suffix('USD');
```

### `autocomplete(?string $autocomplete)`

The HTML `autocomplete` attribute.

```php
TextInput::make('email')->email()->autocomplete('email');
```

### `clearable(bool $clearable = true)`

Show a × button at the end of the input while it has text. Clicking it empties the value. The button is hidden when the field is disabled or read-only, and it works together with `prefix()` / `suffix()`.

```php
TextInput::make('keyword')->search()->clearable();
```

## Validation rules

| Configuration | Rules |
| ------------- | ----- |
| default / `tel()` / `password()` / `search()` / custom type | `string` |
| `email()` | `string`, `email` |
| `url()` | `string`, `url` |
| `minLength(3)` / `maxLength(20)` | adds `min:3` / `max:20` |
| `number()` | `numeric` |
| `number()->min(0)->max(10)` | `numeric`, `min:0`, `max:10` |

Every rule list starts with `required` or `nullable`. Example:

```php
TextInput::make('name')->required()->maxLength(50);
// ['required', 'string', 'max:50']
```

## Value

- Stores a string. Number inputs also send the typed text as a string; the `numeric` rule accepts it.
- Empty value: `''`.

## Standalone use

::: code-group

```vue [Vue]
<script setup lang="ts">
import { ref } from 'vue';
import { TextInput, type FieldSchema } from '@erag/inertia-forms-vue';

defineProps<{ searchField: FieldSchema }>();
const query = ref('');
</script>

<template>
    <TextInput v-model="query" :field="searchField" id="search" :disabled="false" />
</template>
```

```tsx [React]
import { useState } from 'react';
import { TextInput, type FieldSchema } from '@erag/inertia-forms-react';

export function Search({ searchField }: { searchField: FieldSchema }) {
    const [query, setQuery] = useState('');

    return <TextInput field={searchField} id="search" value={query} disabled={false} onChange={(value) => setQuery(String(value))} />;
}
```

```svelte [Svelte]
<script lang="ts">
    import { TextInput, type FieldSchema } from '@erag/inertia-forms-svelte';

    let { searchField }: { searchField: FieldSchema } = $props();
    let query = $state('');
</script>

<TextInput field={searchField} id="search" bind:value={query} disabled={false} />
```

:::

Here `searchField` is a serialized field passed from Laravel, for example `'searchField' => TextInput::make('q')->search()->placeholder('Search…')`. See [Standalone Components](/frontend/standalone).
