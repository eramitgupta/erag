---
title: Whitelist
description: Allow trusted domains even when they appear in a disposable list.
---

# Whitelist

Add trusted domains to `config/disposable-email.php`:

```php
'whitelist' => [
    'trusted-test-domain.com',
],
```

Whitelist matches take precedence over built-in and custom disposable lists. They do not bypass explicitly requested RFC, filter, spoof, or DNS validation.
