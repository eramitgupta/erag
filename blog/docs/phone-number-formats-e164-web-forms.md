---
title: "Phone Number Formats for Web Forms: E.164 Guide"
headline: "E.164 Phone Number Format: How to Store and Display Phone Numbers"
description: Learn the E.164 phone number format, how it differs from national display, and how to store and show phone numbers from web forms, with a React example.
date: 2026-09-29
package: phone-number-react
category: Guide
tags: [react, phone-input, e164, forms, laravel]
---

Open the `users` table of almost any app that has been running for a while and look at the phone column. You'll find `9876543210`, `+91 98765 43210`, `(555) 123-4567`, `0044 7700 900123` and at least one entry that says `n/a`. Every one of those was typed into the same field.

The fix isn't a smarter regex. It's deciding on one format for storage, a different one for display, and making the form produce the storage format. The E.164 phone number format is the standard answer for storage, and this guide explains what it is, where people go wrong, and how to produce it from a React form.

## What is the E.164 phone number format?

E.164 is the ITU-T recommendation that defines international telephone numbers. In practice, "E.164 format" means:

- A leading `+`
- The country calling code (1 to 3 digits, for example `1`, `44`, `91`)
- The national significant number, without any trunk prefix
- No spaces, dashes, dots or brackets
- At most 15 digits in total, not counting the `+`

So an Indian mobile number is `+919876543210`, and a US number is `+15551234567`.

It's not pretty, and it's not meant to be. It's meant to be unambiguous. Any system in the world can dial it, compare it, or pass it to an SMS provider without guessing which country it belongs to.

## National vs international format

The same number has several correct written forms. Take a UK mobile number:

| Form | Example | Used for |
| --- | --- | --- |
| National | `07700 900123` | Showing to people in the same country |
| International | `+44 7700 900123` | Showing to people anywhere |
| E.164 | `+447700900123` | Storage, APIs, `tel:` links |

Look at the leading `0` in the national form. That's a trunk prefix, used when dialling inside the country. It disappears in the international form. Many countries work this way, and it's the single most common source of broken phone data: someone types their national number with its `0` into a field that then prepends the country code, and you store `+4407700900123`.

Formatting conventions also differ by country. Some group digits in pairs, some in threes and fours, some use brackets around area codes. There's no universal "pretty" format, which is another reason not to store one.

## Store E.164, display whatever fits

My rule of thumb:

- **Store** the E.164 string. One column, one format, easy to index and compare.
- **Also store** the ISO country code (`IN`, `US`, `GB`) in its own column.
- **Display** a formatted version generated at render time, never saved.

Why the separate country column? Calling codes are shared. `+1` covers the US, Canada and several other countries. `+7` covers more than one country too. From the E.164 string alone you can't always tell which country the user picked, and you need that to pre-fill a country dropdown on an edit screen.

In Laravel, that's two columns:

```php
Schema::table('users', function (Blueprint $table) {
    $table->string('phone', 16)->nullable();
    $table->string('phone_country', 2)->nullable();
});
```

Sixteen characters is enough for the `+` and 15 digits. Extensions aren't part of E.164, so if you need them, give them their own column.

On the validation side, a regex can enforce the shape:

```php
'phone' => ['nullable', 'string', 'regex:/^\+[1-9]\d{6,14}$/'],
'phone_country' => ['required_with:phone', 'string', 'size:2'],
```

That rejects spaces, missing plus signs and anything over 15 digits. It doesn't check that the length suits the country; for that you need per-country rules, which the frontend already has.

## Producing E.164 from a React form

Here's where `@erag/phone-number-react` comes in. It's a headless hook, so it's worth being precise about what it gives you. According to the [API reference](https://erag.in/phone-number-react/api.html), `usePhoneNumber` returns:

- `callingCode`: the selected country's code with a plus, for example `+91`, or `null` if there's no match
- `localPhone`: the digits the user typed, with every non-numeric character stripped and truncated to the country's max length
- `mask`: a pattern string such as `XXXXX XXXXX`
- `isValid`: whether the digit count matches one of the country's allowed lengths
- `selectedCountry`, `countryOptions` and `handleInput` for the UI

What it doesn't return is a ready-made E.164 string or a formatted display string. You build those from the pieces, which is a couple of lines each.

