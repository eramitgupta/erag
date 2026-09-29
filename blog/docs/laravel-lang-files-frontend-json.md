---
title: Sharing Laravel Lang Files With Your Frontend
description: Two ways to get Laravel lang files to your frontend, Inertia props or exported JSON, and how to choose, configure and build with each one.
date: 2026-09-29
package: laravel-lang-sync-inertia
category: Guide
tags: [laravel, localization, json, vite, inertia]
---

Laravel lang files are PHP arrays. That's great for Blade, mail and validation, and useless to a JavaScript bundle, which can't `require` a PHP file. So at some point every Laravel app with a real frontend has to answer the same question: how do these strings get from `lang/` to the browser?

There are two honest answers. You send them with each response, at runtime. Or you compile them to JSON ahead of time and ship that JSON with your frontend. Laravel Lang Sync Inertia does both, and this post is about when to reach for each one, how the Laravel lang to JSON export works, and how to fit it into a build.

## Option 1: send lang files with the Inertia response

This is the default path, and the one I use for almost every Inertia page. The controller names the groups a page needs:

```php
syncLangFiles(['layout', 'orders']);

return Inertia::render('Orders/Index', ['orders' => $orders]);
```

The package reads `lang/{locale}/layout.php` and `lang/{locale}/orders.php` for the current locale and shares them under `page.props.lang`. In the component, `vueLang()` or `reactLang()` resolves keys like `orders.title`. The full setup is in [using Laravel translations in Inertia Vue and React](./laravel-translations-inertia-vue-react.md).

What you get:

- **Always current.** Edit a lang file, refresh, done. There's nothing to rebuild.
- **The right locale for free.** It follows `App::getLocale()`, so whatever your locale middleware decides is what the page gets.
- **Only what the page needs.** Other groups never leave the server.

What it costs: one `syncLangFiles()` call per controller, and the strings travel with every response that asks for them. And it only helps code that runs inside an Inertia page.

## Option 2: export Laravel lang files to JSON

The second path is an Artisan command that converts your PHP lang files into JSON files your frontend can import:

```bash
php artisan erag:generate-lang
```

Given this input:

```php
<?php

// lang/en/orders.php
return [
    'title' => 'Your orders',
    'shipped' => 'Shipped to :city',
    'legacy_note' => 'Hi {name}, thanks for ordering.',
];
```

You get this file:

```json
{
    "title": "Your orders",
    "shipped": "Shipped to :city",
    "legacy_note": "Hi {name}, thanks for ordering."
}
```

Placeholders are left alone, both the Laravel `:city` style and the older `{name}` style. The export converts the format; it doesn't resolve anything.

Nested folders keep their structure. With `en` and `hi` locales, the output looks like this:

```text
resources/js/lang/
├── en/
│   ├── orders.json
│   ├── admin/
│   │   └── auth.json
│   └── validation.json
└── hi/
    ├── orders.json
    ├── admin/
    │   └── auth.json
    └── validation.json
```

