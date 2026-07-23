---
title: Custom Data
description: Override the bundled country and dial-code data in @erag/phone-number-vue with your own static object or a reactive Vue ref.
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
        content: 'usePhoneNumber custom data, override country list Vue, custom dial codes, PhoneNumberSharedData, reactive ref phone data'
---

# Custom Data

By default, `usePhoneNumber` uses the bundled country and dial-code metadata. You can override it with your own data at any time.

## Passing a static object

```ts
import { usePhoneNumber, type PhoneNumberSharedData } from '@erag/phone-number-vue'

const customData: PhoneNumberSharedData = {
  countries: [
    {
      name: 'India',
      key: 'in',
      isoCode2: 'IN',
      countryCodes: ['91'],
      phone_lengths: [10],
    },
    {
      name: 'United States',
      key: 'us',
      isoCode2: 'US',
      countryCodes: ['1'],
      phone_lengths: [10],
    },
  ],
  dialCodes: [],
}

const phone = usePhoneNumber(customData)
```

## Passing a reactive ref

Pass a `Ref<PhoneNumberSharedData>` when data is loaded asynchronously. The composable will react when the ref updates:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePhoneNumber, type PhoneNumberSharedData } from '@erag/phone-number-vue'

const data = ref<PhoneNumberSharedData>({ countries: [], dialCodes: [] })

const { selectedCountry, countryOptions, localPhone, callingCode, isValid, handleInput } =
  usePhoneNumber(data)

onMounted(async () => {
  const response = await fetch('/api/phone-countries')
  data.value = await response.json()
  // countryOptions updates automatically
})
</script>
```

## Country data shape

Each country object supports both snake_case and camelCase field names:

```ts
// snake_case (both work)
{
  name: 'India',
  key: 'in',
  isoCode2: 'IN',
  isoCode3: 'IND',
  countryCodes: ['91'],
  phone_lengths: [10],       // or phoneLengths: [10]
  phone_length: 10,          // or phoneLength: 10
  phone_max_length: 10,      // or phoneMaxLength: 10
}
```

::: tip Multiple lengths
Some countries allow multiple valid phone lengths. Use the array form:

```ts
phone_lengths: [7, 8, 10]
```
:::

## Accessing bundled data

The bundled data is exported directly if you need it for merging or debugging:

```ts
import { countries, dialCodes, phoneNumberData } from '@erag/phone-number-vue'

console.log(countries.length)    // ~250 countries
console.log(dialCodes.length)    // dial code records
console.log(phoneNumberData)     // { countries, dialCodes }
```
