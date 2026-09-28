---
title: 'Display Helpers'
description: 'Headings, paragraphs, trusted HTML, separators and callouts inside a form. They carry no value and never appear in the data or the validation rules.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/fields/display.md
</div>


<div class="doc-category">Fields</div>

# Display Helpers

Five small classes put content between your fields: `Heading`, `Text`, `Html`, `Separator` and `Callout`. They only show something. They have no name to fill in and no value, so they are never part of `data()`, `rules()` or `validated()`.

**When to use:** a heading in the middle of a long fieldset, a sentence explaining the next fields, a divider before an optional section, or a notice such as "Publishing is final".

Try them on the **Landing page**, **Onboarding wizard** and **Support chat** forms in the [Live Demo](/demo).

## Examples

Each example is a live form built from the PHP below it. Fill it in and press submit to see the data your controller would receive.

### Basic

A heading, a short explanation and a divider between regular fields. None of them shows up in the submitted data.

<Example id="fields/display/basic">

<<< @/../examples/fields/display/basic.php#example

</Example>

### Callout tones

The four tones, plus one with a custom `icon()`. The body text is optional.

<Example id="fields/display/callouts">

<<< @/../examples/fields/display/callouts.php#example

</Example>

### Advanced: settings form

Display helpers mixed with real fields. The warning and the archive notice use `visibleWhen()`, so they only appear once their toggle is on. `Html` adds a link.

<Example id="fields/display/settings">

<<< @/../examples/fields/display/settings.php#example

</Example>

## What they have in common

- The argument to `make()` is the **content** (the heading text, the paragraph, the HTML, or the callout title), not a data key. A unique internal name is generated for you.
- They always span the full row of the fieldset grid, whatever its `columns()`.
- They render without a label, help text or error message.
- `visibleWhen()` / `hiddenWhen()` and the [authorization](/concepts/authorization) methods work as on any field, so a notice can appear only for some values or some users. `class()` adds extra classes, as on other fields.
- Methods about values and validation (`required()`, `rules()`, `default()`, `placeholder()`, ...) have no effect.

## Heading

A heading between fields.

```php
Heading::make('Shipping address')->level(3);
```

### `level(int $level)`

The heading level, from 1 (`<h1>`) to 4 (`<h4>`). Defaults to 3. Values outside the range are clamped.

### `text(string $text)`

Change the heading text after `make()`.

## Text

A paragraph of plain text in a muted color.

```php
Text::make('We only use your phone number for delivery updates.');
```

The text is escaped, so it is safe even for values that come from users or the database: `<b>` is shown as the characters `<b>`, not as bold text. Change it with `text(string $text)`.

## Html

HTML that you write yourself, for example a sentence with a link or a short list.

```php
use Erag\InertiaForms\Fields\Html;

Html::make('By signing up you accept the <a href="/terms">terms of service</a>.');
```

Links, bold and italic text, inline code and lists get matching styles. Change the content with `html(string $html)`.

::: danger Only trusted HTML
`Html` renders its content **as-is**, without escaping or cleaning. Never pass user input, database content that users can edit, or anything else you don't fully control: a `<script>` or an `onerror` attribute in that string would run in your users' browsers. For text use `Text`; to show HTML written by users, clean it first with an HTML sanitizer such as [HTMLPurifier](http://htmlpurifier.org/) before passing it in.
:::

## Separator

A horizontal line.

```php
Separator::make()->spacing('sm');
```

### `spacing(string $spacing)`

The space above and below the line: `none`, `sm`, `md` (default) or `lg`. Unknown values fall back to `md`.

## Callout

A tinted notice box with an icon, a title and optional body text.

```php
Callout::make('Publishing is final', 'Published pages are visible to everyone right away.')->warning();

Callout::make('Two-factor authentication is on')->success();
```

`make(string $title, ?string $body = null)` takes the title and the body. Both are shown as plain, escaped text.

### Tone

| Method | Look |
| ------ | ---- |
| `info()` (default) | Blue, information icon |
| `success()` | Green, check icon |
| `warning()` | Amber, warning icon |
| `danger()` | Red, error icon |

`tone(string $tone)` does the same with a string. Unknown tones fall back to `info`.

### `title(string $title)` / `body(?string $body)`

Change the title or the body after `make()`.

### `icon(?string $icon)`

Use another package icon name instead of the tone's icon, for example `->icon('user')`. See [Icons](/icons) for every name.

## Validation rules

None. Display helpers have no value, so they add nothing to `rules()`, and nothing is expected from the request.

## Value

No value. `data()` and `validated()` never contain them.

## Standalone use

The components are exported as `Heading`, `Text`, `Html`, `Separator` and `Callout`. They only read `field`, so no value or change handler is needed:

::: code-group

```vue [Vue]
<Callout :field="noticeField" id="notice" :disabled="false" />
```

```tsx [React]
<Callout field={noticeField} id="notice" disabled={false} />
```

```svelte [Svelte]
<Callout field={noticeField} id="notice" disabled={false} />
```

:::

Pass `Callout::make(...)` from PHP as the `noticeField` prop. See [Standalone Components](/frontend/standalone).
