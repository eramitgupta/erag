---
title: 'Color Picker'
description: 'A color dropdown with preset swatches, hue, saturation and lightness sliders, a hex box, eyedropper and copy. Validates hex colors like #4f46e5.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/fields/color-picker.md
</div>


<div class="doc-category">Fields</div>

# Color Picker

`Erag\InertiaForms\Fields\ColorPicker` renders a field that shows a color chip and the hex code. Clicking it opens a dropdown with your preset swatches, hue / saturation / lightness sliders, a hex text box, an eyedropper, and a copy button. The dropdown is built into the package with Tailwind CSS, with no color library.

**When to use:** brand colors, label colors, theme settings.

## Examples

Each example is a live form built from the PHP below it. Fill it in and press submit to see the data your controller would receive.

### Basic

Five preset swatches and a starting color. The sliders and hex box are always there for custom colors.

<Example id="fields/color-picker/basic">

<<< @/../examples/fields/color-picker/basic.php#example

</Example>

### Advanced: theme settings

Two required colors with their own swatches, and an optional highlight that starts empty. `clearable()` lets users remove the highlight again.

<Example id="fields/color-picker/theme">

<<< @/../examples/fields/color-picker/theme.php#example

</Example>

## How it works

- The field shows a small chip filled with the current color, followed by the hex code, or the placeholder ("Pick a color") when empty.
- In the dropdown, clicking a swatch sets the value and closes it. The selected swatch gets a ring.
- Drag the **Hue**, **Saturation** and **Lightness** sliders to build a custom color. Each track shows a live gradient, and the value updates as you drag. The hue is kept even when you drag saturation down to gray.
- The footer shows a preview square and a text box that accepts a typed code like `#0f766e` or `#0f7`. The value only changes once the code is valid; Enter closes the dropdown.
- The eyedropper button picks a color from anywhere on the screen. It only appears in browsers that support the EyeDropper API (Chrome and Edge).
- The copy button copies the hex code and shows a check mark for a moment.
- Click outside, press Escape, or Tab away to close.

## Methods

All [common field methods](/concepts/form-class#common-field-methods) are available, including [`clearable()`](/concepts/form-class#common-field-methods), plus:

### `swatches(array $colors)`

Preset colors shown as clickable squares at the top of the dropdown. Clicking one sets the value. Use six-digit hex codes so they pass validation.

```php
ColorPicker::make('label_color')->swatches(['#000000', '#ffffff', '#dc2626']);
```

### `clearable(bool $clearable = true)`

Show a × button in the field once a color is set. Clicking it resets the value to `''`.

```php
ColorPicker::make('highlight')->clearable();
```

### `placeholder(?string $placeholder)`

Text shown in the field while no color is set. Defaults to "Pick a color".

## Validation rules

| Configuration | Rules |
| ------------- | ----- |
| default | `regex:/^#[0-9a-fA-F]{6}$/` |

Only six-digit hex colors with a leading `#` are accepted. Short codes like `#fff` and named colors are rejected.

```php
ColorPicker::make('brand_color')->required();
// ['required', 'regex:/^#[0-9a-fA-F]{6}$/']
```

## Value

- A hex string like `#4f46e5`. The browser color input returns lowercase codes; typed codes keep their case.
- Empty value: `''`.

## Standalone use

::: code-group

```vue [Vue]
<ColorPicker v-model="color" :field="colorField" id="brand_color" :disabled="false" />
```

```tsx [React]
<ColorPicker field={colorField} id="brand_color" value={color} disabled={false} onChange={setColor} />
```

```svelte [Svelte]
<ColorPicker field={colorField} id="brand_color" bind:value={color} disabled={false} />
```

:::

See [Standalone Components](/frontend/standalone).
