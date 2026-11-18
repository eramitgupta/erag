---
title: "Laravel Inertia Form Builders Compared (2026)"
headline: "Best Laravel Inertia Form Builder? Six Options Compared by Someone Who Built One"
description: "Best Laravel Inertia form builder in 2026? Compare erag/inertia-forms, Inertia UI Forms, inlayphp/forms, inertify/form, Filament and Inertia's own Form."
date: 2026-11-18
package: laravel-inertia-forms
category: Comparison
tags: [laravel, inertia, forms, form-builder, comparison]
image: /images/laravel-inertia-form-builders-compared.jpg
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/laravel-inertia-form-builders-compared.md
</div>

![Laravel Inertia form builder comparison of erag/inertia-forms, Inertia UI Forms, inlayphp/forms, inertify/form and Filament](/images/laravel-inertia-form-builders-compared.jpg)

The best Laravel Inertia form builder depends on three things: your Laravel version, your frontend and whether you can pay. On Laravel 12 or 13 with Vue or React and a budget, Inertia UI Forms is the most complete. For Svelte, or a free MIT package on Laravel 13 and Inertia 3, use erag/inertia-forms. For a few simple forms, Inertia's own `<Form>` is enough.

Full disclosure: I wrote erag/inertia-forms, so I'm not neutral. I've tried to write the list I'd want to read anyway. Every fact about the other projects comes from their own website, docs, README, Packagist or npm page, checked on 18 November 2026, and each section links to its source so you can check it yourself. Where I couldn't verify something, I say so.

If you want to try mine while you read, it's three commands on a Laravel 13 app (swap `-vue` for `-react` or `-svelte`):

```bash
composer require erag/inertia-forms
php artisan erag:install-inertia-forms
npm install @erag/inertia-forms-vue
```

## The short version

1. Check your versions. Every Inertia form builder below needs Inertia 3, and erag/inertia-forms also needs Laravel 13.
2. Check your frontend. Svelte narrows the builders to erag/inertia-forms, and Filament is for Livewire, not Inertia pages.
3. Decide free or paid. Inertia UI Forms is the paid one; the other builders are MIT.
4. Decide styled or headless. inertify/form ships no CSS or field components, so you bring your own.
5. Count your forms. For a handful, Inertia's own `<Form>` is enough.

## What does a Laravel Inertia form builder actually do?

Without one, a form lives in three places. The rules sit in a FormRequest. The inputs and `useForm` setup sit in a Vue or React page. The glue, like the list of statuses for a dropdown, gets passed as props by the controller. Add a field and you edit all three.

A form builder moves the form into one PHP class. The class lists the fields, labels, layout, visibility rules and validation. The controller passes it to Inertia as a prop, it serializes to JSON, and one `<Form>` component on the page draws it. When the user submits, the same class validates the request.

That's the shared idea behind erag/inertia-forms, Inertia UI Forms, inlayphp/forms and inertify/form. They differ in versions, frameworks, license and how much UI they ship. Inertia's own `<Form>` isn't a builder at all, which is exactly why it's the baseline.

## How do the Laravel Inertia form builders compare?

| | Frontend | Laravel | License | Schema in PHP | Validation from schema | Conditional fields | Wizard | Svelte |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Inertia `<Form>` / `useForm` | Vue, React, Svelte | 11.35+, 12, 13 | MIT | No | No, Precognition can reuse your server rules | You write them | You build it | Yes |
| erag/inertia-forms | Vue 3.5+, React 19, Svelte 5 | 13 only | MIT, free | Yes | Yes | Yes, browser and server | Yes, steps checked on the server | Yes |
| Inertia UI Forms | Vue 3.5+, React 19+ | 12+ | Paid, one-time, per project | Yes | Yes | Yes | Yes | No |
| inlayphp/forms | Vue, React | 12, 13 | MIT | Yes | Yes, field rules or a validation class | Yes | Yes | No |
| inertify/form | Vue 3.5+, headless | 12, 13 | MIT | Yes | Rules declared on fields | Yes | Yes | No |
| Filament forms | Livewire and Blade | 11.28+ | MIT | Yes | Yes | Yes | Yes | No, not Inertia |

