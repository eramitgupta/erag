---
title: "Introduction"
description: "What Laravel Orphan Files does, when you need it, and what it will never do on its own."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-orphan-files/docs/introduction.md
</div>

# Introduction

`erag/laravel-orphan-files` finds files on your Laravel disks that no database row points to any more, and moves them to a trash folder you can restore from.

## The problem

Most apps store uploads on a disk and save the path in a column. When a user replaces their avatar or deletes a comment, the row changes but the old file stays where it was. After a year or two, a good part of a bucket can be files nobody will ever load again.

Deleting them by hand is risky because you have to know every column that might still point to a file. This package does that bookkeeping for you:

1. It lists the files in the disks and folders you configure.
2. It reads every column you list as a source (plain paths, JSON, rich text, full URLs).
3. Files that nothing points to are orphans. It can report them, move them to a trash folder, or delete them.

In the recording on the home page, 160 of 320 images on a MinIO bucket (593.1 MB) turn out to be orphans.

## What it does not do

- It never runs on its own. Nothing happens until you run a command or schedule one.
- It doesn't listen to model events. Saving or deleting a model never touches storage.
- It has no migrations, no tables and no web UI. Everything is worked out when you run a command.
- It only looks inside the disks and directories you list under `disks`. Anything else on the disk is left alone.

## How a clean is kept safe

- `orphan:clean` is a dry run until you add `--force`.
- By default files are moved to `.orphan-trash/` on the same disk, not deleted. `orphan:restore` moves them back.
- Files modified in the 24 hours before the database was read are skipped, so an upload whose row isn't saved yet is safe.
- If more than 90% of a disk would be cleaned, the run stops. That number almost always means a source is missing from the config.
- If a configured table or column doesn't exist, the run stops before anything is read.

The [Running it safely](./guides/safety.md) guide covers these in more detail.

## Requirements

| Laravel | PHP |
| --- | --- |
| 12.x | 8.2, 8.3, 8.4 |
| 13.x | 8.3, 8.4 |

S3, MinIO, RustFS and other S3-compatible disks also need `league/flysystem-aws-s3-v3`, which most apps using S3 already have.

Next: [Installation](./installation.md).
