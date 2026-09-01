---
title: "Custom Countries & Dial Codes"
description: "Customize country lists, calling codes, and formatting masks in @erag/phone-number-react using static JSON datasets or remote API fetches."
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

# Custom Data

By default, `usePhoneNumber` uses the bundled country and dial-code metadata. You can override it by passing a custom data object.

## Passing a static object

```ts
import { usePhoneNumber, type PhoneNumberSharedData } from '@erag/phone-number-react'

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

## Fetching data on mount

Use `useState` and `useEffect` to load countries from an API:

```tsx
import { useState, useEffect } from 'react'
import { usePhoneNumber, type PhoneNumberSharedData } from '@erag/phone-number-react'

export function PhoneWithApiData() {
  const [data, setData] = useState<PhoneNumberSharedData>({
    countries: [],
    dialCodes: [],
  })

  useEffect(() => {
    fetch('/api/phone-countries')
      .then((res) => res.json())
      .then(setData)
  }, [])

  const phone = usePhoneNumber(data)

  // When data updates, countryOptions re-renders automatically
  return (
    <select
      value={phone.selectedCountry?.isoCode2 ?? ''}
      onChange={(e) =>
        phone.handleInput(
          phone.countryOptions.find((c) => (c.isoCode2 ?? c.key) === e.target.value) ?? ''
        )
      }
    >
      {phone.countryOptions.map((c) => (
        <option key={c.key} value={c.isoCode2 ?? c.key}>
          {c.isoCode2} — {c.name}
        </option>
      ))}
    </select>
  )
}
```

## Country data shape

Each country object supports both snake_case and camelCase field names:

```ts
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
import { countries, dialCodes, phoneNumberData } from '@erag/phone-number-react'

console.log(countries.length)    // ~250 countries
console.log(dialCodes.length)    // dial code records
console.log(phoneNumberData)     // { countries, dialCodes }
```
