---
title: "Scheduling"
description: "Run orphan scans, cleans and trash purges on a schedule with the Laravel scheduler."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-orphan-files/docs/guides/scheduling.md
</div>

# Scheduling

All commands work with Laravel's scheduler. In `routes/console.php`:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('orphan:scan --json')->weekly();
Schedule::command('orphan:clean --force')->weekly()->sundays()->at('03:00')->withoutOverlapping();
Schedule::command('orphan:purge-trash')->daily();
```

Do the first cleanup by hand before you schedule anything. The [Quick Start](../quick-start.md) walks through it.

## Start with the scan only

Schedule `orphan:scan` first and leave the clean out for a few weeks. If the numbers stay steady and the files you spot-check with `orphan:explain` are really unused, add the clean.

A scan's report is also dispatched as the `OrphanScanCompleted` event, so you can log it or send it to a channel:

```php
use Erag\OrphanFiles\Events\OrphanScanCompleted;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;

Event::listen(function (OrphanScanCompleted $event) {
    $totals = $event->report->totals();

    Log::info("Orphan scan: {$totals['cleanable']} files, {$totals['reclaimable_bytes']} bytes can be cleaned");
});
```

## Keep the safety checks on

A scheduled clean keeps the grace period and the 90% safety limit. Don't add `--force-ratio` or `--mode=delete` to a scheduled command. If a source goes missing after a refactor, the limit is what stops the next run from trashing most of the disk. In that case the command fails, and Laravel's scheduler output or your error monitoring will show the message.

## Big buckets

A clean of millions of objects can take a while. `withoutOverlapping()` stops a second run from starting while the first is still going. You can also hand the work to a queue worker:

```php
Schedule::command('orphan:clean --force --queue')->weekly();
```

Give that worker a `--timeout` long enough for a full run.

## Purging the trash

`orphan:purge-trash` deletes trash older than `trash.retention_days` (30). Running it daily keeps the trash at about a month of cleaned files. If you'd like a longer window to restore things, raise `retention_days` instead of running the purge less often.
