---
title: "Domain List Statistics"
description: "Inspect loaded disposable email domains, active remote blacklist sources, cache status, and package metrics using built-in Laravel tools."
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

# Package Stats

Run:

```bash
php artisan disposable:stats
```

The table reports built-in, custom, total, and whitelist domain counts, remote source count, cache settings, subdomain behavior, and the latest blacklist file timestamp.
