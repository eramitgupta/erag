---
title: "Sync & Cache Troubleshooting"
description: "Resolve common issues with remote blacklist downloads, scheduled sync timeouts, file permissions, and cache invalidation in Laravel."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-disposable-email/docs/help/sync-cache.md
</div>


# Sync and Cache Help

For sync failures, verify `remote_url`, `sync_timeout`, network access, and write permission for `blacklist_file`.

```bash
php artisan erag:sync-disposable-email-list
```

Custom files must use a `.txt` extension and contain one domain per line. Clear stale cached results after manual changes:

```bash
php artisan cache:clear
```
