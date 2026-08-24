---
title: Installation
description: Install @erag/phone-number-react using npm, yarn, or pnpm. Supports React 18 and React 19.
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

`@erag/phone-number-react` has a single peer dependency — React 18 or 19. No masking library, no extra runtime dependencies.

## Install the package

::: code-group

```bash [npm]
npm install @erag/phone-number-react
```

```bash [yarn]
yarn add @erag/phone-number-react
```

```bash [pnpm]
pnpm add @erag/phone-number-react
```

:::

## Requirements

| Requirement | Version |
| ----------- | ------- |
| React | `^18.0.0 \|\| ^19.0.0` |
| Node.js | `>=22` |
| TypeScript | `^5.0` (optional but recommended) |

## Verify the install

After installing, import the hook to confirm the package resolves correctly:

```ts
import { usePhoneNumber } from '@erag/phone-number-react'
```

If TypeScript resolves the types without errors, the install is complete.

## What is included

The package ships with:

- `usePhoneNumber` — the main hook
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
} from '@erag/phone-number-react'
```
