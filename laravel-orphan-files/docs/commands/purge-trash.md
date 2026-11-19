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

## What it does

It deletes trashed files for good. By default it only removes trash older than `trash.retention_days` (30 days), on every configured disk.

## When to use it

On a schedule, usually daily, so the trash never holds more than about a month of cleaned files. Run it by hand with `--dry-run` first if you want to empty the trash sooner.

::: danger Does it change anything?
**Deletes files for good.** Purged files are gone, and `orphan:restore` can't bring them back. `--dry-run` is read-only and only shows how many files would go.
:::

## Examples

These examples come from the same test run as the other command pages. At this point the trash held 4 files from the `public` disk, all trashed that day.

### The default: trash older than 30 days

```bash
php artisan orphan:purge-trash --dry-run
```

```
   INFO  Dry run: 0 trashed files (0 B) would be purged.
```

Nothing is older than 30 days, so nothing would go. Without `--dry-run` the command deletes what it counted and prints `Purged ... trashed files (...)`.

### Keep a shorter window

```bash
php artisan orphan:purge-trash --days=7
```

```
   INFO  Purged 0 trashed files (0 B).
```

`--days=7` keeps trash from the last 7 days instead of 30. Everything here is from today, so it is all kept.

### Keep nothing

```bash
php artisan orphan:purge-trash --days=0 --dry-run
```

```
   INFO  Dry run: 4 trashed files (14.6 KB) would be purged.
```

`--days=0` keeps no trash at all, today's included, so all 4 files would go.

### Empty the trash of one disk

```bash
php artisan orphan:purge-trash --all --disk=public
```

```
   INFO  Purged 4 trashed files (14.6 KB).
```

`--all` deletes every trashed file, whatever its age. `--disk=public` limits it to one disk. Running `--all` again on every disk finds nothing left:

```bash
php artisan orphan:purge-trash --all
```

```
   INFO  Purged 0 trashed files (0 B).
```

## Options

| Option | Description |
| --- | --- |
| `--disk=` | Only purge the trash of this disk. Without it, the trash of every configured disk is purged. |
| `--days=` | Keep trash from the last this many days instead of `trash.retention_days`. `--days=0` keeps none, today's trash included. |
| `--all` | Purge every trashed file, whatever its age. |
| `--dry-run` | Show how many files would be purged, without deleting anything. |

::: danger Purged files are gone
After a purge there is no copy left. Run it with `--dry-run` first, especially with `--all` or a small `--days`.
:::

## How age is worked out

Each day's trash lives in a folder named after the date, for example `.orphan-trash/public/2026-10-15/`. A folder is purged when its date is more than `retention_days` before today. With 30 days, on 2026-11-15 the `2026-10-15` folder is purged and the `2026-10-16` folder is kept.

The date comes from the folder name, not from the file. That matters because a file's own time changes in different ways on different disks (see [How a file moves](../guides/first-cleanup.md#how-a-file-moves)).

Only the files that were listed are deleted. A folder is removed when it ends up empty and nothing failed. Folders in the trash whose names aren't dates are never touched. If a file can't be deleted, it is listed with its error and the command exits with code 1.

On S3, purged files are deleted in batches of up to 1,000 keys, and each batch dispatches `OrphanFilesDeleted`.

## On a schedule

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('orphan:purge-trash')->daily();
```

If you'd like a longer window to restore things, raise `retention_days` instead of running the purge less often. See [Scheduling](../guides/scheduling.md).
