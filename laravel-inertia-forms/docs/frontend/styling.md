---
title: 'Styling'
description: 'Style forms with Tailwind CSS 4: point Tailwind at the package, set the accent color, add classes to fields and fieldsets, and use dark mode.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/frontend/styling.md
</div>


<div class="doc-category">Frontend</div>

# Styling

All components are styled with Tailwind CSS 4 utility classes. There is no separate stylesheet to import.

Every control is built in-house: the dropdowns, calendar, time columns, color panel, tags input, and file drop zone are plain Vue, React, or Svelte components with Tailwind classes. The packages don't depend on any third-party UI or date library, so there is nothing else to install or theme.

## Make Tailwind see the classes

Tailwind only generates classes it finds in your source files. Add an `@source` line for the package's `dist` folder to your main CSS file:

::: code-group

```css [Vue]
/* resources/css/app.css */
@import 'tailwindcss';

@source "../../node_modules/@erag/inertia-forms-vue/dist";
```

```css [React]
/* resources/css/app.css */
@import 'tailwindcss';

@source "../../node_modules/@erag/inertia-forms-react/dist";
```

```css [Svelte]
/* resources/css/app.css */
@import 'tailwindcss';

@source "../../node_modules/@erag/inertia-forms-svelte/dist";
```

:::

The path is relative to the CSS file. If the form renders without borders or spacing, this line is missing or points to the wrong folder.

## The default look

- Neutral colors come from Tailwind's `zinc` palette.
- Focus rings, checked states, selected days, chips, and the submit button use the [accent color](#accent-color), which is indigo (`#4f46e5`) unless you change it.
- Errors and the required `*` use `red`.
- Inputs have rounded corners (`rounded-lg`), a light shadow, and a focus ring.
- Dropdowns and pickers open in a rounded panel with a shadow. They close on an outside click or Escape and open above the field when there is no room below.

## Examples

Each example is a live form built from the PHP below it, so you can compare the result with the default look.

### Accent color

`accent()` recolors the selected room, the calendar range, the checked boxes, the toggle and the button with one value.

<Example id="frontend/styling/accent">

<<< @/../examples/frontend/styling/accent.php#example

</Example>

### Extra classes

The `$class` property turns the whole form into a card, the fieldset gets a tinted panel, and the submit row is aligned to the right.

<Example id="frontend/styling/classes">

<<< @/../examples/frontend/styling/classes.php#example

</Example>

### Advanced: layout and actions

A product editor that combines an accent set as a property, a three-column grid with `columnSpan()`, a bordered section, and two submit buttons styled by variant. Resize the window to see the columns collapse.

<Example id="frontend/styling/layout">

<<< @/../examples/frontend/styling/layout.php#example

</Example>

## Dark mode

Every component includes `dark:` variants, including the dropdown panels, calendar, time columns, and chips. They follow your Tailwind dark mode setup:

- By default, Tailwind 4 uses the user's system setting (`prefers-color-scheme`).
- If your app toggles a `.dark` class, configure the variant once in your CSS and the forms follow it:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

## Adding your own classes

You can add classes at four levels. They are appended to the defaults, so you can adjust spacing, width, and similar things.

| Level | PHP | Frontend |
| ----- | --- | -------- |
| Whole form | `Form::class()` or `$class` property | `class` (Vue, Svelte) / `className` (React) on `<Form>` |
| Fieldset | `Fieldset::make()->class('...')` | — |
| Field wrapper | `->class('...')` on any field | — |
| Submit row | `Submit::make()->class('...')` | — |

```php
class ProfileForm extends Form
{
    protected ?string $class = 'mx-auto max-w-2xl';

    public function fields(): array
    {
        return [
            Fieldset::make('About you')->class('rounded-xl border p-6')->fields([
                TextInput::make('name')->class('sm:max-w-xs'),
            ]),
            Submit::make('Save')->class('justify-end'),
        ];
    }
}
```

The `<form>` element also has the class `erag-form`, which you can target from your own CSS:

```css
.erag-form legend {
    letter-spacing: 0.01em;
}
```

::: tip Classes from PHP need scanning too
Tailwind must also see the classes you write in PHP. Tailwind 4 scans your project files automatically, including `app/`, so this usually works out of the box. If a class is missing, add an `@source` line for the folder that contains your form classes, for example `@source "../../app/Forms";`.
:::

## Accent color

One color drives the submit button, focus rings, checked radios and checkboxes, segmented buttons and pills, selected days and ranges, time selections, chips, and the drop zone link. It comes from the CSS variable `--erag-form-accent`, and falls back to `#4f46e5` when the variable isn't set. Lighter tints (like the range highlight and chip background) are mixed from the same color, so one value is enough.

You can set it in three places. The most specific one wins: the frontend prop, then PHP, then the CSS variable.

### Frontend prop

For one rendered form:

::: code-group

```vue [Vue]
<Form :form="form" accent="#0f766e" />
```

```tsx [React]
<Form form={form} accent="#0f766e" />
```

```svelte [Svelte]
<Form {form} accent="#0f766e" />
```

:::

### PHP

Stored with the form definition and sent as `accent` in the [schema](/reference/schema#form):

```php
ContactForm::make()->accent('#0f766e');

// or as a property
protected ?string $accent = '#0f766e';
```

The prop and the PHP value are both applied as an inline `--erag-form-accent` style on the `<form>` element, with the prop taking priority.

### CSS variable

For every form under an element, such as your whole app:

```css
:root {
    --erag-form-accent: #0f766e;
}

.dark {
    --erag-form-accent: #2dd4bf;
}
```

The variable is inherited, so you can also set it on a wrapper around one section of a page. A PHP or prop accent on the form itself still wins.

Standalone components (used outside `<Form>`) read the same variable, so set it on a parent element to color them.

The neutral `zinc` and error `red` colors come from Tailwind's own palette. To change those, redefine the scales in your `@theme` (this affects the rest of your app too).

## Replacing a component

For bigger changes, replace a built-in component with your own through the `components` prop. Your component receives the same props as the original. See [Custom Fields](/frontend/custom-fields#replacing-a-built-in-component).
