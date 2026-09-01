---
title: "Subdomain Blocking"
description: "Configure recursive subdomain matching in Laravel Disposable Email to automatically block disposable subdomains from flagged parent domains."
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

# Subdomain Blocking

Subdomain blocking is enabled by default:

```php
'block_subdomains' => true,
```

When `tempmail.com` is blocked, `mail.tempmail.com` is also blocked. Set the option to `false` when only exact domain matches should fail.

The same matching behavior applies to whitelist entries.
