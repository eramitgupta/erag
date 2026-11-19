---
title: "Step by step: your first cleanup"
description: "A full first cleanup with real output at every step: install, configure, scan, explain, dry run, clean, check, restore and purge the trash."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-orphan-files/docs/guides/first-cleanup.md
</div>

# Step by step: your first cleanup

This page walks through a whole first cleanup, from installing the package to emptying the trash. Each step shows the command, what you should see, and what to check before you move on.

All output on this page comes from a real run. Your numbers will be different, but the steps are the same.

## The test setup

The run used two disks:

- `s3`, a MinIO bucket, with the folder `uploads/orphan-test/`.
- `public`, the local public disk, with the folder `orphan-test/`.

A table called `orphan_test_items` has two columns that point to files: `file_path` holds a plain path, and `gallery` holds JSON like `[{"path": "orphan-test/gallery/g1.jpg"}]`.

Each folder held the same 11 files:

| Files | Why they are there | What should happen |
| --- | --- | --- |
| `ref/a.jpg`, `ref/b.jpg` | A row's `file_path` points to them. | Kept |
| `gallery/g1.jpg`, `gallery/g2.jpg` | A row's `gallery` lists them. | Kept |
| `orphans/o1.jpg`, `orphans/o2.jpg`, `orphans/o3.pdf`, `orphans/nested/o4.jpg` | No row points to them. | Cleaned |
| `new/n1.jpg` | Just uploaded, and its row isn't saved yet. | Kept for now, by the grace period |
| `excluded/e1.jpg`, `excluded/e2.jpg` | They sit in an excluded folder. | Skipped completely |

The files on `public` were two days old. The files on `s3` were a few minutes old.

The grace period was set to 3 minutes so the test didn't have to wait a day. The default is 24 hours, and you should keep it on a real app.

## Step 1: Install

```bash
composer require erag/laravel-orphan-files
php artisan orphan:install
```

You should see:

```
   INFO  Published config/orphan-files.php.

  Next steps
  1. In config/orphan-files.php, list your upload folders under 'disks' and the columns that store file paths under 'sources'.
  2. Run php artisan orphan:scan to see how many orphaned files you have.
  3. Run php artisan orphan:clean for a dry run, then php artisan orphan:clean --force to move the orphans to the trash.

  Docs: https://erag.in/laravel-orphan-files/
```

**Check:** `config/orphan-files.php` now exists. If you already had one, the command asks before replacing it, and the default answer keeps your file. See [orphan:install](../commands/install.md).

## Step 2: Set disks and sources

In `config/orphan-files.php`, list the folders that hold uploads and every column that points to a file. This is the config the test used:

```php
'disks' => [
    's3' => ['uploads/orphan-test/'],
    'public' => ['orphan-test/'],
],

'sources' => [
    ['table' => 'orphan_test_items', 'column' => 'file_path', 'type' => 'path'],
    ['table' => 'orphan_test_items', 'column' => 'gallery', 'type' => 'json', 'key' => '*.path'],
],

'exclude_paths' => [
    '.gitignore',
    '.gitkeep',
    'uploads/orphan-test/excluded/',
    'orphan-test/excluded/',
],
```

The sources have no `disk`, so a path they hold counts on every scanned disk. The two `excluded/` entries end in a slash, so they skip a whole folder.

**Check:**

- Every column that stores a path, a URL or HTML with images is listed. Search your code for `->store(`, `->storeAs(` and `Storage::put` to find them. A column you forget makes its files look like orphans.
- The folders are as narrow as you can make them. Don't list a disk root that also holds exports, logs or cache files.

[Sources](../configuration/sources.md) covers JSON, HTML and URL columns. [Disks and Directories](../configuration/disks.md) covers folders.

## Step 3: Scan

```bash
php artisan orphan:scan
```

You should see:

```
+--------+----------------------+-------+------------+---------+-----------+-----------+-------------+--------+
| Disk   | Directories          | Files | Referenced | Orphans | Protected | Cleanable | Reclaimable | Ratio  |
+--------+----------------------+-------+------------+---------+-----------+-----------+-------------+--------+
| s3     | uploads/orphan-test/ | 9     | 4          | 5       | 1         | 4         | 14.6 KB     | 44.44% |
| public | orphan-test/         | 9     | 4          | 5       | 1         | 4         | 14.6 KB     | 44.44% |
+--------+----------------------+-------+------------+---------+-----------+-----------+-------------+--------+
  Protected on [s3] by grace_period .................................................... 1
  Protected on [public] by grace_period ................................................ 1

   WARN  8 orphaned files (29.3 KB) can be cleaned. Preview with: php artisan orphan:clean.
```

