---
title: "orphan:purge-trash"
description: "Permanently delete trashed files older than the retention period, preview a purge, or empty the trash."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-orphan-files/docs/commands/purge-trash.md
</div>

# orphan:purge-trash

Deletes trashed files for good once they are older than `trash.retention_days` (30 days).

```bash
php artisan orphan:purge-trash
```

```
   INFO  Purged 19 trashed files (6.4 MB).
```

## Options

| Option | Description |
| --- | --- |
| `--disk=` | Only purge the trash of this disk. Without it, every configured disk is purged. |
| `--days=` | Keep trash younger than this many days instead of `retention_days`. |
| `--all` | Purge everything, whatever its age, including today's trash. |
| `--dry-run` | Show what would be purged without deleting. |

## Preview first

```bash
php artisan orphan:purge-trash --all --dry-run
```

```
   INFO  Dry run: 19 trashed files (6.4 MB) would be purged.
```

::: danger Purged files are gone
After a purge there is no copy left. Run it with `--dry-run` first, especially with `--all` or a small `--days`.
:::

## How age is worked out

Each day's trash lives in a folder named after the date, for example `.orphan-trash/public/2026-10-15/`. A folder is purged when its date is more than `retention_days` before today. With 30 days, on 2026-11-15 the `2026-10-15` folder is purged and the `2026-10-16` folder is kept.

The date comes from the folder name, not from the file. That matters because moving a local file keeps its old modification time.

Only the files that were listed are deleted. A folder is removed when it ends up empty and nothing failed. Folders in the trash whose names aren't dates are never touched.

On S3, purged files are deleted in batches of up to 1,000 keys, and each batch dispatches `OrphanFilesDeleted`.
