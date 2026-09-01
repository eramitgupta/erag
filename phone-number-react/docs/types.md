---
title: "TypeScript Type Definitions"
description: "Explore all public TypeScript definitions exported by @erag/phone-number-react for custom country data, hook options, and input handlers."
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

# TypeScript Types

All types are exported from the package and can be imported alongside the hook.

## Import types

```ts
import type {
  PhoneCountry,
  PhoneDialCode,
  PhoneNumberSharedData,
  PhoneNumberOptions,
  PhoneInputValue,
  PhoneNumberCountryKey,
} from '@erag/phone-number-react'
```

---

## `PhoneCountry`

Represents a single country record. Both snake_case and camelCase field names are supported.

```ts
interface PhoneCountry {
  name: string
  key: string
  countryCodes?: string[]
  isoCode2?: string
  isoCode3?: string
  iso2?: string
  iso3?: string
  flag?: string
  flag_url?: string
  phone_length?: number
  phone_lengths?: number[]
  phone_max_length?: number
  phoneLength?: number
  phoneLengths?: number[]
  phoneMaxLength?: number
  [key: string]: unknown     // allows extra fields
}
```

---

## `PhoneDialCode`

Represents a single dial-code record.

```ts
interface PhoneDialCode {
  label?: string
  value?: string
  country?: string
  country_code?: string
  dial_code?: string
  countryCodes?: string[]
  isoCode2?: string
  isoCode3?: string
  [key: string]: unknown
}
```

---

## `PhoneNumberSharedData`

The shape of the data object accepted by `usePhoneNumber`.

```ts
interface PhoneNumberSharedData {
  countries?: PhoneCountry[]
  dialCodes?: PhoneDialCode[]
}
```

---

## `PhoneNumberOptions`

Extends `PhoneNumberSharedData` with initial state options.

```ts
interface PhoneNumberOptions extends PhoneNumberSharedData {
  countryCode?: string   // Default country ISO2 code
  phone?: string         // Pre-fill phone digits
}
```

---

## `PhoneInputValue`

The union type accepted by `handleInput`.

```ts
type PhoneInputValue = string | PhoneCountry | { target?: unknown }
```

This covers a plain string, a country object (to switch countries), or a native DOM event.

---

## `PhoneNumberCountryKey`

A loose key type used internally for country lookups.

```ts
type PhoneNumberCountryKey = string | number | null | undefined
```

---

## Hook return type

`usePhoneNumber` returns plain values (not reactive refs — this is React, not Vue):

```ts
interface PhoneNumberHookReturn {
  countryOptions: PhoneCountry[]
  selectedCountry: PhoneCountry | undefined
  mask: string
  callingCode: string | null
  localPhone: string
  isValid: boolean
  handleInput: (value: PhoneInputValue) => boolean
}
```
