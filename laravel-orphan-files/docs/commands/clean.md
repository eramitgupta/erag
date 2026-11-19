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

## What it does

It finds the same cleanable files as [`orphan:scan`](./scan.md) and gets rid of them. Without `--force` it is a dry run that only shows the files. With `--force` it moves them to the trash, where [`orphan:restore`](./restore.md) can bring them back.

## When to use it

Once a scan and a few [`orphan:explain`](./explain.md) checks look right. Run it without `--force` first and read the list. Then run it again with `--force`, by hand or on a [schedule](../guides/scheduling.md).

::: warning Does it change anything?
- **Without `--force`: read-only.** It lists the files it would clean and changes nothing.
- **With `--force`: moves files to the trash.** They go to `.orphan-trash/{disk}/{date}/` with their original paths, and you can restore them.
- **With `--force --mode=delete`: deletes files for good.** They skip the trash and can't be restored.
:::

## Examples

These examples come from the same test run as the [scan page](./scan.md#example): two disks, `s3` and `public`, with 4 cleanable files each. The grace period was set to 3 minutes for the test; the default is 24 hours.

### Dry run

```bash
php artisan orphan:clean
```

```
+--------+----------------------+-------+------------+---------+-----------+-----------+-------------+--------+
| Disk   | Directories          | Files | Referenced | Orphans | Protected | Cleanable | Reclaimable | Ratio  |
+--------+----------------------+-------+------------+---------+-----------+-----------+-------------+--------+
| s3     | uploads/orphan-test/ | 9     | 4          | 5       | 1         | 4         | 14.6 KB     | 44.44% |
| public | orphan-test/         | 9     | 4          | 5       | 1         | 4         | 14.6 KB     | 44.44% |
+--------+----------------------+-------+------------+---------+-----------+-----------+-------------+--------+
  Protected on [s3] by grace_period .................................................... 1
  Protected on [public] by grace_period ................................................ 1
  s3:uploads/orphan-test/orphans/nested/o4.jpg .................................... 4.4 KB
  s3:uploads/orphan-test/orphans/o1.jpg ........................................... 2.9 KB
  s3:uploads/orphan-test/orphans/o2.jpg ........................................... 3.4 KB
  s3:uploads/orphan-test/orphans/o3.pdf ........................................... 3.9 KB
  public:orphan-test/orphans/o2.jpg ............................................... 3.4 KB
  public:orphan-test/orphans/o1.jpg ............................................... 2.9 KB
  public:orphan-test/orphans/o3.pdf ............................................... 3.9 KB
  public:orphan-test/orphans/nested/o4.jpg ........................................ 4.4 KB

   INFO  Dry run: nothing was changed. Re-run with --force to trash 8 files.
```

It prints the same table as a scan, then the files it would clean as `disk:path` with their size. Only the first 15 files are listed, followed by `… and N more (use -v to list every file).` when there are more. With `-v` every file is listed.

### A first clean in small steps

On a big bucket, start with a limit and look at what moved before you clean the rest:

```bash
php artisan orphan:clean --force --disk=public --limit=2
```

```
+--------+--------------+-------+------------+---------+-----------+-----------+-------------+--------+
| Disk   | Directories  | Files | Referenced | Orphans | Protected | Cleanable | Reclaimable | Ratio  |
+--------+--------------+-------+------------+---------+-----------+-----------+-------------+--------+
| public | orphan-test/ | 9     | 4          | 5       | 1         | 4         | 14.6 KB     | 44.44% |
+--------+--------------+-------+------------+---------+-----------+-----------+-------------+--------+
  Protected on [public] by grace_period ................................................ 1

   INFO  Moved to the trash: 2 files (6.3 KB). Restore them with php artisan orphan:restore.
```

The table still shows 4 cleanable files, because it is worked out before anything moves. Only 2 were moved. `php artisan orphan:restore --list` shows what is in the trash now.

### Clean the rest

```bash
php artisan orphan:clean --force
```

```
+--------+----------------------+-------+------------+---------+-----------+-----------+-------------+--------+
| Disk   | Directories          | Files | Referenced | Orphans | Protected | Cleanable | Reclaimable | Ratio  |
+--------+----------------------+-------+------------+---------+-----------+-----------+-------------+--------+
| s3     | uploads/orphan-test/ | 9     | 4          | 5       | 1         | 4         | 14.6 KB     | 44.44% |
| public | orphan-test/         | 7     | 4          | 3       | 1         | 2         | 8.3 KB      | 28.57% |
+--------+----------------------+-------+------------+---------+-----------+-----------+-------------+--------+
  Protected on [s3] by grace_period .................................................... 1
  Protected on [public] by grace_period ................................................ 1

   INFO  Moved to the trash: 6 files (22.9 KB). Restore them with php artisan orphan:restore.
```

`public` now has 7 files instead of 9, because the 2 files from the last step are in the trash, and the trash is never scanned. The 4 files on `s3` and the last 2 on `public` were moved. The new upload on each disk stays, because the grace period protects it.

### Use a longer grace period

```bash
php artisan orphan:clean --force --disk=s3 --older-than=1h
```

```
+------+----------------------+-------+------------+---------+-----------+-----------+-------------+-------+
| Disk | Directories          | Files | Referenced | Orphans | Protected | Cleanable | Reclaimable | Ratio |
+------+----------------------+-------+------------+---------+-----------+-----------+-------------+-------+
| s3   | uploads/orphan-test/ | 9     | 4          | 5       | 5         | 0         | 0 B         | 0%    |
+------+----------------------+-------+------------+---------+-----------+-----------+-------------+-------+
  Protected on [s3] by grace_period .................................................... 5

   INFO  Nothing to clean.
```

The files on `s3` were only minutes old, so a one hour grace period protects all of them.

## Options

| Option | Description |
| --- | --- |
| `--force` | Actually trash or delete the files. Without it, the command is a dry run. |
| `--mode=` | `trash` (restorable) or `delete` (permanent) for this run. Defaults to `mode` in the config, which is `trash`. |
| `--older-than=` | Use this grace period for this run instead of `grace_period_hours`: `90m`, `48h`, `7d`, `2w`. A plain number means hours. |
| `--limit=` | Clean at most this many files. |
| `--force-ratio` | Skip the `max_orphan_ratio` safety limit for this run. |
| `--disk=` | Only clean these disks. Repeat the option or separate names with commas. |
| `--dir=` | Only clean these folders. They have to be inside the configured folders. |
| `--queue` | Run the clean as a queued job. Needs `--force`. |
| `-v` | In a dry run, list every file instead of the first 15. |

## The safety limit

If more than `max_orphan_ratio` (90%) of a disk's scanned files would be cleaned, a forced clean refuses to run. Nothing is moved, and the command exits with code 1:

```bash
php artisan orphan:clean --force --disk=s3 --dir=uploads/orphan-test/orphans/
```

```
   ERROR  Too many files would be cleaned (s3: 100%, limit 90%), so a forced clean won't run. A source is probably missing from config/orphan-files.php; check a few files with orphan:explain, or pass --force-ratio if the number is right.
```

Here `--dir` points at a folder that holds nothing but orphans, so 100% of the scanned files would go. On a real app a ratio that high almost always means a source is missing from the config. A dry run of the same command still lists the files and shows this message as a warning.

::: danger --force-ratio
`--force-ratio` skips the check for one run. Use it only after `orphan:explain` has shown, file by file, that the reported orphans are really unused.
:::

## Delete mode

```bash
php artisan orphan:clean --force --mode=delete --disk=s3 --older-than=1m
```

```
+------+----------------------+-------+------------+---------+-----------+-----------+-------------+-------+
| Disk | Directories          | Files | Referenced | Orphans | Protected | Cleanable | Reclaimable | Ratio |
+------+----------------------+-------+------------+---------+-----------+-----------+-------------+-------+
| s3   | uploads/orphan-test/ | 10    | 4          | 6       | 0         | 6         | 21.5 KB     | 60%   |
+------+----------------------+-------+------------+---------+-----------+-----------+-------------+-------+

   INFO  Deleted 6 files (21.5 KB).
```

By this point the test had added one more orphan to the folder, so the table shows 10 files. It used `--older-than=1m` so that files a few minutes old could be cleaned. On a real app, keep the default grace period. After a delete, `orphan:restore --list` has nothing to show, because the files never went to the trash.

::: danger Deleted files are gone
Delete mode skips the trash, so `orphan:restore` can't bring the files back. Use it only after a few cleans in trash mode have shown your sources are complete.
:::

## When a clean stops

A clean stops before touching anything when:

- a configured table or column doesn't exist,
- more than `max_orphan_ratio` (90%) of a disk would be cleaned,
- `diff.driver` is set to something other than `auto`, `memory` or `database`,
- the temporary table can't be created in `database` mode,
- `--mode` is not `trash` or `delete`,
- `--queue` is used without `--force`.

The message says what to fix.

Files that can't be moved once the clean has started, for example because of a permission error, are listed in a table with their error at the end. The other files are still moved, and the command exits with code 1.

## How it runs

A clean reads the database first, then lists storage twice: once to build the report and check the ratio, and once to move the files. Files modified after the database was read are always kept, so an upload during a long clean is safe.

Moves are done in batches of `chunk_size` files, and each batch dispatches an `OrphanFilesTrashed` (or `OrphanFilesDeleted`) event with the paths and bytes.

To see where a file goes after a clean, and how it comes back, read [How a file moves](../quick-start.md#how-a-file-moves).
