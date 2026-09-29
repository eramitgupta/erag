---
title: Laravel Signup Form Checklist for SaaS Apps
headline: A Better Laravel Signup Form for SaaS Apps (A Practical Checklist)
description: A practical Laravel signup form checklist for SaaS apps. Block burner emails, collect phone numbers per country, show clear feedback and translate messages.
date: 2026-09-29
category: Best practices
tags: [laravel, saas, forms, validation, inertia]
---

The signup form is the first piece of your product every customer touches. It's also the easiest place for junk to get in: fake addresses, phone numbers in five different formats, and error messages that only make sense in English.

Most Laravel signup forms start as whatever the starter kit generated and never get looked at again. That's fine for launch. It stops being fine when your users table fills up with `tempmail.com` addresses and support can't call anyone back because half the phone numbers are missing a country code.

This is the checklist I work through on a Laravel signup form for a SaaS app. Some items use packages I maintain, some are plain Laravel. Take the parts that fit.

## The Laravel signup form checklist at a glance

1. Ask for as little as possible
2. Validate everything on the server
3. Block burner email addresses
4. Collect phone numbers with the country attached
5. Show field errors inline, and outcomes as toasts
6. Translate labels and validation messages
7. Rate limit the route and verify the email

## 1. Ask for as little as possible

Every field is a reason to leave. Name, email and password are usually enough to create an account. Company name, team size and phone can come later, during onboarding, when the person already has a reason to stay.

Only ask for a phone number at signup if you really use it right away: SMS verification, or a sales team that calls every trial. If it's "nice to have", move it to the profile page.

## 2. Validate everything on the server

Client-side checks are for speed. Server-side checks are for correctness. Here is a Form Request that covers the rest of this checklist:

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users', 'disposable_email'],
            'phone' => ['required', 'string', 'regex:/^\+[1-9][0-9]{6,14}$/'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ];
    }
}
```

The `phone` regex expects the number in international format: a `+`, the country code and the number, digits only. The next sections explain where `disposable_email` comes from and how the frontend produces that phone format.

## 3. Block burner email addresses

The `disposable_email` rule comes from [Laravel Disposable Email](https://erag.in/laravel-disposable-email/validation/form-request.html). It checks the domain against a list of known temporary inbox services and returns a normal validation error if it matches. Install it with:

```bash
composer require erag/laravel-disposable-email
php artisan erag:install-disposable-email
```

This is the single highest-value change on the list for a SaaS product with a free trial. It keeps your mailing list clean and stops the lowest-effort trial abuse. The [block disposable emails tutorial](./block-disposable-emails-laravel.md) covers custom domains, whitelists and keeping the list up to date.

## 4. Collect phone numbers with the country attached

A plain text input for phone numbers gets you `9876543210`, `+1 (555) 010-0199`, `0044 20...` and everything in between. You can't reliably call or text any of them without guessing the country.

The fix is a country selector next to the input, and storing the full number with its calling code. `@erag/phone-number-vue` is a headless composable for this: it tracks the selected country, strips non-digits, limits the length to what the country allows, and gives you a placeholder mask. It renders nothing, so it fits whatever inputs you already use.

```bash
npm install @erag/phone-number-vue
```

Here is a trimmed `resources/js/pages/auth/Register.vue` with Inertia's `useForm`:

```vue
<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { usePhoneNumber } from '@erag/phone-number-vue';

const form = useForm({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
});

const { selectedCountry, countryOptions, localPhone, callingCode, mask, isValid, handleInput } =
    usePhoneNumber({ countryCode: 'US' });

function submit(): void {
    form.phone = `${callingCode.value ?? ''}${localPhone.value}`;
    form.post('/register');
}
</script>

<template>
    <form @submit.prevent="submit">
        <input v-model="form.name" type="text" autocomplete="name" />
        <p v-if="form.errors.name">{{ form.errors.name }}</p>

        <input v-model="form.email" type="email" autocomplete="email" />
        <p v-if="form.errors.email">{{ form.errors.email }}</p>

        <select v-model="selectedCountry">
            <option v-for="country in countryOptions" :key="country.key" :value="country">
                {{ country.isoCode2 }} ({{ country.name }})
            </option>
        </select>
        <input v-model="localPhone" inputmode="numeric" :placeholder="mask" @input="handleInput" />
        <p v-if="form.errors.phone">{{ form.errors.phone }}</p>

        <input v-model="form.password" type="password" autocomplete="new-password" />
        <input v-model="form.password_confirmation" type="password" autocomplete="new-password" />
        <p v-if="form.errors.password">{{ form.errors.password }}</p>

        <button type="submit" :disabled="form.processing || !isValid">Create account</button>
    </form>
