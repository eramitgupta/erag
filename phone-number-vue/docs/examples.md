---
title: Examples
description: Real-world Vue 3 examples using usePhoneNumber — form submission, Inertia.js, reactive ref, and Tailwind CSS UI.
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
    - - meta
      - name: keywords
        content: 'usePhoneNumber examples, Vue phone form, Inertia phone input, Tailwind phone Vue, phone composable example'
---

# Examples

## Form submission with full phone

Combine `callingCode` and `localPhone` to build the full international phone number on submit:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { usePhoneNumber } from '@erag/phone-number-vue'

const { selectedCountry, countryOptions, localPhone, callingCode, isValid, handleInput } =
  usePhoneNumber({ countryCode: 'IN' })

const fullPhone = computed(() =>
  callingCode.value && localPhone.value
    ? `${callingCode.value}${localPhone.value}`
    : ''
)

function submit() {
  if (!isValid.value) return
  console.log('Submitting:', fullPhone.value)
  // e.g. axios.post('/api/register', { phone: fullPhone.value })
}
</script>

<template>
  <form @submit.prevent="submit">
    <select v-model="selectedCountry">
      <option v-for="c in countryOptions" :key="c.key" :value="c">
        {{ c.isoCode2 }} — {{ c.name }} ({{ c.countryCodes?.[0] }})
      </option>
    </select>

    <input
      v-model="localPhone"
      @input="handleInput"
      inputmode="numeric"
      placeholder="Phone number"
    />

    <p v-if="localPhone && !isValid" style="color:red">
      Enter a valid phone number for {{ selectedCountry?.name }}
    </p>

    <button type="submit" :disabled="!isValid">Submit</button>
  </form>
</template>
```

## With Inertia.js form

Use `useForm` from `@inertiajs/vue3` and update the form field inside `handleInput`:

```vue
<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import { usePhoneNumber } from '@erag/phone-number-vue'

const form = useForm({ phone: '' })

const { selectedCountry, countryOptions, localPhone, callingCode, isValid, handleInput } =
  usePhoneNumber()

function onPhoneInput(event: Event) {
  handleInput(event)
  form.phone = callingCode.value + localPhone.value
}

function submit() {
  form.post('/profile/update')
}
</script>

<template>
  <form @submit.prevent="submit">
    <select v-model="selectedCountry">
      <option v-for="c in countryOptions" :key="c.key" :value="c">
        {{ c.isoCode2 }} — {{ c.name }}
      </option>
    </select>

    <input
      v-model="localPhone"
      @input="onPhoneInput"
      inputmode="numeric"
      placeholder="Phone number"
    />

    <p v-if="form.errors.phone">{{ form.errors.phone }}</p>

    <button type="submit" :disabled="form.processing || !isValid">Save</button>
  </form>
</template>
```

## Reactive ref as data source

Pass a `ref` to override bundled data dynamically (e.g. loaded from an API):

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePhoneNumber, type PhoneNumberSharedData } from '@erag/phone-number-vue'

const customData = ref<PhoneNumberSharedData>({ countries: [], dialCodes: [] })

const { selectedCountry, countryOptions, localPhone, callingCode, isValid, handleInput } =
  usePhoneNumber(customData)

onMounted(async () => {
  const res = await fetch('/api/phone-countries')
  customData.value = await res.json()
})
</script>
```

When `customData` updates, `countryOptions` and all dependent computed values update reactively.

## Styled with Tailwind CSS

```vue
<script setup lang="ts">
import { usePhoneNumber } from '@erag/phone-number-vue'

const { selectedCountry, countryOptions, localPhone, callingCode, mask, isValid, handleInput } =
  usePhoneNumber({ countryCode: 'IN' })
</script>

<template>
  <div class="flex flex-col gap-2 max-w-sm">
    <label class="text-sm font-medium text-gray-700">Phone Number</label>

    <div class="flex gap-2">
      <select
        v-model="selectedCountry"
        class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option v-for="c in countryOptions" :key="c.key" :value="c">
          {{ c.isoCode2 }} +{{ c.countryCodes?.[0] }}
        </option>
      </select>

      <input
        v-model="localPhone"
        @input="handleInput"
        inputmode="numeric"
        :placeholder="mask"
        class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        :class="{ 'border-red-400': localPhone && !isValid }"
      />
    </div>

    <p class="text-xs text-gray-400">
      {{ callingCode }} · {{ isValid ? '✅ Valid' : 'Enter a valid number' }}
    </p>
  </div>
</template>
```
