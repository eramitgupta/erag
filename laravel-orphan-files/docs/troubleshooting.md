---
title: "Troubleshooting"
description: "Fix common problems: files reported as orphans that are in use, safety limit errors, missing tables and temporary table permissions."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-orphan-files/docs/troubleshooting.md
</div>

# Troubleshooting

## A file I use shows up as an orphan

Run explain on it:

```bash
php artisan orphan:explain avatars/jane.jpg
```

If it says "Orphan", no source points to it. The usual causes:

- The column isn't listed in `sources`, and the model doesn't use `HasStorageFiles`.
- The source has a `disk` that doesn't match the file's disk.
- The column stores a URL from a CDN that isn't in `url_prefixes`.
- The column stores the path in a format of its own. Write a [normalizer](./extending/normalizers.md) or a [custom extractor](./extending/extractors.md).
- The model lives outside `app/Models`. Add it to `discovery.models`.

## The clean stops with "Too many files would be cleaned"

More than `max_orphan_ratio` (90%) of a disk would go. Run `orphan:explain` on a few of the reported files. If any of them is in use, a source is missing; fix that rather than raising the limit.

## "Source [...]: table [...] doesn't exist"

A source points to a table that isn't there on that connection, often after renaming a table or on a fresh database that hasn't been migrated. Fix or remove the source in `config/orphan-files.php`. The run stops before reading anything, so nothing is touched.

## "a unique primary_key is required"

Tables are read in chunks by a unique column. Set `primary_key` on the source to a unique, sortable column, such as `uuid`.

## "Disk [...] isn't listed under disks"

`--disk` only accepts disks from the `disks` config. Add the disk and its folders there first.

## "Could not create the temporary reference table"

The database user may not create temporary tables. Grant the permission (on MySQL, `CREATE TEMPORARY TABLES`) or set:

```php
'diff' => [
    'driver' => 'memory',
],
```

In `auto` mode this doesn't stop the run. The package stays in memory and logs a warning.

## Recently uploaded files are reported as protected

That's the grace period at work: files modified in the 24 hours before the database was read aren't cleaned. They'll be cleanable on a later run if they're still unreferenced.

Files you just restored on S3 or MinIO count as recent too. A restore there is a copy, so the file gets a new "last modified" time. See [How a file moves](./quick-start.md#how-a-file-moves).

## explain is slow

With [normalizers](./extending/normalizers.md) configured, or `case_sensitive` set to `false`, explain reads every row of each source instead of narrowing the search by file name. Scans and cleans are not affected.

## The scan finds nothing at all

Check that `disks` lists the right disk name and folders, and that the folders exist on that disk. A disk with an empty list scans the whole disk, which is a quick way to confirm the disk itself is reachable.
