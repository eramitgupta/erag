---
title: 'Blocks'
description: 'Repeatable content blocks with their own fields: add from a menu, reorder, collapse and delete. Each block type is validated with its own rules.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/fields/blocks.md
</div>


<div class="doc-category">Fields</div>

# Blocks

`Erag\InertiaForms\Fields\Blocks` holds a list of **content blocks**. You define the kinds of block with `Block`, each with its own fields, and users add blocks from a menu, fill them in, reorder, collapse and delete them. Like every other field, it is built into the package with Tailwind CSS and needs no extra library.

**When to use:** article or page outlines, landing page sections, FAQ entries, order lines, itineraries, or any list where each entry has several fields and there can be more than one kind of entry. When every entry has the same fields, use [Repeater](/fields/repeater) instead: it stores plain rows without a `type`.

Try it on the **Editorial calendar** and **Landing page** forms in the [Live Demo](/demo).

## Examples

Each example is a live form built from the PHP below it. Fill it in and press submit to see the data your controller would receive.

### Basic

Two block types. **Add block** opens a menu to choose one, and each block is stored as `type` plus `data`.

<Example id="fields/blocks/basic">

<<< @/../examples/fields/blocks/basic.php#example

</Example>

### Icons, titles and columns

`icon()` and `description()` shape the menu entries, `titleFrom()` names each block after a field, and the quote block lays its fields out in two columns.

<Example id="fields/blocks/layout">

<<< @/../examples/fields/blocks/layout.php#example

</Example>

### Advanced: page sections

A landing page builder with three block types. Two sections come from `default()` and start collapsed. New hero blocks start with the button field defaults, and `minItems()` / `maxItems()` limit the list.

<Example id="fields/blocks/landing-page">

<<< @/../examples/fields/blocks/landing-page.php#example

</Example>

## How it works

- **Add content block** opens a menu of your block types, each with its icon, label and description. With a single block type, the button adds it straight away. The new block opens and its first field gets focus.
- Each block is a card. The header shows the block title, a badge with the block type and its description.
- Click the header to collapse or expand a block. **Collapse all** / **Expand all** toggles every block.
- Drag the **⋮⋮** handle to move a block, or use the **up** and **down** buttons. The **trash** button deletes it.
- Fields inside a block work exactly like fields anywhere else: every built-in field, custom fields, `visibleWhen()`, `columnSpan()` and help text are all supported.
- When the server returns errors for a block, that block opens and its card gets a red border, so the messages are never hidden inside a collapsed block.

### Keyboard

| Key | Action |
| --- | ------ |
| Arrow Up / Down | Move between block types in the add menu |
| Enter / Space | Add the focused block type, or collapse / expand a focused block header |
| Escape | Close the add menu |

## Block methods

### `Block::make(string $name)`

The block type, stored as `type` in the value. Must be unique within the Blocks field.

### `label(?string $label)`

The name shown in the menu, the badge and the default title. Defaults to a title-cased version of the name.

### `description(?string $description)`

Short text under the label in the menu and the block header.

### `icon(?string $icon)`

One or two characters shown in the menu. Defaults to the first letter of the label.

### `titleFrom(?string $field)`

Use a field's value as the block title once it is filled in, e.g. the heading. Otherwise the title is the label and the block's position, like "Section 2".

### `columns(int $columns)`

Lay the block's fields out in a grid of 1 to 6 columns. Fields use `columnSpan()` as usual.

### `fields(array $fields)`

The fields of this block. Their names are relative to the block, so `heading` is stored as `body.0.data.heading`.

## Blocks methods

All [common field methods](/concepts/form-class#common-field-methods) are available, plus:

### `blocks(array $blocks)`

The block types users can add.

### `addActionLabel(?string $label)`

Text of the add button. Defaults to "Add block".

### `minItems(?int $count)` / `maxItems(?int $count)`

How many blocks are allowed. Delete buttons are disabled at the minimum and the add button at the maximum; the server checks both too.

### `reorderable()`, `addable()`, `deletable()`, `collapsible()`

Turn off the drag handle and move buttons, the add button, the delete buttons, or collapsing. All are on by default.

### `collapsed(bool $collapsed = true)`

Start existing blocks collapsed. Useful for long lists.

## Validation rules

| Attribute | Rules |
| --------- | ----- |
| `body` | `nullable` (or `required`), `array`, `min:<minItems>`, `max:<maxItems>` |
| `body.*` | `array:type,data` |
| `body.*.type` | `required`, `string`, one of your block names |
| `body.N.data.<field>` | the rules of that field, for every submitted block |

- Each block is validated with its own fields' rules. Fields hidden by `visibleWhen()` inside a block are skipped.
- Messages name the block: *"The Heading (Section 2) field is required."*

## Value

The value is a list of blocks, each with a `type` and a `data` object:

```json
[
    { "type": "section", "data": { "heading": "Why forms belong in PHP", "summary": "" } },
    { "type": "quote", "data": { "text": "One class drives the page.", "author": "Aisha Khan", "source": "" } }
]
```

`$form->validated()` returns the same shape, but each block only keeps its own visible fields, and nested fields like [Key Value](/fields/key-value) return their validated form. Unknown block types and unknown keys are dropped, so the result is safe to store in a `json` / `array` cast column.

New blocks start with their fields' `default()` values. Defaults, [bound models](/concepts/model-binding) and JSON strings are filled in the same way, so a block saved before you added a field still gets that field's starting value.

Empty value: `[]` (no blocks).

::: tip File uploads in blocks
A `FileUpload` inside a block makes the whole form submit as multipart, like a top-level upload. Validated files are `UploadedFile` instances inside the block data.
:::

::: warning Nesting
A Blocks or [Repeater](/fields/repeater) field inside a block is not supported yet.
:::

## Standalone use

::: code-group

```vue [Vue]
<Blocks v-model="body" :field="bodyField" id="body" :disabled="false" />
```

```tsx [React]
<Blocks field={bodyField} id="body" value={body} disabled={false} onChange={setBody} />
```

```svelte [Svelte]
<Blocks field={bodyField} id="body" bind:value={body} disabled={false} />
```

:::

Outside `<Form>`, the nested fields render with the built-in components and show no server errors. Inside `<Form>`, the Blocks component picks up the form's registered `components` and errors automatically.
