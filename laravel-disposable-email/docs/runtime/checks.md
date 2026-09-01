---
title: "Runtime Email Checks"
description: "Perform real-time disposable email checks in Laravel controllers, jobs, and API endpoints using the Disposable facade or helper methods."
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

# Runtime Checks

Use the `Disposable` facade when you need a boolean outside request validation:

```php
use Disposable;

Disposable::email('test@tempmail.com'); // true
Disposable::domain('tempmail.com');     // true
Disposable::domain('test@tempmail.com');
```

These methods check disposable-domain status. They do not perform RFC or DNS requests.

The namespaced facade is also available:

```php
use EragLaravelDisposableEmail\Facades\Disposable;
```

For match details, use the [detailed result](./result.html).
