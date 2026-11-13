---
title: 'Calendar & Dates'
description: 'Translate month and weekday names, date formats and the first day of the week in the Date Picker.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/translations/calendar.md
</div>


<div class="doc-category">Translations</div>

# Calendar & Dates

How the Date Picker shows month and weekday names, dates, and the first day of the week.

The calendar does not use `Intl` or the browser language. Month and weekday names come from keys, so the calendar shows exactly the words you set:

| Keys | Used for |
| ---- | -------- |
| `calendar_month_january` ... `calendar_month_december` | Calendar title (`calendar_month_year`) and day labels |
| `calendar_month_short_january` ... `calendar_month_short_december` | Date Picker trigger text (`:month` in `date_display`) |
| `calendar_weekday_sunday` ... `calendar_weekday_saturday` | Day labels for screen readers (`calendar_day_label`) |
| `calendar_weekday_short_sunday` ... `calendar_weekday_short_saturday` | Calendar column headings |

Dutch writes month and day names in lower case, so the title uses `:Month` to capitalize only there:

```ts
setTranslations({
    calendar_month_october: 'oktober',
    calendar_month_short_october: 'okt',
    calendar_weekday_short_monday: 'ma',
    calendar_month_year: ':Month :year', // "Oktober 2026"
    date_display: ':day :month :year', // "4 okt 2026"
    calendar_day_label: ':Weekday :day :month :year', // "Zondag 4 oktober 2026"
});
```

The weekday the rows start on is not a translation. Set it per field in PHP with [`firstDayOfWeek()`](/fields/date-picker#firstdayofweek-int-day) (`0` Sunday, the default, `1` Monday). To follow the locale:

```php
DatePicker::make('starts_on')->firstDayOfWeek(app()->getLocale() === 'en_US' ? 0 : 1);
```

The column headings follow that order automatically.
