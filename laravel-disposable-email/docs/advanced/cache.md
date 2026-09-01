---
title: "Cache Configuration"
description: "Configure high-performance cache drivers to cache compiled disposable domain blacklists and speed up repeated validation lookups in Laravel."
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

# Caching

Enable caching in `config/disposable-email.php`:

```php
'cache_enabled' => true,
'cache_ttl' => 60,
```

`cache_ttl` is measured in seconds. The package caches compiled providers and source metadata.

After manual blacklist or config changes, clear Laravel's cache:

```bash
php artisan cache:clear
```

Install and sync commands clear package cache keys automatically.
