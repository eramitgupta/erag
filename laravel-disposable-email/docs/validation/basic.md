---
title: Basic Validation
description: Reject disposable email addresses with Laravel validation.
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

`disposable_email` checks the domain against built-in and custom lists. Keep Laravel's `email` rule when you also want normal format validation, or use the package's [RFC / DNS modes](../advanced/rfc-dns.md).

## Related

- [Form Requests](./form-request.md)
- [Rule object](./rule-object.md)
- [Manual and API validation](./manual-api.md)
