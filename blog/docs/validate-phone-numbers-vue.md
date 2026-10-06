---
title: Vue Phone Validation for International Numbers
headline: How to Validate International Phone Numbers in Vue 3
description: A practical guide to Vue phone validation for international numbers, covering country length rules, error timing, accessibility and matching checks in Laravel.
date: 2026-09-29
package: phone-number-vue
category: Guide
tags: [vue, validation, phone-input, laravel, accessibility]
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/validate-phone-numbers-vue.md
</div>

Phone validation has a strange reputation. Some forms accept anything, including `asdf`. Others reject perfectly good numbers because someone wrote a regex for their own country and shipped it worldwide.

Good Vue phone validation sits in between. It knows which country the user picked, checks the number against that country's rules, shows errors at the right moment, and then gets checked again on the server.

This guide walks through that with `@erag/phone-number-vue`. If you haven't set up the field yet, start with [building the phone input](./vue-3-phone-number-input.md) and come back.

## What "valid" should mean for a phone field

Before writing code, decide what you are actually checking. There are three levels, and they get more expensive as you go:

1. **Format.** Digits only, sensible length, a known country. Cheap, runs in the browser.
2. **Plausibility.** The digits match that country's numbering plan (right prefixes, right lengths for mobile vs landline). Needs detailed numbering data per country.
3. **Reachability.** The number exists and the user owns it. Only an SMS code or call can prove this.

Most sign-up and profile forms need level 1 in the browser, level 1 again on the server, and level 3 only when the number is used for login or payments. Level 2 is where people over-invest.

## What `isValid` checks

