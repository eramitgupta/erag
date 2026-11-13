---
title: 'Key Reference'
description: 'Every frontend translation key with its English default, where it shows and its parameters, grouped by component.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/translations/keys.md
</div>


<div class="doc-category">Translations</div>

# Key Reference

Every key the built-in components use, grouped by component. Copy the ones you need into `setTranslations()`.

The full list, generated from `defaultTranslations` (130 keys). Every key is optional: anything you don't set shows the English default. Params are the tokens the component passes in.

## Actions

Generic button text. Several are reserved: no built-in component renders them, so they are there for your own components and stay consistent with the rest of the form.

| Key | Default | Where it shows | Params |
| --- | ------- | -------------- | ------ |
| `action_add` | `Add` | Reserved: not used by a built-in component. For your own components. | — |
| `action_cancel` | `Cancel` | Reserved: not used by a built-in component. For your own components. | — |
| `action_clear` | `Clear` | Date Picker and Time Picker: **Clear** button in the popover footer | — |
| `action_clear_field` | `Clear :label` | Screen reader label of the × clear button on Text Input, Combobox, Date Picker, Time Picker and Color Picker (`clearable()`) | `:label` field label |
| `action_close` | `Close` | Reserved: not used by a built-in component. For your own components. | — |
| `action_copy` | `Copy` | Reserved: not used by a built-in component. For your own components. | — |
| `action_copied` | `Copied` | Color Picker: copy button label right after copying | — |
| `action_delete` | `Delete` | Reserved: not used by a built-in component. For your own components. | — |
| `action_delete_field` | `Delete :name` | Blocks, Repeater and Key Value: delete button label of an item or row | `:name` item name, like `Section 2` or `row 3` |
| `action_done` | `Done` | Reserved: not used by a built-in component. For your own components. | — |
| `action_remove` | `Remove` | File Upload: **Remove** button on each selected file | — |

## Form

| Key | Default | Where it shows | Params |
| --- | ------- | -------------- | ------ |
| `form_submit` | `Submit` | The submit button `<Form>` adds when the form has no Submit or Composer field (also the last wizard step) | — |

## Textarea

The counter key starts with `form_` because Composer uses it too.

| Key | Default | Where it shows | Params |
| --- | ------- | -------------- | ------ |
| `form_character_count` | `:count / :max` | Textarea counter with `maxLength()` (with `showCharacterCount()` and no max, only the number shows); Composer counter | `:count` characters typed, `:max` |

## Select and Combobox

| Key | Default | Where it shows | Params |
| --- | ------- | -------------- | ------ |
| `option_placeholder` | `Select an option` | Combobox placeholder when nothing is picked, for fields that are not `searchable()` and have no `placeholder()` | — |
| `option_search` | `Search…` | Combobox placeholder when nothing is picked, for `searchable()` fields without `placeholder()` | — |
| `option_searching` | `Searching…` | Combobox list text while a server search (`searchUsing()`) loads | — |
| `option_no_results` | `No results` | Combobox list text when nothing matches | — |
| `option_selected_count` | `:count selected` | Combobox `multiple()`: screen reader text in the trigger | `:count` |
| `option_remove` | `Remove :name` | Combobox `multiple()`: label of the × on each chip | `:name` option label |

## File Upload and file sizes

The hint under the drop zone is built from these keys, joined with ` · `, like `PDF, DOCX · up to 2.0 MB · max 3 files`. File type names come from `accept()` and are not translated.

| Key | Default | Where it shows | Params |
| --- | ------- | -------------- | ------ |
| `file_upload_click_to_upload` | `Click to upload` | File Upload: the highlighted link in the drop zone title. Rendered in the `:action` slot of `file_upload_drop_prompt` | — |
| `file_upload_drop_prompt` | `:action or drag and drop` | File Upload: drop zone title when the field has no `placeholder()` | `:action` slot (the link) |
| `file_upload_images` | `Images` | File Upload hint for `image()` fields without `accept()` | — |
| `file_upload_max_size` | `up to :size` | File Upload hint with `maxSize()` | `:size` formatted size, like `2.0 MB` |
| `file_upload_max_files` | `max :count files` | File Upload hint with `multiple()` and `maxFiles()` | `:count` |
| `file_size_bytes` | `:size B` | Sizes under 1 KB: File Upload file list, Composer attachments, the max size hint | `:size` number |
| `file_size_kb` | `:size KB` | Sizes under 1 MB (same places) | `:size` whole number |
| `file_size_mb` | `:size MB` | Sizes of 1 MB and more (same places) | `:size` text with one decimal, like `2.5` |

