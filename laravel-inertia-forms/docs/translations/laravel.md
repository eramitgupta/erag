---
title: 'Laravel Messages'
description: 'Publish the inertia-forms language file and translate the validation messages and attribute names the package writes on the server.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/translations/laravel.md
</div>


<div class="doc-category">Translations</div>

# Laravel Messages

The package writes a few validation messages and attribute names itself. They live in a language file you can publish and translate per locale.

## Publish the language file

```bash
php artisan vendor:publish --tag=inertia-forms-lang
```

This copies the package's English file into your app:

```
lang/
└── vendor/
    └── inertia-forms/
        ├── en/
        │   └── inertia-forms.php   ← published copy, edit to change the English
        └── nl/
            └── inertia-forms.php   ← add one folder per locale
```

The namespace is `inertia-forms`, so the package reads its keys as `inertia-forms::inertia-forms.fields...`. A locale file only needs the keys you change. Missing keys fall back to your `fallback_locale`, then to the package's English.

## Override example

A complete Dutch file. Copy it to `lang/vendor/inertia-forms/nl/inertia-forms.php`:

```php
<?php

return [

    'fields' => [

        'blocks' => [
            'type_attribute' => 'bloktype van :label',
            'item_field_attribute' => ':field (:block :position)',
        ],

        'repeater' => [
            'item' => 'Item',
        ],

        'combobox' => [
            'invalid' => 'De geselecteerde :attribute is ongeldig.',
        ],

        'composer' => [
            'required' => 'Schrijf een bericht of voeg een bestand toe.',
            'attachments_attribute' => 'bijlagen van :label',
            'attachment_attribute' => 'bijlage van :label',
        ],

        'key_value' => [
            'key' => 'Sleutel',
            'value' => 'Waarde',
            'cell_attribute' => ':label :column (rij :position)',
            'required' => 'Het veld :attribute heeft minstens één item nodig.',
            'key_required_with' => 'Het veld :attribute is verplicht als er een waarde is ingevuld.',
            'key_distinct' => ':Attribute wordt meer dan eens gebruikt.',
        ],

        'link' => [
            'scheme_required' => ':Attribute moet beginnen met :scheme.',
            'scheme_not_allowed' => ':Attribute moet :schemes gebruiken.',
            'scheme_separator' => ' of ',
            'invalid' => ':Attribute moet een geldige URL zijn.',
            'label_attribute' => 'tekst van :label',
            'target_attribute' => 'doel van :label',
        ],

        'otp' => [
            'size' => ':Attribute moet :length tekens lang zijn.',
            'alphanumeric' => ':Attribute mag alleen letters en cijfers bevatten.',
            'numeric' => ':Attribute mag alleen cijfers bevatten.',
        ],

        'slug' => [
            'format_lowercase_dashes' => ':Attribute mag alleen kleine letters, cijfers en losse streepjes bevatten.',
            'format_lowercase_underscores' => ':Attribute mag alleen kleine letters, cijfers en losse underscores bevatten.',
            'format_dashes' => ':Attribute mag alleen letters, cijfers en losse streepjes bevatten.',
            'format_underscores' => ':Attribute mag alleen letters, cijfers en losse underscores bevatten.',
        ],

    ],

];
```

`:attribute` is filled in by Laravel's validator, so `:Attribute` and `:ATTRIBUTE` work as usual. The other tokens (`:label`, `:field`, `:block`, `:position`, `:column`, `:scheme`, `:schemes`, `:length`) are filled in by the package.

## Every Laravel key

All keys sit under `fields`, so `blocks.type_attribute` is `inertia-forms::inertia-forms.fields.blocks.type_attribute`.

| Key | Default | When it shows |
| --- | ------- | ------------- |
| `blocks.type_attribute` | `:label block type` | Attribute name when a Blocks item has a missing or unknown type. `:label` is the field label. |
| `blocks.item_field_attribute` | `:field (:block :position)` | Attribute name of a field inside a Blocks or Repeater item, like "Title (Section 2)". |
| `repeater.item` | `Item` | The item name of a Repeater without `itemLabel()`. Also shown in the browser: item titles ("Item 1") and, lower-cased, the add button ("Add item"). |
| `combobox.invalid` | `The selected :attribute is invalid.` | A Combobox with `searchUsing()` gets a value that `selectedOptionsUsing()` doesn't return. |
| `composer.required` | `Write a message or attach a file.` | A `required()` Composer is sent with no text and no files. |
| `composer.attachments_attribute` | `:label attachments` | Attribute name in errors about the attachment list (for example too many files). |
| `composer.attachment_attribute` | `:label attachment` | Attribute name in errors about one attachment (type or size). |
| `key_value.key` | `Key` | Column name in Key Value errors, lower-cased, when `keyLabel()` is not set. |
| `key_value.value` | `Value` | Column name in Key Value errors, lower-cased, when `valueLabel()` is not set. |
| `key_value.cell_attribute` | `:label :column (row :position)` | Attribute name of one key or value cell. |
| `key_value.required` | `The :attribute field needs at least one entry.` | A `required()` Key Value has no row with a key. |
| `key_value.key_required_with` | `The :attribute field is required when a value is filled in.` | A row has a value but no key. |
| `key_value.key_distinct` | `The :attribute is used more than once.` | Two rows use the same key. |
| `link.scheme_required` | `The :attribute must start with :scheme.` | `requireScheme()` and the URL has no scheme. `:scheme` is like `https://`. |
| `link.scheme_not_allowed` | `The :attribute must use :schemes.` | The scheme is not in `allowedSchemes()`. `:schemes` is the list joined with `scheme_separator`. |
| `link.scheme_separator` | `or` (with a space on each side) | Joins the schemes in `scheme_not_allowed`, like "https or mailto". |
| `link.invalid` | `The :attribute must be a valid URL.` | The URL can't be read as a web address. |
| `link.label_attribute` | `:label text` | Attribute name of the link text (`withLabel()`). |
| `link.target_attribute` | `:label target` | Attribute name of the link target (`withTarget()`). |
| `otp.size` | `The :attribute must be :length characters.` | An OTP code has the wrong length. |
| `otp.alphanumeric` | `The :attribute may only contain letters and numbers.` | An `alphanumeric()` OTP code has other characters. |
| `otp.numeric` | `The :attribute may only contain numbers.` | A numeric OTP code has other characters. |
| `slug.format_lowercase_dashes` | `The :attribute may only contain lower-case letters, numbers and single dashes.` | Slug format error (the default: lower case, `-`). |
| `slug.format_lowercase_underscores` | `The :attribute may only contain lower-case letters, numbers and single underscores.` | Slug format error with `separator('_')`. |
| `slug.format_dashes` | `The :attribute may only contain letters, numbers and single dashes.` | Slug format error with `keepCase()`. |
| `slug.format_underscores` | `The :attribute may only contain letters, numbers and single underscores.` | Slug format error with `keepCase()` and `separator('_')`. |
