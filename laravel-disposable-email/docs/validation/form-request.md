---
title: Form Request Validation
description: Use disposable email validation in a Laravel Form Request.
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

# Form Request Validation

Keep registration validation in a Form Request:

```php
public function rules(): array
{
    return [
        'name' => ['required', 'string', 'max:255'],
        'email' => ['required', 'email', 'disposable_email'],
        'password' => ['required', 'confirmed', 'min:8'],
    ];
}
```

Laravel will return the normal validation response when the address belongs to a blocked domain.

For stricter format or DNS checks, see [RFC / DNS Validation](../advanced/rfc-dns.md).
