---
title: Detailed Result
description: Inspect matched domains, sources, and whitelist status.
---

# Detailed Result

`Disposable::check()` returns a result object instead of a boolean:

```php
use Disposable;

$result = Disposable::check('test@tempmail.com');

$result->disposable();
$result->domain();
$result->matchedDomain();
$result->source(); // built-in, custom, or whitelist
$result->whitelisted();
$result->toArray();
```

Use this API for logs, admin tools, API diagnostics, or source-aware decisions.
