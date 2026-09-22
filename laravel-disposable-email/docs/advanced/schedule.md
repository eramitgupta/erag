---
title: "Schedule Blacklist Syncing"
description: "Automate daily disposable email domain list syncing using Laravel Task Scheduler and artisan commands to keep spam defenses always updated."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-disposable-email/docs/advanced/schedule.md
</div>


# Schedule Sync

Add the command to `routes/console.php`:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('erag:sync-disposable-email-list')->daily();
```

Laravel also supports `hourly()`, `weekly()`, and other scheduler frequencies. Your server must run Laravel's scheduler for the command to execute.

This application task updates the blacklist files in configured application storage.
