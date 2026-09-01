---
title: "Installation & Setup"
description: "Install @erag/phone-number-vue using npm, yarn, or pnpm. Lightweight, zero dependencies, and built specifically for Vue 3 Composition API."
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

# Installation

`@erag/phone-number-vue` has a single peer dependency — Vue 3. No masking library, no extra runtime dependencies.

## Install the package

::: code-group

```bash [npm]
npm install @erag/phone-number-vue
```

```bash [yarn]
yarn add @erag/phone-number-vue
```

```bash [pnpm]
pnpm add @erag/phone-number-vue
```

:::

## Requirements

| Requirement | Version  |
| ----------- | -------- |
| Vue          | `^3.0.0` |
| Node.js      | `>=16`   |
| TypeScript   | `^5.0` (optional but recommended) |

## Verify the install

After installing, import the composable to confirm the package resolves correctly:

```ts
import { usePhoneNumber } from '@erag/phone-number-vue'
```

If TypeScript resolves the types without errors, the install is complete.

## What is included

The package ships with:

- `usePhoneNumber` — the main composable
- `countries` — bundled country metadata array
- `dialCodes` — bundled dial-code metadata array
- `phoneNumberData` — combined default data object
- Full TypeScript types for all exports

```ts
import {
  usePhoneNumber,
  countries,
  dialCodes,
  phoneNumberData,
} from '@erag/phone-number-vue'
```
