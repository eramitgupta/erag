---
title: "Quick Start"
description: "A whole first cleanup step by step: install, set disks and columns, scan, check files, clean, restore, empty the trash and run it on a schedule."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-orphan-files/docs/quick-start.md
</div>

# Quick Start

This walks through a whole first cleanup, from install to an empty trash. The example app keeps user avatars on the `public` disk and comment images as JSON. Every step ends with what to check before you go on.

## 1. Install

```bash
composer require erag/laravel-orphan-files
php artisan orphan:install
```

`orphan:install` creates `config/orphan-files.php` and prints the next steps. If the file already exists, it asks before replacing it, and the default answer keeps yours. The [installation page](./installation.md) covers S3 and the requirements.

**Check:** `config/orphan-files.php` exists.

## 2. Tell it where files live

In `config/orphan-files.php`, list the disks and the folders that hold uploads:

```php
'disks' => [
    'public' => ['avatars/', 'comments/'],
],
```

Only these folders are ever scanned or cleaned.

**Check:** the folders are as narrow as you can make them. Don't list a disk root that also holds exports, logs or cache files.

## 3. Tell it which columns point to files

```php
'sources' => [
    ['table' => 'users', 'column' => 'avatar', 'type' => 'path', 'disk' => 'public'],
    ['table' => 'comments', 'column' => 'images', 'type' => 'json', 'key' => '*.path', 'disk' => 'public'],
],
```

`users.avatar` holds a path like `avatars/jane.jpg`. `comments.images` holds JSON like `[{"path": "comments/41/a.jpg"}]`, and `key` picks the paths out of it. See [Sources](./configuration/sources.md) for HTML and URL columns.

**Check:** every column that stores a file is listed. Search your code for `->store(`, `->storeAs(` and `Storage::put` to find them. A file whose column you forgot looks like an orphan.

## 4. Scan

```bash
php artisan orphan:scan
```

The scan only reads. On the demo app it prints:

```
+--------+---------------------+-------+------------+---------+-----------+-----------+-------------+--------+
| Disk   | Directories         | Files | Referenced | Orphans | Protected | Cleanable | Reclaimable | Ratio  |
+--------+---------------------+-------+------------+---------+-----------+-----------+-------------+--------+
| public | avatars/, comments/ | 43    | 23         | 20      | 0         | 20        | 6.8 MB      | 46.51% |
+--------+---------------------+-------+------------+---------+-----------+-----------+-------------+--------+

   WARN  20 orphaned files (6.8 MB) can be cleaned. Preview with: php artisan orphan:clean.
```

**Check:** the numbers look believable. A `Ratio` close to 90% almost always means a source is missing, and above 90% a forced clean refuses to run. [orphan:scan](./commands/scan.md#what-the-columns-mean) explains every column.

## 5. Spot-check a few files

Pick one file you know is in use and one reported orphan, and ask about each:

```bash
php artisan orphan:explain avatars/jane.jpg
```

**Check:** a file you use says `Kept: referenced by 1 row.` and shows the row. If it says `Orphan` instead, a source is missing: add it and scan again before you go on.

## 6. Preview the clean

```bash
php artisan orphan:clean
```

This is a dry run. It lists up to 15 of the files it would move (`-v` lists all of them) and changes nothing.

**Check:** every file in the list is one your app doesn't need.

## 7. Clean

```bash
php artisan orphan:clean --force
```

The files move to `.orphan-trash/public/{today's date}/` with their original paths. Nothing is deleted yet.

**Check:** the number of files moved matches the dry run.

## 8. Check your app

The files are in the trash, so this is the time to make sure nothing broke:

- Open the pages that show uploads: profile photos, galleries, posts with images, downloads.
- Watch your logs or error monitoring for 404s on storage URLs.
- Look through the trash for anything you know is in use:

```bash
php artisan orphan:restore --list
```

## 9. Restore if needed

If a file was moved by mistake, put it back:

```bash
php artisan orphan:restore avatars/jane.jpg
```

It goes back to its exact original path. Without `--disk`, `orphan:restore` looks in the trash of every configured disk, and `--all` undoes the whole clean.

**Check:** run `orphan:explain` on the file to see why it counted as an orphan. Usually a source is missing. Add it, or the next clean will move the file again. [orphan:restore](./commands/restore.md) covers folders and `--overwrite`.

## 10. Empty the trash later

Trashed files stay until `orphan:purge-trash` deletes them for good. By default it only removes trash older than 30 days, so you get a month to notice a mistake:

```bash
php artisan orphan:purge-trash --dry-run
```

You don't normally run this by hand. Schedule it, as shown below. To empty the trash sooner, see `--days` and `--all` on the [orphan:purge-trash page](./commands/purge-trash.md).

::: danger Purged files are gone
After a purge there is no copy left, and `orphan:restore` can't help.
:::

## How a file moves

A cleaned file goes through up to three places:

1. **In storage**, at its normal path, for example `avatars/old.jpg` on `public`.
2. **In the trash.** `orphan:clean --force` moves it to `.orphan-trash/{disk}/{date}/{original path}` on the same disk, for example `.orphan-trash/public/2026-11-19/avatars/old.jpg`. Set `trash.disk` to keep the trash on another disk. Scans never look inside the trash.
3. **Back, or gone.** `orphan:restore` puts it back at its original path. `orphan:purge-trash` deletes it for good once its date folder is older than `retention_days` (30), or straight away with `--all`.

```
avatars/old.jpg                                     (in storage)
    |
    |  orphan:clean --force
    v
.orphan-trash/public/2026-11-19/avatars/old.jpg     (in the trash)
    |
    +-- orphan:restore -------> avatars/old.jpg      (back in storage)
    |
    +-- orphan:purge-trash ---> deleted for good


orphan:clean --force --mode=delete

avatars/old.jpg ---> deleted for good (no trash, no restore)
```

`--mode=delete`, or `'mode' => 'delete'` in the config, skips the trash, so there is nothing to restore.

**The file's date after a restore:** on a local disk a move is a rename, so the file keeps its original "last modified" time. On S3 and S3-compatible storage such as MinIO, a move is a copy, so a restored file gets a new time and the grace period protects it again for 24 hours. The trash itself goes by the date folder's name, so a file trashed on 2026-11-19 is purged 30 days after that whatever its own time says.

## Run it on a schedule

Once the first cleanup went well, let the scheduler do it. In `routes/console.php`:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('orphan:scan --json')->weekly();
Schedule::command('orphan:clean --force')->weekly()->sundays()->at('03:00')->withoutOverlapping();
Schedule::command('orphan:purge-trash')->daily();
```

If you're not sure yet, schedule only the scan for a few weeks and add the clean once the numbers stay steady. Don't add `--force-ratio` or `--mode=delete` to a scheduled command. [Scheduling](./guides/scheduling.md) has the details.
