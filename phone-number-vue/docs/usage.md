---
title: Basic Usage
description: How to use usePhoneNumber in a Vue 3 component with a country select and phone input.
head:
  - - meta
    - name: keywords
      content: usePhoneNumber usage, Vue phone input example, country select phone Vue, handleInput composable, localPhone Vue
---

# Basic Usage

Import `usePhoneNumber` and destructure the values you need in your `<script setup>` block.

## Minimal example

```vue
<script setup lang="ts">
import { usePhoneNumber } from '@erag/phone-number-vue'

const {
  selectedCountry,
  countryOptions,
  localPhone,
  callingCode,
  mask,
  isValid,
  handleInput,
} = usePhoneNumber()
</script>

<template>
  <div>
    <!-- Country selector -->
    <select v-model="selectedCountry">
      <option
        v-for="country in countryOptions"
        :key="country.isoCode2 ?? country.key"
        :value="country"
      >
        {{ country.isoCode2 }} — {{ country.name }}
      </option>
    </select>

    <!-- Phone input -->
    <input
      v-model="localPhone"
      @input="handleInput"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      inputmode="numeric"
      :placeholder="mask"
    />

    <!-- Helpers -->
    <p>Calling code: {{ callingCode }}</p>
    <p>Mask: {{ mask }}</p>
    <p>{{ isValid ? '✅ Valid phone number' : '❌ Enter a valid phone number' }}</p>
  </div>
</template>
```

## How `handleInput` works

Pass `@input="handleInput"` on the phone text field. `handleInput` accepts:

- A native `InputEvent` (from `@input`)
- A plain `string` value
- A `PhoneCountry` object (to update the selected country)

It strips non-numeric characters, truncates to the country's max length, updates `localPhone`, and returns `true` if the new value is valid.

## How `selectedCountry` works

`selectedCountry` is a `WritableComputedRef`. Binding it with `v-model` on a `<select>` where each `<option>` has `:value="country"` (the full country object) allows the composable to automatically update the calling code, mask, and validation when the selection changes.

```vue
<select v-model="selectedCountry">
  <option v-for="c in countryOptions" :key="c.key" :value="c">
    {{ c.isoCode2 }} — {{ c.name }}
  </option>
</select>
```

## Default country

The composable defaults to India (`IN`). To change the default, pass a `countryCode` option:

```ts
const phone = usePhoneNumber({ countryCode: 'US' })
```

## Pre-fill a phone number

Pass a `phone` option to pre-populate `localPhone`:

```ts
const phone = usePhoneNumber({ countryCode: 'IN', phone: '9876543210' })
```

The value is normalized and truncated to the selected country's max length automatically.
