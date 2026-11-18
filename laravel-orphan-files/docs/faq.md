---
title: "FAQ"
description: "Common questions about Laravel Orphan Files: production safety, memory use, S3, soft deletes and more."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-orphan-files/docs/faq.md
</div>

# FAQ

## Is it safe on production?

By default it only reports. A clean needs `--force` and moves files to a trash folder you can restore from. Files modified in the 24 hours before the database was read are skipped, a run stops if more than 90% of a disk would be cleaned, and it stops before touching anything if a configured table or column doesn't exist. Run a scan and check a few files with `orphan:explain` before your first clean. [Running it safely](./guides/safety.md) has the full list.

## Does it load the whole table or bucket into memory?

No. Tables are read in chunks of 1,000 rows by primary key, storage listings are streamed, and files are checked in chunks. Referenced paths are kept as hashes, about 25 MB for 250,000 of them. Past `diff.memory_limit` they move to a temporary database table. See [Performance](./configuration/performance.md).

## Does it change my database?

No. It only reads your tables. The one thing it creates is a temporary table for very large runs, which is dropped at the end and which the database removes on its own if the process dies. Set `diff.driver` to `memory` to avoid it.

## Do soft-deleted rows keep their files?

Yes. Global scopes are ignored, so a soft-deleted row still counts as a reference.

## Does saving or deleting a model remove files?

No. The `HasStorageFiles` trait only declares which columns hold files. Files are only removed by `orphan:clean --force`.

## How are S3 files deleted?

In delete mode, with `DeleteObjects` and up to 1,000 keys per request. Trash mode uses a server-side move within the bucket, so files don't leave S3.

## Where is the trash?

In `.orphan-trash/{disk}/{Y-m-d}/{original path}`, on the same disk or on `trash.disk`. Scans never look inside it. See [Trash and Safety Limit](./configuration/cleanup.md).

## Does it work with prefixed or multi-tenant disks?

Yes. A disk's `root` and a scoped disk's `prefix` are used when matching URLs and when deleting in batches.

## Is there a web UI?

No. It's command line only, with a facade for use from code.

## Which Laravel and PHP versions are supported?

Laravel 12 on PHP 8.2 or newer, and Laravel 13 on PHP 8.3 or newer.
