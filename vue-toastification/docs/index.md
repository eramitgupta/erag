---
layout: home
title: Vue Toastification Docs
titleTemplate: false
description: Lightweight, high-performance Toast Notifications and Promise-based Confirmation Modals for Vue 3 with Composition API.
hero:
  name: '@erag/vue-toastification'
  text: 'Lightweight Toast & Modal Library for Vue 3'
  tagline: 'Trigger clean, non-blocking toast notifications and await confirmation dialog decisions natively with a clean promise-based API.'
  image:
    src: /vue-toastification.svg?v=1
    alt: Vue Toastification Logo
  actions:
    - theme: brand
      text: Get Started
      link: /installation.html
    - theme: alt
      text: View Playground
      link: /playground.html

features:
  - icon: '✦'
    title: 'Vue 3 Composition API'
    details: 'Trigger toasts and confirm dialogs smoothly using clean useToast() and useModal() reactive composable hooks.'
  - icon: '↹'
    title: 'Promise-based Modals'
    details: 'Await modal confirmation decisions directly in async functions using simple promise returns without messy callbacks.'
  - icon: '≈'
    title: 'Smooth Animations'
    details: 'Delight users with Apple-style smooth slide-ins, fade-outs, and height-filling transitions on lists.'
  - icon: '⌗'
    title: 'Scoped CSS isolation'
    details: 'All library layout classes are prefixed with erag- to prevent styling conflicts with Tailwind, Bootstrap, etc.'
  - icon: '⌥'
    title: 'Customizable settings'
    details: 'Easily adjust positions, timeouts, confirm/cancel labels, titles, and dynamic themes globally or per call.'
  - icon: '✓'
    title: 'Zero dependencies'
    details: 'Maintains an extremely small package size and relies strictly on native Vue 3 rendering trees.'
  - icon: '☼'
    title: 'Dynamic SVG Icons'
    details: 'Auto-resolves and injects optimized type-matched vector icons for success, warning, error, and info states.'
  - icon: '⛨'
    title: 'Responsive Blur Overlays'
    details: 'Glassmorphic modal backdrops using CSS filter blurs that adapt cleanly from desktop to mobile screens.'
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

<div class="home-container">

## Quick Showcase & Code Examples

Get up and running with `@erag/vue-toastification` in seconds. Check out the core code structures below to see how to initialize, notify, and await modal decisions.

::: code-group
```typescript [1. Global Registration]
import ToastPlugin from '@erag/vue-toastification'
import '@erag/vue-toastification/dist/style.css'

app.use(ToastPlugin, {
  position: 'bottom-right'
})
```

```typescript [2. Triggering Toasts]
import { useToast } from '@erag/vue-toastification'

const { success, error } = useToast()

success('Changes saved!', 'Success')
error('Something went wrong.', 'Error')
```

```typescript [3. Awaiting Modals]
import { useModal } from '@erag/vue-toastification'

const modal = useModal()

const confirmed = await modal.confirm({
  title: 'Delete Resource?',
  message: 'This is permanent.',
  type: 'danger'
})
```
:::

## Frequently Asked Questions

::: details Why use this package over standard vue-toastification libraries?
Unlike other heavy notification libraries, `@erag/vue-toastification` combines both non-blocking toasts and interactive promise-based modal dialogs in a single lightweight package with zero external dependencies and complete typescript integration.
:::

::: details How does the Promise-based modal system function?
When you trigger `modal.confirm()`, the library mounts a confirmation overlay and returns a native JS Promise. Clicking 'Confirm' resolves the promise to `true`, and clicking 'Cancel' resolves it to `false`. This allows you to write clean, linear async/await logic directly in your script setup.
:::

::: details Are layout positions fully configurable?
Yes. You can specify a default global position (e.g. `bottom-right`, `top-center`) during plugin setup, and dynamically override it on individual triggers whenever you need specific alerts positioned differently.
:::

::: details How is style contamination prevented?
All CSS layout selectors used by the package are strictly prefixed with `erag-`. This guarantees that importing the stylesheet won't override or affect standard styling variables in Tailwind, Bootstrap, or custom stylesheets.
:::

</div>
