---
title: "Running It Safely"
description: "Dry runs, trash versus delete mode, restoring files, the grace period and the orphan ratio limit."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-orphan-files/docs/guides/safety.md
</div>

# Running It Safely

The package deletes files, so every default leans towards keeping a file when in doubt. This page collects the checks in one place.

## Before the first clean

1. List every column that can point to a file as a [source](../configuration/sources.md). Search your code for `->store(`, `->storeAs(`, `Storage::put` and `Storage::disk(` to find them.
2. Run `php artisan orphan:scan` and look at the ratio. A ratio close to 90% or higher almost always means a source is missing.
3. Run `orphan:explain` on a few files you know are in use and a few reported orphans.
4. Run `orphan:clean` without `--force` and read the list.

## Dry run by default

`orphan:clean` changes nothing unless you add `--force`. The dry run prints the same table as a scan, the first 15 files it would move, and the safety warnings it would hit.

## Trash, not delete

By default a clean moves files to `.orphan-trash/{disk}/{date}/` with their original paths. Nothing is lost until `orphan:purge-trash` removes trash older than 30 days.

```bash
php artisan orphan:restore --list                   # what's in the trash, on every disk
php artisan orphan:restore avatars/jane.jpg          # put one file back
php artisan orphan:restore --all --date=2026-11-15   # undo a whole day
```

Without `--disk`, `orphan:restore` looks in the trash of every configured disk. [How a file moves](./first-cleanup.md#how-a-file-moves) shows the whole path of a file, from storage to the trash and back.

::: danger Delete mode
`'mode' => 'delete'` or `--mode=delete` skips the trash. There's no undo. Keep trash mode until you've done several cleans and restored nothing.
:::

## The grace period

Files modified less than 24 hours before the database was read are skipped. That covers uploads whose row isn't saved yet: a file stored in step one of a form, or by a job that hasn't finished. Because the age is counted from when the database was read, an upload that arrives during a long clean is also safe.

## The safety limit

If more than 90% of a disk would be cleaned, `orphan:clean --force` stops before moving anything. The usual cause is a source that's missing from the config, or one pointing at the wrong disk.

::: danger --force-ratio
`--force-ratio` skips the check for one run. Use it only after `orphan:explain` has confirmed, file by file, that the reported orphans are really unused, for example after deleting a large feature on purpose.
:::

## Other checks

- A configured table or column that doesn't exist stops the run before anything is read.
- Only the disks and folders under `disks` are scanned. `--dir` can narrow them but never widen them.
- Rows are read from the primary database connection, so a lagging read replica can't hide a reference.
- Soft-deleted rows still count as references.
- If a stored URL's host isn't recognised, files matching the end of the URL path are kept (`match_unknown_hosts`).
- [Normalizers](../extending/normalizers.md) can only add ways to read a stored value. A buggy one keeps too much, it can't cause a deletion.

## Found a file that was cleaned by mistake?

Restore it, then run `orphan:explain` on it to see why it counted as an orphan. Usually a source is missing. Please report a real bug privately as described in the package's SECURITY.md, since a bug that loses data is treated as a security issue.
