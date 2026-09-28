---
title: 'Slider'
description: 'A range slider with min, max, and step, showing the current value with an optional unit like % or px.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/fields/slider.md
</div>


<div class="doc-category">Fields</div>

# Slider

`Erag\InertiaForms\Fields\Slider` renders a range input (`type="range"`) with the current value shown next to it.

**When to use:** volume, percentages, ratings on a scale, budgets where an exact number isn't critical.

## Examples

Each example is a live form built from the PHP below it. Fill it in and press submit to see the data your controller would receive.

### Basic

A 0 to 100 slider that starts at 40. The current value is shown next to it.

<Example id="fields/slider/basic">

<<< @/../examples/fields/slider/basic.php#example

</Example>

### Steps and units

`step()` sets the gap between values, including decimals, and `suffix()` adds a unit to the shown value.

<Example id="fields/slider/units">

<<< @/../examples/fields/slider/units.php#example

</Example>

### Advanced: project brief

Several sliders in a two-column fieldset. The last one hides its number with `showValue(false)`, since only the rough position matters.

<Example id="fields/slider/preferences">

<<< @/../examples/fields/slider/preferences.php#example

</Example>

## Methods

All [common field methods](/concepts/form-class#common-field-methods) are available, plus:

### `min(int|float $min)`

The lowest value. Default `0`. Also used as the empty value.

```php
Slider::make('rating')->min(1)->max(10);
```

### `max(int|float $max)`

The highest value. Default `100`.

```php
Slider::make('discount')->max(50);
```

### `step(int|float $step)`

The distance between values. Default `1`.

```php
Slider::make('opacity')->min(0)->max(1)->step(0.1);
```

### `showValue(bool $show = true)`

Show the current value next to the slider. On by default; pass `false` to hide it.

```php
Slider::make('mood')->showValue(false);
```

### `suffix(?string $suffix)`

A unit shown after the displayed value, like `%` or `px`.

```php
Slider::make('font_size')->min(12)->max(32)->suffix('px');
```

## Validation rules

| Configuration | Rules |
| ------------- | ----- |
| always | `numeric`, `min:<min>`, `max:<max>` |

```php
Slider::make('volume')->min(0)->max(100);
// ['nullable', 'numeric', 'min:0', 'max:100']
```

`step()` is not validated on the server.

## Value

- A number.
- Empty value: the `min()` value, so a slider always has a value.

## Standalone use

::: code-group

```vue [Vue]
<Slider v-model="volume" :field="volumeField" id="volume" :disabled="false" />
```

```tsx [React]
<Slider field={volumeField} id="volume" value={volume} disabled={false} onChange={setVolume} />
```

```svelte [Svelte]
<Slider field={volumeField} id="volume" bind:value={volume} disabled={false} />
```

:::

See [Standalone Components](/frontend/standalone).
