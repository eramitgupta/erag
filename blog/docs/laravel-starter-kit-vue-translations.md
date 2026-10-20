---
title: Laravel Starter Kit Vue Translations (Step by Step)
headline: "How to Add Language Translations to the Laravel Vue Starter Kit"
description: Add language translations to the Laravel Vue starter kit with Laravel lang files, a language switcher, translated validation and a simple Vue __() helper.
date: 2026-10-12
package: laravel-lang-sync-inertia
category: Tutorial
tags: [laravel, vue, inertia, translations, starter-kit]
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/laravel-starter-kit-vue-translations.md
</div>

To add language translations to the Laravel Vue starter kit, keep all your text in Laravel's normal `lang` files, share them with Inertia using [Laravel Lang Sync Inertia](https://erag.in/laravel-lang-sync-inertia/), and read them in your Vue pages with a simple `__()` helper. You write each translation once, in Laravel, and every Vue page uses it. There is no second set of JSON files to keep in sync, no Vite plugin and no extra build step.

This guide walks you through the whole thing on a fresh Laravel Vue starter kit: the login page, the sidebar, the dashboard, a language switcher, translated validation errors and a test. Every step uses plain code you can copy.

## The short answer

Here is the full process in six steps:

1. Install the package: `composer require erag/laravel-lang-sync-inertia` and `npm install @erag/lang-sync-inertia`.
2. Put your text in `lang/en/app.php`, `lang/es/app.php` and so on.
3. Add a small middleware that sets the language and calls `syncLangFiles('app')`.
4. In Vue, use `const { __ } = vueLang()` and write <code v-pre>{{ __('app.login.title') }}</code>.
5. Add a language switcher that saves the chosen language in the session.
6. Translate `validation.php` and `auth.php` so error messages change language too.

The rest of this post explains each step in detail.

## What you will build

By the end, your Laravel Vue starter kit will:

- Show the login page, sidebar and dashboard in **English or Spanish** (or any languages you add)
- Let users **switch language** with one click, and remember their choice
- Show **validation errors** in the selected language
- Support **placeholders** like "Welcome back, :name!" and **plurals** like "You have 3 projects"
- Keep every word in **Laravel's lang files**, the single source of truth for your whole app

We use Spanish (`es`) in the examples, but the steps are the same for Hindi, French, German, Arabic or any other language.

## Why use Laravel's lang files for your Vue pages?

The Laravel Vue starter kit gives you a Laravel backend and a Vue 3 frontend connected by Inertia. Your backend already has a translation system: the `lang` folder, the `__()` helper, placeholders and pluralization. Validation messages, password reset emails and notifications all use it.

The problem is that your Vue pages cannot read those PHP files on their own. Many teams end up copying text into separate JavaScript translation files, then spend months fixing words that changed in one place but not the other.

Laravel Lang Sync Inertia removes that duplication:

- **One source of truth.** You edit `lang/es/app.php`, and both Laravel and Vue use the new text.
- **Familiar syntax.** The Vue helper works like Laravel's: `__()`, `trans()`, `transChoice()`, `:name` placeholders and `{0}|{1}|[2,*]` plurals.
- **No build step.** Translations arrive with each Inertia response, so there is nothing to compile.
- **Small pages.** Only the files you choose are sent to the browser.
- **Made for Inertia.** It supports Inertia v2 and v3, Laravel 8 to 13 and works with Vue, React and Svelte.

