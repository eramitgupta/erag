---
title: "orphan:scan"
description: "Find storage files that no database row references, with a summary per disk, JSON output and CSV export."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-orphan-files/docs/commands/scan.md
</div>

# orphan:scan

## What it does

It lists the files in the folders you configured, checks your database for rows that point to them, and prints a summary per disk. A file that no row points to is an orphan.

## When to use it

Before your first clean, to see how many orphans you have and whether the numbers look right. After that, whenever you want a report, for example once a week on a schedule, or with `--json` for monitoring.

::: tip Does it change anything?
**Read-only.** It reads your storage and your database and changes neither. The only thing it can write is the CSV file you ask for with `--export=csv`.
:::

## Example

The output on this page, and on the other command pages, comes from a real test run on two disks: `s3` (a MinIO bucket) with the folder `uploads/orphan-test/`, and `public` with the folder `orphan-test/`. A table called `orphan_test_items` has a `file_path` column with a plain path and a `gallery` column with JSON like `[{"path": "orphan-test/gallery/g1.jpg"}]`. Each folder held the same 11 files:

| Files | Why they are there | What should happen |
| --- | --- | --- |
| `ref/a.jpg`, `ref/b.jpg` | A row's `file_path` points to them. | Kept |
| `gallery/g1.jpg`, `gallery/g2.jpg` | A row's `gallery` lists them. | Kept |
| `orphans/o1.jpg`, `orphans/o2.jpg`, `orphans/o3.pdf`, `orphans/nested/o4.jpg` | No row points to them. | Cleaned |
| `new/n1.jpg` | Just uploaded, and its row isn't saved yet. | Kept for now, by the grace period |
| `excluded/e1.jpg`, `excluded/e2.jpg` | They sit in an excluded folder. | Skipped completely |

The files on `public` were two days old and the files on `s3` a few minutes old. The grace period was set to 3 minutes so the test didn't have to wait a day. The default is 24 hours; keep it on a real app.

```bash
php artisan orphan:scan
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

   WARN  8 orphaned files (29.3 KB) can be cleaned. Preview with: php artisan orphan:clean.
```

The last line adds up every disk: 4 cleanable files on each. When there is nothing to clean, it says `No orphaned files to clean.` instead.

## What the columns mean

| Column | Meaning | In the example (`s3`) |
| --- | --- | --- |
| Files | Files found in the scanned folders. Excluded paths and the trash folder are skipped and not counted. | 9: the folder holds 11 files, and 2 are excluded. |
| Referenced | Files that at least one source points to. | 4 |
| Orphans | Files that no source points to. | 5 |
| Protected | Orphans that are kept anyway, by the grace period, a size or extension rule, or a custom filter. | 1: the new upload, still inside the grace period. |
| Cleanable | Orphans a clean would remove: Orphans minus Protected. | 4 (5 minus 1) |
| Reclaimable | The total size of the cleanable files. | 14.6 KB |
| Ratio | Cleanable divided by Files. A forced clean stops when a disk is above `max_orphan_ratio` (90 by default). | 44.44% (4 of 9) |

Each `Protected on [disk] by ...` line under the table says which rule kept how many files. `grace_period` is the grace period, `file_rule` covers the size and extension rules, and a custom filter shows up under its class name, for example `archived_tenant` for `ArchivedTenantFilter`.

Excluded files are not Protected. They are skipped before anything is counted, so they don't show up in any column and don't change the ratio. `orphan:explain` still tells you when a file is excluded.

## Options

| Option | Description |
| --- | --- |
| `--disk=` | Only scan these disks. Repeat the option or separate names with commas. A disk has to be listed under `disks` in the config. |
| `--dir=` | Only scan these folders. They have to be inside the configured folders: `--dir` can narrow a scan, never widen it. |
| `--older-than=` | Use this grace period for this run instead of `grace_period_hours`. Units are `m`, `h`, `d` and `w`, for example `90m`, `48h`, `7d` or `2w`. A plain number means hours. |
| `--json` | Print the report as JSON instead of the table. |
| `--export=csv` | Also write every orphan, cleanable or protected, to a CSV file. CSV is the only format. |
| `--output=` | Where to write the CSV. Defaults to a file in `export_path` (`storage/orphan-files`). |
| `--queue` | Run the scan as a queued job instead of in the terminal. |
| `-v` | Also print every orphan as it is found, with the reason it is kept, or `cleanable`. |

## A different grace period for one run

