---
title: "Performance, Queue and Export"
description: "Chunk size, the temporary table used for large reference sets, queued scans and cleans, and CSV export."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-orphan-files/docs/configuration/performance.md
</div>

# Performance, Queue and Export

## Chunk size

```php
'chunk_size' => 1000,
```

Tables are read 1,000 rows at a time, storage files are checked 1,000 at a time, and trash, delete and event batches use the same size. The default is fine for most apps.

## How references are stored during a run

```php
'diff' => [
    'driver' => 'auto',
    'memory_limit' => 250000,
    'connection' => null,
],
```

Every referenced path is hashed and kept in a set while the run compares storage against it.

| Driver | What it does |
| --- | --- |
| `auto` | Keeps the set in memory up to `memory_limit` references, then moves it to a temporary table. |
| `memory` | Always keeps the set in memory. |
| `database` | Uses the temporary table from the start. |

250,000 references take about 25 MB of PHP memory (measured on PHP 8.4). Past that, the temporary table keeps memory flat however many rows you have.

The temporary table is created on `connection` (`null` means your default connection). It's a real temporary table on MySQL, MariaDB, PostgreSQL, SQLite and SQL Server, so the database drops it on its own if the process dies. The package also drops it at the end of every run.

If the database user isn't allowed to create temporary tables, `auto` mode stays in memory and logs a warning, and `database` mode stops with an error like this:

```
Could not create the temporary reference table on database connection [mysql]: SQLSTATE[42000]: ... Access denied for user 'app'@'localhost' ... Grant the database user permission to create temporary tables, or set "orphan-files.diff.driver" to "memory".
```

Any other value for `driver` stops the run with an error naming the three allowed values.

## Queue

```php
'queue' => [
    'connection' => null,
    'name' => null,
],
```

`--queue` dispatches the work as a job instead of running it in the terminal:

```bash
php artisan orphan:scan --queue
php artisan orphan:clean --force --queue
```

The jobs are `RunScanJob` and `CleanOrphansJob`, and each tries once. A queued clean needs `--force`, because a queued dry run would have no one to show its result to. To use a queued scan's report, listen for the `OrphanScanCompleted` event. `connection` and `name` pick the queue connection and queue name; `null` uses your defaults.

Long scans of big buckets can run longer than your worker's `--timeout`. Give the worker that runs these jobs a higher timeout.

## CSV export

```php
'export_path' => storage_path('orphan-files'),
```

`orphan:scan --export=csv` writes every orphan to `storage/orphan-files/orphans-2026-11-15_101500.csv` unless you pass `--output`. The columns are:

```
disk,path,size,last_modified,status,reason
public,avatars/maya-patel-old.jpg,455373,2026-10-02T09:14:11Z,cleanable,
public,avatars/default.png,1840,2026-01-12T08:00:00Z,protected,"it matches the excluded pattern [avatars/default.png]"
```

`status` is `cleanable` or `protected`, and `reason` says why a protected file is kept.

## Events

| Event | When |
| --- | --- |
| `OrphanScanCompleted` | After every scan, including the scan a clean starts with. Holds the `ScanReport`. |
| `OrphanFilesTrashed` | Once per batch moved to the trash, with `disk`, `paths`, `bytes`, `trashDisk` and `trashDirectory`. |
| `OrphanFilesDeleted` | Once per batch deleted for good (delete mode or purge), with `disk`, `paths` and `bytes`. |

All three live in `Erag\OrphanFiles\Events`.
