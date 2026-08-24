---
title: RFC / DNS Validation
description: Add RFC, strict, DNS, spoof, and filter checks to disposable email validation.
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

# RFC / DNS Validation

Pass one or more modes after `disposable_email`:

```php
'email' => ['required', 'disposable_email:rfc'];
'email' => ['required', 'disposable_email:dns'];
'email' => ['required', 'disposable_email:rfc,dns'];
```

Available modes:

| Mode | Check |
| --- | --- |
| `rfc` | Validate against supported email RFCs |
| `strict` | Fail on RFC warnings |
| `dns` | Require a valid MX record |
| `spoof` | Reject deceptive Unicode addresses |
| `filter` | Use PHP `filter_var` validation |
| `filter_unicode` | Use Unicode-aware `filter_var` validation |

Any supported modes may be comma-separated:

```php
'email' => ['required', 'disposable_email:rfc,dns,spoof'];
```

Rule helpers accept the same modes:

```php
use Disposable;

'email' => ['required', Disposable::rule('rfc', 'dns')];
```

Plain `disposable_email` keeps the original domain-only behavior. DNS checks are opt-in because they perform DNS lookups. Laravel's `dns` and `spoof` validators require PHP's `intl` extension.

Whitelist entries only bypass disposable-domain blocking; they do not bypass these format or DNS checks.
