---
title: 'Link'
description: 'A URL input with scheme checks. Store a plain URL string, or a structured link with its own text and a same tab or new tab choice.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/fields/link.md
</div>


<div class="doc-category">Fields</div>

# Link

`Erag\InertiaForms\Fields\Link` collects a URL. By default it is a single input with a link icon and the value is a string. Turn on the link text or the target choice and it becomes a small **structured link** editor whose value is an array. Like every other field, it is built into the package with Tailwind CSS and needs no extra library.

**When to use:** websites, profile links, documentation URLs, and call-to-action buttons where you also need the button text and whether it opens in a new tab. For a plain URL input with no extra checks, [TextInput](/fields/text-input) `url()` also works.

Try it on the **Landing page** and **All fields** forms in the [Live Demo](/demo).

## Examples

Each example is a live form built from the PHP below it. Fill it in and press submit to see the data your controller would receive.

### Basic

A plain URL input. The submitted value is a string.

<Example id="fields/link/basic">

<<< @/../examples/fields/link/basic.php#example

</Example>

### Structured link

`withLabel()` adds the button text and `withTarget()` the same tab / new tab switch, so the value becomes an array with `url`, `label` and `target`.

<Example id="fields/link/structured">

<<< @/../examples/fields/link/structured.php#example

</Example>

### Advanced: scheme rules

The documentation link must start with `https://`; type a URL without it to see the hint. The support link also accepts `mailto:` addresses. The scheme checks themselves run on the server.

<Example id="fields/link/schemes">

<<< @/../examples/fields/link/schemes.php#example

</Example>

## How it works

- **Plain mode** (the default) shows one input with a link icon in front of it.
- **Structured mode** adds a second input for the link text (with `withLabel()`) and a **Same tab / New tab** switch (with `withTarget()`).
- With `requireScheme()`, a short hint such as *"Start with https://"* appears while the typed URL has no scheme, before the form is even submitted.
- A URL typed without a scheme, like `example.test/docs`, is accepted as long as it looks like a web address (unless `requireScheme()` is on). It is stored exactly as typed; add the scheme yourself when you output it, or use `requireScheme()`.

## Methods

All [common field methods](/concepts/form-class#common-field-methods) are available, plus:

### `withLabel(bool $withLabel = true, ?string $placeholder = null)`

Add an input for the link text. The optional placeholder is shown in that input. Turns on structured mode.

### `withTarget(bool $withTarget = true)`

Add a **Same tab / New tab** switch. The choice is stored as `_self` or `_blank`. Turns on structured mode.

### `structured(bool $structured = true)`

Store an array with a `url` key instead of a plain string, without adding the other inputs. Useful when you plan to add the text or target later and want a stable shape.

### `plain()`

Go back to a plain URL string. Turns off structured mode, the link text and the target.

### `requireScheme(bool $require = true)`

Reject URLs typed without a scheme, like `example.test/docs`. The message names the first allowed scheme: *"The Website must start with https://."*

### `allowedSchemes(array|string ...$schemes)`

The schemes a URL may use. Defaults to `http` and `https`. Accepts several strings or an array; `'https://'` and `'HTTPS'` are both read as `https`.

```php
Link::make('support')->allowedSchemes('https', 'mailto');

Link::make('docs')->requireScheme()->allowedSchemes(['https']);
```

For `http` and `https` URLs the host must be a real domain with a dot, like `erag.in`. Other schemes, such as `mailto:`, are only checked for the scheme.

## Validation rules

Plain mode:

| Attribute | Rules |
| --------- | ----- |
| `name` | `nullable` (or `required`), `string`, `max:2048`, the URL check |

Structured mode:

| Attribute | Rules |
| --------- | ----- |
| `name` | `nullable` (or `required`), `array:url,label,target` (only the enabled keys), plus your own rules |
| `name.url` | `nullable` (or `required`), `string`, `max:2048`, the URL check |
| `name.label` | `nullable`, `string`, `max:255` (with `withLabel()`) |
| `name.target` | `nullable`, `in:_self,_blank` (with `withTarget()`) |

The URL check fails with one of these messages:

- *"The Website must use http or https."* for a scheme that isn't allowed, like `javascript:alert(1)`.
- *"The Website must start with https://."* when `requireScheme()` is on and the scheme is missing.
- *"The Website must be a valid URL."* for text that isn't a web address.

In structured mode the link text and target are named after the field label in messages, like "Call to action text" and "Call to action target".

## Value

- Plain mode: a string, like `'https://erag.in/docs'`. Empty value: `''`.
- Structured mode: an array with `url` and only the keys you turned on:

```php
$form->validated('cta');
// ['url' => 'https://erag.in', 'label' => 'Get started', 'target' => '_blank']
```

Empty value in structured mode: `['url' => '', 'label' => '', 'target' => '']` (again only the enabled keys). An empty `target` means no choice was made; treat it like `_self`.

Bound values are converted for you: a string bound to a structured field becomes its `url`, and an array bound to a plain field keeps only its `url`. Store structured links in a `json` / `array` cast column.

## Standalone use

::: code-group

```vue [Vue]
<Link v-model="cta" :field="ctaField" id="cta" :disabled="false" />
```

```tsx [React]
<Link field={ctaField} id="cta" value={cta} disabled={false} onChange={setCta} />
```

```svelte [Svelte]
<Link field={ctaField} id="cta" bind:value={cta} disabled={false} />
```

:::

Start with `''` (plain) or `{ url: '' }` plus the enabled keys (structured) as the value. The component is exported as `Link`; in React, rename it on import (`import { Link as LinkField } from '@erag/inertia-forms-react'`) if it clashes with Inertia's `Link`. See [Standalone Components](/frontend/standalone).