</template>
```

Building `form.phone` inside `submit()` means it always uses the current country, even if the user changed the select after typing. `isValid` only checks that the length fits the selected country, which is why the server-side regex is still there. The [phone-number-vue examples](https://erag.in/phone-number-vue/examples.html) show a styled version.

The snippet is trimmed to show the wiring. In the real form, give every input a visible `<label>` and keep the `autocomplete` attributes: browsers and password managers use them to fill name, email and new password correctly, which removes a lot of typing on mobile. For the phone field, `inputmode="numeric"` brings up the number pad.

On React, `@erag/phone-number-react` has the same API as a hook. See [a phone number input hook for React](./react-phone-number-input-hook.md).

## 5. Show field errors inline, and outcomes as toasts

I have a firm opinion here: validation errors belong next to the field, not in a toast. Toasts disappear after a few seconds, and the person is left looking for which field was wrong. Inertia already gives you `form.errors`, so use it.

Toasts are for outcomes. "Your account is ready" after signup is a good toast. [Laravel Inertia Toast](https://erag.in/laravel-inertia-toast/laravel.html) lets you flash one from the controller and shows it after the redirect. Here is the `store()` method of a registration controller (it assumes you added a `phone` column to `users`):

```php
public function store(RegisterRequest $request): RedirectResponse
{
    $user = User::create([
        'name' => $request->validated('name'),
        'email' => $request->validated('email'),
        'phone' => $request->validated('phone'),
        'password' => Hash::make($request->validated('password')),
    ]);

    event(new Registered($user));

    Auth::login($user);

    toast('Check your inbox to verify your email address.', 'success', 'Welcome aboard');

    return redirect()->route('dashboard');
}
```

The `toast()` helper flashes the message into the session, and the frontend plugin picks it up on the next page. The Vue or React plugin needs one registration step in your Inertia bootstrap file; the [flash messages to toasts guide](./laravel-flash-messages-inertia-toasts.md) walks through it.

## 6. Translate labels and validation messages

If you sell outside one country, the signup page is the first place a non-English speaker notices you didn't think about them.

Server-side validation messages are already handled by Laravel. Publish the language files with `php artisan lang:publish`, add a `lang/{locale}/validation.php` per language, and errors come back in the current locale. Custom messages, like one for the phone format, go in the `custom` section of that file:

```php
// lang/en/validation.php
'custom' => [
    'phone' => [
        'regex' => 'Enter your number with the country code, for example +14155550100.',
    ],
],
```

The labels on the page are the part that usually stays hard-coded in English. [Laravel Lang Sync Inertia](https://erag.in/laravel-lang-sync-inertia/laravel.html) shares your PHP language files with the frontend, so the labels live in the same `lang/` folder as everything else. Call `syncLangFiles()` before rendering the page:

```php
public function create(): Response
{
    syncLangFiles('register');

    return Inertia::render('auth/Register');
}
```

Then read the strings in Vue:

```vue
<script setup lang="ts">
import { vueLang } from '@erag/lang-sync-inertia';

const { __ } = vueLang();
</script>

<template>
    <label for="phone">{{ __('register.phone') }}</label>
</template>
```

That reads `lang/{locale}/register.php` for the current locale. One set of files, one place to translate.

## 7. Rate limit the route and verify the email

Two Laravel features that should be on every public signup form:

- **Rate limiting.** Apply the `throttle` middleware to the registration route so a script can't create accounts in a loop. Laravel's [rate limiting docs](https://laravel.com/docs/routing#rate-limiting) cover named limiters.
- **Email verification.** Implement `MustVerifyEmail` on your `User` model and protect the parts of the app that matter with the `verified` middleware. See [email verification](https://laravel.com/docs/verification). It's the only way to know someone actually controls the inbox.

Neither of these replaces the disposable email check. Verification proves someone controls an inbox, including a temporary one for the ten minutes it exists. Blocking burner domains at the form and verifying afterwards cover different gaps.

## When this is overkill

An internal tool, an invite-only beta or an app where everyone signs in with company SSO doesn't need most of this. Skip the phone field, skip the disposable check, keep verification. Add the rest when you open signups to the public.

## Where to go next

Pick the two items that hurt most today. For most SaaS apps that's burner emails and phone format, since both create bad data you have to clean up later. Then add toasts and translations as the product grows.

If you'd rather start a new project from a kit than assemble the auth pieces yourself, I also build [SaaS Laravel](https://saas-laravel.com/), a starter kit for this kind of app. Either way, the checklist above applies to any Laravel signup form.
