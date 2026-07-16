---
title: Schedule Sync
description: Schedule automatic disposable domain syncing.
---

# Schedule Sync

Add the command to `routes/console.php`:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('erag:sync-disposable-email-list')->daily();
```

Laravel also supports `hourly()`, `weekly()`, and other scheduler frequencies. Your server must run Laravel's scheduler for the command to execute.

This application task updates the blacklist files in configured application storage.
