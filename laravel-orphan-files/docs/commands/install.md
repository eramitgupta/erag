---
title: "orphan:install"
description: "Create config/orphan-files.php, keep or overwrite an existing config, and see the next steps after installing Laravel Orphan Files."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-orphan-files/docs/commands/install.md
</div>

# orphan:install

Creates `config/orphan-files.php` and tells you what to do next. Run it once, right after `composer require`.

```bash
php artisan orphan:install
```

```
   INFO  Published config/orphan-files.php.

  Next steps
  1. In config/orphan-files.php, list your upload folders under 'disks' and the columns that store file paths under 'sources'.
  2. Run php artisan orphan:scan to see how many orphaned files you have.
  3. Run php artisan orphan:clean for a dry run, then php artisan orphan:clean --force to move the orphans to the trash.

  Docs: https://erag.in/laravel-orphan-files/
```

## Options

| Option | Description |
| --- | --- |
| `--force` | Overwrite an existing `config/orphan-files.php` without asking. |

## When the config already exists

If `config/orphan-files.php` is already there, the command asks first:

```
  config/orphan-files.php already exists. Overwrite it with the package defaults? (yes/no) [no]
```

The default answer is no. Saying no keeps your file and prints `Kept your existing config/orphan-files.php.` followed by the same next steps. Without a terminal, for example with `--no-interaction` or in a deploy script, the answer is also no, so a run never replaces your config by accident.

::: warning --force replaces your settings
With `--force` the file is overwritten with the package defaults, and your `disks` and `sources` are lost. Keep a copy, or use version control, before forcing it.
:::

## What it doesn't do

It never touches your database. It creates no migrations and no tables, and it doesn't scan or clean anything. The only file it writes is `config/orphan-files.php`.
