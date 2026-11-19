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

## What it does

It looks at one file, given as a path or a full URL, and tells you whether it is used and by which rows. If no row uses it, it tells you why the file is kept, or that a clean would remove it.

## When to use it

Before your first clean, on a few files you know are in use and a few that the scan reports as orphans. After that, whenever a result surprises you.

::: tip Does it change anything?
**Read-only.** It reads the file's details and your sources. Nothing is moved, deleted or written.
:::

## Example

These examples come from the same test run as the [scan page](./scan.md#example). The grace period was set to 3 minutes for the test; the default is 24 hours.

```bash
php artisan orphan:explain uploads/orphan-test/ref/a.jpg --disk=s3
```

```
  File ............................................. uploads/orphan-test/ref/a.jpg on [s3]
  Exists ............................................. yes, 1.2 KB, modified 3 minutes ago
  Scanned directories ............................................... uploads/orphan-test/
  Sources checked ...................................................................... 2
+-----------------------------+------+-----+-------------------------------+
| Source                      | Type | Row | Value                         |
+-----------------------------+------+-----+-------------------------------+
| orphan_test_items.file_path | path | 1   | uploads/orphan-test/ref/a.jpg |
+-----------------------------+------+-----+-------------------------------+

   INFO  Kept: referenced by 1 row.
```

How to read it:

- `File` is the path that was checked, and the disk.
- `Exists` says whether the file is on the disk, with its size and age.
- `Scanned directories` are the folders configured for that disk under `disks`.
- `Sources checked` is how many sources were searched.
- The table lists the rows that point to the file. `Source` is the table and column, `Row` is the row's primary key, and `Value` is the part of the column that mentions the file. Up to 25 rows are shown.
- The last line is the verdict.

If you leave out the path, the command asks `Which file do you want explained?` and waits for you to type a path or URL.

## Options

| Option | Description |
| --- | --- |
| `path` | The file to check: a path on the disk, like `uploads/photo.jpg`, or a full URL. If you leave it out, the command asks for it. |
| `--disk=` | The disk the file is on. Defaults to the first disk listed under `disks` in the config. |

## The possible answers

| Verdict | What it means | What `orphan:clean --force` does with it |
| --- | --- | --- |
| `Kept: referenced by ...` | At least one row points to the file. | Nothing. It is in use. |
| `Not referenced, but kept: ...` | No row points to it, but a rule protects it for now. | Nothing, as long as the rule applies. |
| `Excluded: ...` | It matches `exclude_paths` or `exclude_patterns`. | Nothing, ever. |
| `Orphan: ...` | No row points to it, and nothing protects it. | Moves it to the trash, or deletes it in delete mode. |
| `The file does not exist on this disk ...` | There is no such file, and no row mentions it. | Nothing. There is nothing to clean. |
| `Referenced by ..., but the file is missing ...` | A row points to a file that isn't on the disk. | Nothing. Fix the broken reference in your app. |

### Referenced

A JSON column works the same way. Here the file is one of two paths in a `gallery` column:

```bash
php artisan orphan:explain orphan-test/gallery/g1.jpg --disk=public
```

```
  File ............................................ orphan-test/gallery/g1.jpg on [public]
  Exists .................................................. yes, 2 KB, modified 2 days ago
  Scanned directories ....................................................... orphan-test/
  Sources checked ...................................................................... 2
+---------------------------+------+-----+----------------------------------------------------------------------------------+
| Source                    | Type | Row | Value                                                                            |
+---------------------------+------+-----+----------------------------------------------------------------------------------+
| orphan_test_items.gallery | json | 6   | [{"path": "orphan-test/gallery/g1.jpg"}, {"path": "orphan-test/gallery/g2.jpg"}] |
+---------------------------+------+-----+----------------------------------------------------------------------------------+

   INFO  Kept: referenced by 1 row.
```

### Orphan

```bash
php artisan orphan:explain uploads/orphan-test/orphans/o1.jpg --disk=s3
```

```
  File ........................................ uploads/orphan-test/orphans/o1.jpg on [s3]
  Exists ............................................. yes, 2.9 KB, modified 3 minutes ago
  Scanned directories ............................................... uploads/orphan-test/
  Sources checked ...................................................................... 2

   WARN  Orphan: none of the 2 sources reference it. orphan:clean --force would trash it.
```

If this is a file your app uses, a source is missing from the config. Add it before you clean. In delete mode the last words are `would delete it`.

### Kept by a rule

```bash
php artisan orphan:explain orphan-test/new/n1.jpg --disk=public
```

```
  File ................................................ orphan-test/new/n1.jpg on [public]
  Exists ............................................. yes, 5.9 KB, modified 2 seconds ago
  Scanned directories ....................................................... orphan-test/
  Sources checked ...................................................................... 2

   INFO  Not referenced, but kept: it was modified within the grace period (3 minutes).
```

The file was uploaded seconds ago, so it is inside the grace period. Once it is older than the grace period, it becomes an orphan if still no row points to it. Other reasons you can see here are a size or extension rule, a custom filter, or `it is outside the scanned directories (or in the trash)`.

### Excluded

```bash
php artisan orphan:explain uploads/orphan-test/excluded/e1.jpg --disk=s3
```

```
  File ....................................... uploads/orphan-test/excluded/e1.jpg on [s3]
  Exists ............................................. yes, 4.9 KB, modified 3 minutes ago
  Scanned directories ............................................... uploads/orphan-test/
  Sources checked ...................................................................... 2

   INFO  Excluded: it is excluded by path [uploads/orphan-test/excluded/]. Scans skip it and orphan:clean never touches it.
```

Excluded files are not counted by the scan at all, not even as Protected. This is the only place they show up.

### Missing file

```bash
php artisan orphan:explain orphan-test/missing.jpg --disk=public
```

```
  File ............................................... orphan-test/missing.jpg on [public]
  Exists .............................................................................. no
  Scanned directories ....................................................... orphan-test/
  Sources checked ...................................................................... 2

   WARN  The file does not exist on this disk, and no source references it.
```

Check the path and the `--disk`. If a row did point to the missing file, the verdict would be `Referenced by 1 row, but the file is missing from the disk (a broken reference).` That one isn't a problem for this package, but it is usually worth fixing in your app.

## With URLs

```bash
php artisan orphan:explain "https://cdn.example.com/products/shoe.jpg" --disk=s3
```

The URL is turned into a disk path the same way as during a scan (see [URLs and CDNs](../configuration/urls.md)), so this is a quick way to check that your `url_prefixes` are right. The `File` line shows the path it was turned into.
