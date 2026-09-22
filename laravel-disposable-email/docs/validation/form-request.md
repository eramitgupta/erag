---
title: "Form Request Validation"
description: "Implement disposable email verification inside Laravel Form Request classes with custom validation messages and authorization rules."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-disposable-email/docs/validation/form-request.md
</div>


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

For stricter format or DNS checks, see [RFC / DNS Validation](../advanced/rfc-dns.html).
