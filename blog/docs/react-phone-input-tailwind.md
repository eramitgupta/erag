---
title: Style a React Phone Input With Tailwind CSS
description: Style a React phone input with Tailwind CSS as one input group, with focus rings, error and disabled states, dark mode and a calling code prefix.
date: 2026-09-29
package: phone-number-react
category: Tutorial
tags: [react, tailwind, phone-input, forms, ui]
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/react-phone-input-tailwind.md
</div>

Most phone inputs look like two unrelated controls parked next to each other: a country dropdown with one border radius, a text box with another, and a focus ring that only lights up half the field. It works, but it looks unfinished.

A headless hook gives you the freedom to fix that properly. `usePhoneNumber` from `@erag/phone-number-react` handles the logic (country, digits, calling code, validation), so every class name is up to you. In this tutorial we'll build a React phone input with Tailwind CSS that reads as one control, with states for focus, errors, disabled and dark mode.

If you haven't installed the package yet, it's one command, and the [installation guide](https://erag.in/phone-number-react/installation.html) has the details:

```bash
npm install @erag/phone-number-react
```

## The design we're aiming for

One rounded box containing three parts:

1. A compact country select on the left, showing `IN +91` instead of a full country name
2. The calling code as muted text, so users don't type it again
3. The digits input, taking the remaining width

When anything inside the box has focus, the whole box gets a ring. When the number is incomplete, the border and ring turn red and a message appears below. That's the entire visual spec.

## A tiny class helper

Conditional classes get messy with template strings. Instead of adding a dependency, I use a four-line helper:

```ts
// resources/js/lib/cx.ts
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
```

If your project already has a class-joining utility, use that instead.

## How to style a React phone input with Tailwind

Here's the full component. We'll go through the interesting classes afterwards.

```tsx
// resources/js/components/PhoneInput.tsx
import { useState } from 'react'
import { usePhoneNumber } from '@erag/phone-number-react'
import { cx } from '@/lib/cx'

type PhoneInputProps = {
  id?: string
  label?: string
  defaultCountry?: string
  serverError?: string
  disabled?: boolean
}

export function PhoneInput({
  id = 'phone',
  label = 'Phone number',
  defaultCountry = 'IN',
  serverError,
  disabled = false,
}: PhoneInputProps) {
  const phone = usePhoneNumber({ countryCode: defaultCountry })
  const [touched, setTouched] = useState(false)

  const lengthError = touched && phone.localPhone.length > 0 && !phone.isValid
  const message = serverError ?? (lengthError ? `Enter a complete ${phone.selectedCountry?.name} number.` : undefined)
  const hasError = Boolean(message)

  function selectCountry(isoCode: string) {
    const country = phone.countryOptions.find((c) => (c.isoCode2 ?? c.key) === isoCode)

    if (country) {
      phone.handleInput(country)
    }
  }

  return (
    <div className="flex max-w-sm flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {label}
      </label>

      <div
        className={cx(
          'flex items-stretch overflow-hidden rounded-lg border bg-white transition',
          'focus-within:ring-4 dark:bg-gray-900',
          hasError
            ? 'border-red-500 focus-within:ring-red-500/20'
            : 'border-gray-300 focus-within:border-sky-500 focus-within:ring-sky-500/20 dark:border-gray-700',
          disabled && 'cursor-not-allowed opacity-60',
        )}
      >
        <label htmlFor={`${id}-country`} className="sr-only">
          Country
        </label>
        <select
          id={`${id}-country`}
          disabled={disabled}
          value={phone.selectedCountry?.isoCode2 ?? ''}
          onChange={(e) => selectCountry(e.target.value)}
          className="border-0 border-r border-gray-200 bg-gray-50 py-2 pl-3 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-0 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          {phone.countryOptions.map((c) => (
            <option key={c.key} value={c.isoCode2 ?? c.key}>
              {c.isoCode2} +{c.countryCodes?.[0]}
            </option>
          ))}
        </select>

        <span className="flex select-none items-center pl-3 text-sm tabular-nums text-gray-500 dark:text-gray-400">
          {phone.callingCode}
        </span>

        <input
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          disabled={disabled}
          value={phone.localPhone}
          onChange={phone.handleInput}
          onBlur={() => setTouched(true)}
          placeholder={phone.mask}
          aria-invalid={hasError}
          aria-describedby={`${id}-message`}
          className="min-w-0 flex-1 border-0 bg-transparent px-2 py-2 text-sm tabular-nums text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 dark:text-gray-100 dark:placeholder:text-gray-500"
        />
      </div>

      <p
        id={`${id}-message`}
        className={cx('min-h-5 text-xs', hasError ? 'text-red-600 dark:text-red-400' : 'text-gray-500')}
      >
        {message ?? `Digits only. We add ${phone.callingCode ?? 'the country code'} for you.`}
      </p>
    </div>
  )
}
```

## The classes that make it look like one control

### Borders live on the wrapper

The select and the input both have `border-0`. The border, radius and background sit on the wrapping `div`, and `overflow-hidden` clips the select's grey background to the rounded corner. That's what makes three elements read as one.

The only inner border is `border-r` on the select, a thin divider between country and number.

### `focus-within` instead of `focus`

A ring on the input alone would leave the select side unhighlighted. `focus-within:ring-4` on the wrapper lights up the whole group when either the select or the input has focus. The inner elements use `focus:outline-none focus:ring-0` so you don't get a second ring inside the first.

If you use the `@tailwindcss/forms` plugin, that `focus:ring-0` matters even more, because the plugin gives form controls their own focus ring by default.

### `tabular-nums` for digits

Proportional digits make a phone number shift slightly as it's typed, because `1` is narrower than `8`. `tabular-nums` gives every digit the same width. It's a small thing, but number fields feel steadier with it.

### `min-w-0` on the input

Flex children default to a minimum width based on their content. On narrow screens that can push the input out of the box. `min-w-0 flex-1` lets it shrink and fill whatever space is left.

### A message slot that doesn't jump

The paragraph under the field always renders, with `min-h-5`. It shows a hint normally and the error when there is one. Because the slot never appears or disappears, the layout below the field doesn't jump when validation kicks in. It's also what `aria-describedby` points at, so screen readers read the hint or the error with the field.

## Error states: client and server

The component handles two kinds of error.

**Length errors** come from the hook. `isValid` is `true` when the digit count matches one of the selected country's allowed lengths. I only show the error after the first blur (`touched`), so nobody sees red on their first keystroke.

**Server errors** come in through `serverError`. With Inertia, you'd pass `form.errors.phone`. A server message takes priority, since it's the final word on what was saved.

Both use the same red border, ring and message text. One visual language for "this field needs attention" is easier to learn than two.

## Should a valid number turn green?

It's tempting to add a green border once `phone.isValid` is true. I'd skip it. A phone field isn't a password strength meter, and a colour change on every completed field adds noise to a form without telling the user much.

If you do want some confirmation, keep it small. A check icon in the message slot, or swapping the hint text to "Looks good", is enough:

```tsx
{message ?? (phone.isValid ? 'Looks good.' : `Digits only. We add ${phone.callingCode ?? 'the country code'} for you.`)}
```

Leave the border neutral. Red should stay the one colour that means "look here".

## Dark mode

Every colour class has a `dark:` partner: the wrapper background, the select's grey panel, the divider, text and placeholder. The error red is slightly lighter in dark mode (`text-red-400`) because the darker red loses contrast on a near-black background.

Tailwind decides when `dark:` applies based on your config (the user's system setting by default, or a class/selector strategy if you've set one up). The component doesn't need to know which.

## About the placeholder

The hook's `mask` is a pattern like `XXXXX XXXXX` for India. As a placeholder, it tells people how many digits to expect and how they're grouped. If the X's feel too technical for your audience, change them before rendering:

```tsx
placeholder={phone.mask.replace(/X/g, '0')}
```

That gives `00000 00000`, which reads more like a number. Keep in mind the input itself stores digits only. The spaces in the mask are just a visual hint; `localPhone` never contains them.

## Using it in a form

The component above owns its phone state, which is fine for a standalone field. For a real form you'll want the parent to read `callingCode`, `localPhone` and `isValid` at submit time. The cleanest way is to call `usePhoneNumber` in the parent and pass the result into the styled component, as shown in the [React phone number input tutorial](./react-phone-number-input-hook.md). The markup and classes here don't change at all; only where the hook is called moves.

For another take on the same field, the [examples page](https://erag.in/phone-number-react/examples.html) has a shorter Tailwind version with a sky focus ring.

## When Tailwind styling isn't the right fit

- **You already have an input group component.** Use it. Pass the hook's values into your existing `InputGroup` or `TextField` and skip this markup entirely.
- **You need flags or country search.** A native `<select>` can't render images or a search box. You'd need a custom listbox component, which is a bigger job than styling.
- **You want digits grouped while typing.** The hook stores and returns plain digits. Inserting spaces as the user types means managing the cursor position yourself, and that's rarely worth it for a phone field.

## Where to go next

Drop the component into one form, check it in both light and dark mode, and try it at phone width. Then decide how you'll store the result. The [E.164 phone number format guide](./phone-number-formats-e164-web-forms.md) covers why a full international number plus an ISO country is the safest pair to keep.
