---
title: Framework Integrations
description: Integration details for Laravel PWA with Livewire, Inertia.js, Vue 3, and React.
head:
    - - meta
      - name: keywords
        content: 'Laravel PWA Livewire, Inertia Vue React PWA Laravel, framework integration'
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

# Framework Integrations

`erag/laravel-pwa` is compatible with multiple modern frontend frameworks in the Laravel ecosystem.

---

## Livewire Integration

When building SPAs with Livewire (using `wire:navigate`), scripts in layouts can be executed multiple times or lose state during page transitions.

To prevent service worker registration scripts from firing repeatedly, configure the following setting in `config/pwa.php`:

```php
'livewire-app' => true,
```

### What this does
This appends the `data-navigate-once` attribute to the service worker registration scripts when `@RegisterServiceWorkerScript` is compiled:

```html
<script data-navigate-once>
    // service worker registration logic here
</script>
```

This guarantees Livewire only executes the script once on the initial page load, preventing worker registration duplication.

---

## Inertia.js (Vue & React)

When using Inertia.js, the page does not reload fully on navigating. The main layout (e.g. `app.blade.php`) remains mounted, which makes PWA integration clean.

### Steps
1. Place `@PwaHead` inside the `<head>` tag of your `app.blade.php`:
   ```html
   <head>
       @PwaHead
       @viteReactRefresh
       @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
   </head>
   ```
2. Place `@RegisterServiceWorkerScript` inside the `<body>` element of your `app.blade.php`:
   ```html
   <body class="font-sans antialiased">
       @inertia
       @RegisterServiceWorkerScript
   </body>
   ```

Because Inertia operates as a Single Page App, the service worker registers successfully on mount and stays active as users navigate between pages.
