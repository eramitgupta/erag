---
title: Caching Support
description: Enable and configure caching for Laravel Disposable Email to improve performance in high-traffic applications.
keywords: Laravel Disposable Email, caching, email validation, Laravel performance
---

## 🧠 Caching Support

Laravel Disposable Email Detection supports optional caching to improve performance,
especially when working with large disposable email domain lists.

When caching is enabled, the compiled list of disposable domains is stored in cache,
reducing filesystem reads and speeding up validation and runtime checks.

---

### ⚙️ Enable Caching

To enable caching, update the configuration file `config/disposable-email.php`:

```php
'cache_enabled' => true,
'cache_ttl' => 60, // Cache duration in minutes
````

---

### 🔧 How Caching Works

* The disposable domain list is cached after the first load
* Subsequent checks read from cache instead of the filesystem
* Significantly improves performance for high-traffic applications

---

::: tip
Caching is recommended for **production environments** and applications with
frequent email validations such as public signups or APIs.
:::

---

### 🧹 Clear Cache

If you update disposable domain files manually or sync new domains,
clear the cache to apply the changes:

```bash
php artisan cache:clear
```

---

By enabling caching, you ensure faster email validation while maintaining
accurate and up-to-date disposable email detection.
