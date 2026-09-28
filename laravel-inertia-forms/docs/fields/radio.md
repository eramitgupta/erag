---
title: 'Radio'
description: 'Pick one option from a list of radio buttons, shown as a list, description cards, columns, or a segmented button control.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/fields/radio.md
</div>


<div class="doc-category">Fields</div>

# Radio

`Erag\InertiaForms\Fields\Radio` renders a group of radio buttons. When any option has a description, each option is drawn as a card with the description under the label. With `buttons()`, the options become a segmented control.

**When to use:** a small set of choices (2 to 6) that users should see at a glance.

```php
use Erag\InertiaForms\Fields\Radio;

Radio::make('shipping')->options([
    ['value' => 'standard', 'label' => 'Standard', 'description' => '3 to 5 business days'],
    ['value' => 'express', 'label' => 'Express', 'description' => 'Next business day'],
])->default('standard')->columns(2);
```

## Examples

Each example is a live form built from the PHP below it. Fill it in and press submit to see the data your controller would receive.

### Basic

Three plain options on one line with `inline()`.

<Example id="fields/radio/basic">

<<< @/../examples/fields/radio/basic.php#example

</Example>

### Cards with descriptions

When options have descriptions, each one is drawn as a card. Here in two columns, with a default and a disabled option.

<Example id="fields/radio/cards">

<<< @/../examples/fields/radio/cards.php#example

</Example>

### Advanced: segmented buttons

`buttons()` turns short options into a segmented control, one with a default and one required.

<Example id="fields/radio/buttons">

<<< @/../examples/fields/radio/buttons.php#example

</Example>

## Methods

All [common field methods](/concepts/form-class#common-field-methods) are available, plus:

### `options(mixed $options)`

The choices. Accepts every format described in [Combobox → Option formats](/fields/combobox#option-formats), including enums and collections.

```php
Radio::make('size')->options(['S', 'M', 'L']);
```

### `inline(bool $inline = true)`

Place options next to each other on one line (wrapping when needed).

```php
Radio::make('answer')->options(['yes' => 'Yes', 'no' => 'No'])->inline();
```

### `columns(?int $columns)`

Lay options out in a grid. Supports 1 to 4 columns on wider screens; options stack on mobile. Ignored when `inline()` is on.

```php
Radio::make('plan')->options(Plan::class)->columns(3);
```

### `buttons(bool $buttons = true)`

Draw the options as a segmented control: one row of joined buttons where the selected one is filled with the accent color. It suits short labels like view modes, billing periods, or sizes. The real radio inputs stay in the page (visually hidden), so arrow keys, Tab, and screen readers work as usual.

```php
Radio::make('billing')
    ->options(['monthly' => 'Monthly', 'yearly' => 'Yearly'])
    ->default('monthly')
    ->buttons();
```

In this mode only labels are shown; descriptions, `inline()`, and `columns()` are ignored. The row wraps when it runs out of room.

## Validation rules

| Configuration | Rules |
| ------------- | ----- |
| default | `Rule::in(<option values>)` |

```php
Radio::make('contact_method')->options(['email' => 'Email', 'phone' => 'Phone'])->required();
// ['required', Rule::in(['email', 'phone'])]
```

## Value

- The selected option value.
- Empty value: `null` (nothing selected).

## Standalone use

::: code-group

```vue [Vue]
<Radio v-model="shipping" :field="shippingField" id="shipping" :disabled="false" />
```

```tsx [React]
<Radio field={shippingField} id="shipping" value={shipping} disabled={false} onChange={setShipping} />
```

```svelte [Svelte]
<Radio field={shippingField} id="shipping" bind:value={shipping} disabled={false} />
```

:::

The group is labelled by an element with the id `` `${id}-label` ``. Inside `<Form>`, the field wrapper provides it. When standalone, render your own element with that id, or wrap the component in [`FieldWrapper`](/frontend/standalone#fieldwrapper).
