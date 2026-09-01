---
title: "Domain Whitelisting"
description: "Safelist trusted domains like Gmail, Outlook, and corporate emails so they are never falsely rejected by disposable validation filters."
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
