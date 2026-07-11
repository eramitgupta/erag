---
title: Introduction
description: What @erag/phone-number-react does, when to use it, and how it fits into React projects.
head:
  - - meta
    - name: keywords
      content: phone number react introduction, usePhoneNumber react overview, country phone input React, headless phone hook
---

# Introduction

`@erag/phone-number-react` is a headless React hook that handles the full state management for a country-aware phone number input field.

It is designed for projects that already have their own UI components and just need the logic layer — no stylesheet, no component markup, no masking dependency.

## What the hook does

- Tracks which country is selected, defaulting to India (`IN`)
- Strips non-numeric characters from input as the user types
- Truncates the phone number to the selected country's max length automatically
- Returns the calling code for the selected country (for example `+91`)
- Returns a mask pattern string (for example `XXXXX XXXXX`) without a masking library
- Validates the current phone length against the selected country's allowed lengths
- Provides a complete list of countries for use in a `<select>` or custom dropdown

## When to use it

Use `@erag/phone-number-react` when you:

- Already have a design system or UI components and want phone logic that fits inside them
- Need country-aware input without installing a heavy phone masking library
- Want validation tied to the selected country's actual phone lengths
- Work in a TypeScript project and want full type safety for phone state

## When not to use it

This package is a logic-only hook. It does not render any UI. If you need a fully styled, pre-built phone input component with flags and dropdowns, you may need a different package.

## How it fits into a React project

The hook is called inside a function component:

```tsx
import { usePhoneNumber } from '@erag/phone-number-react'

export function PhoneField() {
  const phone = usePhoneNumber()
  // phone.selectedCountry, phone.countryOptions, phone.localPhone, etc.
}
```

From there you wire the returned values into your own JSX — a native `<select>`, a custom dropdown, or any component that accepts an `onChange` handler.

## Package details

| Property        | Value                                          |
| --------------- | ---------------------------------------------- |
| Package name    | `@erag/phone-number-react`                     |
| Version         | `1.0.2`                                        |
| Framework       | React `^18.0.0 \|\| ^19.0.0` (peer dependency)|
| Language        | TypeScript                                     |
| Module format   | ESM                                            |
| License         | MIT                                            |
| Repository      | [github.com/eramitgupta/phone-number-react](https://github.com/eramitgupta/phone-number-react) |
