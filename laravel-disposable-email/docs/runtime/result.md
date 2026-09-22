---
title: "Inspection & Result Object"
description: "Inspect detailed verification result objects containing matched domain names, source list metadata, DNS status, and whitelist flags."
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
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-disposable-email/docs/runtime/result.md
</div>


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
