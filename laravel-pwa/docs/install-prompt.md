---
title: "Install Prompt & Offline Support"
description: "Customize Add to Home Screen install prompts, iOS Safari banner overlays, offline fallback pages, and service worker caching in Laravel."
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

# Install Prompt & Offline Support

`erag/laravel-pwa` provides built-in, out-of-the-box templates and scripts for handling application installation prompts and offline fallbacks.

---

## Add to Home Screen (Install Prompt)

When `'install-button' => true` is enabled in `config/pwa.php`, the package registers client-side logic to prompt visitors to install the application.

### Native Android & Desktop browsers
1. On load, the service worker checks if the application is running standalone.
2. If the browser fires the `beforeinstallprompt` event, the package intercepts it, prevents default browser popups, and displays a custom floating button (`#install-button`) in the bottom-right corner.
3. Clicking this button triggers the browser's native install dialog.

### iOS Safari (iPhone & iPad)
iOS Safari does not support the native `beforeinstallprompt` event. To handle this, the package includes user-agent checks:
1. It detects if the visitor is using Safari on an iOS device.
2. If they are running in the browser (not standalone), it displays a custom helper tooltip instructions panel (`.ios-tip`) guiding them to tap the **Share** button and choose **Add to Home Screen**.

---


### Injected Styles
The prompt is styled as a modern floating circle button in the bottom-right:

```css
.box-icon {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 2147483647;
    max-width: min(320px, calc(100vw - 32px));
}
.box-icon .circle {
    cursor: pointer;
    width: 60px;
    height: 60px;
    background-color: transparent;
    border: 0;
    border-radius: 100%;
}
```

---

## Offline Fallback Page

A core feature of the PWA service worker is offline support. 

- **Automatic caching**: The service worker automatically caches static layout headers, stylesheet elements, and javascript files on the initial load.
- **Offline Mode**: If the user loses internet connection and navigates to a route that hasn't been cached yet, the service worker intercepts the network failure and redirects the display to a clean offline fallback layout.

![Offline page fallback](https://github.com/user-attachments/assets/1a80465e-0307-43ac-a1bc-9bca2cf16f8d)
