---
title: Subdomain Blocking
description: Control whether blocked parent domains also block subdomains.
head:
    - - meta
      - name: keywords
        content: 'block disposable email subdomains, Laravel disposable domain subdomain rules, parent domain blacklist'
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
