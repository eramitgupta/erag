---
title: Validation and Runtime
description: Choose between request validation, runtime checks, API checks, and Blade feedback in Laravel Disposable Email.
head:
  - - meta
    - name: keywords
      content: laravel disposable email validation, laravel runtime email check, laravel disposable email rule
---

# Validation and Runtime

Use the package at the right layer for your application:

- [Validation](./validation.html) for request, Form Request, controller, and API input validation.
- [Email Validation Advanced Check](./email-validation-advanced-check.html) for Laravel's RFC, DNS, spoof, and filter styles.
- [Runtime Checks](./runtime-checks.html) for boolean checks, detailed results, facades, and service classes.
- [API and Blade](./api-and-blade.html) for live API endpoints and Blade UI feedback.

For most forms, start with:

```php
$request->validate([
    'email' => ['required', 'email', 'disposable_email'],
]);
```

The package can then be reused in services, APIs, and templates without duplicating disposable-domain logic.
