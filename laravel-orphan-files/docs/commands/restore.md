---
title: "orphan:restore"
description: "Move trashed files back to their original paths, list what is in the trash on every disk, or restore everything from one day."
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

## What it does

It moves files from the trash back to the exact path they had before the clean. With `--list` it shows what is in the trash instead.

## When to use it

When a clean moved a file your app still needs, or when you want to undo a whole clean. Use `--list` any time to check what a clean moved.

::: warning Does it change anything?
**Moves files out of the trash**, back to their original paths. A file that already exists at that path is left alone, unless you pass `--overwrite`, which replaces it. `--list` is read-only.
:::

## Examples

These examples come from the same test run as the [clean page](./clean.md#examples). After the cleans there, the trash held 8 files: 4 from `s3` and 4 from `public`.

### See what is in the trash

```bash
php artisan orphan:restore --list
```

```
+--------+------------+-------------------------------------------+--------+
| Disk   | Trashed on | Original path                             | Size   |
+--------+------------+-------------------------------------------+--------+
| s3     | 2026-11-19 | uploads/orphan-test/orphans/nested/o4.jpg | 4.4 KB |
| s3     | 2026-11-19 | uploads/orphan-test/orphans/o1.jpg        | 2.9 KB |
| s3     | 2026-11-19 | uploads/orphan-test/orphans/o2.jpg        | 3.4 KB |
| s3     | 2026-11-19 | uploads/orphan-test/orphans/o3.pdf        | 3.9 KB |
| public | 2026-11-19 | orphan-test/orphans/o2.jpg                | 3.4 KB |
| public | 2026-11-19 | orphan-test/orphans/o1.jpg                | 2.9 KB |
| public | 2026-11-19 | orphan-test/orphans/o3.pdf                | 3.9 KB |
| public | 2026-11-19 | orphan-test/orphans/nested/o4.jpg         | 4.4 KB |
+--------+------------+-------------------------------------------+--------+
```

Without `--disk`, the list covers every configured disk, and a `Disk` column shows where each file came from. With one disk there is no `Disk` column:

```bash
php artisan orphan:restore --list --disk=public
```

```
+------------+-----------------------------------+--------+
| Trashed on | Original path                     | Size   |
+------------+-----------------------------------+--------+
| 2026-11-19 | orphan-test/orphans/o2.jpg        | 3.4 KB |
| 2026-11-19 | orphan-test/orphans/o1.jpg        | 2.9 KB |
| 2026-11-19 | orphan-test/orphans/o3.pdf        | 3.9 KB |
| 2026-11-19 | orphan-test/orphans/nested/o4.jpg | 4.4 KB |
+------------+-----------------------------------+--------+
```

The list shows up to 500 rows and tells you how many more there are. Pass a path to list only one folder, for example `php artisan orphan:restore orphan-test/orphans --list`.

### Restore one file

```bash
php artisan orphan:restore uploads/orphan-test/orphans/o1.jpg
```

```
  s3:uploads/orphan-test/orphans/o1.jpg ......................................... RESTORED

   INFO  Restored 1 file (2.9 KB).
```

You don't need `--disk`. Without it, the command looks in the trash of every configured disk and restores the file from the disk that has it, here `s3`. If the same path is in the trash of two disks, each copy goes back to its own disk.

### Restore a folder

```bash
php artisan orphan:restore orphan-test/orphans/nested/
```

```
  public:orphan-test/orphans/nested/o4.jpg ...................................... RESTORED

   INFO  Restored 1 file (4.4 KB).
```

A folder path restores every trashed file under it.

### A file already exists at the original path

For this example the test first put a new file at `orphan-test/orphans/o2.jpg`. The restore leaves that file alone:

```bash
php artisan orphan:restore orphan-test/orphans/o2.jpg
```

```
  public:orphan-test/orphans/o2.jpg A file already exists at the original path. Use --overwrite to replace it.

   WARN  1 file could not be restored, see above.
```

The command exits with code 1, and the trashed copy stays in the trash. To replace the file at the original path with the trashed copy, add `--overwrite`:

```bash
php artisan orphan:restore orphan-test/orphans/o2.jpg --overwrite
```

```
  public:orphan-test/orphans/o2.jpg ............................................. RESTORED

   INFO  Restored 1 file (3.4 KB).
```

### A path that isn't in the trash

```bash
php artisan orphan:restore uploads/orphan-test/nothing-here.jpg
```

```
  uploads/orphan-test/nothing-here.jpg Not found in the trash of s3 or public.

   WARN  1 file could not be restored, see above.
```

This also exits with code 1. With `--disk`, the line names that disk and says `Not found in the trash.`

### Restore everything

```bash
php artisan orphan:restore --all
```

```
  s3:uploads/orphan-test/orphans/nested/o4.jpg .................................. RESTORED
  s3:uploads/orphan-test/orphans/o2.jpg ......................................... RESTORED
  s3:uploads/orphan-test/orphans/o3.pdf ......................................... RESTORED
  public:orphan-test/orphans/o1.jpg ............................................. RESTORED
  public:orphan-test/orphans/o3.pdf ............................................. RESTORED

   INFO  Restored 5 files (18.6 KB).
```

`--all` restores everything on every configured disk: here the 5 files that were still in the trash. Add `--disk=public` to restore only one disk, or `--date=2026-11-19` to restore only what was trashed that day. Afterwards the list is empty:

```bash
php artisan orphan:restore --list
```

```
   INFO  The trash is empty on s3 and public.
```

With `--disk`, the message is `The trash of disk [public] is empty.`

## Options

| Option | Description |
| --- | --- |
| `paths` | One or more original paths to restore. A folder path restores everything trashed under it. |
| `--disk=` | Only use the trash of this disk. Without it, the trash of every configured disk is used. |
| `--date=` | Only restore copies trashed on this day, written as `Y-m-d`, for example `2026-11-19`. |
| `--all` | Restore everything in the trash, on every disk, or only on `--disk`. |
| `--overwrite` | Replace a file that already exists at the original path. |
| `--list` | Show what is in the trash instead of restoring. Add a path to list only one folder. |

Give either paths or `--all`. Without both, the command stops with `Give the paths to restore, or pass --all. Use --list to see the trash.`

## Which copy is restored

If a path was trashed more than once, the newest copy is restored. Copies from the same day sit in folders like `2026-11-15` and `2026-11-15_101500`, and the later one wins.

## The file's date after a restore

A restored file goes back to its exact original path. Its "last modified" time depends on the disk:

- On a local disk, with the trash on the same disk, the file is renamed back and keeps its original time.
- On S3 and S3-compatible storage such as MinIO, a restore is a copy, so the file gets a new "last modified" time. The same happens when `trash.disk` is a different disk.

A new time means the grace period starts again. If the restored file is still unreferenced, the next clean leaves it alone until it is older than the grace period (24 hours by default). See [How a file moves](../guides/first-cleanup.md#how-a-file-moves) for the full picture.