```bash
php artisan orphan:scan --older-than=1h
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

   WARN  4 orphaned files (14.6 KB) can be cleaned. Preview with: php artisan orphan:clean.
```

The files on `s3` had been uploaded a few minutes earlier, so with a one hour grace period all 5 orphans are protected. The files on `public` were two days old, so 4 of them stay cleanable.

A duration the command doesn't understand stops it before anything is read:

```bash
php artisan orphan:scan --older-than=30s
```

```
   ERROR  Invalid duration [30s]. Use e.g. 90m, 48h, 7d or 2w.
```

## JSON

`--json` prints the same numbers for scripts and monitoring. Sizes are in bytes, and `references` is the number of unique file references found in the database.

```bash
php artisan orphan:scan --disk=s3 --json
```

```json
{
    "started_at": "2026-11-19T17:56:03+00:00",
    "finished_at": "2026-11-19T17:56:03+00:00",
    "references": 8,
    "totals": {
        "files": 9,
        "referenced": 4,
        "orphans": 5,
        "protected": 1,
        "cleanable": 4,
        "total_bytes": 28200,
        "orphan_bytes": 21000,
        "reclaimable_bytes": 15000
    },
    "disks": {
        "s3": {
            "disk": "s3",
            "directories": [
                "uploads/orphan-test/"
            ],
            "files": 9,
            "referenced": 4,
            "orphans": 5,
            "protected": 1,
            "cleanable": 4,
            "total_bytes": 28200,
            "orphan_bytes": 21000,
            "reclaimable_bytes": 15000,
            "orphan_ratio": 44.44,
            "protected_by": {
                "grace_period": 1
            }
        }
    }
}
```

## CSV export

```bash
php artisan orphan:scan --export=csv
```

The table and the warning are printed as usual, with one extra line:

```
   INFO  Exported 10 orphans to storage/orphan-files/orphans-2026-11-19_174623.csv.
```

Pass `--output=` to choose the file yourself, for example `--output=/tmp/orphans.csv`.

The file has one row per orphan, both cleanable and protected, so the 8 cleanable and 2 protected files make 10 rows. The columns are `disk`, `path`, `size`, `last_modified`, `status` (`cleanable` or `protected`) and `reason`:

```
disk,path,size,last_modified,status,reason
s3,uploads/orphan-test/new/n1.jpg,6000,2026-11-19T17:56:02Z,protected,"it was modified within the grace period (3 minutes)"
s3,uploads/orphan-test/orphans/nested/o4.jpg,4500,2026-11-19T17:52:43Z,cleanable,
s3,uploads/orphan-test/orphans/o1.jpg,3000,2026-11-19T17:52:43Z,cleanable,
s3,uploads/orphan-test/orphans/o2.jpg,3500,2026-11-19T17:52:43Z,cleanable,
s3,uploads/orphan-test/orphans/o3.pdf,4000,2026-11-19T17:52:43Z,cleanable,
public,orphan-test/new/n1.jpg,6000,2026-11-19T17:56:02Z,protected,"it was modified within the grace period (3 minutes)"
public,orphan-test/orphans/o2.jpg,3500,2026-11-17T17:52:43Z,cleanable,
public,orphan-test/orphans/o1.jpg,3000,2026-11-17T17:52:43Z,cleanable,
public,orphan-test/orphans/o3.pdf,4000,2026-11-17T17:52:43Z,cleanable,
public,orphan-test/orphans/nested/o4.jpg,4500,2026-11-17T17:52:43Z,cleanable,
```

Excluded files are not in the export. The file is written row by row, so a scan with a million orphans doesn't fill memory. See [Performance, Queue and Export](../configuration/performance.md#csv-export) for the `export_path` setting.

## Queued scans

```bash
php artisan orphan:scan --queue
```

The terminal returns right away with `The scan was queued. Listen for the OrphanScanCompleted event to read the report.` The report arrives in the `OrphanScanCompleted` event:

```php
use Erag\OrphanFiles\Events\OrphanScanCompleted;
use Illuminate\Support\Facades\Event;

Event::listen(function (OrphanScanCompleted $event) {
    $totals = $event->report->totals();

    logger()->info('Orphan scan', $totals);
});
```

## From code

```php
use Erag\OrphanFiles\Facades\OrphanFiles;
use Erag\OrphanFiles\Support\Data\ScanOptions;

$report = OrphanFiles::scan(new ScanOptions(disks: ['s3']));

$report->totals()['reclaimable_bytes']; // 15000 in the example above
```

Next: check a few of the reported files with [`orphan:explain`](./explain.md).
