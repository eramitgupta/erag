---
title: Whitelist
description: Allow trusted domains even when they appear in a disposable list.
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

# Whitelist

Add trusted domains to `config/disposable-email.php`:

```php
'whitelist' => [
    'trusted-test-domain.com',
],
```

Whitelist matches take precedence over built-in and custom disposable lists. They do not bypass explicitly requested RFC, filter, spoof, or DNS validation.
