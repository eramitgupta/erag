---
title: 'Switching Language'
description: 'Switch the form language at runtime with locale files in your frontend, or with translations shared from Laravel through Inertia.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/translations/switching-language.md
</div>


<div class="doc-category">Translations</div>

# Switching Language

Calling `setTranslations()` again updates every rendered form right away. The setups below follow the user locale.

Because each call merges, switching from Dutch to German with `setTranslations(de)` would keep any Dutch key that `de` doesn't have. Start from the defaults when you switch:

```ts
import { defaultTranslations, setTranslations } from '@erag/inertia-forms-vue'; // or -react / -svelte

setTranslations({ ...defaultTranslations, ...de });
```

::: warning Listen to `success` as well as `navigate`
Inertia fires `navigate` only when a visit adds a history entry. A language switcher usually posts the new locale and redirects back to the same page, which replaces the entry, so only `success` fires. Listen to both: `success` for visits like that, `navigate` for the browser's back and forward buttons.
:::

Below are three setups. All of them share the current locale with Inertia and apply it after every visit, so a language switcher that redirects back just works. If you translate the rest of your Inertia app too, start with the first one.

## With Laravel Lang Sync Inertia (recommended)

[Laravel Lang Sync Inertia](https://erag.in/laravel-lang-sync-inertia/) is our companion package for translating Inertia apps. It takes your Laravel language files and shares them with your pages, so the same `lang/{locale}` files translate your pages, your form labels and the form components. There is no second set of translation files to keep in sync.

**1. Install it** (one Composer package and one npm package):

```bash
composer require erag/laravel-lang-sync-inertia
npm install @erag/lang-sync-inertia
php artisan erag:install-lang
```

**2. Put the component text in a Laravel language file.** Use the keys from the [key reference](/translations/keys) and keep the `:name` tokens as they are:

```php
// lang/nl/forms-ui.php
return [
    'action_clear' => 'Wissen',
    'option_no_results' => 'Geen resultaten gevonden',
    'file_upload_click_to_upload' => 'Klik om te uploaden',
    'repeater_add' => ':name toevoegen',
    'wizard_progress' => 'Stap :current van :total',
    // ...
];
```

**3. Share it on every page.** `syncLangFiles()` loads the file for the current locale and adds it to the page props under `lang`. Call it in your Inertia middleware so every page gets it, and add the files your own pages use:

```php
// app/Http/Middleware/HandleInertiaRequests.php
public function share(Request $request): array
{
    syncLangFiles(['forms-ui', 'app']);

    return [
        ...parent::share($request),
        'locale' => app()->getLocale(),
    ];
}
```

**4. Pass it to the forms.** The form text arrives as `page.props.lang['forms-ui']`:

::: code-group

```ts [Vue]
// resources/js/app.ts
import { createInertiaApp, router } from '@inertiajs/vue3';
import { defaultTranslations, setTranslations, type Translations } from '@erag/inertia-forms-vue';

let active: unknown;

function syncForms(props: Record<string, unknown>): void {
    const { locale, lang } = props as { locale: string; lang?: Record<string, unknown> };
    if (locale === active) return;
    active = locale;
    setTranslations({ ...defaultTranslations, ...((lang?.['forms-ui'] ?? {}) as Translations) });
}

// The first page, before it renders, so it never flashes English.
syncForms(JSON.parse(document.querySelector('script[data-page="app"]')?.textContent ?? '{}').props ?? {});
// "success" also fires when a visit stays on the same URL, like a language switch.
router.on('success', (event) => syncForms(event.detail.page.props));
router.on('navigate', (event) => syncForms(event.detail.page.props));

createInertiaApp({
    // ...
});
```

```tsx [React]
// resources/js/app.tsx
import { createInertiaApp, router } from '@inertiajs/react';
import { defaultTranslations, setTranslations, type Translations } from '@erag/inertia-forms-react';

let active: unknown;

function syncForms(props: Record<string, unknown>): void {
    const { locale, lang } = props as { locale: string; lang?: Record<string, unknown> };
    if (locale === active) return;
    active = locale;
    setTranslations({ ...defaultTranslations, ...((lang?.['forms-ui'] ?? {}) as Translations) });
}

// The first page, before it renders, so it never flashes English.
syncForms(JSON.parse(document.querySelector('script[data-page="app"]')?.textContent ?? '{}').props ?? {});
// "success" also fires when a visit stays on the same URL, like a language switch.
router.on('success', (event) => syncForms(event.detail.page.props));
router.on('navigate', (event) => syncForms(event.detail.page.props));

createInertiaApp({
    // ...
});
```

```ts [Svelte]
// resources/js/app.ts
import { createInertiaApp, router } from '@inertiajs/svelte';
import { defaultTranslations, setTranslations, type Translations } from '@erag/inertia-forms-svelte';

let active: unknown;

function syncForms(props: Record<string, unknown>): void {
    const { locale, lang } = props as { locale: string; lang?: Record<string, unknown> };
    if (locale === active) return;
    active = locale;
    setTranslations({ ...defaultTranslations, ...((lang?.['forms-ui'] ?? {}) as Translations) });
}

// The first page, before it renders, so it never flashes English.
syncForms(JSON.parse(document.querySelector('script[data-page="app"]')?.textContent ?? '{}').props ?? {});
// "success" also fires when a visit stays on the same URL, like a language switch.
router.on('success', (event) => syncForms(event.detail.page.props));
router.on('navigate', (event) => syncForms(event.detail.page.props));

createInertiaApp({
    // ...
});
```

:::

**5. Translate the rest of the page with the same files.** Your own text uses the helpers from Lang Sync Inertia:

::: code-group

```vue [Vue]
<script setup lang="ts">
import { vueLang } from '@erag/lang-sync-inertia/vue';
import { Form, type FormSchema } from '@erag/inertia-forms-vue';

defineProps<{ form: FormSchema }>();
const { __ } = vueLang();
</script>

<template>
    <h1>{{ __('app.contact.title') }}</h1>
    <Form :form="form" />
</template>
```

```tsx [React]
import { reactLang } from '@erag/lang-sync-inertia/react';
import { Form, type FormSchema } from '@erag/inertia-forms-react';

export default function Contact({ form }: { form: FormSchema }) {
    const { __ } = reactLang();

    return (
        <>
            <h1>{__('app.contact.title')}</h1>
            <Form form={form} />
        </>
    );
}
```

```svelte [Svelte]
<script module lang="ts">
    import { svelteLang } from '@erag/lang-sync-inertia/svelte';

    const { __ } = svelteLang();
</script>

<script lang="ts">
    import { Form, type FormSchema } from '@erag/inertia-forms-svelte';

    let { form }: { form: FormSchema } = $props();
</script>

<h1>{__('app.contact.title')}</h1>
<Form {form} />
```

:::

The form labels still come from `__()` in your form class, so one `lang/nl` folder now holds every word on the page. Read the [Lang Sync Inertia docs](https://erag.in/laravel-lang-sync-inertia/) for plurals, nested files and exporting to JSON.

## Locale files in your frontend

Keep one file per locale in `resources/js/lang/inertia-forms/` (`nl.ts`, `de.ts`, ...) and share the locale from Laravel:

```php
// app/Http/Middleware/HandleInertiaRequests.php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'locale' => app()->getLocale(),
    ];
}
```

A small helper picks the matching file:

```ts
// resources/js/lib/form-locale.ts
import { defaultTranslations, setTranslations, type Translations } from '@erag/inertia-forms-vue'; // or -react / -svelte

const locales = import.meta.glob<Translations>('../lang/inertia-forms/*.ts', {
    eager: true,
    import: 'default',
});

let active: string | undefined;

export function applyFormLocale(locale: unknown): void {
    const code = String(locale || 'en').toLowerCase().replace(/[-_].*$/, '');
    if (code === active) return;
    active = code;
    setTranslations({ ...defaultTranslations, ...locales[`../lang/inertia-forms/${code}.ts`] });
}
```

Call it in the entry, once before the first render and again after each visit. The first call reads `<html lang>`, which Laravel's default `app.blade.php` already sets:

```blade
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
```

::: code-group

```ts [Vue]
// resources/js/app.ts
import { createInertiaApp, router } from '@inertiajs/vue3';
import { applyFormLocale } from './lib/form-locale';

applyFormLocale(document.documentElement.lang);
router.on('success', (event) => applyFormLocale(event.detail.page.props.locale));
router.on('navigate', (event) => applyFormLocale(event.detail.page.props.locale));

createInertiaApp({
    // ...
});
```

```tsx [React]
// resources/js/app.tsx
import { createInertiaApp, router } from '@inertiajs/react';
import { applyFormLocale } from './lib/form-locale';

applyFormLocale(document.documentElement.lang);
router.on('success', (event) => applyFormLocale(event.detail.page.props.locale));
router.on('navigate', (event) => applyFormLocale(event.detail.page.props.locale));

createInertiaApp({
    // ...
});
```

```ts [Svelte]
// resources/js/app.ts
import { createInertiaApp, router } from '@inertiajs/svelte';
import { applyFormLocale } from './lib/form-locale';

applyFormLocale(document.documentElement.lang);
router.on('success', (event) => applyFormLocale(event.detail.page.props.locale));
router.on('navigate', (event) => applyFormLocale(event.detail.page.props.locale));

createInertiaApp({
    // ...
});
```

:::

With `eager: true` every locale is in the bundle (each file is a few KB). Drop `eager` and `await` the loader if you have many languages.

## Translations from Laravel without a package

Prefer not to add a package? Put the frontend keys in a normal Laravel language file and share it. The `:name` tokens pass through untouched, because `trans()` doesn't replace anything when it returns a whole file:

```php
// lang/nl/forms-ui.php
return [
    'action_clear' => 'Wissen',
    'option_no_results' => 'Geen resultaten',
    'repeater_add' => ':Name toevoegen',
    // ...
];
```

```php
// app/Http/Middleware/HandleInertiaRequests.php
use Illuminate\Support\Facades\Lang;

public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'locale' => app()->getLocale(),
        'formTranslations' => fn () => Lang::has('forms-ui') ? trans('forms-ui') : [],
    ];
}
```

::: code-group

```ts [Vue]
// resources/js/app.ts
import { createInertiaApp, router } from '@inertiajs/vue3';
import { defaultTranslations, setTranslations, type Translations } from '@erag/inertia-forms-vue';

let active: unknown;

function syncForms(props: Record<string, unknown>): void {
    const { locale, formTranslations } = props;
    if (locale === active) return;
    active = locale;
    setTranslations({ ...defaultTranslations, ...(formTranslations as Translations) });
}

// The first page, before it renders, so it never flashes English.
syncForms(JSON.parse(document.querySelector('script[data-page="app"]')?.textContent ?? '{}').props ?? {});
// "success" also fires when a visit stays on the same URL, like a language switch.
router.on('success', (event) => syncForms(event.detail.page.props));
router.on('navigate', (event) => syncForms(event.detail.page.props));

createInertiaApp({
    // ...
});
```

```tsx [React]
// resources/js/app.tsx
import { createInertiaApp, router } from '@inertiajs/react';
import { defaultTranslations, setTranslations, type Translations } from '@erag/inertia-forms-react';

let active: unknown;

function syncForms(props: Record<string, unknown>): void {
    const { locale, formTranslations } = props;
    if (locale === active) return;
    active = locale;
    setTranslations({ ...defaultTranslations, ...(formTranslations as Translations) });
}

// The first page, before it renders, so it never flashes English.
syncForms(JSON.parse(document.querySelector('script[data-page="app"]')?.textContent ?? '{}').props ?? {});
// "success" also fires when a visit stays on the same URL, like a language switch.
router.on('success', (event) => syncForms(event.detail.page.props));
router.on('navigate', (event) => syncForms(event.detail.page.props));

createInertiaApp({
    // ...
});
```

```ts [Svelte]
// resources/js/app.ts
import { createInertiaApp, router } from '@inertiajs/svelte';
import { defaultTranslations, setTranslations, type Translations } from '@erag/inertia-forms-svelte';

let active: unknown;

function syncForms(props: Record<string, unknown>): void {
    const { locale, formTranslations } = props;
    if (locale === active) return;
    active = locale;
    setTranslations({ ...defaultTranslations, ...(formTranslations as Translations) });
}

// The first page, before it renders, so it never flashes English.
syncForms(JSON.parse(document.querySelector('script[data-page="app"]')?.textContent ?? '{}').props ?? {});
// "success" also fires when a visit stays on the same URL, like a language switch.
router.on('success', (event) => syncForms(event.detail.page.props));
router.on('navigate', (event) => syncForms(event.detail.page.props));

createInertiaApp({
    // ...
});
```

:::

The first page is applied from the page data Inertia puts in `<script data-page="app">`, before anything renders, so the first form already shows the right language.

::: tip Server-side rendering
The translations are one store per JavaScript process. With SSR, that store is shared by every request the SSR server handles. Set the page's locale in your `ssr` entry right before rendering each page, the same way as in the browser.
:::