The [export docs](https://erag.in/laravel-lang-sync-inertia/exporting.html) show the same example with `auth.php`.

## Where the JSON goes

Two config keys in `config/inertia-lang.php` control the paths:

```php
return [
    'lang_path' => base_path('lang'),
    'output_lang' => resource_path('js/lang'),
];
```

`lang_path` is the folder that holds your PHP lang files; `syncLangFiles()` reads from it. `output_lang` is where the JSON is written. On an older app that still keeps translations in `resources/lang`, or if you want the JSON in a different folder, change them:

```php
return [
    'lang_path' => resource_path('lang'),
    'output_lang' => resource_path('js/translations'),
];
```

Details are on the [configuration page](https://erag.in/laravel-lang-sync-inertia/config.html).

## Loading the exported JSON with Vite

The package's frontend helpers read from Inertia page props. For the JSON files, you're in plain Vite territory: JSON imports and `import.meta.glob` both work out of the box.

For a single file, a static import is enough:

```ts
import orders from '../lang/en/orders.json';

console.log(orders.title); // "Your orders"
```

For "whatever locale the user picked", load lazily so each locale becomes its own chunk instead of one big bundle:

```ts
// resources/js/lib/messages.ts
const loaders = import.meta.glob<Record<string, string>>('../lang/*/*.json', {
    import: 'default',
});

export async function loadMessages(locale: string, group: string): Promise<Record<string, string>> {
    const load = loaders[`../lang/${locale}/${group}.json`];

    return load ? await load() : {};
}
```

Because the strings still contain `:city` and `{name}`, you replace placeholders yourself. For code outside Inertia pages, a tiny replace is usually all you need:

```ts
export function fill(line: string, replaces: Record<string, string | number> = {}): string {
    return Object.entries(replaces).reduce(
        (text, [key, value]) => text.replaceAll(`:${key}`, String(value)).replaceAll(`{${key}}`, String(value)),
        line,
    );
}
```

Keep that helper small. If you find yourself adding pluralization to it, that's a sign the code probably belongs in an Inertia page, where `transChoice()` already handles Laravel's plural syntax.

## Build the JSON before the frontend

The export has to run before Vite bundles anything that imports the JSON. In a deploy script, that's just ordering:

```bash
composer install --no-dev --optimize-autoloader
php artisan erag:generate-lang
npm ci
npm run build
```

During development, rerun `php artisan erag:generate-lang` after editing a lang file that your JSON consumers use. Pages that use `syncLangFiles()` don't need this, since they read the PHP files on every request.

Then decide whether the generated files belong in Git:

- **Commit them** if your frontend is built somewhere without PHP. The trade-off is that someone will eventually edit a JSON file by hand and lose the change on the next export.
- **Ignore them** and generate in CI if PHP is available at build time. The PHP files stay the only source of truth, which is the whole reason to do this.

I prefer ignoring them. Add `resources/js/lang/` (or your `output_lang`) to `.gitignore`.

## Props or JSON: which one should you use?

My default, in order:

1. **Inertia pages use `syncLangFiles()`.** No build step, the locale is always right, and you get `trans()` and `transChoice()` with Laravel's pluralization rules.
2. **Code without an Inertia page uses the JSON export.** A widget mounted on a static marketing page, a script that runs before your Inertia app boots, or a separate frontend in the same repo.
3. **Mixed apps use both.** They read the same PHP files, so there's still only one place to edit a string.

The export is also the answer when your deployment wants static files and nothing generated per request.

## Why not share every lang file from middleware?

You can put translations in `HandleInertiaRequests::share()` yourself, and for a tiny app that's fine. The problem shows up later: shared props go out with every Inertia response. Share all of `lang/{locale}` and every page visit carries your validation lines, your admin panel copy and your email subjects, whether the page uses them or not.

`syncLangFiles()` flips that. Each controller asks for the groups its page needs, and nothing else is sent. The export flips it further: the strings are fetched once as static assets and the server sends none at all.

## A few things that trip people up

- **Wrong `lang_path`.** If the export produces nothing, check that `lang_path` points at the folder that actually has your `en/`, `hi/` and so on.
- **Dots in keys.** `lang/en/admin/auth.php` becomes `admin/auth.json` on disk and `admin.auth.*` in keys. Don't also use dots inside your array keys, or lookups get confusing fast.
- **Stale JSON in development.** If a string looks old in a JSON consumer but fine on Inertia pages, you forgot to rerun the export.

## FAQ

### Can I use the export and `syncLangFiles()` in the same app?

Yes. Both read the same PHP lang files. The export exists for the cases where you don't want to rely only on Inertia shared props, so running both side by side is the expected setup, not a workaround.

### Do nested lang folders survive the export?

Yes. `lang/en/admin/auth.php` becomes `admin/auth.json` under the locale folder, and the keys still read as `admin.auth.*`.

### Does the export translate anything or fill in placeholders?

No. It converts PHP arrays to JSON. `:name` and `{name}` stay in the strings, and plural lines keep their pipe syntax. Resolving them is up to the code that reads the JSON.

## Where to go next

Start with props. Add the export when you hit code that has no Inertia page to read from, and put `php artisan erag:generate-lang` in your build script the same day so the JSON never drifts. If you're also adding a language switcher, [building a multilingual Laravel Inertia app](./multilingual-laravel-inertia-app.md) covers locale middleware and `<html lang>`.
