---
title: 'Translations Overview'
description: 'What Laravel Inertia Forms translates, where each piece of text comes from, and how to translate your own labels with __().'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/translations/index.md
</div>


<div class="doc-category">Translations</div>

# Translations Overview

Every word a form shows can be translated. The text comes from three places, and each is translated in its own place. Start here, then follow the pages in this section.

| Page | What it covers |
| ---- | -------------- |
| [Laravel Messages](/translations/laravel) | Publish the language file for the messages the package writes on the server. |
| [Frontend Setup](/translations/frontend) | Call `setTranslations()` once in your app entry. |
| [Tokens & Functions](/translations/tokens) | `:name` tokens, function values, and text with elements inside. |
| [Calendar & Dates](/translations/calendar) | Month and weekday names, date formats, first day of the week. |
| [Switching Language](/translations/switching-language) | Change the language at runtime with Inertia. |
| [Custom Components](/translations/custom-components) | `useTranslate()` in your own fields, and TypeScript types. |
| [Key Reference](/translations/keys) | Every frontend key with its English default. |
| [Dutch Starter File](/translations/dutch-starter) | All keys translated, ready to copy. |

::: tip Recommended: Laravel Lang Sync Inertia
Inertia Forms translates your forms. For the rest of your Inertia pages (headings, menus, buttons and messages outside a form) we recommend **[Laravel Lang Sync Inertia](https://erag.in/laravel-lang-sync-inertia/)**, a free companion package from the same author.

It shares your normal Laravel `lang/{locale}` files with Vue, React and Svelte, so you can use `__('app.welcome')` in your components just like in Blade. All your text, including the form component text, then lives in one place: your Laravel language files. See [Switching Language](/translations/switching-language#with-laravel-lang-sync-inertia-recommended) for the setup.
:::

## Two translation surfaces

| Surface | What it covers | Where you translate it |
| ------- | -------------- | ---------------------- |
| **Laravel** | Validation messages and attribute names the package writes itself (a required Composer, Key Value rows, Link schemes, Slug and OTP formats), and the default Repeater item name. | `lang/vendor/inertia-forms/{locale}/inertia-forms.php` |
| **Frontend** | Text the components render: buttons, placeholders, empty states, screen reader labels, file sizes, and calendar month and weekday names. | `setTranslations()` in your app entry |
| **Your app** | Labels, placeholders, help text, options, fieldset legends, Submit text, and Laravel's own validation messages (`required`, `email`, ...). | Your `lang/{locale}/*.php` files with `__()` |

What the package does **not** translate:

- **Your own copy.** Anything you pass to `label()`, `placeholder()`, `help()`, `options()`, `Fieldset::make()` or `Submit::make()` is shown as you wrote it. Wrap it in `__()`.
- **Laravel's validation messages.** "The email field is required." comes from your app's `lang/{locale}/validation.php` (run `php artisan lang:publish` to get the English files).
- **Developer-facing text.** Console warnings and thrown errors stay in English.
- **Symbols and data.** See [Not translated on purpose](#not-translated-on-purpose).

## Your own copy

Labels and other copy live in the form class, so translate them there with your app's keys. `fields()` runs on every request, after your locale middleware, so `__()` returns the right language:

```php
class ContactForm extends Form
{
    protected ?string $actionRoute = 'contact.store';

    public function fields(): array
    {
        return [
            Fieldset::make(__('contact.details'))->fields([
                TextInput::make('email')
                    ->label(__('contact.email'))
                    ->placeholder(__('contact.email_placeholder'))
                    ->help(__('contact.email_help'))
                    ->required(),
                Combobox::make('topic')
                    ->label(__('contact.topic'))
                    ->options([
                        'sales' => __('contact.topics.sales'),
                        'support' => __('contact.topics.support'),
                    ]),
            ]),
            Submit::make(__('contact.send')),
        ];
    }
}
```

Laravel uses the field label as the `:attribute` in validation messages, so a translated label also translates the attribute name in errors.

### Fields without a label

A field with no `label()` gets one from its name: `email` shows as "Email" and `full_name` as "Full name". Those names are English, so in a Hindi form you would see "Email भरना ज़रूरी है।".

Add the names to the `attributes` array of your app's `lang/{locale}/validation.php`. The package uses it for the label, and Laravel uses it for the `:attribute` in messages:

```php
// lang/hi/validation.php
return [
    'required' => ':attribute भरना ज़रूरी है।',

    'attributes' => [
        'email' => 'ईमेल',
        'full_name' => 'पूरा नाम',
    ],
];
```

`TextInput::make('email')` now shows "ईमेल" and its error reads "ईमेल भरना ज़रूरी है।". The full field name is checked first, then its last segment, so `billing.first_name` also matches `first_name`. A `label()` you set yourself always wins, and a name with no translation keeps the readable English name.

::: warning Submit buttons
`Submit::make('Save draft')` uses its first argument as the button text, so pass translated text: `Submit::make(__('forms.save_draft'))`. The same goes for `itemLabel()`, `addActionLabel()` and every other text you write in the form class.
:::

::: warning Locale on the package endpoints
[Wizard](/concepts/wizard) step checks and [remote combobox search](/fields/combobox#searchusing-closure-callback) rebuild your form on a package endpoint. Those routes use the middleware in `config/inertia-forms.php` (`['web', 'throttle:60,1']` by default). If your locale middleware is part of the `web` group, nothing else is needed. If not, add it to `search.middleware` and `wizard.middleware`, or step errors come back in the default language.
:::


## Not translated on purpose

- **The required `*` marker.** A symbol, hidden from screen readers.
- **Format examples:** the Time Picker placeholder `--:--` / `--:--:--` and the Color Picker hex placeholder `#000000`.
- **Punctuation:** the `…` of an open date range end and the ` · ` / `, ` separators in the File Upload hint. Translate `date_range` to change how a range is laid out.
- **Data:** file type names from `accept()` (like `PDF, DOCX`), block menu icons, and the hex value used as a swatch label.
- **Your own copy:** labels, help, placeholders, options, fieldset legends and other text sent by Laravel. Translate it with `__()` in PHP.
- **Developer messages:** console warnings and thrown errors.