## Date Picker

| Key | Default | Where it shows | Params |
| --- | ------- | -------------- | ------ |
| `date_placeholder` | `Select a date` | Date Picker trigger text when empty | — |
| `date_range_placeholder` | `Select dates` | Date Picker `range()` trigger text when empty | — |
| `date_today` | `Today` | Date Picker: **Today** button in the popover footer | — |
| `date_range` | `:start – :end` | Date Picker `range()` trigger text. `:end` is `…` until the second date is picked | `:start`, `:end` (each built with `date_display`) |
| `date_display` | `:month :day, :year` | Date Picker trigger text of a picked date, like `Oct 4, 2026` | `:month` short month name, `:day`, `:year` |
| `date_time` | `:date, :time` | Date Picker `withTime()` trigger text | `:date` (from `date_display`), `:time` (`HH:MM`) |

## Calendar

The calendar inside the Date Picker. Month and weekday names come from these keys, not from `Intl`, so the calendar shows exactly the words you set.

| Key | Default | Where it shows | Params |
| --- | ------- | -------------- | ------ |
| `calendar_previous_year` | `Previous year` | Calendar navigation button label (screen readers) | — |
| `calendar_previous_month` | `Previous month` | Calendar navigation button label (screen readers) | — |
| `calendar_next_month` | `Next month` | Calendar navigation button label (screen readers) | — |
| `calendar_next_year` | `Next year` | Calendar navigation button label (screen readers) | — |
| `calendar_month_year` | `:month :year` | Calendar title above each month | `:month` full month name, `:year` |
| `calendar_day_label` | `:weekday, :month :day, :year` | Label of each day button (screen readers) | `:weekday`, `:month` (full names), `:day`, `:year` |
| `calendar_month_january` | `January` | Calendar title and day labels | — |
| `calendar_month_february` | `February` | Calendar title and day labels | — |
| `calendar_month_march` | `March` | Calendar title and day labels | — |
| `calendar_month_april` | `April` | Calendar title and day labels | — |
| `calendar_month_may` | `May` | Calendar title and day labels | — |
| `calendar_month_june` | `June` | Calendar title and day labels | — |
| `calendar_month_july` | `July` | Calendar title and day labels | — |
| `calendar_month_august` | `August` | Calendar title and day labels | — |
| `calendar_month_september` | `September` | Calendar title and day labels | — |
| `calendar_month_october` | `October` | Calendar title and day labels | — |
| `calendar_month_november` | `November` | Calendar title and day labels | — |
| `calendar_month_december` | `December` | Calendar title and day labels | — |
| `calendar_month_short_january` | `Jan` | Date Picker trigger text (`:month` in `date_display`) | — |
| `calendar_month_short_february` | `Feb` | Date Picker trigger text (`:month` in `date_display`) | — |
| `calendar_month_short_march` | `Mar` | Date Picker trigger text (`:month` in `date_display`) | — |
| `calendar_month_short_april` | `Apr` | Date Picker trigger text (`:month` in `date_display`) | — |
| `calendar_month_short_may` | `May` | Date Picker trigger text (`:month` in `date_display`) | — |
| `calendar_month_short_june` | `Jun` | Date Picker trigger text (`:month` in `date_display`) | — |
| `calendar_month_short_july` | `Jul` | Date Picker trigger text (`:month` in `date_display`) | — |
| `calendar_month_short_august` | `Aug` | Date Picker trigger text (`:month` in `date_display`) | — |
| `calendar_month_short_september` | `Sep` | Date Picker trigger text (`:month` in `date_display`) | — |
| `calendar_month_short_october` | `Oct` | Date Picker trigger text (`:month` in `date_display`) | — |
| `calendar_month_short_november` | `Nov` | Date Picker trigger text (`:month` in `date_display`) | — |
| `calendar_month_short_december` | `Dec` | Date Picker trigger text (`:month` in `date_display`) | — |
| `calendar_weekday_sunday` | `Sunday` | Day labels (screen readers) | — |
| `calendar_weekday_monday` | `Monday` | Day labels (screen readers) | — |
| `calendar_weekday_tuesday` | `Tuesday` | Day labels (screen readers) | — |
| `calendar_weekday_wednesday` | `Wednesday` | Day labels (screen readers) | — |
| `calendar_weekday_thursday` | `Thursday` | Day labels (screen readers) | — |
| `calendar_weekday_friday` | `Friday` | Day labels (screen readers) | — |
| `calendar_weekday_saturday` | `Saturday` | Day labels (screen readers) | — |
| `calendar_weekday_short_sunday` | `Su` | Calendar column headings | — |
| `calendar_weekday_short_monday` | `Mo` | Calendar column headings | — |
| `calendar_weekday_short_tuesday` | `Tu` | Calendar column headings | — |
| `calendar_weekday_short_wednesday` | `We` | Calendar column headings | — |
| `calendar_weekday_short_thursday` | `Th` | Calendar column headings | — |
| `calendar_weekday_short_friday` | `Fr` | Calendar column headings | — |
| `calendar_weekday_short_saturday` | `Sa` | Calendar column headings | — |

