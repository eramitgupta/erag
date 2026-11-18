---
title: "orphan:restore"
description: "Move trashed files back to their original paths, list what is in the trash, or restore everything from one day."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-orphan-files/docs/commands/restore.md
</div>

# orphan:restore

Moves files from the trash back to where they were.

```bash
php artisan orphan:restore avatars/maya-patel-old.jpg
```

```
  public:avatars/maya-patel-old.jpg .......................................... RESTORED

   INFO  Restored 1 files (444.7 KB).
```

## Options

| Option | Description |
| --- | --- |
| `paths` | One or more original paths. A folder restores everything trashed under it. |
| `--disk=` | The disk the files were trashed from. Defaults to the first configured disk. |
| `--date=` | Only restore copies trashed on this day, e.g. `2026-11-15`. |
| `--all` | Restore everything in the trash of the disk. |
| `--overwrite` | Replace a file that already exists at the original path. |
| `--list` | Show what is in the trash instead of restoring. |

## See what is in the trash

```bash
php artisan orphan:restore --list
```

```
+------------+-------------------------------+----------+
| Trashed on | Original path                 | Size     |
+------------+-------------------------------+----------+
| 2026-11-15 | comments/2026/09/IMG_8675.jpg | 615.1 KB |
| 2026-11-15 | comments/2026/09/IMG_3915.jpg | 268.1 KB |
| 2026-11-15 | comments/2026/09/IMG_2996.jpg | 210.2 KB |
+------------+-------------------------------+----------+
```

The list shows up to 500 rows and tells you how many more there are. Pass a path to list only one folder: `restore comments/2026/09 --list`.

## More examples

```bash
php artisan orphan:restore comments/41                  # everything under a folder
php artisan orphan:restore a.jpg b.jpg --disk=s3        # several files on another disk
php artisan orphan:restore --all --date=2026-11-15      # everything trashed that day
```

## Which copy is restored

If a path was trashed more than once, the newest copy is restored. Copies from the same day sit in folders like `2026-11-15` and `2026-11-15_101500`, and the later one wins.

A file that already exists at the original path is left alone and reported:

```
  public:avatars/jane.jpg ....... A file already exists at the original path. Use --overwrite to replace it.
```

A path that isn't in the trash is reported as `Not found in the trash.` If anything couldn't be restored, the command exits with status 1.
