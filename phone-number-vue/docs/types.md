---
title: TypeScript Types
description: TypeScript type definitions for @erag/phone-number-vue — PhoneCountry, PhoneDialCode, PhoneNumberOptions, PhoneNumberHelpers, and PhoneInputValue.
head:
  - - meta
    - name: keywords
      content: phone-number-vue TypeScript types, PhoneCountry type, PhoneNumberOptions, PhoneNumberHelpers, PhoneInputValue, usePhoneNumber types
---

# TypeScript Types

All types are exported from the package and can be imported alongside the composable.

## Import types

```ts
import type {
  PhoneCountry,
  PhoneDialCode,
  PhoneNumberSharedData,
  PhoneNumberOptions,
  PhoneNumberHelpers,
  PhoneInputValue,
  PhoneNumberCountryKey,
} from '@erag/phone-number-vue'
```

---

## `PhoneCountry`

Represents a single country record. Both snake_case and camelCase field names are supported for compatibility with different data sources.

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

## `PhoneNumberHelpers`

The full type of what `usePhoneNumber` returns.

```ts
interface PhoneNumberHelpers {
  countryOptions: ComputedRef<PhoneCountry[]>
  selectedCountry: WritableComputedRef<PhoneCountry | undefined>
  mask: ComputedRef<string>
  callingCode: ComputedRef<string | null>
  localPhone: Ref<string>
  isValid: ComputedRef<boolean>
  handleInput: (value: PhoneInputValue) => boolean
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
