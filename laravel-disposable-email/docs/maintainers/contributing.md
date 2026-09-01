---
title: "Maintainer Contribution Guide"
description: "Comprehensive development and testing guide for maintainers contributing code, domain feeds, and documentation to Laravel Disposable Email."
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

# Contributing

Keep changes focused, preserve public APIs, and add tests for behavior changes. Run the package formatter and test suite before opening a pull request:

```bash
vendor/bin/pint --dirty
composer test
```

User-facing changes must update the matching feature page and VitePress sidebar. Internal helpers live in `src/Support` and should stay small and focused.

Domain normalization, validation, source loading, whitelist loading, and compiled domain access share `Support\Domain`. Do not add a separate domain-list wrapper for the same responsibility.

Remote fetching, file writing, and filename generation are private to `Commands\Sync` because no other package component uses that behavior.

## Command classes

Console command internals use short class names:

| Class | Artisan command |
| --- | --- |
| `Commands\Install` | `erag:install-disposable-email` |
| `Commands\Sync` | `erag:sync-disposable-email-list` |
| `Commands\Stats` | `disposable:stats` |

The PHP class names may stay concise while the public Artisan signatures remain descriptive and backward compatible.

[Open the GitHub repository](https://github.com/eramitgupta/laravel-disposable-email).
