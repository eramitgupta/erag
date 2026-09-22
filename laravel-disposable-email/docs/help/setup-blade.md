---
title: "Setup & Blade Help"
description: "Troubleshoot package installation, service provider discovery, and @disposable Blade conditional directives in your Laravel templates."
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
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-disposable-email/docs/help/setup-blade.md
</div>


# Setup and Blade Help

Run the installer before editing package configuration:

```bash
php artisan erag:install-disposable-email
```

If discovery is disabled, register `EragLaravelDisposableEmail\LaravelDisposableEmailServiceProvider` in your Laravel provider configuration.

For Blade, pass a non-empty full email to `@disposableEmail`. The conditional checks disposable status only; request validation remains responsible for accepting or rejecting submitted input.