## Time Picker

| Key | Default | Where it shows | Params |
| --- | ------- | -------------- | ------ |
| `time_now` | `Now` | Time Picker: **Now** button in the popover footer | — |
| `time_hour` | `Hour` | Hour column heading (Time Picker and Date Picker `withTime()`) | — |
| `time_minute` | `Min` | Minute column heading | — |
| `time_second` | `Sec` | Seconds column heading (`withSeconds()`) | — |

## Color Picker

| Key | Default | Where it shows | Params |
| --- | ------- | -------------- | ------ |
| `color_placeholder` | `Pick a color` | Color Picker trigger text when empty and no `placeholder()` | — |
| `color_hue` | `Hue` | Color Picker slider label | — |
| `color_saturation` | `Saturation` | Color Picker slider label | — |
| `color_lightness` | `Lightness` | Color Picker slider label | — |
| `color_hex_code` | `:label hex code` | Color Picker hex input label (screen readers) | `:label` field label |
| `color_eyedropper` | `Pick a color from the screen` | Color Picker eyedropper button label (in browsers that support it) | — |
| `color_copy_hex` | `Copy hex code` | Color Picker copy button label | — |

## Tags Input

| Key | Default | Where it shows | Params |
| --- | ------- | -------------- | ------ |
| `tags_placeholder` | `Type and press Enter` | Tags Input placeholder when there are no tags and no `placeholder()` | — |
| `tags_list` | `:label tags` | Tags Input chip list label (screen readers) | `:label` field label |
| `tags_suggestions` | `:label suggestions` | Tags Input suggestions list label (screen readers) | `:label` field label |
| `tags_remove` | `Remove :name` | Tags Input: label of the × on each chip | `:name` tag text |

## Key Value

| Key | Default | Where it shows | Params |
| --- | ------- | -------------- | ------ |
| `key_value_key` | `Key` | Key column heading when PHP `keyLabel()` is not set | — |
| `key_value_value` | `Value` | Value column heading when PHP `valueLabel()` is not set | — |
| `key_value_add` | `Add row` | Add button when PHP `addActionLabel()` is not set | — |
| `key_value_empty` | `No entries yet.` | Key Value empty state | — |
| `key_value_cell` | `:label :number` | Key and value input labels (screen readers) | `:label` column heading, `:number` row number |
| `key_value_row` | `row :number` | Row name used as `:name` in the move and delete labels | `:number` row number |

## Repeater and Blocks

Repeater and Blocks share one component, so the `collection_*` keys apply to both (and the move labels to Key Value too).

