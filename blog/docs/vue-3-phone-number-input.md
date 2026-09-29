---
title: Vue Phone Number Input With Country Codes
headline: Build a Country-Aware Phone Input in Vue 3
description: Build a Vue phone number input with a country selector, calling code, length checks and a clean v-model, using the headless usePhoneNumber composable.
date: 2026-09-29
package: phone-number-vue
category: Tutorial
tags: [vue, phone-input, forms, inertia, typescript]
---

A plain `<input type="text">` for phone numbers looks fine until the data comes back. One user types `+91 98765-43210`, another types `09876543210`, a third pastes a number with brackets around the area code. Your database now has four formats for the same kind of value, and nothing tells you which country any of them belong to.

A Vue phone number input that knows about countries fixes most of that at the source. The user picks a country, types digits, and your form gets a calling code plus a clean string of digits that you can check against that country's allowed lengths.

In this tutorial we'll build a reusable `PhoneField.vue` with `@erag/phone-number-vue`, a headless composable I wrote for exactly this. It gives you state and handlers. You bring the markup.

## What we're building

By the end you'll have:

- A country `<select>` that updates the calling code, placeholder mask and validation when it changes
- A phone input that strips anything that isn't a digit and stops at the country's max length
- A component that works with `v-model` and hands the parent the full number (for example `+919876543210`) plus a validity flag
- A register page using it with Inertia's `useForm`

## Install the composable

The package has one peer dependency, Vue 3. There's no masking library and no stylesheet to import.

```bash
npm install @erag/phone-number-vue
```

