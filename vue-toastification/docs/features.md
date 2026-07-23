---
title: Package Features
description: 'Detailed walkthrough of key features included in @erag/vue-toastification.'
head:
    - - meta
      - name: keywords
        content: 'vue-toastification, Package Features, Vue, documentation, API'
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

# Package Features

Detailed walkthrough of key features included in `@erag/vue-toastification`.

## Core Features

- **Vue 3 Composition API**: Simple, clean hooks (`useToast`, `useModal`) for trigger rendering inside script setup tags.
- **Promise-based confirmations**: Linear async/await logic pauses execution natively instead of callback chaining.
- **Apple-style animations**: Smooth CSS-based keyframes transition popups, slide-ins, and gap-filling changes dynamically.
- **TypeScript First-class**: Complete autocomplete support for positions, durations, modal configurations, and type checks.
- **Zero third-party dependencies**: Lightweight, high-performance module layout optimized for production bundles.
- **Scoped CSS prefixes**: Scoped using `erag-` class namespaces to prevent framework interference.

---

## Toast Specifics

- **Dynamic Icon Resolving**: Toasts automatically resolve and inject optimized vector SVG icons matching their type (success, error, warning, info).
- **Single-Line Auto-Formatting**: If a toast has only a message without a header, the CSS classes auto-adjust dynamically to optimize font alignment and vertical padding.
- **Auto-Dismiss Timers**: Built-in setTimeout timers control alert durations, automatically performing DOM cleanup on unmount to prevent resource leaks.

---

## Modal Specifics

- **Glassmorphic Backdrops**: Confirmation modal overlays employ a CSS `backdrop-filter: blur(2px)` overlay to blur the viewport layout.
- **Type Variant Classing**: Generates button styles dynamically (`erag-btn-danger`, `erag-btn-warning`, etc.) mapping to appropriate color accents based on action risk level.
- **Responsive Sizing Bounds**: The modal wrapper scales dynamically down on mobile devices (`width: 90%`), with a clean maximum bound (`max-width: 450px`) on desktop.