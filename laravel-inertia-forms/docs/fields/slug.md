---
title: 'Slug'
description: 'A URL slug that fills itself in from another field, like the title, until the user edits it. Optional prefix, dash or underscore, and a format check.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/fields/slug.md
</div>


<div class="doc-category">Fields</div>

# Slug

`Erag\InertiaForms\Fields\Slug` is a text input for URL-safe slugs such as `launch-faster-with-forms`. Point it at another field with `from()` and it fills itself in live while the user types there. Like every other field, it is built into the package with Tailwind CSS and needs no extra library.

**When to use:** post, page, product or workspace URLs, usernames, and any identifier that is usually made from a name but may be changed by hand.

Try it on the **Landing page**, **Onboarding wizard** and **All fields** forms in the [Live Demo](/demo).

## Examples

Each example is a live form built from the PHP below it. Fill it in and press submit to see the data your controller would receive.

### Basic

Type a title and the slug follows it. Edit the slug and it stops following; the regenerate button brings it back.

<Example id="fields/slug/basic">

<<< @/../examples/fields/slug/basic.php#example

</Example>

### Underscores and a length limit

A username made from the full name, joined with `_` and cut at 20 characters.

<Example id="fields/slug/separator">

<<< @/../examples/fields/slug/separator.php#example

</Example>

### Advanced: case-sensitive paths

`keepCase()` keeps capital letters, so *"Getting Started"* becomes `Getting_Started`. Combined with a prefix and a 60-character limit.

<Example id="fields/slug/wiki-page">

<<< @/../examples/fields/slug/wiki-page.php#example

</Example>

## How it works

- While the slug has not been edited, it follows the `from()` field: typing *"Crème Brûlée Recipes!"* in the title fills in `creme-brulee-recipes`.
- As soon as the user types in the slug field, it stops following. A **regenerate** button then appears; clicking it makes the slug from the source field again and turns following back on.
- Clearing the slug field also turns following back on.
- When the field loses focus, whatever was typed is cleaned up into a valid slug: accents are removed, spaces and symbols become the separator, and repeated or trailing separators are dropped.
- `prefix()` shows fixed text in front of the input, like the start of the final URL. It is only a visual hint and is not part of the value.
- Inside a [Blocks](/fields/blocks) or [Repeater](/fields/repeater) item, `from()` looks for the field in the same item first, then at the top level of the form.

## Methods

All [common field methods](/concepts/form-class#common-field-methods) are available, plus:

### `from(?string $field)`

The field the slug is made from, usually `title` or `name`. Without it, the slug is typed by hand and only cleaned up on blur.

### `prefix(?string $prefix)`

Text shown in an add-on before the input, for example `example.test/blog/`.

### `separator(string $separator)`

The character between words: `-` (default) or `_`. Any other value falls back to `-`.

```php
Slug::make('handle')->from('name')->separator('_');
// "Jane Example" → "jane_example"
```

### `keepCase(bool $keep = true)`

Keep upper-case letters instead of lower-casing the slug.

### `maxLength(?int $length)`

The longest allowed slug. Defaults to 255; `null` removes the limit. Generated slugs are cut at the limit without a trailing separator.

## Validation rules

| Attribute | Rules |
| --------- | ----- |
| `name` | `nullable` (or `required`), `string`, `max:<maxLength>`, `regex` for the slug format |

The format is letters and numbers joined by single separators, so `hello-world-2` passes while `Hello World` and `a--b` fail. The message explains the format:

- *"The Slug may only contain lower-case letters, numbers and single dashes."*
- With `keepCase()`: *"… may only contain letters, numbers and single dashes."*
- With `separator('_')`: *"… and single underscores."*

Uniqueness is up to you, for example `->rule(Rule::unique('posts', 'slug')->ignore($post))`.

## Value

A string, like `'launch-faster-with-forms'`. The prefix is not included. Empty value: `''`.

## Standalone use

::: code-group

```vue [Vue]
<Slug v-model="slug" :field="slugField" id="slug" :disabled="false" />
```

```tsx [React]
<Slug field={slugField} id="slug" value={slug} disabled={false} onChange={setSlug} />
```

```svelte [Svelte]
<Slug field={slugField} id="slug" bind:value={slug} disabled={false} />
```

:::

Outside `<Form>` there is no form data to follow, so the field acts as a plain slug input that cleans up on blur. See [Standalone Components](/frontend/standalone).
