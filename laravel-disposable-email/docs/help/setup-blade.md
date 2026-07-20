---
title: Setup and Blade Help
description: Troubleshoot package registration and Blade checks.
---

# Setup and Blade Help

Run the installer before editing package configuration:

```bash
php artisan erag:install-disposable-email
```

If discovery is disabled, register `EragLaravelDisposableEmail\LaravelDisposableEmailServiceProvider` in your Laravel provider configuration.

For Blade, pass a non-empty full email to `@disposableEmail`. The conditional checks disposable status only; request validation remains responsible for accepting or rejecting submitted input.
