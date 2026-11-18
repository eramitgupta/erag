---
title: "orphan:clean"
description: "Trash or delete orphaned files. A dry run unless you pass --force, with limits, delete mode and a safety ratio."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-orphan-files/docs/commands/clean.md
</div>

# orphan:clean

Moves orphans to the trash, or deletes them in delete mode. Without `--force` it is a dry run and changes nothing.

## Dry run

```bash
php artisan orphan:clean
```

It prints the same table as `scan`, then up to 15 of the files it would move:

```
  public:avatars/maya-patel-old.jpg ................................................ 444.7 KB
  public:avatars/sofia-rossi-old.jpg ............................................... 543.9 KB
  ...
  public:comments/2026/09/IMG_9876.jpg ............................................. 257.6 KB
  … and 5 more (use -v to list every file).

   INFO  Dry run: nothing was changed. Re-run with --force to trash 20 files.
```

`-v` lists every file instead of 15.

## Clean

```bash
php artisan orphan:clean --force
```

```
   INFO  Moved to the trash: 20 files (6.8 MB). Restore them with php artisan orphan:restore.
```

Files that can't be moved, for example because of a permission error, are listed in a table at the end, and the command exits with status 1. The others are still moved.

## Options

| Option | Description |
| --- | --- |
| `--force` | Actually trash or delete the files. Without it nothing changes. |
| `--mode=trash\|delete` | Override the configured mode for this run. |
| `--older-than=` | Only files older than this: `90m`, `48h`, `7d`, `2w`. Replaces the grace period. |
| `--limit=` | Clean at most this many files. |
| `--force-ratio` | Ignore `max_orphan_ratio`. |
| `--disk=`, `--dir=` | Limit the run, the same as for `scan`. |
| `--queue` | Run as a queued job. Needs `--force`. |

## A first clean in small steps

On a big bucket, start with a limit and look at what moved:

```bash
php artisan orphan:clean --force --limit=100
php artisan orphan:restore --list
```

## Delete mode

```bash
php artisan orphan:clean --force --mode=delete
```

::: danger Permanent
Deleted files don't go to the trash and can't be restored. Use delete mode only after a few trash-mode cleans have shown your sources are complete.
:::

## When a clean stops

A clean stops before touching anything when:

- a configured table or column doesn't exist,
- more than `max_orphan_ratio` (90%) of a disk would be cleaned,
- `diff.driver` is set to something other than `auto`, `memory` or `database`,
- the temporary table can't be created in `database` mode.

The message says what to fix. For the ratio check:

```
Too many files would be cleaned (public: 96.4%, limit 90%), so a forced clean won't run. A source is probably missing from config/orphan-files.php; check a few files with orphan:explain, or pass --force-ratio if the number is right.
```

## How it runs

A clean reads the database first, then lists storage twice: once to build the report and check the ratio, and once to move the files. Files modified after the database was read are always kept, so an upload during a long clean is safe.

Moves are done in batches of `chunk_size` files, and each batch dispatches an `OrphanFilesTrashed` (or `OrphanFilesDeleted`) event with the paths and bytes.
