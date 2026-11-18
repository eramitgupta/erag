---
title: "Quick Start"
description: "Configure one disk and one column, run a scan, check a file with explain, and do your first clean."
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

This walks through a typical first setup: user avatars on the `public` disk and comment images stored as JSON.

If you haven't installed the package yet, run `composer require erag/laravel-orphan-files` and then `php artisan orphan:install`. The [installation page](./installation.md) explains both.

## 1. Tell it where files live

In `config/orphan-files.php`, list the disks and the folders that hold uploads:

```php
'disks' => [
    'public' => ['avatars/', 'comments/'],
],
```

Only these folders are ever scanned or cleaned. Use the narrowest folders you can; don't list a disk root that also holds exports, logs or cached files.

## 2. Tell it which columns point to files

```php
'sources' => [
    ['table' => 'users', 'column' => 'avatar', 'type' => 'path', 'disk' => 'public'],
    ['table' => 'comments', 'column' => 'images', 'type' => 'json', 'key' => '*.path', 'disk' => 'public'],
],
```

`users.avatar` holds a path like `avatars/jane.jpg`. `comments.images` holds JSON like `[{"path": "comments/41/a.jpg"}]`, and `key` picks the paths out of it. See [Sources](./configuration/sources.md) for HTML and URL columns.

::: tip Find every column first
A file whose column you forgot looks like an orphan. Search your code for `->store(`, `->storeAs(` and `Storage::put` to find every place that saves an upload, and add each column it writes to.
:::

## 3. Scan

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

## 4. Spot-check a few files

Pick one file you know is in use and one reported orphan, and ask about each:

```bash
php artisan orphan:explain avatars/jane.jpg
```

If a file you use shows up as an orphan, a source is missing. Add it and scan again.

## 5. Preview the clean

```bash
php artisan orphan:clean
```

This is a dry run. It lists up to 15 of the files it would move (`-v` lists all of them) and changes nothing.

## 6. Clean

```bash
php artisan orphan:clean --force
```

The files move to `.orphan-trash/public/{today's date}/` with their original paths. If something was moved by mistake:

```bash
php artisan orphan:restore avatars/jane.jpg
```

After 30 days, `orphan:purge-trash` deletes the trash for good. See [Scheduling](./guides/scheduling.md) to run all of this weekly.
