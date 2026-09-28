---
title: 'Checkbox Group'
description: 'Pick several options as checkboxes or toggle pills. Stores an array of values and supports descriptions, inline layout, columns, and array rules.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/fields/checkbox-group.md
</div>


<div class="doc-category">Fields</div>

# Checkbox Group

`Erag\InertiaForms\Fields\CheckboxGroup` renders a list of checkboxes and stores the checked option values as an array. When any option has a description, options are drawn as cards. With `buttons()`, the options become toggle pills.

**When to use:** picking several values from a short list, where a multi-select would hide the choices.

```php
use Erag\InertiaForms\Fields\CheckboxGroup;

CheckboxGroup::make('topics')->options([
    'news' => 'Product news',
    'tips' => 'Tips and tutorials',
    'events' => 'Events',
])->inline();
```

## Examples

Each example is a live form built from the PHP below it. Fill it in and press submit to see the data your controller would receive.

### Basic

Three options on one line. The value is an array of the checked keys.

<Example id="fields/checkbox-group/basic">

<<< @/../examples/fields/checkbox-group/basic.php#example

</Example>

### Cards with descriptions

Options with descriptions become cards; `columns(2)` puts them in a grid. At least one must be checked.

<Example id="fields/checkbox-group/cards">

<<< @/../examples/fields/checkbox-group/cards.php#example

</Example>

### Advanced: toggle pills

`buttons()` draws each option as a pill. The workdays start with a default selection; the interests are limited to three with `rule('max:3')`, which is checked on the server.

<Example id="fields/checkbox-group/buttons">

<<< @/../examples/fields/checkbox-group/buttons.php#example

</Example>

## Methods

All [common field methods](/concepts/form-class#common-field-methods) are available, plus:

### `options(mixed $options)`

The choices. Accepts every format described in [Combobox → Option formats](/fields/combobox#option-formats).

```php
CheckboxGroup::make('permissions')->options(Permission::pluck('label', 'name'));
```

### `inline(bool $inline = true)`

Place checkboxes next to each other on one line (wrapping when needed).

```php
CheckboxGroup::make('days')->options(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])->inline();
```

### `columns(?int $columns)`

Lay options out in a grid of 1 to 4 columns on wider screens. Ignored when `inline()` is on.

```php
CheckboxGroup::make('features')->options([...])->columns(2);
```

### `buttons(bool $buttons = true)`

Draw each option as a pill-shaped toggle button. Clicking a pill switches it on (filled with the accent color) or off. Pills wrap onto new lines as needed, which works well for tags, days of the week, or interests. The checkboxes stay in the page (visually hidden), so keyboard and screen reader support is unchanged.

```php
CheckboxGroup::make('days')
    ->options(['mon' => 'Mon', 'tue' => 'Tue', 'wed' => 'Wed', 'thu' => 'Thu', 'fri' => 'Fri'])
    ->buttons();
```

In this mode only labels are shown; descriptions, `inline()`, and `columns()` are ignored.

## Validation rules

| Key | Rules |
| --- | ----- |
| `name` | `array` (plus `required`/`nullable` and your own rules) |
| `name.*` | `Rule::in(<option values>)` |

```php
CheckboxGroup::make('topics')->options(['news', 'tips'])->required();
// 'topics'   => ['required', 'array']
// 'topics.*' => [Rule::in(['news', 'tips'])]
```

`required()` means at least one box must be checked, because Laravel's `required` rule rejects an empty array. Use `->rule('min:2')` or `->rule('max:3')` to limit the count.

## Value

- An array of checked option values, in the order they were checked.
- Empty value: `[]`.
- Bound collections and enum lists are converted to a plain array of values.

## Standalone use

::: code-group

```vue [Vue]
<CheckboxGroup v-model="topics" :field="topicsField" id="topics" :disabled="false" />
```

```tsx [React]
<CheckboxGroup field={topicsField} id="topics" value={topics} disabled={false} onChange={setTopics} />
```

```svelte [Svelte]
<CheckboxGroup field={topicsField} id="topics" bind:value={topics} disabled={false} />
```

:::

Like [Radio](/fields/radio#standalone-use), the group is labelled by an element with the id `` `${id}-label` ``. Use [`FieldWrapper`](/frontend/standalone#fieldwrapper) to get the label for free.