The E.164 value is the calling code followed by the local digits:

```tsx
// resources/js/components/ContactPhone.tsx
import { usePhoneNumber } from '@erag/phone-number-react'

export function ContactPhone() {
  const phone = usePhoneNumber({ countryCode: 'IN' })

  const e164 =
    phone.isValid && phone.callingCode ? `${phone.callingCode}${phone.localPhone}` : null

  function selectCountry(isoCode: string) {
    const country = phone.countryOptions.find((c) => (c.isoCode2 ?? c.key) === isoCode)

    if (country) {
      phone.handleInput(country)
    }
  }

  return (
    <div>
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

      <input
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        value={phone.localPhone}
        onChange={phone.handleInput}
        placeholder={phone.mask}
      />

      <input type="hidden" name="phone" value={e164 ?? ''} />
      <input type="hidden" name="phone_country" value={phone.selectedCountry?.isoCode2 ?? ''} />
    </div>
  )
}
```

I only build `e164` when `isValid` is true, so an incomplete number never looks like a finished one. The hidden inputs are one way to hand the values to a normal form post; with Inertia or `fetch` you'd send `e164` and the ISO code directly.

## The trunk prefix problem, in practice

Because the digits input sits next to a visible calling code, most people type the national number without the country code. Some will still type the leading `0` out of habit.

The hook strips non-digits and truncates to the country's max length. The docs don't describe any special handling for a leading `0`, so don't assume it's removed for you. Test the countries you care about with how your users actually type, and put the expectation in the hint text: "Enter your number without the leading 0." That one sentence prevents most bad entries.

## Formatting for display

When you show a stored number back to a user, `+919876543210` is hard to read. Grouping helps. The hook's `mask` tells you how the selected country groups its digits, so you can apply it yourself:

```ts
// resources/js/lib/applyPhoneMask.ts
export function applyPhoneMask(digits: string, mask: string): string {
  let output = ''
  let index = 0

  for (const char of mask) {
    if (index >= digits.length) {
      break
    }

    if (char === 'X') {
      output += digits[index]
      index++
    } else {
      output += char
    }
  }

  return output + digits.slice(index)
}
```

Then the international display is the calling code, a space, and the masked digits:

```tsx
const display = phone.callingCode
  ? `${phone.callingCode} ${applyPhoneMask(phone.localPhone, phone.mask)}`
  : phone.localPhone
```

For India that turns `9876543210` into `+91 98765 43210`. This helper is my code, not part of the package, and it assumes the mask uses `X` for digit slots, as the documented examples do. If a country allows more than one length, the mask may not fit every one, which is why the helper appends any leftover digits instead of dropping them.

For links, always use the E.164 value, not the display one:

```tsx
<a href={`tel:${e164}`}>{display}</a>
```

## HTML attributes that help

A few attributes make phone fields easier to fill in, and they cost nothing:

- `type="tel"` brings up a phone keypad on most mobile keyboards. Browsers don't validate its format, because phone formats vary so much. MDN's [tel input reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/tel) explains why.
- `inputmode="numeric"` asks for a digits-only keypad.
- `autocomplete="tel-national"` lets the browser autofill only the national part, which suits a field with a separate country selector. Plain `tel` fills the whole number. The [autocomplete reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) lists all the phone tokens.

## FAQ

### Should I store the plus sign?

Yes. `+919876543210` is E.164; `919876543210` is ambiguous and is often mistaken for a national number by other systems.

### Can I derive the country from an E.164 number?

Sometimes, but not reliably, because several countries share calling codes like `+1`. Store the ISO country separately.

### Does the hook format numbers as the user types?

No. `localPhone` is always plain digits. The `mask` is a pattern you can use as a placeholder or apply yourself for display.

### Is E.164 enough to know a number is valid?

It proves the shape, not that the number exists. Ownership needs SMS or call verification.

## Where to go next

Pick your storage format first, then build the input to produce it. If you're starting the React field from scratch, the [React phone number input tutorial](./react-phone-number-input-hook.md) walks through the hook step by step, and the [Tailwind phone input guide](./react-phone-input-tailwind.md) makes it look finished. The [custom data page](https://erag.in/phone-number-react/custom-data.html) covers limiting the country list to the markets you serve.
