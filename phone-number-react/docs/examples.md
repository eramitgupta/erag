---
title: Examples
description: Real-world React examples using usePhoneNumber — form submission, Inertia.js, custom data, and Tailwind CSS UI.
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

# Examples

## Form submission with full phone

Combine `callingCode` and `localPhone` to build the full international phone number on submit:

```tsx
import { usePhoneNumber } from '@erag/phone-number-react'

export function RegisterForm() {
  const phone = usePhoneNumber({ countryCode: 'IN' })

  const fullPhone = phone.callingCode && phone.localPhone
    ? `${phone.callingCode}${phone.localPhone}`
    : ''

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!phone.isValid) return
    console.log('Submitting:', fullPhone)
    // fetch('/api/register', { method: 'POST', body: JSON.stringify({ phone: fullPhone }) })
  }

  return (
    <form onSubmit={handleSubmit}>
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
            {c.isoCode2} — {c.name} (+{c.countryCodes?.[0]})
          </option>
        ))}
      </select>

      <input
        value={phone.localPhone}
        onChange={phone.handleInput}
        inputMode="numeric"
        placeholder="Phone number"
      />

      {phone.localPhone && !phone.isValid && (
        <p style={{ color: 'red' }}>
          Enter a valid phone number for {phone.selectedCountry?.name}
        </p>
      )}

      <button type="submit" disabled={!phone.isValid}>
        Register
      </button>
    </form>
  )
}
```

## With Inertia.js (`@inertiajs/react`)

```tsx
import { useForm } from '@inertiajs/react'
import { usePhoneNumber } from '@erag/phone-number-react'

export function ProfileForm() {
  const form = useForm({ phone: '' })
  const phone = usePhoneNumber()

  function onPhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    phone.handleInput(e)
    form.setData('phone', `${phone.callingCode}${phone.localPhone}`)
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.post('/profile') }}>
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

      <input
        value={phone.localPhone}
        onChange={onPhoneChange}
        inputMode="numeric"
        placeholder="Phone number"
      />

      {form.errors.phone && <p>{form.errors.phone}</p>}

      <button type="submit" disabled={form.processing || !phone.isValid}>
        Save
      </button>
    </form>
  )
}
```

## Custom data loaded from an API

Pass a custom data object when countries come from an API. Re-render triggers naturally when state updates:

```tsx
import { useState, useEffect } from 'react'
import { usePhoneNumber, type PhoneNumberSharedData } from '@erag/phone-number-react'

export function PhoneWithDynamicData() {
  const [data, setData] = useState<PhoneNumberSharedData>({ countries: [], dialCodes: [] })
  const phone = usePhoneNumber(data)

  useEffect(() => {
    fetch('/api/phone-countries')
      .then((res) => res.json())
      .then(setData)
  }, [])

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

## Styled with Tailwind CSS

```tsx
import { usePhoneNumber } from '@erag/phone-number-react'

export function PhoneField() {
  const phone = usePhoneNumber({ countryCode: 'IN' })

  return (
    <div className="flex flex-col gap-2 max-w-sm">
      <label className="text-sm font-medium text-gray-700">Phone Number</label>

      <div className="flex gap-2">
        <select
          value={phone.selectedCountry?.isoCode2 ?? ''}
          onChange={(e) =>
            phone.handleInput(
              phone.countryOptions.find((c) => (c.isoCode2 ?? c.key) === e.target.value) ?? ''
            )
          }
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          {phone.countryOptions.map((c) => (
            <option key={c.key} value={c.isoCode2 ?? c.key}>
              {c.isoCode2} +{c.countryCodes?.[0]}
            </option>
          ))}
        </select>

        <input
          value={phone.localPhone}
          onChange={phone.handleInput}
          inputMode="numeric"
          placeholder={phone.mask}
          className={`flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${
            phone.localPhone && !phone.isValid ? 'border-red-400' : 'border-gray-300'
          }`}
        />
      </div>

      <p className="text-xs text-gray-400">
        {phone.callingCode} · {phone.isValid ? '✅ Valid' : 'Enter a valid number'}
      </p>
    </div>
  )
}
```