The composable returns `isValid` as a computed ref. According to the [API reference](https://erag.in/phone-number-vue/api.html), it is `true` when `localPhone` has a non-zero length that matches one of the selected country's allowed phone lengths.

So it's a length check tied to the selected country. It is not a numbering-plan check. For India that means a 10-digit number passes and a 9-digit one doesn't. It does not look at which digit the number starts with.

That's a deliberate trade-off, and I think it's the right default for most forms. Length rules catch the common mistakes: a missing digit, an extra digit, the country code typed twice. Anything stricter needs a lot more data and gets things wrong when numbering plans change.

Two things happen before `isValid` even runs:

- `handleInput` strips every non-digit character, so spaces, dashes and brackets never reach your state.
- The value is truncated to the country's max length, so "too long" can't happen from typing.

That leaves "too short" and "empty" as the cases you need to message.

## How to show phone errors at the right time

The quickest way to annoy people is a red error under the field after the first keystroke. At one digit, of course the number is invalid. The user hasn't finished.

A pattern that works well:

- Don't show an error while the user is still typing for the first time.
- Show it on blur if the number is incomplete.
- Once the number has been valid, show the error immediately if it becomes invalid again.

`handleInput` returns a boolean for the new value, which makes the last rule easy:

```vue
<!-- resources/js/components/ContactPhone.vue -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePhoneNumber } from '@erag/phone-number-vue'

const { selectedCountry, countryOptions, localPhone, callingCode, mask, isValid, handleInput } =
  usePhoneNumber({ countryCode: 'US' })

const touched = ref(false)

function onPhoneInput(event: Event) {
  const becameValid = handleInput(event)

  if (becameValid) {
    touched.value = true
  }
}

const showError = computed(
  () => touched.value && localPhone.value.length > 0 && !isValid.value,
)

const errorMessage = computed(
  () => `Enter a complete phone number for ${selectedCountry.value?.name ?? 'this country'}.`,
)
</script>

<template>
  <div>
    <label for="contact-phone">Mobile number</label>

    <select v-model="selectedCountry" aria-label="Country">
      <option v-for="country in countryOptions" :key="country.key" :value="country">
        {{ country.name }} (+{{ country.countryCodes?.[0] }})
      </option>
    </select>

    <input
      id="contact-phone"
      v-model="localPhone"
      type="tel"
      inputmode="numeric"
      :placeholder="mask"
      :aria-invalid="showError"
      aria-describedby="contact-phone-hint"
      @input="onPhoneInput"
      @blur="touched = true"
    />

    <p id="contact-phone-hint" :class="{ error: showError }">
      {{ showError ? errorMessage : `We'll add ${callingCode ?? 'the country code'} for you.` }}
    </p>
  </div>
</template>
```

Notice the error message names the selected country. "Enter a complete phone number for Germany" is more useful than "Invalid phone", because the most common real cause is the wrong country in the dropdown.

The hint element doubles as the error slot, and `aria-describedby` points at it either way. Screen reader users hear the hint on focus and the error once `aria-invalid` flips. MDN's page on [aria-invalid](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-invalid) is a good reference if you want to go further.

## Validating when the country changes

Here's a case people miss. A user types a 10-digit US number, then realises they meant the UK and switches the country. The digits stay, but the rules changed.

You don't need extra code for this. `isValid` is a computed ref that depends on the selected country, so it re-evaluates on the switch. If `touched` is already true, the error shows straight away. That's the behaviour you want: the user just changed something, so tell them the result.

## Restricting the countries you accept

If your business only operates in a few countries, don't offer 200 of them. It makes the dropdown longer and lets people submit numbers you can't use.

The package exports its bundled data, so you can filter it and pass the result back in:

```ts
import { countries, dialCodes, usePhoneNumber } from '@erag/phone-number-vue'

const supportedCountries = ['IN', 'US', 'GB']

const phone = usePhoneNumber({
  countries: countries.filter((country) =>
    supportedCountries.includes((country.isoCode2 ?? country.key).toUpperCase()),
  ),
  dialCodes,
  countryCode: 'IN',
})
```

You can also define countries by hand. Each record takes `phone_lengths` (or `phoneLengths`) as an array, which is how a country with more than one valid length is described. The [custom data page](https://erag.in/phone-number-vue/custom-data.html) shows the full shape, including loading the list from an API through a reactive ref.

## Validate phone numbers again on the server

Client-side checks are for the user's benefit. They don't protect your data. Anyone can post to your endpoint directly, so the same rule has to exist in Laravel.

On the client, send the full number built from `callingCode` and `localPhone`, plus the ISO country:

```ts
import { useForm } from '@inertiajs/vue3'

const form = useForm({ phone: '', phone_country: '' })

function submit() {
  form.phone = `${callingCode.value ?? ''}${localPhone.value}`
  form.phone_country = selectedCountry.value?.isoCode2 ?? ''
  form.post('/profile/phone')
}
```

On the server, a form request can at least enforce the international shape: a plus sign, a non-zero first digit, and no more than 15 digits in total.

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePhoneRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'phone' => ['required', 'string', 'regex:/^\+[1-9]\d{6,14}$/'],
            'phone_country' => ['required', 'string', 'size:2'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'phone.regex' => 'Enter the phone number with its country code.',
        ];
    }
}
```

If you want the server to enforce per-country lengths too, keep a small map of the countries you support and check the digit count in a custom rule. For a short supported list that's a few lines. Laravel's [custom validation rules](https://laravel.com/docs/validation#custom-validation-rules) docs cover the pattern.

With Inertia, a failed server check comes back as `form.errors.phone`. Render it in the same hint slot as the client error so there's only one place to look.

## When length validation isn't enough

Length checks are the right floor. They are not the right ceiling for every app.

- **Login by phone, two-factor, payouts.** Verify ownership with a one-time code. No amount of format checking tells you the number belongs to the person typing it.
- **You must reject landlines or premium numbers.** You need numbering-plan data per country. The composable doesn't try to do this.
- **Regulated industries.** If the phone number has compliance meaning, use a lookup service and keep the result.

For everything else (contact numbers, delivery details, a profile field) country-aware length validation on both sides catches the mistakes that actually happen.

## FAQ

### Does `isValid` check whether the number really exists?

No. It checks that the digit count matches one of the selected country's allowed lengths. Existence needs SMS or call verification.

### Can users type spaces or dashes?

They can type them, but `handleInput` strips non-numeric characters, so `localPhone` only ever holds digits.

### Why is my number invalid after switching country?

Validation follows the selected country. The same digits can be a valid length in one country and not in another.

### Should I disable the submit button until the number is valid?

For short forms, yes. For long forms, I prefer leaving it enabled and showing the error on submit, so people aren't left guessing which field blocks them.

## Where to go next

Wire the error timing above into your phone component, then add the form request on the Laravel side so both ends agree. If you're weighing this approach against a finished widget, read [headless phone inputs vs ready-made components](./headless-phone-input-vs-component-libraries.md) before you commit.
