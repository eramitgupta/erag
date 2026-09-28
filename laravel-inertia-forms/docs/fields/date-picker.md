---
title: 'Date Picker'
description: 'A calendar popover for single dates, date and time, or start-end ranges, with min and max limits, keyboard navigation, and date rules.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/fields/date-picker.md
</div>


<div class="doc-category">Fields</div>

# Date Picker

`Erag\InertiaForms\Fields\DatePicker` opens a calendar in a popover under the field. It handles a single date, a date and a time (`withTime()`), or a start and end date (`range()`). The calendar is built into the package with Tailwind CSS, so it looks the same in every browser and needs no extra date library.

**When to use:** birthdays, start dates, deadlines, appointment slots, booking and report ranges.

## Examples

Each example is a live form built from the PHP below it. Fill it in and press submit to see the data your controller would receive.

### Basic

A single required date. `minDate()` and `maxDate()` disable every day outside the allowed window, here anyone younger than 18.

<Example id="fields/date-picker/basic">

<<< @/../examples/fields/date-picker/basic.php#example

</Example>

### Date and time

`withTime()` adds hour and minute columns and stores `Y-m-d\TH:i`. Because `minDate(now())` is a Carbon instance, the limit includes the time too.

<Example id="fields/date-picker/with-time">

<<< @/../examples/fields/date-picker/with-time.php#example

</Example>

### Advanced: booking range

`range()` stores a `start` and an `end`, shown over two months. `firstDayOfWeek(1)` starts the weeks on Monday, and the field spans two of the fieldset's three columns.

<Example id="fields/date-picker/range">

<<< @/../examples/fields/date-picker/range.php#example

</Example>

## How it works

- Click the field to open the calendar. Picking a day sets the value and closes it. In range mode it closes once both the start and end are picked. The popover is as wide as the calendar, not the field.
- The field shows the chosen date in a readable form (for example "Sep 27, 2026"). The stored value stays `Y-m-d`.
- Days before `minDate()` or after `maxDate()` are disabled. Today is outlined.
- The footer has a **Today** button (jumps to the current month and, outside range mode, picks today) and a **Clear** button.
- Click outside or press Escape to close without changes. When there is no room below, the popover opens above the field.

### Keyboard

| Key | Action |
| --- | ------ |
| Arrow Left / Right | Previous / next day |
| Arrow Up / Down | Same day in the previous / next week |
| Page Up / Page Down | Same day in the previous / next month |
| Enter / Space | Pick the focused day |
| Escape | Close the calendar |

## Methods