The scan only reads. Nothing has changed yet.

**Check:**

- `Files` is 9 on each disk: 11 files, minus the 2 excluded ones. Excluded files are not counted anywhere.
- `Referenced` is 4: the two `ref/` files and the two gallery images.
- `Protected` is 1: the new upload, kept by the grace period.
- `Ratio` is 44.44%, 4 cleanable files out of 9. A ratio close to 90% or higher almost always means a source is missing. Above 90%, a forced clean refuses to run.

[orphan:scan](../commands/scan.md#what-the-columns-mean) explains every column.

## Step 4: Explain a few files

Pick a file you know is in use, a few reported orphans, and anything that surprises you.

A file in use:

```bash
php artisan orphan:explain uploads/orphan-test/ref/a.jpg --disk=s3
```

```
  File ............................................. uploads/orphan-test/ref/a.jpg on [s3]
  Exists ............................................. yes, 1.2 KB, modified 3 minutes ago
  Scanned directories ............................................... uploads/orphan-test/
  Sources checked ...................................................................... 2
+-----------------------------+------+-----+-------------------------------+
| Source                      | Type | Row | Value                         |
+-----------------------------+------+-----+-------------------------------+
| orphan_test_items.file_path | path | 1   | uploads/orphan-test/ref/a.jpg |
+-----------------------------+------+-----+-------------------------------+

   INFO  Kept: referenced by 1 row.
```

A reported orphan:

```bash
php artisan orphan:explain uploads/orphan-test/orphans/o1.jpg --disk=s3
```

```
  File ........................................ uploads/orphan-test/orphans/o1.jpg on [s3]
  Exists ............................................. yes, 2.9 KB, modified 3 minutes ago
  Scanned directories ............................................... uploads/orphan-test/
  Sources checked ...................................................................... 2

   WARN  Orphan: none of the 2 sources reference it. orphan:clean --force would trash it.
```

The new upload:

```bash
php artisan orphan:explain orphan-test/new/n1.jpg --disk=public
```

```
  File ................................................ orphan-test/new/n1.jpg on [public]
  Exists ............................................. yes, 5.9 KB, modified 2 seconds ago
  Scanned directories ....................................................... orphan-test/
  Sources checked ...................................................................... 2

   INFO  Not referenced, but kept: it was modified within the grace period (3 minutes).
```

**Check:** files you know are in use say `Kept`, and the orphans really are unused. If a file your app uses says `Orphan`, a source is missing. Add it to the config and scan again before you go on. [orphan:explain](../commands/explain.md#the-possible-answers) lists every possible answer.

## Step 5: Clean, as a dry run

```bash
php artisan orphan:clean
```

You should see:

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

**Check:** read the list. Every file in it should be one your app doesn't need. Only the first 15 files are shown; add `-v` to see all of them. Nothing has changed yet.

## Step 6: Clean for real

Start small. Move a couple of files and look at them before you do the rest:

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

Then clean the rest:

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

**Check:**

- 2 plus 6 makes 8 files moved, the same 8 the dry run listed.
- `public` shows 7 files now, because the 2 files from the first run are in the trash, and the trash is never scanned.
- The new upload is still in place on both disks.

If the clean stops with `Too many files would be cleaned`, don't force it. Go back to step 4 and find the missing source. See [the safety limit](../commands/clean.md#the-safety-limit).

## Step 7: Check your app

Nothing was deleted yet. The files are in the trash, so this is the time to make sure nothing is broken:

- Open the pages that show uploads: profile photos, galleries, posts with images, downloads.
- Watch your logs or error monitoring for 404s on storage URLs.
- Look through the trash for anything you know is in use:

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

**Check:** the list holds the 8 files from step 6, from both disks, and nothing your app needs.

## Step 8: Restore if needed

If a file was moved by mistake, put it back. You don't need to say which disk it was on:

```bash
php artisan orphan:restore uploads/orphan-test/orphans/o1.jpg
```

```
  s3:uploads/orphan-test/orphans/o1.jpg ......................................... RESTORED

   INFO  Restored 1 file (2.9 KB).
```

The file is back at its exact original path. `php artisan orphan:restore --all` undoes the whole clean, and `--date=2026-11-19` limits it to one day.

**Check:**

- The page that needed the file works again.
- Run `orphan:explain` on the file to see why it counted as an orphan. Usually a source is missing. Add it, or the next clean will move the file again.
- On S3 and MinIO the restored file gets a new "last modified" time, so it is inside the grace period again. On a local disk it keeps its original time. [How a file moves](#how-a-file-moves) explains why.

[orphan:restore](../commands/restore.md) covers folders, files that already exist and `--overwrite`.

## Step 9: Purge the trash

Trashed files stay until `orphan:purge-trash` deletes them. By default it only removes trash older than 30 days. Preview it first:

```bash
php artisan orphan:purge-trash --dry-run
```

```
   INFO  Dry run: 0 trashed files (0 B) would be purged.
```

**Check:** 0 is right here. Everything in the trash is from today, so it is kept for another 30 days. You don't normally run this by hand. Schedule it daily, as shown below, and the trash keeps about a month of cleaned files. To empty it sooner, see `--days` and `--all` on the [orphan:purge-trash page](../commands/purge-trash.md).

::: danger Purged files are gone
After a purge there is no copy left, and `orphan:restore` can't help.
:::

## How a file moves

A cleaned file goes through up to three places:

1. **In storage.** The file sits at its normal path, for example `uploads/orphan-test/orphans/o1.jpg` on `s3`.
2. **In the trash.** `orphan:clean --force` moves it to `.orphan-trash/{disk}/{date}/{original path}` on the same disk, for example `.orphan-trash/s3/2026-11-19/uploads/orphan-test/orphans/o1.jpg`. Set `trash.disk` to keep the trash on another disk. Scans never look inside the trash.
3. **Back, or gone.** From the trash, a file either goes back to its original path with `orphan:restore`, or is deleted for good by `orphan:purge-trash` once its date folder is older than `retention_days` (30), or straight away with `--all`.

```
uploads/orphan-test/orphans/o1.jpg                                (in storage)
    |
    |  orphan:clean --force
    v
.orphan-trash/s3/2026-11-19/uploads/orphan-test/orphans/o1.jpg   (in the trash)
    |
    +-- orphan:restore -------> uploads/orphan-test/orphans/o1.jpg   (back in storage)
    |
    +-- orphan:purge-trash ---> deleted for good


orphan:clean --force --mode=delete

uploads/orphan-test/orphans/o1.jpg ---> deleted for good (no trash, no restore)
```

`--mode=delete`, or `'mode' => 'delete'` in the config, skips the trash. Files are deleted straight from storage, and there is nothing to restore.

### The file's date after a move

On a local disk, with the trash on the same disk, moving a file is a rename, so it keeps its original "last modified" time both ways. On S3 and S3-compatible storage such as MinIO, a move is a copy followed by a delete, so the file gets a new time each time it moves. The same is true when `trash.disk` is a different disk.

This matters after a restore: a restored file on S3 counts as brand new, so the grace period protects it again. In the test, every file was restored and then a clean ran straight away with a grace period of only one minute:

```bash
php artisan orphan:clean --force --older-than=1m
```

```
+--------+----------------------+-------+------------+---------+-----------+-----------+-------------+--------+
| Disk   | Directories          | Files | Referenced | Orphans | Protected | Cleanable | Reclaimable | Ratio  |
+--------+----------------------+-------+------------+---------+-----------+-----------+-------------+--------+
| s3     | uploads/orphan-test/ | 9     | 4          | 5       | 5         | 0         | 0 B         | 0%     |
| public | orphan-test/         | 9     | 4          | 5       | 1         | 4         | 14.6 KB     | 44.44% |
+--------+----------------------+-------+------------+---------+-----------+-----------+-------------+--------+
  Protected on [s3] by grace_period .................................................... 5
  Protected on [public] by grace_period ................................................ 1

   INFO  Moved to the trash: 4 files (14.6 KB). Restore them with php artisan orphan:restore.
```

The restored files on `s3` had a new time, so all 5 orphans were protected. The files on `public` kept their two-day-old time, so the 4 orphans went back to the trash.

The trash itself doesn't depend on file times. Retention is worked out from the date folder's name, so a file trashed on 2026-11-19 is purged 30 days after that, whatever its own time says.

## A schedule for after the first cleanup

Once the first cleanup went well, let the scheduler do it. In `routes/console.php`:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('orphan:scan --json')->weekly();
Schedule::command('orphan:clean --force')->weekly()->sundays()->at('03:00')->withoutOverlapping();
Schedule::command('orphan:purge-trash')->daily();
```

If you're not sure yet, schedule only the scan for a few weeks and add the clean once the numbers stay steady. Don't add `--force-ratio` or `--mode=delete` to a scheduled command. [Scheduling](./scheduling.md) has the details.
