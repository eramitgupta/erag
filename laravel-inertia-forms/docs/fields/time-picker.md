---
title: 'Time Picker'
description: 'A time popover with hour and minute columns, minute steps, optional seconds, and earliest or latest limits, validated with date_format.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/fields/time-picker.md
</div>


<div class="doc-category">Fields</div>

# Time Picker

`Erag\InertiaForms\Fields\TimePicker` opens a small popover with scrollable hour and minute columns (and seconds, if you turn them on). It is built into the package with Tailwind CSS, so it looks the same in every browser.

**When to use:** opening hours, reminder times, preferred call times.

## Examples

Each example is a live form built from the PHP below it. Fill it in and press submit to see the data your controller would receive.

### Basic

An optional time in 15-minute steps, with a × button to clear it.

<Example id="fields/time-picker/basic">

<<< @/../examples/fields/time-picker/basic.php#example

</Example>

### Allowed window

`minTime()` and `maxTime()` disable every minute outside the window, and add matching rules on the server. `minuteStep(30)` keeps the list short.

<Example id="fields/time-picker/business-hours">

<<< @/../examples/fields/time-picker/business-hours.php#example

</Example>

### Advanced: seconds

`withSeconds()` adds a third column and stores `H:i:s`. With `minuteStep(1)` every minute can be picked, and the limits use seconds as well.

<Example id="fields/time-picker/seconds">

<<< @/../examples/fields/time-picker/seconds.php#example

</Example>

## How it works

- Click the field to open the columns. Picking an hour, minute, or second updates the value right away.
- The popover closes by itself once you have picked every column (hour and minute, plus second with `withSeconds()`). When the field already had a time, picking a new minute (or second) closes it straight away. Click outside, press Escape, or Tab away to close it at any time.
- The selected entry in each column is highlighted and scrolled into view when the popover opens.
- Minutes (and seconds) outside `minTime()` / `maxTime()` are disabled.
- The footer has a **Now** button (the current time, rounded down to the minute step) and a **Clear** button. Both close the popover.

## Methods

All [common field methods](/concepts/form-class#common-field-methods) are available, including [`clearable()`](/concepts/form-class#common-field-methods), plus:

### `minuteStep(int $minutes)`

The gap between the minutes offered in the picker. The default is `5` (`:00`, `:05`, `:10`, …). Values are clamped between `1` and `30`.

```php
TimePicker::make('slot')->minuteStep(15); // :00, :15, :30, :45
TimePicker::make('exact_time')->minuteStep(1);
```

The step only shapes the picker. It is not a validation rule, so add your own rule if the server must enforce it.

### `withSeconds(bool $withSeconds = true)`

Add a seconds column. The value format becomes `H:i:s`.

```php
TimePicker::make('lap_time')->withSeconds();
```

### `minTime(?string $time)`

The earliest allowed time, as a string like `'09:00'`. Earlier minutes are disabled in the picker, and an `after_or_equal:` rule is added.

```php
TimePicker::make('opens_at')->minTime('06:00');
```

### `maxTime(?string $time)`

The latest allowed time. Later minutes are disabled in the picker, and a `before_or_equal:` rule is added.

```php
TimePicker::make('closes_at')->maxTime('23:30');
```

### `clearable(bool $clearable = true)`

Shows a × button in the field once a time is set. Clicking it empties the value.

```php
TimePicker::make('reminder_at')->clearable();
```

### `placeholder(?string $placeholder)`

Text shown while no time is set. Defaults to `--:--` (or `--:--:--` with `withSeconds()`).

## Validation rules

| Configuration | Rules |
| ------------- | ----- |
| default | `date_format:H:i` |
| `withSeconds()` | `date_format:H:i:s` |
| `minTime('09:00')` | adds `after_or_equal:09:00` |
| `maxTime('17:00')` | adds `before_or_equal:17:00` |

```php
TimePicker::make('call_time')->required()->minTime('09:00');
// ['required', 'date_format:H:i', 'after_or_equal:09:00']
```

## Value

- A string: `H:i` (for example `14:30`), or `H:i:s` with `withSeconds()`.
- Empty value: `''`.
- Bound Carbon / `DateTimeInterface` values are formatted to match.

## Standalone use

::: code-group

```vue [Vue]
<TimePicker v-model="callTime" :field="callTimeField" id="call_time" :disabled="false" />
```

```tsx [React]
<TimePicker field={callTimeField} id="call_time" value={callTime} disabled={false} onChange={setCallTime} />
```

```svelte [Svelte]
<TimePicker field={callTimeField} id="call_time" bind:value={callTime} disabled={false} />
```

:::

See [Standalone Components](/frontend/standalone).
