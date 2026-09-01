---
title: "Basic Form Validation"
description: "Add disposable email validation rules to Laravel forms, controllers, and Livewire components with customizable error messages."
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

# Basic Validation

Use the package rule with Laravel's normal request validation:

```php
$request->validate([
    'email' => ['required', 'email', 'disposable_email'],
]);
```

The string form works too:

```php
'email' => 'required|email|disposable_email',
```

`disposable_email` checks the domain against built-in and custom lists. Keep Laravel's `email` rule when you also want normal format validation, or use the package's [RFC / DNS modes](../advanced/rfc-dns.html).

## Related

- [Form Requests](./form-request.html)
- [Rule object](./rule-object.html)
- [Manual and API validation](./manual-api.html)
