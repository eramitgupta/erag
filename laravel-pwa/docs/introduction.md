---
title: Introduction
description: Learn how Erag Laravel PWA integrates progressive web app capabilities, manifest files, and service workers into your Laravel projects.
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

# Introduction

`erag/laravel-pwa` is a Laravel package designed to seamlessly integrate Progressive Web Application (PWA) features into any Laravel project.

With this package, you don't need to manually configure manifest JSON schemas, write raw service worker service registrations, or coordinate the install button flows. The package provides a robust setup right from your Laravel configuration files.

## What is a PWA?

A Progressive Web App (PWA) is a website that looks and behaves as if it is a native mobile app. PWAs are fast, reliable, and installable on both mobile devices and desktop computers. They run inside secure context boundaries (HTTPS) and use a background service worker to manage routing, offline capabilities, and asset loading.

## Core Features

- **PWA Manifest Auto-generation**: Compiles a standards-compliant web manifest file using settings defined in `config/pwa.php`.
- **Easy Service Worker Registration**: Registers service workers automatically using a simple Blade template directive.
- **Dynamic Configuration Updates**: Modify branding name, shortcuts, icons, and theme colors on the fly using the `PWA` Facade API.
- **Built-in Logo Processor**: Controller-ready helper functions to upload, check, and compile PNG logos.
- **Install Flow Management**: Add "Add to Home Screen" prompt banners seamlessly.
- **Ecosystem Compatibility**: Works with standard Blade views, Livewire apps, Inertia Vue, or React frontends.

---

## Secure Connection Warning ⚠️

> [!WARNING]
> Progressive Web Apps **require a secure HTTPS connection** to operate. If your local dev environment or production site runs on plain HTTP, the service worker will not register, and PWA prompts will not show up.

---

## Screenshots & Interface Previews 📸

### PWA Configuration Dashboard
Shows how easily you can customize configurations, manifest properties, and icon lists dynamically from your admin dashboards:

![PWA settings dashboard](https://github.com/user-attachments/assets/27c08862-0557-4fbd-bd8f-90b9d05f67b3)

### Custom Offline Page
When users lose internet access, they receive a styled offline fallback screen automatically instead of a browser connection error:

![Offline page fallback](https://github.com/user-attachments/assets/1a80465e-0307-43ac-a1bc-9bca2cf16f8d)
