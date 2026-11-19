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

## What it does

It creates `config/orphan-files.php` with the package defaults and prints what to do next.

## When to use it

Once, right after `composer require erag/laravel-orphan-files`. Run it again later only if you want to go back to the default config.

::: tip Does it change anything?
**Writes one file.** It creates `config/orphan-files.php`. An existing file is only replaced if you answer yes or pass `--force`. Your storage and your database are never touched.
:::

## Example

### First install

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

### The config already exists

If `config/orphan-files.php` is already there, the command asks before it writes anything. The default answer is no, so pressing Enter keeps your file:

```bash
php artisan orphan:install
```

```
  config/orphan-files.php already exists. Overwrite it with the package defaults? (yes/no) [no]
❯ no

   INFO  Kept your existing config/orphan-files.php.

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

## What happens to an existing config

| You run | No config yet | Config already exists |
| --- | --- | --- |
| `php artisan orphan:install` | Created | Asks first. The default answer, no, keeps your file. |
| `php artisan orphan:install --no-interaction` | Created | Kept. There is no question, and the answer is no. |
| `php artisan orphan:install --force` | Created | Overwritten with the defaults, without asking. |

Without a terminal, for example in a deploy script, the command behaves like `--no-interaction`. A deploy never replaces your config by accident.

::: warning --force replaces your settings
With `--force` the file is overwritten with the package defaults, and your `disks` and `sources` are gone. Keep a copy, or commit the file to version control, before you force it.
:::

## What it doesn't do

It creates no migrations and no tables, and it doesn't scan or clean anything. The only file it writes is `config/orphan-files.php`.

Laravel's own `php artisan vendor:publish --tag=orphan-files-config` creates the same file, but it skips the overwrite question and the next steps.

Next: fill in `disks` and `sources` and follow the [Quick Start](../quick-start.md).