The Laravel column is what each project publishes as its requirement. "Validation from schema" means the server builds Laravel rules from the field definitions, so there's no second FormRequest to keep in sync.

One thing the table hides: every Inertia form builder here requires Inertia 3. erag/inertia-forms and inlayphp/forms ask for `inertiajs/inertia-laravel` ^3.0, while Inertia UI Forms and inertify/form ask for 3.3 or newer. If your app is still on Inertia 2, upgrade first or stay with `useForm`.

## Do you need a builder, or is Inertia's Form enough?

Inertia ships a `<Form>` component and a `useForm` helper for [Vue, React and Svelte](https://inertiajs.com/docs/v3/the-basics/forms). You write the inputs yourself and give each one a `name`. Inertia handles the submit, `errors`, `processing`, resets and file uploads. With Laravel Precognition it can validate fields live against your server rules, without copying them into JavaScript.

It has no field components, no schema, no wizard and no conditional fields beyond your own `v-if`. That's fine. For a login page, a contact form and a profile screen, a builder is more machinery than you need. The current server adapter, inertia-laravel v3.7.0, supports Laravel 11.35 and up, 12 and 13, according to [Packagist](https://packagist.org/packages/inertiajs/inertia-laravel).

Reach for a builder when you have many similar CRUD, settings or admin forms, and the drift between PHP and the page starts to cost you real bugs.

## erag/inertia-forms: free, MIT, with Svelte support

This is mine. It needs PHP 8.3+, Laravel 13, Inertia 3 on server and client, and Tailwind CSS 4. On the frontend you pick Vue 3.5+, React 19 or Svelte 5. It's MIT licensed, the fields come styled with Tailwind, and the latest release on [Packagist](https://packagist.org/packages/erag/inertia-forms) is v0.0.3 from 13 November 2026.

### A short example

A support ticket form where the invoice number only appears for billing questions. Create it with `php artisan make:form SupportTicketForm`:

```php
<?php

namespace App\Forms;

use Erag\InertiaForms\Fields\Combobox;
use Erag\InertiaForms\Fields\Fieldset;
use Erag\InertiaForms\Fields\Submit;
use Erag\InertiaForms\Fields\Textarea;
use Erag\InertiaForms\Fields\TextInput;
use Erag\InertiaForms\Form;

class SupportTicketForm extends Form
{
    protected ?string $actionRoute = 'tickets.store';

    public function fields(): array
    {
        return [
            Fieldset::make('Ticket')->columns(2)->fields([
                TextInput::make('email')->email()->required(),
                Combobox::make('topic')->required()->options([
                    'billing' => 'Billing',
                    'bug' => 'Bug report',
                ]),
                TextInput::make('invoice_number')
                    ->required()
                    ->visibleWhen('topic', 'billing'),
                Textarea::make('message')
                    ->required()
                    ->maxLength(2000)
                    ->columnSpan(2),
            ]),
            Submit::make('Send ticket'),
        ];
    }
}
```

The controller passes the form to the page and validates with the same class:

```php
<?php

namespace App\Http\Controllers;

use App\Forms\SupportTicketForm;
use App\Models\SupportTicket;
use Erag\InertiaForms\Attributes\Validate;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SupportTicketController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Tickets/Create', [
            'form' => SupportTicketForm::make(),
        ]);
    }

    public function store(#[Validate] SupportTicketForm $form): RedirectResponse
    {
        SupportTicket::create($form->validated());

        return back()->with('status', 'Ticket sent.');
    }
}
```

The page is one component. This is Vue; React and Svelte look the same:

```vue
<!-- resources/js/pages/Tickets/Create.vue -->
<script setup lang="ts">
import { Form, type FormSchema } from '@erag/inertia-forms-vue';

defineProps<{ form: FormSchema }>();
</script>

<template>
    <Form :form="form" />
</template>
```

The `email` field gets `required`, `string` and `email` rules without you writing them. The `topic` combobox only accepts `billing` or `bug`. When the topic isn't billing, the invoice field is hidden in the browser and left out of the server rules, so `validated()` won't contain it. The [conditional fields tutorial](./inertia-forms-permissions-conditional-fields.md) goes further with permissions.

### What erag/inertia-forms doesn't do

- **No Laravel 12 or older.** Composer requires `illuminate/*` ^13.0, and every release so far has. Inertia 1 and 2 aren't supported either.
- **Tailwind CSS 4 is expected.** The built-in components use Tailwind classes, so you add one `@source` line to your CSS.
- **It's young.** v0.0.3 means the API can still change before 1.0.
- **Fewer heavy fields than Inertia UI.** There's no rich text editor field and no chunked uploads, and fields don't validate live as you leave them. In wizard mode, the server checks each step when the user clicks Continue, as the [multi-step wizard guide](./multi-step-form-wizard-laravel-inertia.md) shows.

## Inertia UI Forms: the most complete paid option

Inertia UI Forms is a commercial package from Inertia UI, the makers of Inertia Table and Inertia Modal. The [requirements page](https://inertiaui.com/inertia-forms/docs/requirements) lists PHP 8.2+, Laravel 12+, inertia-laravel 3.3+ and Tailwind CSS 4.3+, with Vue 3.5 or React 19 on the frontend. Svelte isn't mentioned.

It's paid. The [product page](https://inertiaui.com/inertia-forms) says "Pay once. No subscription." A license covers one project and includes a year of updates. The [terms](https://inertiaui.com/terms-and-conditions) describe a one-time fee: after that year you keep the version you have, but you need to renew for further updates. At the time of writing the page lists a launch price of €179, with an unlimited license at checkout. Prices change, so check the page.

Where it goes beyond the free options, going by its own product page:

- a TipTap-based rich text field with image uploads stored in Spatie Media Library;
- chunked file uploads that retry failed chunks;
- `precognitive()` fields that validate against your server rules when the user leaves them;
- more than 30 field types, plus wizards and conditional visibility.

I couldn't find a public changelog or release list, so I can't tell you its latest release date.

Pick it if you're on Laravel 12, or you need rich text, chunked uploads or Media Library today, and a per-project license fits your budget.

## inlayphp/forms: free, Vue and React, part of a bigger toolkit

[inlayphp/forms](https://packagist.org/packages/inlayphp/forms) describes itself as "Schema-driven forms for Laravel and Inertia." It's MIT, needs PHP 8.3+, Laravel 12 or 13, and inertia-laravel ^3.0. The latest tag on Packagist is v0.3.24 from 24 August 2026.

The [README](https://github.com/InlayPHP/forms) calls it the renderer-neutral form builder for Inlay, and the repository is a read-only split of the larger Inlay monorepo. You build forms in PHP with `Form::make()` or `FormPage` classes. Fields support `visibleWhen()`, `hiddenWhen()`, `requiredWhen()` and `disabledWhen()`, and there's a `Wizard` with per-step validation. By default the page validates the rules declared on its fields, or you attach a separate validation class.

Rendering comes from `@inlayphp/forms-vue` or `@inlayphp/forms-react`. On npm, both list other Inlay packages (core, ui, theme and actions) as peer dependencies, so you're adopting part of Inlay's UI layer, not only a form component.

Pick it if you want a free builder on Laravel 12 with Vue or React, or you like the rest of Inlay.

## inertify/form: headless and Vue only

[inertify/form](https://github.com/inertify/form) is a "completely headless, schema-driven form library for Laravel, Inertia, and Vue." The README is clear that the runtime ships no CSS, no Tailwind preset and no default field components. You bring your own.

It needs PHP 8.3+, Laravel 12 or 13, inertia-laravel 3.3+, Vue 3.5+ and `@inertiajs/vue3` 3.6+. React isn't supported. It's MIT. Forms are PHP classes with a `fields()` method, fields carry their own rules, and it supports `visibleWhen()` with `clearWhenHidden()` and a wizard with per-step validation.

Two things to know. The README says it's a clean-room implementation based on the publicly documented Inertia Forms v1.3.1 API, and that it isn't affiliated with Inertia UI. And [Packagist](https://packagist.org/packages/inertify/form) lists only `dev-main`, with no tagged release yet, while the npm package `@inertify/form-vue` is at 0.1.0.

Pick it if you're Vue-only, already have a component library, and want the form logic without anyone else's markup.

## Filament forms: great for Livewire, not for Inertia pages

The [Filament docs](https://filamentphp.com/docs/5.x/forms/overview) say its schemas "are built on top of Livewire". filament/forms is MIT, the latest release is v5.11.4 from 15 November 2026, and Filament needs PHP 8.2+, Laravel 11.28+ and Tailwind CSS 4.1+. It has PHP schemas, validation, conditional fields and a `Wizard` component.

But Filament forms render through Livewire and Blade, so you can't drop one into an Inertia Vue, React or Svelte page. A common setup is a Filament panel at `/admin` next to an Inertia app for customers. In that case, use Filament inside the panel and one of the options above for your Inertia pages.

## Which Laravel Inertia form builder should you pick?

- **Pick Inertia's `<Form>` or `useForm`** if you have a handful of forms, or you're still on Inertia 2.
- **Pick Inertia UI Forms** if you're on Laravel 12, need rich text, chunked uploads or Media Library, and a paid per-project license is fine.
- **Pick erag/inertia-forms** if you're on Laravel 13 and Inertia 3 and want MIT, free and styled components, or if you use Svelte.
- **Pick inlayphp/forms** if you need a free builder on Laravel 12 with Vue or React.
- **Pick inertify/form** if you're Vue-only with your own design system and want headless logic.
- **Pick Filament forms** for a Livewire or Filament admin, not for Inertia pages.

Whatever you choose, your models, policies and routes mostly stay the same. Switching means rewriting the form classes, since each package has its own field API, so choose for where your app will be next year. To see a builder on real admin screens first, the [admin CRUD form builder guide](./laravel-inertia-form-builder-admin-crud.md) builds a create and edit form end to end.

## Frequently asked questions

### Is there a free alternative to Inertia UI Forms?

Yes, three in this list, all MIT: erag/inertia-forms (Laravel 13, Vue, React or Svelte, styled with Tailwind), inlayphp/forms (Laravel 12 or 13, Vue or React) and inertify/form (Laravel 12 or 13, Vue only, headless). Check each field API before assuming your form classes carry over.

### Does erag/inertia-forms work with Laravel 12 or Inertia 2?

No. It requires Laravel 13 and Inertia 3 on both server and client. On Laravel 12, look at Inertia UI Forms, inlayphp/forms or inertify/form.

### Can I use Filament forms in an Inertia app?

Not inside Inertia pages, because they render through Livewire. You can run a Filament panel next to your Inertia app and use its forms there.

### Which Inertia form builders support Svelte?

Of the builders compared here, only erag/inertia-forms ships a Svelte renderer, `@erag/inertia-forms-svelte` for Svelte 5. Inertia's own `<Form>` also works in Svelte, without a schema.

### Do I need a form builder for a few forms?

No. A login page and a contact form are easier with Inertia's `<Form>` and a FormRequest. Builders pay off when many forms share the same patterns, as [one set of validation rules for Laravel and Inertia](./shared-validation-laravel-inertia.md) explains.

### Is erag/inertia-forms ready for production?

It's at v0.0.3, so the API may still change before 1.0. Pin the version in `composer.json` and `package.json`, and run your form tests after each upgrade.

## Try erag/inertia-forms

If you're on Laravel 13 and Inertia 3, install the PHP package and the renderer for your framework:

```bash
composer require erag/inertia-forms
php artisan erag:install-inertia-forms
npm install @erag/inertia-forms-vue
```

Use `@erag/inertia-forms-react` or `@erag/inertia-forms-svelte` instead if that's your stack. Then let Tailwind see the components in `resources/css/app.css`:

```css
@import 'tailwindcss';

@source "../../node_modules/@erag/inertia-forms-vue/dist";
```

- [Requirements](https://erag.in/laravel-inertia-forms/guide/requirements.html), [installation](https://erag.in/laravel-inertia-forms/guide/installation.html) and the [quick start](https://erag.in/laravel-inertia-forms/guide/quick-start.html)
- [Build Inertia forms from a single PHP class](./laravel-inertia-forms-php-class.md), the full walkthrough
- [Free Laravel packages for Inertia apps](./laravel-inertia-packages.md)
- [Filament-style forms for Laravel Inertia apps](./filament-style-forms-inertia.md), [Inertia's Form component vs a PHP form builder](./inertia-form-component-vs-form-builder.md) and [Laravel Inertia Svelte 5 forms](./laravel-inertia-svelte-forms.md)
