---
title: "Basic & Controlled Usage"
description: "Implement international phone inputs in React components with country select dropdowns, live formatting, and real-time validation states."
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

# Basic Usage

Call `usePhoneNumber` inside your component and wire the returned values to your JSX.

## Minimal example

```tsx
import { usePhoneNumber } from '@erag/phone-number-react'

export function PhoneInput() {
  const phone = usePhoneNumber()

  return (
    <div>
      {/* Country selector */}
      <select
        value={phone.selectedCountry?.isoCode2 ?? ''}
        onChange={(e) =>
          phone.handleInput(
            phone.countryOptions.find(
              (c) => (c.isoCode2 ?? c.key) === e.target.value
            ) ?? ''
          )
        }
      >
        {phone.countryOptions.map((country) => (
          <option key={country.key} value={country.isoCode2 ?? country.key}>
            {country.isoCode2} — {country.name}
          </option>
        ))}
      </select>

      {/* Phone input */}
      <input
        value={phone.localPhone}
        onChange={phone.handleInput}
        inputMode="numeric"
        placeholder={phone.mask}
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />

      {/* Helpers */}
      <p>Calling code: {phone.callingCode}</p>
      <p>Mask: {phone.mask}</p>
      <p>{phone.isValid ? '✅ Valid phone number' : '❌ Enter a valid phone number'}</p>
    </div>
  )
}
```

## How `handleInput` works

`handleInput` is the unified input handler. It accepts:

- A native `ChangeEvent<HTMLInputElement>` (from `onChange` on the phone input)
- A plain `string` value
- A `PhoneCountry` object (to update the selected country)

It strips non-numeric characters, truncates to the country's max length, updates `localPhone` state internally, and returns `true` if the new value is valid.

## Handling the country select

The country select needs to pass the full `PhoneCountry` object to `handleInput`. Find it from `countryOptions` using the selected ISO code:

```tsx
<select
  value={phone.selectedCountry?.isoCode2 ?? ''}
  onChange={(e) =>
    phone.handleInput(
      phone.countryOptions.find(
        (c) => (c.isoCode2 ?? c.key) === e.target.value
      ) ?? ''
    )
  }
>
```

## Default country

The hook defaults to India (`IN`). To change the default, pass a `countryCode` option:

```ts
const phone = usePhoneNumber({ countryCode: 'US' })
```

## Pre-fill a phone number

Pass a `phone` option to pre-populate the value:

```ts
const phone = usePhoneNumber({ countryCode: 'IN', phone: '9876543210' })
```

The value is normalized and truncated to the selected country's max length automatically.