Yarn and pnpm work too (`yarn add` / `pnpm add`). The [installation guide](https://erag.in/phone-number-vue/installation.html) lists the requirements: Vue `^3.0.0`, Node.js 16 or newer, and TypeScript 5 if you use it.

Check that it resolves:

```ts
import { usePhoneNumber } from '@erag/phone-number-vue'
```

## The smallest working version

Before making a component, it helps to see what the composable hands back. Drop this into any page:

```vue
<script setup lang="ts">
import { usePhoneNumber } from '@erag/phone-number-vue'

const { selectedCountry, countryOptions, localPhone, callingCode, mask, isValid, handleInput } =
  usePhoneNumber()
</script>

<template>
  <div>
    <select v-model="selectedCountry">
      <option v-for="country in countryOptions" :key="country.key" :value="country">
        {{ country.isoCode2 }} - {{ country.name }}
      </option>
    </select>

    <input v-model="localPhone" inputmode="numeric" :placeholder="mask" @input="handleInput" />

    <p>{{ callingCode }} {{ localPhone }} ({{ isValid ? 'valid' : 'not valid yet' }})</p>
  </div>
</template>
```

Type a few letters into the input and they disappear. Type more digits than the country allows and the extra ones are dropped. Switch the country and the calling code, mask and `isValid` all update.

Three details are doing the work here:

- **`:value="country"`** passes the whole country object to the option, not just an ISO code. `selectedCountry` is a writable computed ref, so `v-model` on the select sets it directly.
- **`@input="handleInput"`** runs the normalization. It strips non-digits, truncates to the country's max length, and updates `localPhone`.
- **`:placeholder="mask"`** shows a pattern like `XXXXX XXXXX` for India, so people can see roughly how many digits you expect.

The default country is India (`IN`). You'll usually want to change that, which we'll do next.

## How to turn it into a reusable Vue phone input component

Most apps need a phone field in more than one place: registration, profile settings, a checkout form. So let's wrap the composable in a component with a normal `v-model`.

The parent shouldn't care about calling codes and local digits separately. It wants one string it can send to the server, and a way to know whether the number is complete. I use two models for that: the default one for the full number, and a named `valid` model.

```vue
<!-- resources/js/components/PhoneField.vue -->
<script setup lang="ts">
import { computed, watch } from 'vue'
import { usePhoneNumber } from '@erag/phone-number-vue'

const props = defineProps<{
  id?: string
  label?: string
  defaultCountry?: string
  initialPhone?: string
}>()

const fullPhone = defineModel<string>({ default: '' })
const valid = defineModel<boolean>('valid', { default: false })

const { selectedCountry, countryOptions, localPhone, callingCode, mask, isValid, handleInput } =
  usePhoneNumber({
    countryCode: props.defaultCountry ?? 'US',
    phone: props.initialPhone,
  })

const combined = computed(() =>
  callingCode.value && localPhone.value ? `${callingCode.value}${localPhone.value}` : '',
)

watch(combined, (value) => (fullPhone.value = value), { immediate: true })
watch(isValid, (value) => (valid.value = value), { immediate: true })
</script>

<template>
  <div class="phone-field">
    <label :for="id ?? 'phone'">{{ label ?? 'Phone number' }}</label>

    <div class="phone-field__row">
      <select v-model="selectedCountry" aria-label="Country">
        <option v-for="country in countryOptions" :key="country.key" :value="country">
          {{ country.name }} (+{{ country.countryCodes?.[0] }})
        </option>
      </select>

      <span class="phone-field__code">{{ callingCode }}</span>

      <input
        :id="id ?? 'phone'"
        v-model="localPhone"
        type="tel"
        inputmode="numeric"
        autocomplete="tel-national"
        :placeholder="mask"
        @input="handleInput"
      />
    </div>
  </div>
</template>
```

A few choices worth explaining:

**Why `defineModel`?** It keeps the parent API to `v-model` and `v-model:valid`, which reads well in a form. It needs Vue 3.4 or newer. On older Vue 3 versions, swap it for a `modelValue` prop and an `update:modelValue` emit; the rest stays the same.

**Why watch `combined` instead of building the string in the input handler?** Because the number changes in two ways: when the user types, and when they switch country. A computed value covers both. Building it only inside `@input` misses the country change, and you end up submitting the old calling code.

**Why show `callingCode` next to the input?** It tells the user not to type the country code themselves. People who see `+91` sitting right there rarely add it again.

**Why `autocomplete="tel-national"`?** Browsers can autofill just the national part of a saved number, which fits a field that sits next to a country selector. Plain `tel` would work too, but you'd get the country code pasted into a digits-only input.

Styling is left out on purpose. The composable doesn't ship CSS, so the classes above are hooks for whatever you already use.

## Using it on an Inertia register page

Here's the component on a registration page. The form gets the full number, and the submit button waits until the number has a valid length for the selected country.

```vue
<!-- resources/js/Pages/Auth/Register.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from '@inertiajs/vue3'
import PhoneField from '@/components/PhoneField.vue'

const form = useForm({
  name: '',
  email: '',
  phone: '',
})

const phoneIsValid = ref(false)

function submit() {
  form.post('/register')
}
</script>

<template>
  <form @submit.prevent="submit">
    <input v-model="form.name" autocomplete="name" placeholder="Full name" />
    <input v-model="form.email" type="email" autocomplete="email" placeholder="Email" />

    <PhoneField v-model="form.phone" v-model:valid="phoneIsValid" default-country="IN" />
    <p v-if="form.errors.phone">{{ form.errors.phone }}</p>

    <button type="submit" :disabled="form.processing || !phoneIsValid">Create account</button>
  </form>
</template>
```

`form.phone` now holds something like `+919876543210`. That's the value you validate again on the server and store.

## Pre-filling the field on an edit page

On a profile page you need to show the number the user already saved. The composable takes two options for this: `countryCode` for the ISO2 country and `phone` for the local digits. The `phone` value is normalized and truncated the same way typed input is.

```vue
<PhoneField
  v-model="form.phone"
  v-model:valid="phoneIsValid"
  :default-country="user.phone_country"
  :initial-phone="user.phone_local"
/>
```

This is where your storage choice matters. If you only store `+15551234567`, you have to split it back into country and local digits, and calling codes aren't unique per country (`+1` covers more than one). Storing the ISO2 country next to the number makes pre-filling trivial. I cover the storage side properly in the [E.164 format guide](./phone-number-formats-e164-web-forms.md).

## Putting your main countries first

A list of 200+ countries in alphabetical order means most of your users scroll past dozens of entries to find their own. If most sign-ups come from a handful of countries, put those at the top.

The package exports its bundled `countries` and `dialCodes`, and `usePhoneNumber` accepts your own list, so reordering is a few lines:

```ts
import { countries, dialCodes, usePhoneNumber } from '@erag/phone-number-vue'

const preferred = ['IN', 'US', 'GB']
const isoOf = (country: (typeof countries)[number]) => (country.isoCode2 ?? country.key).toUpperCase()

const orderedCountries = [
  ...preferred.flatMap((iso) => countries.filter((country) => isoOf(country) === iso)),
  ...countries.filter((country) => !preferred.includes(isoOf(country))),
]

const phone = usePhoneNumber({ countries: orderedCountries, dialCodes, countryCode: 'IN' })
```

I pass `dialCodes` along with the reordered list so nothing else about the data changes. The [custom data page](https://erag.in/phone-number-vue/custom-data.html) shows the country record shape if you'd rather define the list yourself.

## When you don't need this

Be honest with yourself about the requirement before adding a country selector.

- **Single-country apps.** If every user is in one country, a `type="tel"` input with a fixed prefix and a length check is enough.
- **You want a finished widget.** The composable renders nothing. If you want a flag dropdown with search out of the box, a ready-made component will get you there faster. I compared both routes in [headless phone inputs vs ready-made components](./headless-phone-input-vs-component-libraries.md).
- **You need carrier-level checks.** Validation here is length-based for the selected country. It won't tell you whether a number exists or is a mobile line. That takes an SMS verification step or a lookup service.

## Where to go next

You now have a component that produces a consistent full number and a validity flag from any page. Two things are worth doing next:

1. Add proper error timing and server-side checks. The [Vue phone validation guide](./validate-phone-numbers-vue.md) covers when to show errors and how to mirror the rule in Laravel.
2. Skim the [API reference](https://erag.in/phone-number-vue/api.html) for the exact return types, and the [examples page](https://erag.in/phone-number-vue/examples.html) for a Tailwind-styled version of the same field.

If your country list comes from your own backend, `usePhoneNumber` also accepts a reactive ref of custom data, so the field updates when the fetch resolves.
