---
title: Sync and Cache Help
description: Troubleshoot remote source, blacklist, and cache issues.
head:
    - - meta
      - name: keywords
        content: 'Laravel disposable email sync troubleshooting, disposable blacklist cache issue, Laravel domain list update'
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

# Sync and Cache Help

For sync failures, verify `remote_url`, `sync_timeout`, network access, and write permission for `blacklist_file`.

```bash
php artisan erag:sync-disposable-email-list
```

Custom files must use a `.txt` extension and contain one domain per line. Clear stale cached results after manual changes:

```bash
php artisan cache:clear
```
