---
title: "Disks and Directories"
description: "Choose which Laravel disks and folders Laravel Orphan Files scans. Nothing outside them is ever touched."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-orphan-files/docs/configuration/disks.md
</div>

# Disks and Directories

`disks` decides where the package looks. Nothing outside these locations is scanned, trashed or deleted.

```php
'disks' => [
    'public' => ['avatars/', 'comments/'],
    's3' => ['uploads/'],
],
```

The keys are disk names from `config/filesystems.php`. The values are folders on that disk.

## The whole disk

An empty array, `''` or `'*'` means the whole disk:

```php
'disks' => [
    'media' => [],
],
```

Only do this for a disk that holds nothing but uploads. On a disk like `local`, the root usually also has exports, cached files or logs that no database row points to, and they would all show up as orphans.

## Nested folders

If you list a folder and one of its subfolders, the subfolder is dropped because the parent already covers it. `['avatars/', 'avatars/2024/']` scans `avatars/` once.

## Limiting a single run

`--disk` and `--dir` narrow a scan or clean without changing the config:

```bash
php artisan orphan:scan --disk=public --dir=avatars
```

`--dir` can only narrow what's configured. With `'public' => ['avatars/']`, `--dir=avatars/2024` works, but `--dir=posts` stops with an error because `posts/` isn't a configured location. A disk that isn't listed under `disks` can't be scanned at all, even with `--disk`.

## The trash folder

The trash lives in `.orphan-trash/` on the same disk (see [Trash and Safety Limit](./cleanup.md)). Scans always skip it, even when you scan the whole disk.
