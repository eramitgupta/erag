---
title: 'Repeater'
description: 'Repeat the same group of fields as rows: links, contacts, FAQ entries or line items. Add, reorder, collapse and delete rows; the value is a plain list.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/fields/repeater.md
</div>


<div class="doc-category">Fields</div>

# Repeater

`Erag\InertiaForms\Fields\Repeater` repeats one group of fields as a list of items. Users add items, fill them in, reorder, collapse and delete them. It works like [Blocks](/fields/blocks) with a single block type, but stores **plain rows** instead of `{ type, data }` items. Like every other field, it is built into the package with Tailwind CSS and needs no extra library.

**When to use:** social links, contact people, FAQ entries, order lines, speakers, or any list where every entry has the same few fields. When entries can be of different kinds (a heading, a quote, an image), use [Blocks](/fields/blocks).

Try it on the **Landing page** and **All fields** forms in the [Live Demo](/demo).

## Examples

Each example is a live form built from the PHP below it. Fill it in and press submit to see the data your controller would receive.

### Basic

A list of links. Each item has the same two fields, and the value is a plain array of rows.

<Example id="fields/repeater/basic">

<<< @/../examples/fields/repeater/basic.php#example

</Example>

### Item titles

`titleFrom('question')` shows the question in the item header once it is typed. `maxItems(5)` disables the add button after five questions.

<Example id="fields/repeater/faq">

<<< @/../examples/fields/repeater/faq.php#example

</Example>

### Advanced: grid, limits and defaults

Two contacts are filled in with `default()` and start collapsed. Each item uses a two-column grid, and `minItems(1)` keeps at least one contact in the list.

<Example id="fields/repeater/contacts">

<<< @/../examples/fields/repeater/contacts.php#example

</Example>

## How it works

- The add button (**Add question** in the example) appends a new item straight away. There is no menu, because there is only one kind of item. The new item opens and its first field gets focus.
- Each item is a card. Its header shows the item title: the value of the `titleFrom()` field once it is filled in, otherwise the item label and position, like "Question 2".
- Click the header to collapse or expand an item. **Collapse all** / **Expand all** toggles every item.
- Drag the **⋮⋮** handle to move an item, or use the **up** and **down** buttons. The **trash** button deletes it.
- Fields inside an item work like fields anywhere else: every built-in field, custom fields, `visibleWhen()` (checked against the item's own values), `columnSpan()` and help text.
- When the server returns errors for an item, that item opens and gets a red border.

## Methods

All [common field methods](/concepts/form-class#common-field-methods) are available, plus:

### `fields(array $fields)`

The fields of each item. Their names are relative to the item, so `question` is stored as `faq.0.question`.

### `itemLabel(string $label)`

The name of one item, used in item titles ("Question 2"), the default add button text and validation messages. Defaults to "Item".

### `titleFrom(?string $field)`

Use a field's value as the item title once it is filled in.

### `columns(int $columns)`

Lay each item's fields out in a grid of 1 to 6 columns. Fields use `columnSpan()` as usual.

```php
Repeater::make('contacts')
    ->itemLabel('Contact')
    ->columns(2)
    ->fields([
        TextInput::make('name')->required(),
        TextInput::make('email')->email(),
        TextInput::make('role')->columnSpan(2),
    ]);
```

### `addActionLabel(?string $label)`

Text of the add button. Defaults to "Add" plus the item label in lower case, like "Add contact".

### `minItems(?int $count)` / `maxItems(?int $count)`

How many items are allowed. Delete buttons are disabled at the minimum and the add button at the maximum; the server checks both too.

### `reorderable()`, `addable()`, `deletable()`, `collapsible()`

Turn off the drag handle and move buttons, the add button, the delete buttons, or collapsing. All are on by default.

### `collapsed(bool $collapsed = true)`

Start existing items collapsed.

## Validation rules

| Attribute | Rules |
| --------- | ----- |
| `faq` | `nullable` (or `required`), `array`, `min:<minItems>`, `max:<maxItems>` |
| `faq.*` | `array` |
| `faq.N.<field>` | the rules of that field, for every submitted item |

- Each item is validated with its fields' rules. Fields hidden by `visibleWhen()` inside an item are skipped.
- Messages name the item: *"The Label (Link 2) field is required."*
- With `required()` or `minItems(1)`, an empty list fails.

## Value

The value is a list of rows, one array per item:

```json
[
    { "question": "Can I cancel any time?", "answer": "Yes, from the billing page." },
    { "question": "Is there a free plan?", "answer": "Yes, for up to three users." }
]
```

`$form->validated()` returns the same shape, but each row only keeps the item's own visible fields. Unknown keys are dropped:

```php
// submitted: [['label' => 'Docs', 'url' => 'https://erag.in', 'extra' => 'x']]
$form->validated('links');
// [['label' => 'Docs', 'url' => 'https://erag.in']]
```

That is ready to store in a `json` / `array` cast column. Defaults, [bound models](/concepts/model-binding) and JSON strings are filled in the same way, and missing fields get their starting value: `default([['label' => 'Docs']])` becomes `[['label' => 'Docs', 'url' => '']]`.

Empty value: `[]` (no items).

::: warning Nesting
A Repeater or [Blocks](/fields/blocks) field inside a Repeater item is not supported yet.
:::

## Standalone use

::: code-group

```vue [Vue]
<Repeater v-model="faq" :field="faqField" id="faq" :disabled="false" />
```

```tsx [React]
<Repeater field={faqField} id="faq" value={faq} disabled={false} onChange={setFaq} />
```

```svelte [Svelte]
<Repeater field={faqField} id="faq" bind:value={faq} disabled={false} />
```

:::

`Repeater` is the Blocks component in repeater mode (it switches when `field.component` is `'Repeater'`). Start with a list of row objects (or `[]`) as the value. See [Standalone Components](/frontend/standalone).