| Key | Default | Where it shows | Params |
| --- | ------- | -------------- | ------ |
| `collection_expand_all` | `Expand all` | Toggle-all button when every item is collapsed (`collapsible()`) | — |
| `collection_collapse_all` | `Collapse all` | Toggle-all button (`collapsible()`) | — |
| `collection_move_up` | `Move :name up` | Move up button label (Repeater, Blocks, Key Value) | `:name` item name |
| `collection_move_down` | `Move :name down` | Move down button label (Repeater, Blocks, Key Value) | `:name` item name |
| `collection_item` | `:label :number` | Item title when `titleFrom()` is empty, and the item name in move and delete labels | `:label` block or item label, `:number` |
| `blocks_add` | `Add block` | Blocks add button and add menu label when PHP `addActionLabel()` is not set | — |
| `blocks_empty` | `No blocks yet.` | Blocks empty state | — |
| `repeater_add` | `Add :name` | Repeater add button when PHP `addActionLabel()` is not set | `:name` item label, lower-cased (`itemLabel()`, else the PHP key `fields.repeater.item`) |
| `repeater_empty` | `No items yet.` | Repeater empty state | — |

## Link

| Key | Default | Where it shows | Params |
| --- | ------- | -------------- | ------ |
| `link_url_placeholder` | `https://example.com` | Link URL input placeholder when no `placeholder()` | — |
| `link_text_placeholder` | `Link text` | Link text input placeholder (`withLabel()` without a placeholder argument) | — |
| `link_text_label` | `:label text` | Link text input label (screen readers) | `:label` field label |
| `link_target_label` | `Open :label in` | Link target choice label (screen readers, `withTarget()`) | `:label` field label |
| `link_same_tab` | `Same tab` | Link target option (`withTarget()`) | — |
| `link_new_tab` | `New tab` | Link target option (`withTarget()`) | — |
| `link_scheme_hint` | `Start with :scheme` | Hint under the Link input with `requireScheme()` | `:scheme`, like `https://` |

## Slug

| Key | Default | Where it shows | Params |
| --- | ------- | -------------- | ------ |
| `slug_regenerate` | `Regenerate :label` | Slug regenerate button label and tooltip | `:label` field label |

## OTP Input

| Key | Default | Where it shows | Params |
| --- | ------- | -------------- | ------ |
| `otp_digit` | `Digit :number of :total` | Label of each box (screen readers), numeric codes | `:number`, `:total` |
| `otp_character` | `Character :number of :total` | Label of each box (screen readers), `alphanumeric()` codes | `:number`, `:total` |

## Composer

| Key | Default | Where it shows | Params |
| --- | ------- | -------------- | ------ |
| `composer_send` | `Send` | Send button when PHP `sendLabel()` is not set | — |
| `composer_attach` | `Attach files` | Paperclip button label and tooltip (`attachments()`) | — |
| `composer_attachments` | `Attachments` | Attachment list label (screen readers) | — |
| `composer_quick_replies` | `Quick replies` | Quick replies group label (screen readers) | — |
| `composer_remove_attachment` | `Remove :name` | Label of the × on each attachment | `:name` file name |
| `composer_hint` | `Press :enter to send, :newline for new line` | Hint under the box with `submitOnEnter()`. Each slot is rendered as a `<kbd>` | `:enter`, `:newline` slots |
| `composer_key_enter` | `Enter` | Key name in the `:enter` slot of `composer_hint` | — |
| `composer_key_newline` | `Shift + Enter` | Key name in the `:newline` slot of `composer_hint` | — |

## Wizard

| Key | Default | Where it shows | Params |
| --- | ------- | -------------- | ------ |
| `wizard_next` | `Continue` | Wizard **Continue** button when PHP `wizard(nextLabel: ...)` is not set | — |
| `wizard_back` | `Back` | Wizard **Back** button when PHP `wizard(backLabel: ...)` is not set | — |
| `wizard_progress` | `Step :current of :total` | Compact step counter above the progress bar | `:current` (starts at 1), `:total` |
| `wizard_progress_label` | `Progress` | Label of the steps navigation (screen readers) | — |
| `wizard_step` | `Step :number` | Title of a step whose fieldset has no legend | `:number` (starts at 1) |