All [common field methods](/concepts/form-class#common-field-methods) are available, including [`clearable()`](/concepts/form-class#common-field-methods), plus:

### `withTime(bool $withTime = true)`

Pick a date and a time. Hour and minute columns appear next to the calendar (in 5-minute steps), and a picked day keeps the current time or starts at 09:00. The popover stays open while you pick a day and an hour, and closes once you pick a minute. The value format becomes `Y-m-d\TH:i` (for example `2026-09-27T14:30`).

```php
DatePicker::make('meeting_at')->withTime();
```

`withTime()` is ignored in range mode.

### `range(bool $range = true)`

Pick a start and an end date. The first click sets the start, the second click sets the end (clicking an earlier day swaps them), and the days in between are highlighted while you move the pointer. The value becomes an array with `start` and `end` keys.

```php
DatePicker::make('stay')->range()->required();
// value: ['start' => '2026-10-18', 'end' => '2026-10-22']
```

A range picker shows two months side by side unless you set `months()` yourself.

### `months(int $months)`

How many months the calendar shows at once: `1` or `2`. Other numbers are clamped to that range. The default is `1`, or `2` with `range()`. On small screens the months stack vertically.

```php
DatePicker::make('trip')->range()->months(1);
DatePicker::make('due_on')->months(2);
```

### `firstDayOfWeek(int $day)`

The weekday the calendar rows start on: `0` for Sunday (the default), `1` for Monday, up to `6` for Saturday.

```php
DatePicker::make('starts_on')->firstDayOfWeek(1);
```

### `minDate(DateTimeInterface|string|null $date)`

The earliest allowed date. Earlier days are disabled in the calendar, and an `after_or_equal:` rule is added. A Carbon instance is formatted for the field; a string is used as-is.

```php
DatePicker::make('check_in')->minDate(today());
DatePicker::make('check_in')->minDate('2026-01-01');
```

### `maxDate(DateTimeInterface|string|null $date)`

The latest allowed date. Later days are disabled, and a `before_or_equal:` rule is added.

```php
DatePicker::make('birthday')->maxDate(today()->subYears(18));
```

::: tip Limits follow the mode
Carbon limits are formatted when the form is serialized, so they always match the mode. With `withTime()` they include the time, in any call order:

```php
DatePicker::make('meeting_at')->minDate(now())->withTime();
```
:::

### `clearable(bool $clearable = true)`

Shows a small × button in the field once a date is set. Clicking it empties the value (both ends for a range). The **Clear** button in the calendar footer is always there.

```php
DatePicker::make('follow_up_on')->clearable();
```

## Validation rules

**Single date**

| Configuration | Rules |
| ------------- | ----- |
| default | `date` |
| `minDate('2026-01-01')` | adds `after_or_equal:2026-01-01` |
| `maxDate('2026-12-31')` | adds `before_or_equal:2026-12-31` |

```php
DatePicker::make('starts_on')->required()->minDate('2026-01-01');
// ['required', 'date', 'after_or_equal:2026-01-01']
```

**Range**

With `range()`, rules are set on the array and on each end:

| Key | Rules |
| --- | ----- |
| `name` | `required` or `nullable`, `array`, plus your own rules |
| `name.start` | `required` or `nullable`, `date`, and the min/max rules |
| `name.end` | `required` (or `required_with:name.start` when optional), `nullable`, `date`, the min/max rules, and `after_or_equal:name.start` |

```php
DatePicker::make('stay')->range()->required()->minDate('2026-01-01');
// 'stay'       => ['required', 'array']
// 'stay.start' => ['required', 'date', 'after_or_equal:2026-01-01']
// 'stay.end'   => ['required', 'nullable', 'date', 'after_or_equal:2026-01-01', 'after_or_equal:stay.start']
```

An optional range may be left empty, but once a start date is set, an end date is required too. The end can't be before the start.

## Value

- A string: `Y-m-d`, or `Y-m-d\TH:i` with `withTime()`.
- With `range()`: an array `['start' => 'Y-m-d', 'end' => 'Y-m-d']`. Until the second click, `end` is `''`.
- Empty value: `''`, or `['start' => '', 'end' => '']` with `range()`.
- Bound Carbon / `DateTimeInterface` values are formatted to match. Bound strings are passed through unchanged, so use a `date` or `datetime` cast on your model.
- A bound range can be an array with `start`/`end` keys or a two-item list like `[$checkIn, $checkOut]`. Each item may be a Carbon instance or a string.

```php
$form->bind(['stay' => [Carbon::parse('2026-10-18'), '2026-10-22']]);
// data: ['stay' => ['start' => '2026-10-18', 'end' => '2026-10-22']]
```

## Standalone use

::: code-group

```vue [Vue]
<DatePicker v-model="startsOn" :field="startsOnField" id="starts_on" :disabled="false" />
```

```tsx [React]
<DatePicker field={startsOnField} id="starts_on" value={startsOn} disabled={false} onChange={setStartsOn} />
```

```svelte [Svelte]
<DatePicker field={startsOnField} id="starts_on" bind:value={startsOn} disabled={false} />
```

:::

For a range field, keep an object like `{ start: '', end: '' }` in your state. The `DateRangeValue` type describes it. See [Standalone Components](/frontend/standalone).
