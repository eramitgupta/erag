---
title: Caching
description: Cache compiled disposable domain lists for repeated lookups.
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
