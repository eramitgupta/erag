---
title: Laravel Translation Sync for Inertia
headline: "How to Prevent Translation Drift in Laravel Inertia Apps"
description: A practical Laravel translation sync workflow for Inertia apps, covering source of truth, runtime props, JSON exports, locale switches and missing keys.
date: 2026-10-11
package: laravel-lang-sync-inertia
category: Best practices
tags: [laravel, inertia, localization, vue, react, workflow]
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/laravel-lang-sync-locale-drift.md
</div>

Laravel translation sync becomes necessary when an Inertia application grows beyond a handful of pages. At first, a developer can add a label directly to a Vue component and move on. Then a React page needs the same label, validation needs a related message and a scheduled email uses different wording. The product now has several copies of the same sentence.

Translation drift is what happens next. The English copy changes in one place, the Hindi file is forgotten, an exported JSON file stays stale and a shared component shows a raw key on one route. The issue is rarely a lack of care. It is usually a lack of ownership.

This guide presents a practical Laravel translation sync workflow: keep Laravel language files as the source, sync only the groups an Inertia page needs and use generated JSON only for consumers that cannot read Inertia props.

## Choose one source of truth

For a Laravel application, `lang/{locale}` is usually the right home for product copy. The same files can be used by Blade, mail, notifications, validation and Inertia pages. The frontend should ask for a translation key instead of maintaining a second copy of the sentence in JavaScript.

```php
// lang/en/settings.php
return [
    'title' => 'Settings',
    'save' => 'Save changes',
    'saved' => 'Your settings were saved.',
];
```

The corresponding locale file owns the translated wording:

```php
// lang/fr/settings.php
return [
    'title' => 'Paramètres',
    'save' => 'Enregistrer les modifications',
    'saved' => 'Vos paramètres ont été enregistrés.',
];
```

Use stable keys that describe the meaning of the string. `settings.save` is easier to move or rewrite than using the English sentence as a key. Avoid keys such as `blue_button_text`; visual details change, but the action remains.

## Sync translation groups per Inertia page

The Laravel Lang Sync Inertia package provides `syncLangFiles()` for sharing selected groups with the current Inertia response:

```php
public function index(): Response
{
    syncLangFiles(['layout', 'settings', 'validation']);

    return Inertia::render('Settings/Index');
}
```

Inside the Vue page:

```ts
import { vueLang } from '@erag/lang-sync-inertia';

const { __, trans } = vueLang();

__('settings.title');
trans('settings.saved');
```

React uses the same backend contract through `reactLang()`. This is the important part of Laravel translation sync: the server and both frontend adapters read the same source instead of each inventing a different data pipeline.

Sync only the groups a page actually uses. A shared layout group belongs in the common response path; an invoices group belongs on invoice pages. Smaller payloads are easier to inspect, and a missing dependency is obvious in the controller that rendered the page.

## Use namespaces that match the application

As the number of pages increases, one large `messages.php` file becomes difficult to search. Use groups that map to a real area of the product:

```text
lang/
├── en/
│   ├── layout.php
│   ├── settings.php
│   ├── billing.php
│   └── admin/users.php
└── hi/
    ├── layout.php
    ├── settings.php
    ├── billing.php
    └── admin/users.php
```

For nested groups, use dot notation:

```php
syncLangFiles('admin.users');
```

The frontend then reads keys such as `admin.users.title`. This gives a reviewer enough context to find the file and check whether a new key has translations in the supported locales.

## Runtime sync versus exported JSON

There are two valid ways to move Laravel language files to a frontend.

Runtime sync sends selected groups with an Inertia response. It is a good default for authenticated pages because it follows the current Laravel locale, needs no rebuild after a copy edit and sends only what the page requests.

JSON export runs an Artisan command and creates static files that a frontend can import:

```bash
php artisan erag:generate-lang
```

Use export for code that runs without an Inertia response, such as a static widget, a standalone JavaScript page, a build-time email preview or a client-side script loaded before navigation. Put the command in the build pipeline if generated JSON is part of the deployed bundle:

```json
{
    "scripts": {
        "build": "php artisan erag:generate-lang && vite build"
    }
}
```

