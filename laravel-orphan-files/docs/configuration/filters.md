---
title: "Exclusions, File Rules and Grace Period"
description: "Keep files that must never be cleaned: exclusions, size and extension rules, and the grace period for recent uploads."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-orphan-files/docs/configuration/filters.md
</div>

# Exclusions and Grace Period

Filters decide which orphans are kept anyway. A kept orphan shows up as "Protected" in the scan, and `orphan:explain` tells you which rule kept it.

## Exclusions

```php
'exclude_paths' => [
    '.gitignore',
    '.gitkeep',
],

'exclude_patterns' => [
    'defaults/*',
    '*.pdf',
],
```

`exclude_paths` holds exact paths. An entry without a slash matches that file name in any folder, so `.gitignore` also keeps `avatars/.gitignore`. An entry ending in a slash keeps a whole folder, for example `'avatars/defaults/'`.

`exclude_patterns` holds glob patterns, where `*` matches across folders. A pattern without a slash is matched against the file name, so `*.pdf` keeps every PDF.

Placeholder images are the usual reason to exclude something: `avatars/default.png` is often not stored in any row, because the app falls back to it in code.

## Size and extension rules

```php
'min_size' => null,           // bytes
'max_size' => null,
'only_extensions' => [],
'except_extensions' => [],
```

Only orphans inside these rules are cleaned. Some examples:

```php
'min_size' => 1024,                          // ignore files under 1 KB
'only_extensions' => ['jpg', 'jpeg', 'png', 'webp'],
'except_extensions' => ['pdf'],              // never clean PDFs
```

Extensions are compared in lower case, and a leading dot is fine. If a size rule is set but the disk can't report a file's size, the file is kept.

## Grace period

```php
'grace_period_hours' => 24,
```

Files modified less than 24 hours before the database was read are never cleaned. This covers the gap between storing an upload and saving the row that points to it, for example a multi-step form or a queued job.

The age is measured from when the package started reading the database, not from when the file is reached. A clean of a large bucket can take a while, and an image uploaded during the run is therefore always safe. A file whose modification time the disk can't report is kept too.

For one run, `--older-than` replaces the grace period:

```bash
php artisan orphan:clean --older-than=7d
```

It accepts `90m`, `48h`, `7d` or `2w`. A plain number means hours.

::: warning Shorter than the default
`--older-than=1h` or `grace_period_hours` below 24 shrinks the safety margin for uploads whose row isn't saved yet. Only lower it if you know how long your upload flow takes.
:::

## Custom filters

For rules that depend on your app, such as "keep anything a published post links to", see [Filters](../extending/filters.md).
