---
title: 'Icons'
aside: false
description: 'Over 200 icons drawn for the package, used by name with icon() on submit buttons, wizard steps and callouts. No icon library. Add your own SVG icons too.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/icons.md
</div>


<div class="doc-category">Overview</div>

# Icons

The package comes with **over 200 icons**, drawn for it in one consistent style (24×24, 2px rounded strokes). No icon library is used or needed. Pick one by its name with `icon()`:

```php
use Erag\InertiaForms\Fields\Submit;

Submit::make('Invite user')->icon('user');
Submit::make('Launch')->icon('rocket');
```

The icon takes the text color of the element it sits in, so it matches the button, step or callout automatically.

**How they are loaded.** About 40 icons that the fields use themselves (like `check`, `trash` and `user`) are part of the frontend package. Every other icon is sent by Laravel as a few bytes of SVG with the form, and only when a field uses it, so the JavaScript bundle doesn't grow no matter how many icons exist.

## Where you can use `icon()`

| Method | Where the icon shows | Notes |
| ------ | -------------------- | ----- |
| `Submit::icon(?string $icon, string $position = 'left')` | Next to the button text | Pass `'right'` to put it after the text, e.g. for "Continue →". While the form is sending, the spinner takes its place. |
| `Fieldset::icon(?string $icon)` | In the step circle of a [wizard](/concepts/wizard) | Only used in wizards. A finished step shows a check instead. |
| `Callout::icon(?string $icon)` | At the start of a [callout](/fields/display#callout) | Without it, the callout uses the icon of its tone (info, success, warning, danger). |

Pass `null` to remove an icon again, for example `->icon(null)`.

## Examples

Each example is a live form built from the PHP below it.

### Buttons

`icon('user')` puts the user icon before the text. The second argument moves it after the text. Names may be written `shopping-cart`, `shopping_cart` or `shoppingCart`.

<Example id="frontend/icons/buttons">

<<< @/../examples/frontend/icons/buttons.php#example

</Example>

### Wizard steps

Each fieldset shows its icon in the stepper. Fill in the first step and press **Continue**: the finished step turns into a check.

<Example id="frontend/icons/wizard">

<<< @/../examples/frontend/icons/wizard.php#example

</Example>

### Callouts

A custom icon replaces the tone's icon. The last callout uses a name that doesn't exist (`unicorn`), so it keeps the default icon.

<Example id="frontend/icons/callouts">

<<< @/../examples/frontend/icons/callouts.php#example

</Example>

### Your own icon

Register any SVG under a name, then use it like the others.

<Example id="frontend/icons/custom">

<<< @/../examples/frontend/icons/custom.php#example

</Example>

## All icons

Click an icon to copy its name. `map-pin`, `map_pin` and `MapPin` all work as `mapPin`.

The icons Laravel sends are listed in the `Erag\InertiaForms\Support\IconSetEnum` enum, so you can also use a case's value: `->icon(IconSetEnum::Rocket->value)`.

<IconGallery />

## Your own icons

Add icons in `config/inertia-forms.php` (publish it with [`erag:install-inertia-forms`](/reference/artisan-config#erag-install-inertia-forms)):

```php
'icons' => [
    'bolt' => '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    'brand-mark' => '<circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/>',
],
```

Or register them in code, for example in `AppServiceProvider::boot()`:

```php
use Erag\InertiaForms\Support\Icon;

Icon::register('bolt', '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>');
```

The SVG can be:

- the inside of a 24×24 icon: `<path …/>`, `<circle …/>`, `<rect …/>` and so on,
- just a path's `d` value: `'M13 2 4 14h7l-1 8 9-12h-7z'`,
- or a whole `<svg>` element, whose inside is used.

It is drawn in a 24×24 box with a 2px `currentColor` stroke and no fill, like the other icons. Give a shape `fill="currentColor" stroke="none"` for a solid part. A name that already exists replaces the package's icon everywhere.

For safety, icons may only contain SVG shapes: `<script>`, `<foreignObject>`, `<use>`, `<image>`, `on…` event attributes and `javascript:` links are rejected with an exception.

`Icon::exists('rocket')` tells you whether a name shows an icon, and `Icon::names()` lists every available name.

## Unknown names

An icon name that isn't in the list above (or registered) never breaks the form:

| Used on | What you see |
| ------- | ------------ |
| Submit button | The button without an icon. |
| Wizard step | The step number. |
| Callout | The tone's default icon. |

## Block icons are text

[`Block::icon()`](/fields/blocks) is different: it takes one or two characters shown in the "add block" menu, not an icon name.

```php
Block::make('hero')->icon('★');
Block::make('faq')->icon('?');
```
