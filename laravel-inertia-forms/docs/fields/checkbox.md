---
title: 'Checkbox'
description: 'A single checkbox with its label beside it. Custom true and false values, and required() means the box must be checked.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/fields/checkbox.md
</div>


<div class="doc-category">Fields</div>

# Checkbox

`Erag\InertiaForms\Fields\Checkbox` renders a single checkbox with its label next to it.

**When to use:** a single yes/no choice, like "I agree to the terms" or "Remember me".

## Examples

Each example is a live form built from the PHP below it. Fill it in and press submit to see the data your controller would receive.

### Basic

A required checkbox must be ticked before the form can be sent.

<Example id="fields/checkbox/basic">

<<< @/../examples/fields/checkbox/basic.php#example

</Example>

### Custom values

Store `yes` / `no` or `1` / `0` instead of `true` / `false`. Toggle them and submit to see the values.

<Example id="fields/checkbox/custom-values">

<<< @/../examples/fields/checkbox/custom-values.php#example

</Example>

### Advanced: sign-up form

An optional newsletter box that starts ticked, next to the required terms box.

<Example id="fields/checkbox/signup">

<<< @/../examples/fields/checkbox/signup.php#example

</Example>

## Methods

All [common field methods](/concepts/form-class#common-field-methods) are available, plus:

### `trueValue(mixed $value)`

The value stored when the box is checked. Default `true`.

```php
Checkbox::make('newsletter')->trueValue('yes')->falseValue('no');
```

### `falseValue(mixed $value)`

The value stored when the box is unchecked. Default `false`.

```php
Checkbox::make('opt_in')->trueValue(1)->falseValue(0);
```

## Validation rules

| Configuration | Rules |
| ------------- | ----- |
| default (`true`/`false`) | `boolean` |
| custom true/false values | `Rule::in([trueValue, falseValue])` (a `null` value is left out) |

```php
Checkbox::make('remember');
// ['nullable', 'boolean']

Checkbox::make('newsletter')->trueValue('yes')->falseValue('no');
// ['nullable', Rule::in(['yes', 'no'])]
```

### Required means "must be checked"

```php
Checkbox::make('terms')->label('I agree to the terms')->required();
// ['required', 'accepted']

Checkbox::make('newsletter')->trueValue('yes')->falseValue('no')->required();
// ['required', Rule::in(['yes'])]
```

On failure the message reads "The I agree to the terms field must be accepted."

## Value

- The true value when checked, the false value when unchecked.
- Empty value: the false value (`false` by default).
- Bound values are converted: a value equal to the true or false value is kept, otherwise truthy becomes the true value and falsy the false value.

## Standalone use

::: code-group

```vue [Vue]
<Checkbox v-model="remember" :field="rememberField" id="remember" :disabled="false" />
```

```tsx [React]
<Checkbox field={rememberField} id="remember" value={remember} disabled={false} onChange={setRemember} />
```

```svelte [Svelte]
<Checkbox field={rememberField} id="remember" bind:value={remember} disabled={false} />
```

:::

The checkbox renders its own label from `field.label`, so it needs no wrapper. It compares the value with `field.trueValue` and `field.falseValue`, so pass a serialized field (see [Standalone Components](/frontend/standalone)).