It has more than 45,000 installs on Packagist and is the same translation layer used by the [SaaS Laravel starter kits](https://saas-laravel.com/) in 17 languages.

## Step 1: Install the package

Install the Laravel package and the frontend helper:

```bash
composer require erag/laravel-lang-sync-inertia
npm install @erag/lang-sync-inertia
```

New Laravel apps do not include a `lang` folder by default. Publish Laravel's default language files, then the package config:

```bash
php artisan lang:publish
php artisan erag:install-lang
```

You now have `lang/en/auth.php`, `lang/en/validation.php` and friends, plus a `config/inertia-lang.php` file. You do not need to change the config to get started.

## Step 2: Create your language files

Create one file for the text in your app. Grouping keys by page keeps things tidy.

```php
<?php

// lang/en/app.php

return [
    'nav' => [
        'dashboard' => 'Dashboard',
        'repository' => 'Repository',
        'documentation' => 'Documentation',
    ],
    'login' => [
        'title' => 'Log in to your account',
        'description' => 'Enter your email and password below to log in',
        'email' => 'Email address',
        'password' => 'Password',
        'remember' => 'Remember me',
        'forgot' => 'Forgot password?',
        'submit' => 'Log in',
        'no_account' => "Don't have an account?",
        'sign_up' => 'Sign up',
    ],
    'dashboard' => [
        'welcome' => 'Welcome back, :name!',
        'projects' => '{0} You have no projects yet|{1} You have one project|[2,*] You have :count projects',
    ],
];
```

Then create the same file for each language, with the same keys:

```php
<?php

// lang/es/app.php

return [
    'nav' => [
        'dashboard' => 'Panel',
        'repository' => 'Repositorio',
        'documentation' => 'Documentación',
    ],
    'login' => [
        'title' => 'Inicia sesión en tu cuenta',
        'description' => 'Introduce tu correo y contraseña para iniciar sesión',
        'email' => 'Correo electrónico',
        'password' => 'Contraseña',
        'remember' => 'Recordarme',
        'forgot' => '¿Olvidaste tu contraseña?',
        'submit' => 'Iniciar sesión',
        'no_account' => '¿No tienes una cuenta?',
        'sign_up' => 'Regístrate',
    ],
    'dashboard' => [
        'welcome' => '¡Bienvenido de nuevo, :name!',
        'projects' => '{0} Aún no tienes proyectos|{1} Tienes un proyecto|[2,*] Tienes :count proyectos',
    ],
];
```

Keep the keys identical in every language. If a key is missing, the Vue helper shows the key itself, like `app.login.title`, which makes gaps easy to spot.

## Step 3: Set the language on every request

Your app needs to decide which language to use for each visitor, then share the right file with Inertia. A small middleware does both.

```bash
php artisan make:middleware SetLocale
```

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * The languages this app supports.
     *
     * @var array<int, string>
     */
    public const SUPPORTED = ['en', 'es'];

    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->session()->get('locale', config('app.locale'));

        App::setLocale(in_array($locale, self::SUPPORTED, true) ? $locale : config('app.locale'));

        syncLangFiles('app');

        return $next($request);
    }
}
```

Register it in `bootstrap/app.php`, at the start of the starter kit's web middleware list:

```php
use App\Http\Middleware\SetLocale;

->withMiddleware(function (Middleware $middleware): void {
    $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

    $middleware->web(append: [
        SetLocale::class,
        HandleAppearance::class,
        HandleInertiaRequests::class,
        AddLinkHeadersForPreloadedAssets::class,
    ]);
})
```

### Why the order matters

`syncLangFiles()` reads files for the language that is active **at the moment you call it**. That is why it runs inside the middleware, right after `App::setLocale()`. If you call it earlier, for example at the top of `routes/web.php`, it loads the default language before the visitor's choice is applied, and the language switcher appears to do nothing.

Call it in one place, after the language is set, and you will never hit this problem.

Using middleware also covers every page in the starter kit at once: the Fortify login and registration pages, `Route::inertia()` pages like the dashboard and the settings pages. You do not have to touch each controller.

### Share the current language with Vue

Your Vue pages will want to know which language is active, for example to highlight it in the switcher. Add it to the shared props in `app/Http/Middleware/HandleInertiaRequests.php`:

```php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        // ...the starter kit's existing shared props
        'locale' => fn () => app()->getLocale(),
    ];
}
```

## Step 4: Translate your Vue pages

Import the Vue helper and use `__()` in your templates. Here is the starter kit's login page, translated.

The starter kit sets the login card's title and description in `defineOptions`. Those values are fixed when the file is compiled, so they cannot call `__()`. Remove `title` and `description` from `defineOptions` and set them with Inertia's `setLayoutProps()` instead. The starter kit already uses the same function on its two-factor challenge page.

```vue
<script setup lang="ts">
import { vueLang } from '@erag/lang-sync-inertia/vue';
import { Head, setLayoutProps } from '@inertiajs/vue3';

const { __ } = vueLang();

setLayoutProps({
    title: __('app.login.title'),
    description: __('app.login.description'),
});
</script>

<template>
    <Head :title="__('app.login.submit')" />

    <Label for="email">{{ __('app.login.email') }}</Label>

    <Label for="password">{{ __('app.login.password') }}</Label>

    <TextLink :href="request()">{{ __('app.login.forgot') }}</TextLink>

    <span>{{ __('app.login.remember') }}</span>

    <Button type="submit">{{ __('app.login.submit') }}</Button>

    <p>
        {{ __('app.login.no_account') }}
        <TextLink :href="register()">{{ __('app.login.sign_up') }}</TextLink>
    </p>
</template>
```

The template above only shows the translated parts. Keep the rest of the starter kit's markup, inputs and form handling exactly as it is, and replace each English string with a `__()` call.

### Placeholders and plurals

The helper understands Laravel's placeholder and plural syntax, so the dashboard can greet users by name and count their projects:

```vue
<script setup lang="ts">
import { vueLang } from '@erag/lang-sync-inertia/vue';
import { usePage } from '@inertiajs/vue3';

const { __, transChoice } = vueLang();
const page = usePage();
</script>

