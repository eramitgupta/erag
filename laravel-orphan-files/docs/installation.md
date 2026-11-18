---
title: "Installation"
description: "Install erag/laravel-orphan-files with Composer and create the config file with php artisan orphan:install."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-orphan-files/docs/installation.md
</div>

# Installation

## Requirements

| Laravel | PHP |
| --- | --- |
| 12.x | 8.2, 8.3, 8.4 |
| 13.x | 8.3, 8.4 |

S3, MinIO, RustFS and other S3-compatible disks also need `league/flysystem-aws-s3-v3`, covered [below](#s3-minio-and-rustfs).

## Install the package

Two commands set everything up:

```bash
composer require erag/laravel-orphan-files
php artisan orphan:install
```

Laravel discovers the service provider and the `OrphanFiles` facade on its own.

## What orphan:install does

- It creates `config/orphan-files.php` with the package defaults.
- If that file already exists, it asks before overwriting it. Answer no, or run it without a terminal, and your config is kept.
- `--force` overwrites the file without asking.
- It prints the next steps.
- It never touches your database and creates no migrations.

```
   INFO  Published config/orphan-files.php.

  Next steps
  1. In config/orphan-files.php, list your upload folders under 'disks' and the columns that store file paths under 'sources'.
  2. Run php artisan orphan:scan to see how many orphaned files you have.
  3. Run php artisan orphan:clean for a dry run, then php artisan orphan:clean --force to move the orphans to the trash.

  Docs: https://erag.in/laravel-orphan-files/
```

Out of the box the config scans nothing: `disks` and `sources` are empty until you fill them in. The [quick start](./quick-start.md) shows a first setup, and the [orphan:install page](./commands/install.md) lists its options.

::: tip Alternative
You can also publish the config with Laravel's own command: `php artisan vendor:publish --tag=orphan-files-config`. It creates the same file but skips the overwrite question and the next steps.
:::

## S3, MinIO and RustFS

Laravel's S3 driver needs the Flysystem adapter. If your app already uses an `s3` disk, you have it.

```bash
composer require league/flysystem-aws-s3-v3 "^3.0"
```

MinIO and RustFS use the same S3 driver with a custom endpoint. See [MinIO and RustFS](./configuration/urls.md#minio-and-rustfs) for the disk config.

## Check that it works

```bash
php artisan list orphan
```

You should see six commands:

```
  orphan:clean        Trash or delete orphaned storage files (dry run unless --force).
  orphan:explain      Show whether a file is referenced, and where, or why it counts as an orphan.
  orphan:install      Publish the orphan-files config file and show the next steps.
  orphan:purge-trash  Permanently delete trashed orphan files older than the retention period.
  orphan:restore      Restore trashed orphan files to their original paths.
  orphan:scan         Find storage files that no database row references.
```

## AI agents and Laravel Boost

The package ships a [Laravel Boost](https://github.com/laravel/boost) guideline and an `orphan-files-setup` skill. If your app uses Boost, `php artisan boost:install` or `php artisan boost:update` adds them for your coding agent. The guideline tells agents to preview with a scan or dry run and to ask before using `--force`, delete mode or `--force-ratio`. The package doesn't require `laravel/boost`.
