---
title: 'Fieldsets & Layout'
description: 'Group related fields under a legend and description, and lay them out in a responsive grid with columns and column spans.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/concepts/fieldsets.md
</div>


<div class="doc-category">Core Concepts</div>

# Fieldsets & Layout

A fieldset groups related fields under an optional heading and lays them out in a responsive grid.

```php
use Erag\InertiaForms\Fields\Fieldset;

Fieldset::make('Shipping address')
    ->description('Where should we send your order?')
    ->columns(2)
    ->fields([
        TextInput::make('shipping.street')->columnSpan(2),
        TextInput::make('shipping.city'),
        TextInput::make('shipping.postal_code'),
    ]);
```

**When to use:** whenever a form has more than a handful of fields, or you want a multi-column layout.

## Examples

Each example is a live form built from the PHP below it. Fill it in and press submit to see the data your controller would receive.

### Basic

A single group with a legend and a description.

<Example id="concepts/fieldsets/basic">

<<< @/../examples/concepts/fieldsets/basic.php#example

</Example>

### Grid columns and spans

`columns(2)` puts two fields per row on larger screens; `columnSpan(2)` makes the street use the whole row.

<Example id="concepts/fieldsets/columns">

<<< @/../examples/concepts/fieldsets/columns.php#example

</Example>

### Advanced: several sections

A form class with three fieldsets. The billing section only appears when the checkbox is ticked, using `visibleWhen()` on the whole fieldset.

<Example id="concepts/fieldsets/sections">

<<< @/../examples/concepts/fieldsets/sections.php#example

</Example>

## Methods

| Method | Description |
| ------ | ----------- |
| `make(?string $legend = null)` | Create a fieldset. The legend is optional. |
| `legend(?string $legend)` | Heading text. With a legend, the group renders as a `<fieldset>` with a `<legend>`. Without one, it renders as a plain `<div>`. |
| `description(?string $description)` | Short text under the legend. Only shown when a legend is set. |
| `icon(?string $icon)` | A package icon name shown for this fieldset's step in a [wizard](/concepts/wizard), like `'user'`. |
| `columns(int $columns)` | Grid columns on wider screens. Minimum 1. Fields always stack on mobile. |
| `id(?string $id)` | HTML `id` on the fieldset element, handy for anchors. |
| `class(?string $class)` | Extra CSS classes on the fieldset element. |
| `fields(array $fields)` | The fields inside this fieldset. Fieldsets cannot be nested. |
| `visibleWhen(...)` / `hiddenWhen(...)` | Show or hide the whole group. See [Conditional Visibility](/concepts/visibility). |
| `authorize(...)` / `authorizedWhen(...)` / `authorizedUnless(...)` | Remove the whole group for some users. See [Authorization](/concepts/authorization). |

## Loose fields

You don't have to wrap everything in a fieldset. Fields placed directly in `fields()` are grouped into unnamed, one-column fieldsets for you. A new group starts every time a real fieldset interrupts them.

```php
public function fields(): array
{
    return [
        TextInput::make('title'),          // group 1 (unnamed)
        Textarea::make('body'),            // group 1 (unnamed)
        Fieldset::make('SEO')->fields([    // group 2
            TextInput::make('meta_title'),
        ]),
        Submit::make('Publish'),           // group 3 (unnamed)
    ];
}
```

## Grid columns

`columns()` controls the grid on larger screens. The frontend maps it to Tailwind classes:

| `columns` | Mobile | `sm` (640px+) | `lg` (1024px+) |
| --------- | ------ | ------------- | -------------- |
| 1 | 1 | 1 | 1 |
| 2 | 1 | 2 | 2 |
| 3 | 1 | 2 | 3 |
| 4 | 1 | 2 | 4 |
| 5 | 1 | 2 | 5 |
| 6 | 1 | 3 | 6 |

Values above 6 are treated as 6 by the frontend.

## Column span

Use `columnSpan()` on a field to make it wider than one column.

```php
Fieldset::make('Profile')->columns(3)->fields([
    TextInput::make('first_name'),
    TextInput::make('last_name'),
    TextInput::make('nickname'),
    Textarea::make('bio')->columnSpan(3),    // full row
    TextInput::make('website')->columnSpan(2),
]);
```

If the span is equal to or larger than the fieldset's column count, the field fills the whole row. A span of `1` or `null` is the default single column.

## Example: two sections

```php
public function fields(): array
{
    return [
        Fieldset::make('Company')->columns(2)->fields([
            TextInput::make('company_name')->required()->columnSpan(2),
            TextInput::make('vat_number')->label('VAT number'),
            Combobox::make('size')->options(['1-10', '11-50', '51-200', '200+']),
        ]),
        Fieldset::make('Billing contact')
            ->description('We send invoices to this person.')
            ->columns(2)
            ->fields([
                TextInput::make('billing.name')->required(),
                TextInput::make('billing.email')->email()->required(),
            ]),
        Submit::make('Save company'),
    ];
}
```
