---
title: "Trash, Retention and the Safety Limit"
description: "Trash or delete mode, where the trash lives, how long it is kept, and the orphan ratio limit that stops a clean."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-orphan-files/docs/configuration/cleanup.md
</div>

# Trash and Safety Limit

## Mode

```php
'mode' => 'trash',   // or 'delete'
```

In `trash` mode, a clean moves orphans to a trash folder, where you can restore them. In `delete` mode they are removed for good. `--mode=delete` switches a single run.

::: danger Delete mode can't be undone
In `delete` mode there is no trash and no `restore`. Run a few cleans in `trash` mode first and only switch once you trust your sources.
:::

On S3 and S3-compatible disks, delete mode uses `DeleteObjects` with up to 1,000 keys per request instead of one request per file. A disk with `'read-only' => true` is never batch-deleted.

## Trash

```php
'trash' => [
    'disk' => null,
    'directory' => '.orphan-trash',
    'retention_days' => 30,
],
```

With `disk` set to `null`, the trash lives on the same disk as the file, so a clean is a rename on a local disk and a server-side copy on S3. Set it to another disk, for example `'local'`, to keep the trash somewhere else. Files are then copied across and the original is removed.

`orphan:restore` moves files back the same way. A copy gets a new "last modified" time, so a file restored on S3, or from a trash on another disk, is inside the grace period again. A rename on a local disk keeps the original time. [How a file moves](../quick-start.md#how-a-file-moves) shows the whole path.

Files keep their original path inside the trash:

```
.orphan-trash/public/2026-11-15/avatars/maya-patel-old.jpg
```

The date folder is what retention uses. If the same path is trashed twice on one day, the second copy goes into a folder like `2026-11-15_101500`, so nothing in the trash is ever overwritten. Scans never look inside the trash.

`retention_days` is how long `orphan:purge-trash` keeps trashed files. With 30, a folder dated 2026-10-15 is purged on 2026-11-15, and one dated 2026-10-16 is kept.

## Safety limit

```php
'max_orphan_ratio' => 90,
```

If more than 90% of a disk's files would be cleaned, `clean --force` stops before touching anything. A ratio that high almost always means a source is missing from the config, not that most of your files are really unused. A dry run shows the same check as a warning.

The ratio is worked out per disk: cleanable orphans divided by all scanned files on that disk. Set it to `100` or `null` to switch the check off.

To go past it once:

```bash
php artisan orphan:clean --force --force-ratio
```

::: danger Before using --force-ratio
Check a handful of the reported files with `orphan:explain` first. If even one of them is a file your app uses, a source is missing and `--force-ratio` would trash everything that source points to.
:::
