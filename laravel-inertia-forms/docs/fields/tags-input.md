---
title: 'Tags Input'
description: 'Free-text tags with suggestions, drag-and-drop reordering, paste splitting, and tag count or length limits. Stores an array of strings.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/fields/tags-input.md
</div>


<div class="doc-category">Fields</div>

# Tags Input

`Erag\InertiaForms\Fields\TagsInput` lets users type their own short values and collect them as tags (chips) inside the field. The value is a list of strings. Like every other field, it is built into the package with Tailwind CSS and needs no extra library.

**When to use:** keywords, skills, labels, email aliases, or any list of free-form words. When users must choose from a fixed list, use [Combobox](/fields/combobox) with `multiple()` or [CheckboxGroup](/fields/checkbox-group) instead.

```php
use Erag\InertiaForms\Fields\TagsInput;

TagsInput::make('keywords')
    ->suggestions(['laravel', 'inertia', 'vue', 'react', 'svelte'])
    ->maxTags(8)
    ->maxTagLength(30)
    ->help('Press Enter or comma after each keyword.');
```

## Examples

Each example is a live form built from the PHP below it. Fill it in and press submit to see the data your controller would receive.

### Basic

Type a word and press Enter or comma. The value is an array of strings.

<Example id="fields/tags-input/basic">

<<< @/../examples/fields/tags-input/basic.php#example

</Example>

### Suggestions and limits

Suggestions appear while the field has focus. At most five tags of up to 20 characters each.

<Example id="fields/tags-input/suggestions">

<<< @/../examples/fields/tags-input/suggestions.php#example

</Example>

### Advanced: bound values

A form class bound to existing data. The comma-separated `tags` string is split into tags, and `reorderable(false)` removes the drag handles from the aliases.

<Example id="fields/tags-input/product">

<<< @/../examples/fields/tags-input/product.php#example

</Example>

## How it works

- Type a word and press **Enter**, **comma**, or **Tab** to turn it into a tag. Tab only adds when there is text, so it still moves focus from an empty box.
- Leaving the field adds whatever is still typed.
- **Backspace** in the empty box removes the last tag. Every tag also has its own × button.
- Pasting text that contains commas or line breaks splits it into several tags at once.
- Surrounding spaces are trimmed. Empty values and duplicates are skipped.
- Tags can be dragged into a new order by their grip handle (see `reorderable()`).
- When the field is disabled or read-only, tags can't be added, removed, or moved.

### Keyboard

| Key | Action |
| --- | ------ |
| Enter / comma | Add the typed text (or the highlighted suggestion) as a tag |
| Tab | Add the typed text, if any, then move focus as usual |
| Arrow Down / Up | Move through the suggestions |
| Backspace | In an empty box, remove the last tag |
| Escape | Hide the suggestions |

## Methods

All [common field methods](/concepts/form-class#common-field-methods) are available, plus:

### `suggestions(array $suggestions)`

Values offered in a dropdown while the field has focus. Typing narrows the list to suggestions that contain the text (case-insensitive), and tags that are already added are left out. Click a suggestion, or highlight it with the arrow keys and press Enter, to add it.

Suggestions are only hints. Users can still add any other value, so validate with your own rules if the list must be strict.

```php
TagsInput::make('skills')->suggestions(Skill::orderBy('name')->pluck('name')->all());
```

Every suggestion is cast to a string.

### `maxTags(?int $count)`

The largest number of tags. Adds `max:<count>` to the array rule. In the browser, the text box disappears once the limit is reached, and extra tags from a paste are dropped.

```php
TagsInput::make('labels')->maxTags(5);
```

### `maxTagLength(?int $characters)`

The longest allowed tag, in characters. Limits what can be typed in the box and adds `max:<characters>` to each item. Longer pasted values are skipped.

```php
TagsInput::make('hashtags')->maxTagLength(25);
```

### `reorderable(bool $reorderable = true)`

Whether tags can be dragged to change their order. It is **on by default**; each tag then shows a small grip handle. The order of the tags is the order of the values sent to the server. Turn it off when order doesn't matter:

```php
TagsInput::make('aliases')->reorderable(false);
```

### `placeholder(?string $placeholder)`

Text in the empty box while there are no tags. Defaults to "Type and press Enter".

## Validation rules

| Key | Rules |
| --- | ----- |
| `name` | `required` or `nullable`, `array`, `max:<maxTags>` when set, plus your own rules |
| `name.*` | `string`, `distinct`, `max:<maxTagLength>` when set |

```php
TagsInput::make('tags')->required()->maxTags(5)->maxTagLength(20);
// 'tags'   => ['required', 'array', 'max:5']
// 'tags.*' => ['string', 'distinct', 'max:20']
```

`required()` means at least one tag. Your own rules from `->rules()` / `->rule()` are added to `name`. `distinct` makes the server reject a list with the same tag twice, matching what the browser already prevents. Errors on single items (like `tags.2`) appear under the field.

## Value

- An array of strings, in the order shown, like `['laravel', 'inertia']`.
- Empty value: `[]`.
- Bound collections are converted to a plain array of strings.
- A bound comma-separated string is split for you, so a column holding `"carry-on, travel"` becomes `['carry-on', 'travel']`.

```php
$form->bind(['tags' => 'carry-on, water-resistant']);
// data: ['tags' => ['carry-on', 'water-resistant']]
```

To store the tags in a single column, use an `array` or `json` cast on the model, or join them yourself after validation.

## Standalone use

::: code-group

```vue [Vue]
<TagsInput v-model="keywords" :field="keywordsField" id="keywords" :disabled="false" />
```

```tsx [React]
<TagsInput field={keywordsField} id="keywords" value={keywords} disabled={false} onChange={setKeywords} />
```

```svelte [Svelte]
<TagsInput field={keywordsField} id="keywords" bind:value={keywords} disabled={false} />
```

:::

Start with an empty array (`[]`) as the value. See [Standalone Components](/frontend/standalone).
