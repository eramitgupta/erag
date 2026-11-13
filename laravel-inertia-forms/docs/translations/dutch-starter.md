---
title: 'Dutch Starter File'
description: 'A ready-to-copy Dutch translation file with all 130 frontend keys, to start a new language from.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/translations/dutch-starter.md
</div>


<div class="doc-category">Translations</div>

# Dutch Starter File

A complete translation file with every key. Copy it, rename it to your language and translate the values.

All 130 keys translated to Dutch. Copy it to `resources/js/lang/inertia-forms/nl.ts`, adjust the wording, and use it as the template for other languages.

::: details resources/js/lang/inertia-forms/nl.ts

```ts
import type { Translations } from '@erag/inertia-forms-vue'; // or -react / -svelte

export default {
    // Generic actions
    action_add: 'Toevoegen',
    action_cancel: 'Annuleren',
    action_clear: 'Wissen',
    action_clear_field: ':label wissen',
    action_close: 'Sluiten',
    action_copy: 'Kopiëren',
    action_copied: 'Gekopieerd',
    action_delete: 'Verwijderen',
    action_delete_field: ':Name verwijderen',
    action_done: 'Klaar',
    action_remove: 'Verwijderen',

    // Form
    form_submit: 'Versturen',
    form_character_count: ':count / :max',

    // Select / Combobox
    option_placeholder: 'Kies een optie',
    option_search: 'Zoeken…',
    option_searching: 'Bezig met zoeken…',
    option_no_results: 'Geen resultaten',
    option_selected_count: ':count geselecteerd',
    option_remove: ':name verwijderen',

    // FileUpload
    file_upload_click_to_upload: 'Klik om te uploaden',
    file_upload_drop_prompt: ':action of sleep bestanden hierheen',
    file_upload_images: 'Afbeeldingen',
    file_upload_max_size: 'tot :size',
    file_upload_max_files: 'max. :count bestanden',

    // File sizes (FileUpload and Composer)
    file_size_bytes: ':size B',
    file_size_kb: ':size KB',
    file_size_mb: ':size MB',

    // DatePicker
    date_placeholder: 'Kies een datum',
    date_range_placeholder: 'Kies datums',
    date_today: 'Vandaag',
    date_range: ':start – :end',
    date_display: ':day :month :year',
    date_time: ':date, :time',

    // Calendar
    calendar_previous_year: 'Vorig jaar',
    calendar_previous_month: 'Vorige maand',
    calendar_next_month: 'Volgende maand',
    calendar_next_year: 'Volgend jaar',
    calendar_month_year: ':Month :year',
    calendar_day_label: ':Weekday :day :month :year',
    calendar_month_january: 'januari',
    calendar_month_february: 'februari',
    calendar_month_march: 'maart',
    calendar_month_april: 'april',
    calendar_month_may: 'mei',
    calendar_month_june: 'juni',
    calendar_month_july: 'juli',
    calendar_month_august: 'augustus',
    calendar_month_september: 'september',
    calendar_month_october: 'oktober',
    calendar_month_november: 'november',
    calendar_month_december: 'december',
    calendar_month_short_january: 'jan',
    calendar_month_short_february: 'feb',
    calendar_month_short_march: 'mrt',
    calendar_month_short_april: 'apr',
    calendar_month_short_may: 'mei',
    calendar_month_short_june: 'jun',
    calendar_month_short_july: 'jul',
    calendar_month_short_august: 'aug',
    calendar_month_short_september: 'sep',
    calendar_month_short_october: 'okt',
    calendar_month_short_november: 'nov',
    calendar_month_short_december: 'dec',
    calendar_weekday_sunday: 'zondag',
    calendar_weekday_monday: 'maandag',
    calendar_weekday_tuesday: 'dinsdag',
    calendar_weekday_wednesday: 'woensdag',
    calendar_weekday_thursday: 'donderdag',
    calendar_weekday_friday: 'vrijdag',
    calendar_weekday_saturday: 'zaterdag',
    calendar_weekday_short_sunday: 'zo',
    calendar_weekday_short_monday: 'ma',
    calendar_weekday_short_tuesday: 'di',
    calendar_weekday_short_wednesday: 'wo',
    calendar_weekday_short_thursday: 'do',
    calendar_weekday_short_friday: 'vr',
    calendar_weekday_short_saturday: 'za',

    // TimePicker
    time_now: 'Nu',
    time_hour: 'Uur',
    time_minute: 'Min',
    time_second: 'Sec',

    // ColorPicker
    color_placeholder: 'Kies een kleur',
    color_hue: 'Tint',
    color_saturation: 'Verzadiging',
    color_lightness: 'Helderheid',
    color_hex_code: 'Hexcode van :label',
    color_eyedropper: 'Kies een kleur op het scherm',
    color_copy_hex: 'Hexcode kopiëren',

    // TagsInput
    tags_placeholder: 'Typ en druk op Enter',
    tags_list: 'Tags van :label',
    tags_suggestions: 'Suggesties voor :label',
    tags_remove: ':name verwijderen',

    // KeyValue
    key_value_key: 'Sleutel',
    key_value_value: 'Waarde',
    key_value_add: 'Rij toevoegen',
    key_value_empty: 'Nog geen items.',
    key_value_cell: ':label :number',
    key_value_row: 'rij :number',

    // Shared by Repeater, Blocks and KeyValue
    collection_expand_all: 'Alles uitklappen',
    collection_collapse_all: 'Alles inklappen',
    collection_move_up: ':Name omhoog verplaatsen',
    collection_move_down: ':Name omlaag verplaatsen',
    collection_item: ':label :number',

    // Blocks
    blocks_add: 'Blok toevoegen',
    blocks_empty: 'Nog geen blokken.',

    // Repeater
    repeater_add: ':Name toevoegen',
    repeater_empty: 'Nog geen items.',

    // Link
    link_url_placeholder: 'https://voorbeeld.nl',
    link_text_placeholder: 'Linktekst',
    link_text_label: 'Tekst van :label',
    link_target_label: ':label openen in',
    link_same_tab: 'Zelfde tabblad',
    link_new_tab: 'Nieuw tabblad',
    link_scheme_hint: 'Begin met :scheme',

    // Slug
    slug_regenerate: ':label opnieuw genereren',

    // OtpInput
    otp_digit: 'Cijfer :number van :total',
    otp_character: 'Teken :number van :total',

    // Composer
    composer_send: 'Verzenden',
    composer_attach: 'Bestanden bijvoegen',
    composer_attachments: 'Bijlagen',
    composer_quick_replies: 'Snelle antwoorden',
    composer_remove_attachment: ':name verwijderen',
    composer_hint: 'Druk op :enter om te verzenden, :newline voor een nieuwe regel',
    composer_key_enter: 'Enter',
    composer_key_newline: 'Shift + Enter',

    // Wizard
    wizard_next: 'Doorgaan',
    wizard_back: 'Terug',
    wizard_progress: 'Stap :current van :total',
    wizard_progress_label: 'Voortgang',
    wizard_step: 'Stap :number',
} satisfies Translations;
```

:::
