---
title: 'Toggle'
description: 'An on/off switch with custom stored values and optional On/Off text. required() means the switch must be on.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/fields/toggle.md
</div>


<div class="doc-category">Fields</div>

# Toggle

`Erag\InertiaForms\Fields\Toggle` renders an on/off switch (a `<button role="switch">`), with optional text next to it that changes with the state.

**When to use:** settings that take effect as "on" or "off", like notifications or visibility flags.

```php
use Erag\InertiaForms\Fields\Toggle;

Toggle::make('notifications')
    ->label('Email notifications')
    ->onLabel('On')
    ->offLabel('Off')
    ->default(true);
```

## Examples

Each example is a live form built from the PHP below it. Fill it in and press submit to see the data your controller would receive.

### Basic

A switch that starts on.

<Example id="fields/toggle/basic">

<<< @/../examples/fields/toggle/basic.php#example

</Example>

### State labels

The text next to the switch changes with its state.

<Example id="fields/toggle/state-labels">

<<< @/../examples/fields/toggle/state-labels.php#example

</Example>

### Advanced: privacy settings

The account switch stores `active` / `paused` instead of a boolean. The email switch only appears while the public profile is on, using `visibleWhen()`.

<Example id="fields/toggle/privacy-settings">

<<< @/../examples/fields/toggle/privacy-settings.php#example

</Example>

## Methods

All [common field methods](/concepts/form-class#common-field-methods) are available, plus:

### `onLabel(?string $label)`

Text shown next to the switch while it is on.

```php
Toggle::make('public')->onLabel('Visible to everyone');
```

### `offLabel(?string $label)`

Text shown next to the switch while it is off.

```php
Toggle::make('public')->offLabel('Only you can see this');
```

### `trueValue(mixed $value)` / `falseValue(mixed $value)`

The values stored for "on" and "off". Defaults are `true` and `false`.

```php
Toggle::make('status')->trueValue('active')->falseValue('inactive');
```

## Validation rules

| Configuration | Rules |
| ------------- | ----- |
| default (`true`/`false`) | `boolean` |
| custom values | `Rule::in([trueValue, falseValue])` (a `null` value is left out) |

```php
Toggle::make('status')->trueValue('active')->falseValue('inactive');
// ['nullable', Rule::in(['active', 'inactive'])]
```

As with [Checkbox](/fields/checkbox), `required()` means the switch must be on: it generates `['required', 'accepted']`, or `['required', Rule::in([<trueValue>])]` for custom values.

## Value

- The true value when on, the false value when off.
- Empty value: the false value (`false` by default).
- Bound values are converted: truthy becomes the true value, falsy the false value.

## Standalone use

::: code-group

```vue [Vue]
<Toggle v-model="enabled" :field="enabledField" id="enabled" :disabled="false" />
```

```tsx [React]
<Toggle field={enabledField} id="enabled" value={enabled} disabled={false} onChange={setEnabled} />
```

```svelte [Svelte]
<Toggle field={enabledField} id="enabled" bind:value={enabled} disabled={false} />
```

:::

The switch compares its value with `field.trueValue`, so pass a serialized field. See [Standalone Components](/frontend/standalone).
