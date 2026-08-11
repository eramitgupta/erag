---
title: Setup and Blade Help
description: Troubleshoot package registration and Blade checks.
head:
    - - meta
      - name: keywords
        content: 'Laravel disposable email Blade directive, disposable email service provider, Blade email validation'
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

# Setup and Blade Help

Run the installer before editing package configuration:

```bash
php artisan erag:install-disposable-email
```

If discovery is disabled, register `EragLaravelDisposableEmail\LaravelDisposableEmailServiceProvider` in your Laravel provider configuration.

For Blade, pass a non-empty full email to `@disposableEmail`. The conditional checks disposable status only; request validation remains responsible for accepting or rejecting submitted input.