<template>
    <h1>{{ __('app.dashboard.welcome', { name: page.props.auth.user.name }) }}</h1>

    <p>{{ transChoice('app.dashboard.projects', 3) }}</p>
</template>
```

In Spanish, that shows "¡Bienvenido de nuevo, Amit!" and "Tienes 3 proyectos". In English, "Welcome back, Amit!" and "You have 3 projects".

| Helper | What it does | Example |
| --- | --- | --- |
| `__(key, replaces?)` | Returns a translation, with optional placeholders | `__('app.nav.dashboard')` |
| `trans(key, replaces?)` | Same as `__()` | `trans('app.dashboard.welcome', { name })` |
| `transChoice(key, count, replaces?)` | Picks the right plural form | `transChoice('app.dashboard.projects', 3)` |
| `trans_choice(key, count, replaces?)` | Same as `transChoice()` | `trans_choice('app.dashboard.projects', 1)` |

## Step 5: Translate the sidebar

The starter kit defines its sidebar links in `resources/js/components/AppSidebar.vue` as a plain array. Wrap that array in `computed()` so the labels update when the language changes:

```ts
import { vueLang } from '@erag/lang-sync-inertia/vue';
import { computed } from 'vue';

const { __ } = vueLang();

const mainNavItems = computed<NavItem[]>(() => [
    {
        title: __('app.nav.dashboard'),
        href: dashboard(),
        icon: LayoutGrid,
    },
]);
```

Do the same for `footerNavItems`. The template does not need to change, because Vue unwraps computed values automatically.

The `computed()` is important. The sidebar lives in a layout that stays on screen while you move between pages. A plain array is built once and keeps its first language. A computed array rebuilds itself whenever the translations change.

## Step 6: Add a language switcher

First, add a route that saves the chosen language. In `routes/web.php`:

```php
use App\Http\Middleware\SetLocale;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

Route::post('locale', function (Request $request) {
    $validated = $request->validate([
        'locale' => ['required', Rule::in(SetLocale::SUPPORTED)],
    ]);

    $request->session()->put('locale', $validated['locale']);

    return back();
})->name('locale.update');
```

Then create a small Vue component, `resources/js/components/LanguageSwitcher.vue`:

```vue
<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';

const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
];

const page = usePage<{ locale: string }>();
const currentLocale = computed(() => page.props.locale);

function switchLanguage(code: string): void {
    router.post('/locale', { locale: code }, { preserveScroll: true });
}
</script>

<template>
    <div class="flex gap-1">
        <button
            v-for="language in languages"
            :key="language.code"
            type="button"
            class="rounded-md px-2 py-1 text-sm"
            :class="currentLocale === language.code ? 'bg-muted font-medium' : 'text-muted-foreground'"
            :aria-pressed="currentLocale === language.code"
            @click="switchLanguage(language.code)"
        >
            {{ language.label }}
        </button>
    </div>
</template>
```

Place `<LanguageSwitcher />` wherever you like: the sidebar footer, the header or the login page. When someone clicks a language, Laravel saves it in the session, redirects back and Inertia reloads the page with the new translations.

The starter kit uses Laravel Wayfinder for typed routes. Once your route exists, you can import its generated function and use it instead of the `'/locale'` string.

## Step 7: Translate validation and login errors

Validation errors are created by Laravel on the server, so they follow the active language automatically, as long as the language files exist.

Copy the English files into your new language folder and translate them:

```text
lang/en/validation.php  →  lang/es/validation.php
lang/en/auth.php        →  lang/es/auth.php
lang/en/passwords.php   →  lang/es/passwords.php
```

- `validation.php` covers messages like "The email field is required."
- `auth.php` covers "These credentials do not match our records." on the login page.
- `passwords.php` covers password reset messages.

To show friendly field names, use the `attributes` array at the bottom of `validation.php`:

```php
'attributes' => [
    'email' => 'correo electrónico',
    'password' => 'contraseña',
],
```

Because `SetLocale` runs before your controllers and Fortify actions, every validation error is already in the visitor's language when it reaches your Vue page. The starter kit's existing error components display it without any changes.

## Step 8: Remember the language for each user (optional)

The session remembers the language for the current browser. To remember it across devices, store it on the user.

Add a column:

```bash
php artisan make:migration add_locale_to_users_table
```

```php
Schema::table('users', function (Blueprint $table) {
    $table->string('locale', 10)->nullable();
});
```

Prefer the user's saved language in `SetLocale`:

```php
$locale = $request->user()?->locale
    ?? $request->session()->get('locale', config('app.locale'));
