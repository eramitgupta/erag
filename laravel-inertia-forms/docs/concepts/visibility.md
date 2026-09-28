---
title: 'Conditional Visibility'
description: 'Show or hide fields and fieldsets based on other values with visibleWhen() and hiddenWhen(), in the browser and during validation.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/concepts/visibility.md
</div>


<div class="doc-category">Core Concepts</div>

# Conditional Visibility

Show a field (or a whole fieldset) only when another field has a certain value.

```php
Combobox::make('contact_method')->options(['email' => 'Email', 'phone' => 'Phone']),

TextInput::make('phone')
    ->required()
    ->visibleWhen('contact_method', 'phone'),
```

The phone input appears only when "Phone" is selected.

**When to use:** "Other, please specify" inputs, business-only sections, fields that depend on a toggle, and similar cases.

## Examples

Each example is a live form built from the PHP below it. Change the answers to watch fields appear and disappear, then submit to see the data your controller would receive.

### Basic

One condition per field: the radio decides whether you are asked for an email or a phone number.

<Example id="concepts/visibility/basic">

<<< @/../examples/concepts/visibility/basic.php#example

</Example>

### Operators

A tour of the operators: `<` on a number, a list for "one of these", `contains` on a checkbox group, and `not_empty` on a text area. Try an age under 18, pick India, tick Workshops and type a note.

<Example id="concepts/visibility/operators">

<<< @/../examples/concepts/visibility/operators.php#example

</Example>

### Advanced: sections, nested fields and cleanup

The Company fieldset only shows for business accounts. Inside it, the VAT number depends on a nested field, and the PO number needs two conditions to pass. With `clearWhenHidden()`, switching back to Personal empties those values, so the submitted data doesn't carry stale company details.

<Example id="concepts/visibility/sections">

<<< @/../examples/concepts/visibility/sections.php#example

</Example>

## How it works

The rules are serialized into the schema. The frontend evaluates them on every change, and the backend evaluates the same rules when validating. Both sides use the same comparison logic, so they always agree on what is visible.

- **In the browser**, hidden fields are not rendered.
- **On the server**, hidden fields get no validation rules, so they are never required and never appear in `validated()`.

That second point is important: `->required()` on a hidden field is ignored until the field is visible.

## `visibleWhen()` and `hiddenWhen()`

Both methods take the name of another field, then either a value or an operator and a value.

```php
// Equal to a value
->visibleWhen('type', 'business')

// A list means "one of these"
->visibleWhen('country', ['IN', 'US'])

// Operator and value
->visibleWhen('age', '>=', 18)
->visibleWhen('tags', 'contains', 'vip')
->visibleWhen('status', '!=', 'draft')

// hiddenWhen() is the opposite of visibleWhen()
->hiddenWhen('same_as_billing', true)
```

| Arguments | Meaning |
| --------- | ------- |
| `('field', $value)` | Compare with `=`. |
| `('field', [$a, $b])` | Compare with `in`. |
| `('field', $operator, $value)` | Use any [supported operator](/reference/visibility-operators). |

An unknown operator throws an `InvalidArgumentException`.

::: tip Operators without a value
`empty`, `not_empty`, `truthy`, and `falsy` don't need a value. Pass the operator on its own:

```php
->visibleWhen('bio', 'not_empty')
->hiddenWhen('newsletter', 'falsy')
```

For boolean fields such as a [toggle](/fields/toggle), comparing with `true` also works: `->visibleWhen('has_company', true)`.
:::

## Multiple conditions

Chain calls to add more conditions. **All** of them must pass.

```php
TextInput::make('vat_number')
    ->visibleWhen('type', 'business')
    ->visibleWhen('country', 'in', ['DE', 'FR', 'IT']);
```

There is no built-in "or" between separate conditions. For "one of these values" on the same field, pass an array.

## Nested fields

Use dot notation to depend on nested data:

```php
TextInput::make('address.state')->visibleWhen('address.country', 'US');
```

## Fieldsets

Fieldsets support the same methods. When a fieldset is hidden, every field inside it is hidden and skipped during validation.

```php
Fieldset::make('Company details')
    ->visibleWhen('account_type', 'business')
    ->fields([
        TextInput::make('company_name')->required(),
        TextInput::make('vat_number'),
    ]);
```

## Clearing hidden values

By default, a hidden field keeps whatever the user typed before it was hidden. Hidden fields are not validated, and their values are not included in `validated()`, but they are still sent with the request.

Call `clearWhenHidden()` to reset the value to the field's empty value as soon as it becomes hidden in the browser:

```php
TextInput::make('phone')
    ->visibleWhen('contact_method', 'phone')
    ->clearWhenHidden();
```

This also applies when the field's fieldset becomes hidden.

## Value comparison

Values are compared as strings after a small normalization step, so `1`, `'1'`, and `1.0` are equal, and `true` equals `'true'`. Enum cases are compared by their backing value. Numeric operators (`>`, `>=`, `<`, `<=`) only pass when both sides are numeric.

See the [Visibility Operators reference](/reference/visibility-operators) for exact rules.

## Using visibility in your own code

Each frontend package exports `isVisible(conditions, data)`, the same function `<Form>` uses:

::: code-group

```vue [Vue]
<script setup lang="ts">
import { isVisible, type FieldSchema } from '@erag/inertia-forms-vue';

const props = defineProps<{ field: FieldSchema; data: Record<string, unknown> }>();
</script>

<template>
    <p v-if="isVisible(props.field.visibility, props.data)">Visible right now</p>
</template>
```

```tsx [React]
import { isVisible, type FieldSchema } from '@erag/inertia-forms-react';

function Hint({ field, data }: { field: FieldSchema; data: Record<string, unknown> }) {
    return isVisible(field.visibility, data) ? <p>Visible right now</p> : null;
}
```

```svelte [Svelte]
<script lang="ts">
    import { isVisible, type FieldSchema } from '@erag/inertia-forms-svelte';

    let { field, data }: { field: FieldSchema; data: Record<string, unknown> } = $props();
</script>

{#if isVisible(field.visibility, data)}
    <p>Visible right now</p>
{/if}
```

:::

On the server, `$field->isVisibleFor($data)` does the same thing.
