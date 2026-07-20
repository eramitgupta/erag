---
title: Subdomain Blocking
description: Control whether blocked parent domains also block subdomains.
---

# Subdomain Blocking

Subdomain blocking is enabled by default:

```php
'block_subdomains' => true,
```

When `tempmail.com` is blocked, `mail.tempmail.com` is also blocked. Set the option to `false` when only exact domain matches should fail.

The same matching behavior applies to whitelist entries.
