---
title: "orphan:explain"
description: "Check one file or URL: which rows reference it, or why it counts as an orphan or is kept."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-orphan-files/docs/commands/explain.md
</div>

# orphan:explain

Tells you whether one file is referenced, and by which rows. Use it before your first clean and whenever a result surprises you.

```bash
php artisan orphan:explain avatars/maya-patel.jpg
```

```
  File ............................................... avatars/maya-patel.jpg on [public]
  Exists ............................................ yes, 297.1 KB, modified 1 month ago
  Scanned directories ............................................... avatars/, comments/
  Sources checked ..................................................................... 2
+--------------+------+-----+------------------------+
| Source       | Type | Row | Value                  |
+--------------+------+-----+------------------------+
| users.avatar | path | 2   | avatars/maya-patel.jpg |
+--------------+------+-----+------------------------+

   INFO  Kept: referenced by 1 row(s).
```

`Row` is the primary key of the row, and `Value` is the part of the column that mentions the file. Up to 25 rows are shown.

## Options

| Option | Description |
| --- | --- |
| `path` | A disk path, or a URL such as `https://cdn.example.com/products/shoe.jpg`. |
| `--disk=` | The disk of the file. Defaults to the first configured disk. |

## Possible answers

An orphan:

```
   WARN  Orphan: none of the 2 sources reference it. orphan:clean --force would trash it.
```

Not referenced, but kept by a filter:

```
   INFO  Not referenced, but kept: it was modified within the grace period (24 hours).
```

The reason can also be an exclusion, a size or extension rule, a custom filter, or that the file is outside the scanned directories.

A row points to a file that doesn't exist:

```
   WARN  Referenced by 1 row(s), but the file is missing from the disk (a broken reference).
```

That one isn't a problem for this package, but it's usually worth fixing in your app.

## With URLs

```bash
php artisan orphan:explain "https://cdn.example.com/products/shoe.jpg" --disk=s3
```

The URL is turned into a disk path the same way as during a scan (see [URLs and CDNs](../configuration/urls.md)), so this is a quick way to check that your `url_prefixes` are right.