```

And save it when they switch, in the `locale.update` route:

```php
$request->user()?->forceFill(['locale' => $validated['locale']])->save();
```

## Step 9: Export translations to JSON (optional)

If you prefer static files, the package can export your PHP language files to JSON:

```bash
php artisan erag:generate-lang
```

This writes files like `resources/js/lang/es/app.json`, keeping nested folders intact. When exported files exist for the active language, the package automatically includes them in the translations it shares with your pages, merged with anything you load with `syncLangFiles()`.

This is handy for small apps that want every translation available everywhere. For larger apps, sharing only the files each page needs keeps responses lighter. The guide to [sharing Laravel lang files with your frontend](./laravel-lang-files-frontend-json.md) compares both approaches.

## Step 10: Test it

Two short Pest tests make sure translations keep working as your app grows:

```php
use Inertia\Testing\AssertableInertia as Assert;

it('shows the login page in Spanish', function () {
    $this->withSession(['locale' => 'es'])
        ->get(route('login'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('lang.app.login.title', 'Inicia sesión en tu cuenta'));
});

it('saves the chosen language', function () {
    $this->post(route('locale.update'), ['locale' => 'es'])
        ->assertSessionHas('locale', 'es');
});
```

The first test proves the right file is shared for the chosen language. The second proves the switcher route saves it.

## Common problems and quick fixes

### I see `app.login.title` instead of the translation

The key was not found. Check three things: the file is loaded with `syncLangFiles()`, the key is spelled the same in PHP and Vue, and the file exists for the current language. Each language needs its own file, so add the missing key to `lang/es/app.php`.

### The language switcher does nothing

Make sure `syncLangFiles()` is called inside the `SetLocale` middleware, after `App::setLocale()`, and not earlier in `routes/web.php`. Also confirm the middleware is registered in `bootstrap/app.php`.

### The sidebar stays in the old language

Wrap the sidebar items in `computed()`, as shown in Step 5. The layout stays mounted between pages, so a plain array never rebuilds.

### The login card title is still in English

Values in `defineOptions` cannot use `__()`. Remove `title` and `description` from `defineOptions` and set them with `setLayoutProps()` inside `<script setup>`.

### Validation errors are still in English

Copy and translate `validation.php` and `auth.php` into your language folder, and check that `SetLocale` is in the web middleware list.

### My page sends too much translation data

Only sync what you need. Keep shared text in `app.php`, move page-specific text into files like `lang/es/billing.php` and call `syncLangFiles('billing')` in that page's controller.

## Frequently asked questions

### How do I add translations to the Laravel Vue starter kit?

Install Laravel Lang Sync Inertia, put your text in Laravel's `lang` files, call `syncLangFiles()` in a middleware after setting the language and use `__()` from `vueLang()` in your Vue pages.

### Do I need a separate JSON translation file for Vue?

No. Vue reads the same PHP language files your Laravel backend uses. JSON export is available if you want it, but it is optional.

### Do I need a Vite plugin or an extra build step?

No. Translations are shared with each Inertia response, so there is nothing to compile.

### Does it support placeholders and pluralization?

Yes. Use `:name` placeholders with `__()` or `trans()`, and Laravel's plural syntax like `{0} none|{1} one|[2,*] :count` with `transChoice()`.

### Does it work with Laravel 13 and Inertia v3?

Yes. The package supports Laravel 8 to 13 and Inertia v2 and v3.

### Can I use it with the React or Svelte starter kits?

Yes. Use `reactLang()` from `@erag/lang-sync-inertia/react` or `svelteLang()` from `@erag/lang-sync-inertia/svelte`. The Laravel side is exactly the same. See [Laravel translations in Inertia with Vue and React](./laravel-translations-inertia-vue-react.md).

### How do I translate validation errors in an Inertia Vue app?

Translate `lang/{locale}/validation.php` and set the language in middleware before validation runs. Laravel then sends errors in the right language, and Vue displays them as usual. The guide on [keeping validation errors in sync with Inertia](./laravel-lang-sync-validation-errors.md) goes further.

### Can users choose their own language?

Yes. Save their choice in the session, as in Step 6, or on the user record, as in Step 8, and the `SetLocale` middleware applies it on every request.

## Ship your Laravel Vue app in every language

Translating the Laravel Vue starter kit does not need a second translation system. Keep your words in Laravel's `lang` files, share them with one helper call, and use `__()` in Vue just like you do in PHP.

```bash
composer require erag/laravel-lang-sync-inertia
npm install @erag/lang-sync-inertia
```

- **Documentation:** [erag.in/laravel-lang-sync-inertia](https://erag.in/laravel-lang-sync-inertia/)
- **GitHub:** [eramitgupta/laravel-lang-sync-inertia](https://github.com/eramitgupta/laravel-lang-sync-inertia). A star helps other developers find it.
- **Building a full multilingual app?** The guide to [building a multilingual Laravel Inertia app](./multilingual-laravel-inertia-app.md) covers locale strategy, URLs and scaling your lang files.