The [Laravel lang files and frontend JSON guide](./laravel-lang-files-frontend-json.md) compares the two approaches in more detail. Do not use both randomly. Document which consumer uses runtime props and which consumer imports generated files.

## Make locale switching a server decision

A language selector should not only change a JavaScript object. The next Laravel request must use the selected locale so validation, notifications, mail and Inertia props all agree.

A reliable flow looks like this:

1. The browser submits the selected locale to Laravel.
2. Laravel validates the locale against an allowlist.
3. The application stores it in the session or authenticated user profile.
4. Locale middleware calls `App::setLocale()` on the next request.
5. Controllers call `syncLangFiles()` under that locale.
6. The response updates the page and the document language.

On the frontend, update `<html lang>` from the locale shared by the server:

```ts
watch(() => page.props.locale, (locale) => {
    document.documentElement.lang = locale;
}, { immediate: true });
```

If the browser says `hi` while Laravel validates in `en`, users will notice the mismatch immediately when a form fails.

## Make missing keys easy to find

The frontend helper returns the key when it cannot find a translation. During development, a visible `billing.invoice_paid` is a useful signal. An empty string would be harder to trace.

You can also add a small test for important translation groups:

```php
it('shares the settings translations with the page', function () {
    $this->get('/settings')
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->has('props.lang.settings.title')
            ->has('props.lang.settings.save')
        );
});
```

For supported locales, build a key inventory from the default language and compare each locale file against it. A locale can intentionally omit a key if the application has a documented fallback, but accidental omissions should be visible in CI.

## Keep placeholders and plural rules intact

Translation drift is not only about missing keys. A translation can exist and still be unusable if its placeholder names differ:

```php
// Correct in both locale files
'welcome' => 'Welcome, :name',
```

If one file uses `:name` and another uses `:user`, the frontend call will work in one language and show an unreplaced placeholder in the other. Review placeholder names as part of the translation contract.

For plural messages, keep the entire sentence in the file:

```php
'items' => '{0} No items|{1} One item|[2,*] :count items',
```

Use `transChoice()` or `trans_choice()` in the frontend. Do not build “There are” plus a number plus “items” from separate keys; sentence order and grammar vary between languages.

## Review language changes like code changes

A small workflow prevents most drift:

- a new UI phrase starts as a Laravel key;
- the default locale is updated first;
- all supported locale files are checked for the key;
- the controller syncs the group used by the page;
- exported JSON is regenerated if a static consumer uses it;
- tests cover the page and important locales;
- the pull request description mentions copy changes when translators need review.

Avoid adding English fallback text directly in a component except for genuinely technical content. If a key is temporary, mark it clearly and remove it before release. “We will translate this later” has a habit of becoming permanent product copy.

## Keep shared layout strings predictable

Navigation, account menus and common actions are used by many pages. Put them in a small `layout.php` group and sync it consistently through shared middleware or a base controller. Do not add the entire application dictionary just because the navigation is shared.

Page-specific strings should stay page-specific. This makes payloads smaller and gives the translation team a useful map of where a phrase appears.

### Does Laravel translation sync work with React as well as Vue?

Yes. The backend helper is the same, and the package provides separate `vueLang()` and `reactLang()` frontend helpers with matching keys.

### When should I use JSON export instead of Inertia props?

Use runtime props for Inertia pages that already have a server response. Use JSON export for static or standalone JavaScript that cannot access `page.props.lang`. The [exporting guide](https://erag.in/laravel-lang-sync-inertia/exporting.html) shows the generated file layout.

### Should I sync every language file globally?

Usually no. Sync shared layout strings globally if needed, then request page-specific groups in the controller. Sending every file increases response size and makes dependencies unclear.

### How do I find untranslated keys?

Keep raw keys visible in development, test important page props and compare key inventories across locale files. A CI check for missing keys is more reliable than waiting for a user to find a button in the wrong language.

Laravel translation sync is less about a clever helper and more about a clear ownership rule. Keep language files in Laravel, make page dependencies explicit, regenerate exports when required and let the server control the locale. Once that workflow is in place, adding a new language becomes a manageable content task instead of a frontend rewrite.

