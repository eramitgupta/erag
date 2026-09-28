---
title: 'Introduction'
description: 'Laravel Inertia Forms lets you define a form once in a PHP class and render it in Vue, React, or Svelte with a single Form component.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/guide/introduction.md
</div>


<div class="doc-category">Getting Started</div>

# Introduction

`erag/inertia-forms` lets you describe a form once, in a PHP class, and render it in an Inertia app with a single `<Form>` component.

The PHP class is the source of truth. It holds:

- the fields and their order,
- labels, placeholders, help text, and default values,
- the layout (fieldsets and grid columns),
- conditional visibility rules,
- authorization checks,
- the validation rules for each field.

The class serializes to a plain JSON schema. The frontend package reads that schema and draws the form with Tailwind CSS 4. When the user submits, Inertia sends the data back to Laravel, where the same class validates it.

## How it fits together

```text
┌──────────────────────┐   Inertia prop   ┌──────────────────────┐
│  App\Forms\UserForm  │ ───────────────▶ │  <Form :form="form"> │
│  fields(), rules     │                  │  Vue / React / Svelte│
└──────────────────────┘                  └──────────┬───────────┘
          ▲                                          │ submit
          │  $form->validate($request)               │ (Inertia visit)
          └──────────────────────────────────────────┘
```

1. You write a class that extends `Erag\InertiaForms\Form` and returns fields from `fields()`.
2. Your controller passes an instance to `Inertia::render()` as a prop.
3. The page renders `<Form>` with that prop.
4. On submit, the controller validates the request with the same class.

## What you get

- **22 field types**: text input, textarea, hidden, combobox (single, multiple, searchable, or loaded from the server), radio, checkbox, checkbox group, toggle, date (single, with time, or range), time, color, slider, file upload, tags input, key-value rows, slug, link, one-time code, chat-style composer, repeater, content blocks, and submit buttons with variants and intents.
- **5 display helpers**: headings, text, trusted HTML, separators, and callouts between your fields.
- **Multi-step wizards**: turn the fieldsets of any form into steps, each checked on the server before the user moves on.
- **Components built in-house** with Tailwind CSS: the dropdowns, calendar, time picker, color panel and tags input don't rely on any third-party UI or editor library, and one accent color themes them all.
- **Generated validation rules** based on how each field is configured.
- **Conditional visibility** that runs the same way in the browser and on the server.
- **Authorization** for the whole form, a fieldset, or a single field.
- **Model binding** from an Eloquent model or an array.
- **Custom fields** with your own PHP class and frontend component.
- **Standalone components** you can use outside `<Form>`.

## When to use it

Use it for CRUD screens, settings pages, onboarding wizards, support replies, and admin panels: places where forms are mostly data entry and you want the backend to own the rules.

If a screen needs a very custom layout or heavy client-side logic, you can still use the field components on their own (see [Standalone Components](/frontend/standalone)) or write the form by hand.

## Project status

This is an independent open-source package under the MIT license. It supports **Laravel 13** and **Inertia 3** only. See [Requirements](/guide/requirements) for the full list.
