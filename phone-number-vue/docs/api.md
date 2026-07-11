---
title: API Reference
description: Full API reference for usePhoneNumber — return values, parameters, and handleInput behavior.
head:
  - - meta
    - name: keywords
      content: usePhoneNumber API, phone composable return values, handleInput API, selectedCountry API, callingCode API, mask API
---

# API Reference

## `usePhoneNumber(options?)`

The main composable export.

```ts
import { usePhoneNumber } from '@erag/phone-number-vue'

const phone = usePhoneNumber(options?)
```

### Parameters

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `options` | `PhoneNumberOptions \| Ref<PhoneNumberOptions \| undefined>` | `phoneNumberData` | Optional. Pass a static options object or a reactive `Ref` to override country data, set default country, or pre-fill the phone number. |

### Options shape

```ts
interface PhoneNumberOptions {
  countries?: PhoneCountry[]    // Override country list
  dialCodes?: PhoneDialCode[]   // Override dial-code list
  countryCode?: string          // Default selected country ISO2 code (e.g. 'IN')
  phone?: string                // Pre-fill phone number
}
```

---

## Return values

### `countryOptions`

```ts
countryOptions: ComputedRef<PhoneCountry[]>
```

Reactive list of all countries for rendering in a `<select>` or custom dropdown. Derived from the bundled data or your custom data.

---

### `selectedCountry`

```ts
selectedCountry: WritableComputedRef<PhoneCountry | undefined>
```

The currently selected country object. Use with `v-model` on a `<select>` where each option's `:value` is the full country object.

Setting `selectedCountry` updates the country key, which cascades to `callingCode`, `mask`, and validation.

---

### `localPhone`

```ts
localPhone: Ref<string>
```

The normalized local phone digits. Non-numeric characters are stripped. The value is truncated to the selected country's max length automatically.

Bind with `v-model` on your phone input.

---

### `callingCode`

```ts
callingCode: ComputedRef<string | null>
```

The calling code for the selected country, for example `+91` for India or `+1` for the United States. Returns `null` if no match is found.

---

### `mask`

```ts
mask: ComputedRef<string>
```

A mask pattern string for the selected country, for example `XXXXX XXXXX` for India. Use it as a placeholder or display guide. No masking library is involved.

---

### `isValid`

```ts
isValid: ComputedRef<boolean>
```

`true` when `localPhone` has a non-zero length that matches one of the selected country's allowed phone lengths. `false` otherwise.

---

### `handleInput`

```ts
handleInput: (value: PhoneInputValue) => boolean
```

The unified input handler. Pass it directly to `@input` on your phone text field.

**Accepted values:**

| Input type | Behavior |
| ---------- | -------- |
| Native `InputEvent` | Reads `event.target.value`, normalizes digits, truncates, updates `localPhone` |
| `string` | Normalizes and applies the string as the new phone value |
| `PhoneCountry` object | Updates the selected country (use when handling country select changes) |

**Returns:** `boolean` — `true` if the resulting phone is valid, `false` otherwise.

---

## Exported data

```ts
import {
  countries,        // PhoneCountry[]
  dialCodes,        // PhoneDialCode[]
  phoneNumberData,  // { countries, dialCodes }
} from '@erag/phone-number-vue'
```
