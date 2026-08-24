---
title: Remote Sync
description: Sync disposable domains from configured remote sources.
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

# Remote Sync

Configure one or more URLs in `remote_url`, then run:

```bash
php artisan erag:sync-disposable-email-list
```

The command clears package caches, fetches each source, normalizes JSON or newline text, and writes sorted unique domains to `blacklist_file`.

Use `sync_timeout` to control the HTTP timeout. A source failure is reported without hiding successful sources.

This command updates application storage, not the package's built-in source array.
