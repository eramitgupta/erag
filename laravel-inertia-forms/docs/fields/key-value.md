---
title: 'Key Value'
description: 'Editable key and value rows for metadata, headers or settings. Add, remove and reorder rows; validated() returns a plain key-value array.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/fields/key-value.md
</div>


<div class="doc-category">Fields</div>

# Key Value

`Erag\InertiaForms\Fields\KeyValue` renders a small table of **key / value** rows. Users can add rows, remove them, and change their order with the drag handle or the up and down buttons. Like every other field, it is built into the package with Tailwind CSS and needs no extra library.

**When to use:** invoice or order metadata, HTTP headers, environment variables, feature settings, or any list of named values that users define themselves.

```php
use Erag\InertiaForms\Fields\KeyValue;

KeyValue::make('invoice_metadata')
    ->keyPlaceholder('region')
    ->valuePlaceholder('EMEA')
    ->addActionLabel('Add metadata')
    ->maxItems(8);
```

Try it on the **Subscription billing** and **All fields** forms in the [Live Demo](/demo).

## Examples

Each example is a live form built from the PHP below it. Fill it in and press submit to see the data your controller would receive.

### Basic

An empty table where users add their own rows. Submit to see the `{ key, value }` rows the browser sends; `validated()` turns them into a plain array.

<Example id="fields/key-value/basic">

<<< @/../examples/fields/key-value/basic.php#example

</Example>

### Labels, placeholders and a limit

Custom column names, placeholder text, a custom add button, and at most five rows. The add button turns off at the limit.

<Example id="fields/key-value/headers">

<<< @/../examples/fields/key-value/headers.php#example

</Example>

### Advanced: fixed keys

The rows come from `default()`. With `editableKeys(false)`, `addable(false)`, `deletable(false)` and `reorderable(false)` users can only change the values.

<Example id="fields/key-value/fixed-keys">

<<< @/../examples/fields/key-value/fixed-keys.php#example

</Example>

## How it works

- Each row has a key input and a value input. The header shows the column names (**Key** and **Value** by default).
- **Add row** (or your `addActionLabel()`) appends an empty row and moves focus into it.
- The **×** button removes a row.
- Drag the **⋮⋮** handle to move a row, or use the **up** and **down** buttons. Focus stays with the row you moved, so keyboard users can keep pressing the same button.
- Empty rows are allowed while editing. Rows without a key are dropped when the form is validated.

## Methods

All [common field methods](/concepts/form-class#common-field-methods) are available, plus:

### `keyLabel(string $label)` / `valueLabel(string $label)`

The column headings. They are also used in the input labels for screen readers and in validation messages.

```php
KeyValue::make('headers')->keyLabel('Header')->valueLabel('Value');
```

### `keyPlaceholder(?string $placeholder)` / `valuePlaceholder(?string $placeholder)`

Placeholder text for every key and value input.

### `addActionLabel(?string $label)`

Text of the add button. Defaults to "Add row".

### `reorderable(bool $reorderable = true)`

Show the drag handle and the up and down buttons. On by default.

### `addable(bool $addable = true)` / `deletable(bool $deletable = true)`

Hide the add button or the remove buttons. Turn both off together with `editableKeys(false)` to let users only fill in the values of rows you provide.

```php
KeyValue::make('limits')
    ->default(['requests_per_minute' => '60', 'burst' => '10'])
    ->addable(false)
    ->deletable(false)
    ->editableKeys(false);
```

### `editableKeys(bool $editable = true)`

Make the key inputs read-only. Useful for a fixed set of keys.

### `maxItems(?int $count)`

The most rows allowed. The add button is disabled when the limit is reached, and the server checks it too.

### `maxKeyLength(?int $characters)` / `maxValueLength(?int $characters)`

Limit the length of keys (255 by default) and values (no limit by default).

## Validation rules

| Attribute | Rules |
| --------- | ----- |
| `name` | `nullable` (or `required`), `array`, `max:<maxItems>` |
| `name.*` | `array:key,value` |
| `name.*.key` | `nullable`, `string`, `required_with:name.*.value`, `distinct:ignore_case`, `max:255` |
| `name.*.value` | `nullable`, `string`, `max:<maxValueLength>` |

- A value without a key fails with *"The Invoice metadata key (row 3) field is required when a value is filled in."*
- Keys must be unique (case-insensitive): *"The Invoice metadata key (row 2) is used more than once."*
- With `required()`, at least one row must have a key. Rows that are completely empty do not count.

## Value

In the browser the value is a list of rows:

```json
[
    { "key": "region", "value": "EMEA" },
    { "key": "cost_center", "value": "OPS-204" }
]
```

`$form->validated()` turns it into a plain array, keeping the row order and dropping rows without a key:

```php
$form->validated('invoice_metadata');
// ['region' => 'EMEA', 'cost_center' => 'OPS-204']
```

That is ready to save in a `json` / `array` cast column. Defaults and [bound models](/concepts/model-binding) work the same way in reverse: `default(['region' => 'EMEA'])`, an `array` cast attribute, or a JSON string are all turned into rows for the browser.

Empty value: `[]` (no rows).

## Standalone use

::: code-group

```vue [Vue]
<KeyValue v-model="metadata" :field="metadataField" id="metadata" :disabled="false" />
```

```tsx [React]
<KeyValue field={metadataField} id="metadata" value={metadata} disabled={false} onChange={setMetadata} />
```

```svelte [Svelte]
<KeyValue field={metadataField} id="metadata" bind:value={metadata} disabled={false} />
```

:::

Start with a list of `{ key, value }` rows (or `[]`) as the value. The table is labelled by an element with the id `` `${id}-label` ``; inside `<Form>` the field wrapper provides it. See [Standalone Components](/frontend/standalone).
