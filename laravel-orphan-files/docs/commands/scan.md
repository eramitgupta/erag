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

Finds files that no source points to and prints a summary per disk. It only reads; nothing on the disk or in the database changes.

```bash
php artisan orphan:scan
```

```
+--------+---------------------+-------+------------+---------+-----------+-----------+-------------+--------+
| Disk   | Directories         | Files | Referenced | Orphans | Protected | Cleanable | Reclaimable | Ratio  |
+--------+---------------------+-------+------------+---------+-----------+-----------+-------------+--------+
| public | avatars/, comments/ | 43    | 23         | 20      | 0         | 20        | 6.8 MB      | 46.51% |
+--------+---------------------+-------+------------+---------+-----------+-----------+-------------+--------+

   WARN  20 orphaned files (6.8 MB) can be cleaned. Preview with: php artisan orphan:clean.
```

| Column | Meaning |
| --- | --- |
| Files | Every file found in the configured directories. |
| Referenced | Files at least one source points to. |
| Orphans | Files nothing points to. |
| Protected | Orphans kept anyway, by an exclusion, a file rule or the grace period. Each filter gets its own line under the table. |
| Cleanable | Orphans a clean would remove: Orphans minus Protected. |
| Reclaimable | The size of the cleanable files. |
| Ratio | Cleanable as a share of Files. A clean stops above `max_orphan_ratio` (90%). |

## Options

| Option | Description |
| --- | --- |
| `--disk=` | Only these disks. Repeat the option or separate names with commas. |
| `--dir=` | Only these directories. They have to be inside the configured `disks` directories. |
| `--older-than=` | Use a different grace period for this run: `90m`, `48h`, `7d`, `2w`. |
| `--json` | Print the summary as JSON. |
| `--export=csv` | Write every orphan to a CSV file. |
| `--output=` | Where to write the export. Defaults to `export_path` (`storage/orphan-files`). |
| `--queue` | Run the scan as a queued job. |
| `-v` | List every orphan as it's found, with its status. |

## JSON

`--json` is handy for monitoring. Sizes are in bytes:

```json
{
    "started_at": "2026-11-15T17:35:13+00:00",
    "finished_at": "2026-11-15T17:35:13+00:00",
    "references": 23,
    "totals": {
        "files": 43,
        "referenced": 23,
        "orphans": 20,
        "protected": 0,
        "cleanable": 20,
        "total_bytes": 17901882,
        "orphan_bytes": 7115052,
        "reclaimable_bytes": 7115052
    },
    "disks": {
        "public": {
            "disk": "public",
            "directories": ["avatars/", "comments/"],
            "files": 43,
            "cleanable": 20,
            "orphan_ratio": 46.51,
            "protected_by": []
        }
    }
}
```

The `disks` entries also contain `referenced`, `orphans`, `protected` and the three byte counts; they're shortened here.

## CSV export

```bash
php artisan orphan:scan --export=csv
php artisan orphan:scan --export=csv --output=/tmp/orphans.csv
```

The file has one row per orphan, with `disk`, `path`, `size`, `last_modified`, `status` (`cleanable` or `protected`) and `reason`. It's written row by row, so a scan with a million orphans doesn't fill memory. See [Performance, Queue and Export](../configuration/performance.md#csv-export) for a sample.

## Queued scans

```bash
php artisan orphan:scan --queue
```

The terminal returns right away. The report arrives in the `OrphanScanCompleted` event:

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

$report = OrphanFiles::scan(new ScanOptions(disks: ['public']));

$report->totals()['reclaimable_bytes']; // 7115052
```
