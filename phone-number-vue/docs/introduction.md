---
title: Introduction
description: What @erag/phone-number-vue does, when to use it, and how it fits into Vue 3 projects.
head:
  - - meta
    - name: keywords
      content: phone number vue introduction, usePhoneNumber overview, country phone input Vue 3, headless phone composable
---

# Introduction

`@erag/phone-number-vue` is a headless Vue 3 composable that handles the full state management for a country-aware phone number input field.

It is designed for projects that already have their own UI components and just need the logic layer — no stylesheet, no component markup, no masking dependency.

## What the composable does

- Tracks which country is selected, defaulting to India (`IN`)
- Strips non-numeric characters from input as the user types
- Truncates the phone number to the selected country's max length automatically
- Returns the calling code for the selected country (for example `+91`)
- Returns a mask pattern string (for example `XXXXX XXXXX`) without a masking library
- Validates the current phone length against the selected country's allowed lengths
- Provides a complete list of countries for use in a `<select>` or custom dropdown

## When to use it

Use `@erag/phone-number-vue` when you:

- Already have a design system or UI components and want phone logic that fits inside them
- Need country-aware input without installing a heavy phone masking library
- Want validation tied to the selected country's actual phone lengths
- Work in a TypeScript project and want full type safety for phone state

## When not to use it

This package is a logic-only composable. It does not render any UI. If you need a fully styled, pre-built phone input component with flags and dropdowns, you may need a different package.

## How it fits into a Vue project

The composable plugs into a standard Vue `<script setup>` component:

```vue
<script setup lang="ts">
import { usePhoneNumber } from '@erag/phone-number-vue'

const { selectedCountry, countryOptions, localPhone, callingCode, mask, isValid, handleInput } =
    usePhoneNumber()
</script>
```

From there you wire the returned values into your own template — a native `<select>`, a custom dropdown, or any component that accepts a `v-model` or event handler.

The composable is reactive. When the selected country changes, the calling code, mask, phone lengths, and validation all update automatically.

## Package details

| Property        | Value                                        |
| --------------- | -------------------------------------------- |
| Package name    | `@erag/phone-number-vue`                     |
| Version         | `1.0.2`                                      |
| Framework       | Vue 3 (`^3.0.0` peer dependency)             |
| Language        | TypeScript                                   |
| Module format   | ESM                                          |
| License         | MIT                                          |
| Repository      | [github.com/eramitgupta/phone-number-vue](https://github.com/eramitgupta/phone-number-vue) |
