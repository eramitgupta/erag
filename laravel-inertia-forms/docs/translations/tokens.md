---
title: 'Tokens & Functions'
description: 'Use :name replacement tokens, function values for plurals and number formatting, and translate text that has elements inside.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/translations/tokens.md
</div>


<div class="doc-category">Translations</div>

# Tokens & Functions

A translation can be a plain string with `:tokens`, or a function that builds the text itself.

## Replacement tokens

Tokens work like Laravel's. A key's parameters are listed in the [key reference](/translations/keys).

| Token | Replaced with | `repeater_add` with `name: 'contact'` |
| ----- | ------------- | ------------------------------------- |
| `:name` | the value as is | `:name toevoegen` → `contact toevoegen` |
| `:Name` | first letter upper-cased | `:Name toevoegen` → `Contact toevoegen` |
| `:NAME` | fully upper-cased | `:NAME TOEVOEGEN` → `CONTACT TOEVOEGEN` |

- Put tokens anywhere and in any order, so the sentence can follow your language's grammar: `date_display: ':day :month :year'`.
- You can leave a token out. `action_clear_field: 'Wissen'` is valid, but the label then no longer says which field it clears.
- Longer names are replaced first, and replaced text is never scanned again, so a value that contains `:name` stays as it is.
- A token with no matching parameter is shown as typed.

## Function values

A value can be a function. It receives the parameters and returns the text. Use it for plural rules, number formatting, or anything a fixed string can't do:

```ts
import { setTranslations, type TranslationValue } from '@erag/inertia-forms-vue'; // or -react / -svelte

const plural = new Intl.PluralRules('nl-NL');
const number = new Intl.NumberFormat('nl-NL');

const maxFiles: TranslationValue = ({ count }) =>
    plural.select(Number(count)) === 'one' ? 'max. 1 bestand' : `max. ${count} bestanden`;

setTranslations({
    file_upload_max_files: maxFiles,
    option_selected_count: ({ count }) => `${number.format(Number(count))} geselecteerd`,
    wizard_progress: ({ current, total }) => `Stap ${number.format(Number(current))} van ${number.format(Number(total))}`,
    // 2.5 MB → 2,5 MB
    file_size_mb: ({ size }) => `${String(size).replace('.', ',')} MB`,
});
```

- Counts, numbers and dates are passed as numbers (`:count`, `:number`, `:current`, `:total`, `:max`, `:day`, `:year`), so `Intl` can format them. `file_size_mb` gets its size as text with one decimal.
- A function's result is used as is; tokens in it are not replaced.
- If a function throws, a warning is logged and the English default is shown.

## Text with elements inside

Two keys contain an element in the middle of the sentence. The element is written as a slot token, and the component renders its own element there:

| Key | Default | Slot | Rendered as |
| --- | ------- | ---- | ----------- |
| `file_upload_drop_prompt` | `:action or drag and drop` | `:action` | The clickable link, with the text of `file_upload_click_to_upload` |
| `composer_hint` | `Press :enter to send, :newline for new line` | `:enter`, `:newline` | A `<kbd>` with `composer_key_enter` / `composer_key_newline` |

Because the slots are tokens, the word order is yours:

```ts
setTranslations({
    file_upload_drop_prompt: 'Sleep bestanden hierheen of :action',
    file_upload_click_to_upload: 'kies ze op je computer',
    composer_hint: ':enter om te verzenden, :newline voor een nieuwe regel',
    composer_key_enter: 'Enter',
    composer_key_newline: 'Shift + Enter',
});
```

Keep every slot token, written in lower case. If you drop one, that element is not shown. A function value works here too, as long as it returns the slot tokens in the text.

Under the hood, the components call `translateParts(key, slots)`, which you can use in your own components. It returns text pieces and `{ slot }` markers in the translated order:

```ts
translateParts('composer_hint', ['enter', 'newline']);
// ['Press ', { slot: 'enter' }, ' to send, ', { slot: 'newline' }, ' for new line']
```
