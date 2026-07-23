---
title: API Reference
description: Full API reference for usePhoneNumber React hook — return values, parameters, and handleInput behavior.
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
        content: 'usePhoneNumber API React, phone hook return values, handleInput API React, selectedCountry React, callingCode React'
---

# API Reference

## `usePhoneNumber(options?)`

The main hook export.

```ts
import { usePhoneNumber } from '@erag/phone-number-react'

const phone = usePhoneNumber(options?)
```

### Parameters

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `options` | `PhoneNumberOptions` | `phoneNumberData` | Optional. Pass a data object to override country data, set the default country, or pre-fill the phone number. |

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
countryOptions: PhoneCountry[]
```

List of all countries for rendering in a `<select>` or custom dropdown. Derived from bundled data or your custom data.

---

### `selectedCountry`

```ts
selectedCountry: PhoneCountry | undefined
```

The currently selected country object. Use `selectedCountry?.isoCode2` as the `value` on a controlled `<select>`.

---

### `localPhone`

```ts
localPhone: string
```

The normalized local phone digits. Non-numeric characters are stripped and the value is truncated to the selected country's max length.

Use as the controlled `value` on your phone `<input>`.

---

### `callingCode`

```ts
callingCode: string | null
```

The calling code for the selected country, for example `+91` for India or `+1` for the United States. Returns `null` if no match is found.

---

### `mask`

```ts
mask: string
```

A mask pattern string for the selected country, for example `XXXXX XXXXX` for India. Use it as an input `placeholder`. No masking library is involved.

---

### `isValid`

```ts
isValid: boolean
```

`true` when `localPhone` has a non-zero length that matches one of the selected country's allowed phone lengths. `false` otherwise.

---

### `handleInput`

```ts
handleInput: (value: PhoneInputValue) => boolean
```

The unified input handler.

**Accepted values:**

| Input type | Behavior |
| ---------- | -------- |
| `ChangeEvent<HTMLInputElement>` | Reads `event.target.value`, normalizes, truncates, updates `localPhone` |
| `string` | Normalizes and applies the string as the new phone value |
| `PhoneCountry` object | Updates the selected country |

**Returns:** `boolean` — `true` if the resulting phone is valid, `false` otherwise.

**Usage on phone input:**
```tsx
<input value={phone.localPhone} onChange={phone.handleInput} />
```

**Usage on country select:**
```tsx
onChange={(e) =>
  phone.handleInput(
    phone.countryOptions.find((c) => (c.isoCode2 ?? c.key) === e.target.value) ?? ''
  )
}
```

---

## Exported data

```ts
import {
  countries,        // PhoneCountry[]
  dialCodes,        // PhoneDialCode[]
  phoneNumberData,  // { countries, dialCodes }
} from '@erag/phone-number-react'
```
