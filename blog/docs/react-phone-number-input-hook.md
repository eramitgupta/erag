---
title: React Phone Number Input With a Headless Hook
headline: A Phone Number Input Hook for React (Country Codes Included)
description: Build a React phone number input with country selection, calling codes and length validation using the headless usePhoneNumber hook and your own JSX.
date: 2026-09-29
package: phone-number-react
category: Tutorial
tags: [react, phone-input, hooks, forms, inertia]
---

You need a phone field in a React form. You want a country selector, you want the digits cleaned up, and you want to know whether the number is complete before the form is submitted. What you don't want is another component that brings its own CSS and fights your design system for every border.

That's the gap `@erag/phone-number-react` fills. It's a hook, `usePhoneNumber`, that manages the state of a country-aware React phone number input and returns plain values and one handler. The JSX is yours.

This tutorial goes from install to a working sign-up form, and covers the two React-specific things that trip people up: mapping a `<select>` value back to a country object, and reading state right after you set it.

## Install the hook

```bash
npm install @erag/phone-number-react
```

Or with other package managers:

```bash
yarn add @erag/phone-number-react
pnpm add @erag/phone-number-react
```

The peer dependency is React `^18.0.0 || ^19.0.0`. The [installation guide](https://erag.in/phone-number-react/installation.html) lists Node.js 22 or newer, and TypeScript 5 as optional but recommended. There's no masking library and no stylesheet.

## What `usePhoneNumber` returns

Call it inside a component and you get an object back. Unlike the Vue version, these are plain values, not refs, so you read them directly in JSX.

| Value | Type | What it's for |
| --- | --- | --- |
| `countryOptions` | `PhoneCountry[]` | Rendering the country list |
| `selectedCountry` | `PhoneCountry \| undefined` | The current country object |
| `localPhone` | `string` | The normalized digits, for the input's `value` |
| `callingCode` | `string \| null` | For example `+91` or `+1` |
| `mask` | `string` | A pattern like `XXXXX XXXXX`, handy as a placeholder |
| `isValid` | `boolean` | Digit count matches an allowed length for the country |
| `handleInput` | `(value) => boolean` | Takes a change event, a string, or a country object |

The default country is India (`IN`). Pass `countryCode` to change it, and `phone` to pre-fill digits. Full details are in the [API reference](https://erag.in/phone-number-react/api.html).

## How to build a React phone number input component

Here's a complete field. Read the code first, then I'll go through the parts that matter.

```tsx
// resources/js/components/PhoneField.tsx
import { usePhoneNumber } from '@erag/phone-number-react'

type PhoneState = ReturnType<typeof usePhoneNumber>

type PhoneFieldProps = {
  phone: PhoneState
  id?: string
  label?: string
  error?: string
}

export function PhoneField({ phone, id = 'phone', label = 'Phone number', error }: PhoneFieldProps) {
  function selectCountry(isoCode: string) {
    const country = phone.countryOptions.find((c) => (c.isoCode2 ?? c.key) === isoCode)

    if (country) {
      phone.handleInput(country)
    }
  }

  const showLengthError = phone.localPhone.length > 0 && !phone.isValid

  return (
    <div className="phone-field">
      <label htmlFor={id}>{label}</label>

      <div className="phone-field__row">
        <select
          aria-label="Country"
          value={phone.selectedCountry?.isoCode2 ?? ''}
          onChange={(e) => selectCountry(e.target.value)}
        >
          {phone.countryOptions.map((c) => (
            <option key={c.key} value={c.isoCode2 ?? c.key}>
              {c.name} (+{c.countryCodes?.[0]})
            </option>
          ))}
        </select>

        <span className="phone-field__code">{phone.callingCode}</span>

        <input
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={phone.localPhone}
          onChange={phone.handleInput}
          placeholder={phone.mask}
          aria-invalid={showLengthError || Boolean(error)}
        />
      </div>

      {error && <p className="phone-field__error">{error}</p>}
      {!error && showLengthError && (
        <p className="phone-field__error">
          Enter a complete number for {phone.selectedCountry?.name}.
        </p>
      )}
    </div>
  )
}
```

### The select needs a string, the hook needs an object

A controlled `<select>` works with string values. The hook wants a `PhoneCountry` object when the country changes. So the select uses the ISO code as its `value`, and `selectCountry` looks the object up again in `countryOptions` before calling `handleInput`.

I only call `handleInput` when a country is found. That matters: `handleInput` also accepts a plain string and treats it as a phone value. Passing an empty string as a fallback would go down that path instead of changing the country.

### One handler for the input

`onChange={phone.handleInput}` is all the phone input needs. The hook reads `event.target.value`, strips non-digits, truncates to the country's max length and updates `localPhone`. Because the input is controlled by `phone.localPhone`, letters and extra digits simply never show up.

### Why the hook lives in the parent

Notice that `PhoneField` doesn't call `usePhoneNumber`. It receives the hook's result as a prop.

In React, lifting the state up is the simplest way to let the form read the phone values when it submits. The alternative, calling the hook inside the field and reporting changes up through an `onChange` callback and an effect, works, but you end up with duplicated state and effect dependency warnings. Passing the hook result down keeps one source of truth.

`ReturnType<typeof usePhoneNumber>` gives you the exact type without importing anything extra.

It also makes the field easier to reuse. A checkout form, a profile page and an admin screen can each call `usePhoneNumber` with their own default country or pre-filled value, and they all render the same `PhoneField`. The field only cares about displaying state and forwarding events. Where the data comes from and where it goes is the page's business.

## Using it in an Inertia sign-up form

Now the form that owns the state:

```tsx
// resources/js/Pages/Auth/Register.tsx
import { FormEvent } from 'react'
import { useForm } from '@inertiajs/react'
import { usePhoneNumber } from '@erag/phone-number-react'
import { PhoneField } from '@/components/PhoneField'

export default function Register() {
  const phone = usePhoneNumber({ countryCode: 'US' })

  const form = useForm({
    name: '',
    email: '',
    phone: '',
    phone_country: '',
  })

  const fullPhone =
    phone.callingCode && phone.localPhone ? `${phone.callingCode}${phone.localPhone}` : ''

  function submit(e: FormEvent) {
    e.preventDefault()

    form.transform((data) => ({
      ...data,
      phone: fullPhone,
      phone_country: phone.selectedCountry?.isoCode2 ?? '',
    }))

    form.post('/register')
  }

  return (
    <form onSubmit={submit}>
      <input
        value={form.data.name}
        onChange={(e) => form.setData('name', e.target.value)}
        autoComplete="name"
        placeholder="Full name"
      />

      <input
        type="email"
        value={form.data.email}
        onChange={(e) => form.setData('email', e.target.value)}
        autoComplete="email"
        placeholder="Email"
      />

      <PhoneField phone={phone} error={form.errors.phone} />

      <button type="submit" disabled={form.processing || !phone.isValid}>
        Create account
      </button>
    </form>
  )
}
```

`fullPhone` is computed during render, so it always reflects the current country and digits. The server receives something like `+15551234567` plus `US`, which is easy to validate and store.

## The stale state gotcha

This is the React mistake I'd most like you to avoid. It's tempting to write:

```tsx
function onPhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
  phone.handleInput(e)
  form.setData('phone', `${phone.callingCode}${phone.localPhone}`)
}
```

It looks right, but `phone.localPhone` in that function is the value from the current render. `handleInput` updates state, and React applies that on the next render. So your form data is always one keystroke behind. It also misses country changes entirely, and if `callingCode` is `null` you'll send the text `null` in front of the digits.

Two ways out:

- **Derive, don't copy.** Compute the full number during render, as `fullPhone` does above, and use it at submit time.
- **Use the return value.** `handleInput` returns `true` if the new value is valid. That's the one piece of fresh information you can use inside the same handler, for example to clear an error as soon as the number becomes complete.

## Handling pasted international numbers

People copy phone numbers from contacts, emails and signatures, and those usually include the country code: `+91 98765 43210`. The hook strips the non-digits, which leaves `919876543210`. The `91` now counts toward the country's max length, so the number gets cut short and the last digits are lost.

Since `handleInput` accepts a plain string, you can catch the paste and remove a matching calling code first:

```tsx
function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
  const pasted = e.clipboardData.getData('text').trim()

  if (phone.callingCode && pasted.startsWith(phone.callingCode)) {
    e.preventDefault()
    phone.handleInput(pasted.slice(phone.callingCode.length))
  }
}
```

Add `onPaste={handlePaste}` to the input in `PhoneField`. If the pasted number starts with a different country's code, it falls through to the normal handler, and the length error tells the user something is off. Switching the country automatically from a pasted prefix is possible, but calling codes like `+1` are shared by several countries, so I'd rather let the user pick.

The same string form is useful elsewhere. `phone.handleInput('')` clears the field, for example after a successful submit on a form that stays on the page.

## Pre-filling an existing number

For an edit screen, pass the stored country and local digits:

```tsx
const phone = usePhoneNumber({
  countryCode: user.phone_country,
  phone: user.phone_local,
})
```

The `phone` value goes through the same normalization and truncation as typed input. Storing the ISO country next to the number makes this easy. If you only store the international string, you'll need to split it back apart, which I cover in the [E.164 phone format guide](./phone-number-formats-e164-web-forms.md).

## When you don't need this hook

- **One country only.** A `type="tel"` input with a fixed prefix and a length check is simpler.
- **You want a finished widget with flags and search.** The hook renders nothing. A ready-made component will be quicker if you don't have your own select and input components.
- **You need to know the number exists.** `isValid` is a length check for the selected country. Ownership takes an SMS or call verification step.

## Where to go next

The field above is deliberately unstyled. The [Tailwind phone input tutorial](./react-phone-input-tailwind.md) turns it into a polished input group with focus rings, error states and dark mode. If your country list lives in your backend, the [custom data page](https://erag.in/phone-number-react/custom-data.html) shows how to pass your own countries and lengths into the hook.
