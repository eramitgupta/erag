---
title: "Using it from code"
description: "Call scan, clean, explain and the queue helpers from PHP through the OrphanFiles facade."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-orphan-files/docs/guides/code.md
</div>

# Using it from code

The Artisan commands are thin wrappers around the `OrphanFiles` facade. You can call the same methods from a controller, a job or a test.

```php
use Erag\OrphanFiles\Facades\OrphanFiles;
use Erag\OrphanFiles\Support\Data\CleanOptions;
use Erag\OrphanFiles\Support\Data\ScanOptions;
```

## Scan

```php
$report = OrphanFiles::scan(new ScanOptions(disks: ['s3']));

$report->totals();
// ['files' => ..., 'referenced' => ..., 'orphans' => ..., 'protected' => ...,
//  'cleanable' => ..., 'total_bytes' => ..., 'orphan_bytes' => ..., 'reclaimable_bytes' => ...]
```

`ScanOptions` takes three optional arguments:

| Argument | Default | Meaning |
| --- | --- | --- |
| `disks` | `null` | Disks to scan. `null` scans every disk in `config/orphan-files.php`. |
| `directories` | `null` | Narrow the scan to these folders. They have to sit inside the configured directories. |
| `minimumAgeMinutes` | `null` | Replaces `grace_period_hours` for this run. |

A scan only reads. It fires the `OrphanScanCompleted` event when it finishes.

## Clean

```php
OrphanFiles::clean(new CleanOptions(mode: 'trash', dryRun: false));
```

`CleanOptions` defaults to `dryRun: true`, so `OrphanFiles::clean()` with no arguments only reports what it would do. Pass `dryRun: false` to move files.

| Argument | Default | Meaning |
| --- | --- | --- |
| `scan` | `new ScanOptions` | Which disks and directories to clean. |
| `mode` | `null` | `'trash'` or `'delete'`. `null` uses the `mode` from config. |
| `limit` | `null` | Stop after this many files. |
| `dryRun` | `true` | Report only, don't touch storage. |
| `forceRatio` | `false` | Skip the [safety threshold](../configuration/cleanup.md). |

To clean one disk, pass a `ScanOptions` as `scan`:

```php
$result = OrphanFiles::clean(new CleanOptions(
    scan: new ScanOptions(disks: ['s3'], directories: ['avatars']),
    dryRun: false,
));

$result->action->processed; // files moved to the trash
$result->action->bytes;     // total size of those files
```

A real clean throws `Erag\OrphanFiles\Exceptions\SafetyThresholdExceeded` if more than `max_orphan_ratio` percent of a disk would go. A dry run doesn't throw; it lists the problem in `$result->ratioViolations` instead.

## Queue it

```php
OrphanFiles::queueScan();
OrphanFiles::queueClean(new CleanOptions(dryRun: false));
```

Both dispatch a job to the connection and queue set under `queue` in the config. `queueClean()` follows the same dry-run default, so leave out `dryRun: false` and the job only reports.

## Check a single file

```php
OrphanFiles::explain('avatars/jane.jpg', 'public')->verdict();
// 'referenced', 'protected', 'orphan' or 'missing'

OrphanFiles::isReferenced('public', 'avatars/jane.jpg'); // true or false
```

`explain()` accepts a path or a full URL and returns the matching rows as well as the verdict, the same data [`orphan:explain`](../commands/explain.md) prints. `isReferenced()` stops at the first match, so it is the cheaper choice when you only need a yes or no. Neither changes anything.

## Trash

```php
OrphanFiles::restore('public', ['avatars/jane.jpg']);
OrphanFiles::restoreAll('public');
OrphanFiles::purgeTrash('public', retentionDays: 30, dryRun: true);
```

These match [`orphan:restore`](../commands/restore.md) and [`orphan:purge-trash`](../commands/purge-trash.md). Each returns an `ActionResult` with `processed`, `failed` and `bytes`.

To add sources, extractors, normalizers or filters from a service provider, see [Custom extractors](../extending/extractors.md), [Normalizers](../extending/normalizers.md) and [Filters](../extending/filters.md).
