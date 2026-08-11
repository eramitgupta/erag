---
title: Laravel Disposable Email Validation and Runtime Checks
description: Add disposable email validation to Laravel requests, then use runtime checks, facade methods, API results, and Blade feedback in your app.
head:
  - - meta
    - name: keywords
      content: Laravel disposable email validation rule, runtime disposable email check, Laravel email blacklist validation, disposable email facade
---

# Validation and Runtime

Use the package at the right layer for your application:

- [Validation](./validation-and-runtime.html) for request, Form Request, controller, and API input validation.
- [Configuration](./configuration.html) for blacklist, whitelist, remote source, and validation settings.
- [Runtime checks](./validation-and-runtime.html) for boolean checks, detailed results, facades, and service classes.
- [Sync and blacklist](./sync-and-blacklist.html) for domain updates and custom blacklist files.

For most forms, start with:

```php
$request->validate([
    'email' => ['required', 'email', 'disposable_email'],
]);
```

The package can then be reused in services, APIs, and templates without duplicating disposable-domain logic.
