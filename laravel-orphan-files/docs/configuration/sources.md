---
title: "Sources"
description: "Tell Laravel Orphan Files which database columns point to stored files: path, json, html and url columns with examples."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-orphan-files/docs/configuration/sources.md
</div>

# Sources

A source is a database column that can point to a stored file. Every file that a source points to is kept. Everything else in the configured folders is an orphan.

```php
'sources' => [
    ['table' => 'users', 'column' => 'avatar', 'type' => 'path', 'disk' => 'public'],
    ['model' => App\Models\Comment::class, 'column' => 'images', 'type' => 'json', 'key' => '*.path'],
    ['table' => 'posts', 'column' => 'body', 'type' => 'html'],
    ['table' => 'products', 'column' => 'image_url', 'type' => 'url', 'disk' => 's3'],
],
```

::: warning A missing source looks like an orphan
If you forget a column, the files it points to are reported as orphans. Before your first clean, check every place your code saves an upload and run [`orphan:explain`](../commands/explain.md) on a few files you know are in use.
:::

## Options

| Option | Description |
| --- | --- |
| `table` or `model` | Where to read. A model gives the table, connection and primary key. |
| `column` | The column with the reference. `'*'` passes the whole row to a [custom extractor](../extending/extractors.md). |
| `type` | `path`, `json`, `html`, `url`, or a type you register. Defaults to `path`. |
| `disk` | Only keep files on this disk. Without it, matching paths are kept on every scanned disk. |
| `key` | For `json`: the dot path, or a list of dot paths, to read. |
| `separator` | For `path`: when one column holds several paths, e.g. `','`. |
| `connection` | The database connection. Defaults to the model's connection, or the default one. |
| `primary_key` | A unique column used to read the table in chunks. Defaults to `id` or the model's key. |

Tables are read in chunks of `chunk_size` (1,000 rows) by primary key, so a table with millions of rows is fine. A table without a single unique key can't be read in chunks, and the run stops with an error asking for `primary_key`.

Global scopes are ignored, even when you use `model`. A soft-deleted row still keeps its file, because restoring the row should bring the file back too.

Rows are always read from the primary connection, never from a read replica. A replica that lags behind could miss a reference that was just saved.

## path

The column holds one path on the disk:

```php
['table' => 'users', 'column' => 'avatar', 'type' => 'path', 'disk' => 'public'],
```

`avatars/jane.jpg` keeps `avatars/jane.jpg`. These variants are understood too:

| Stored value | Keeps |
| --- | --- |
| `/avatars/jane.jpg` | `avatars/jane.jpg` |
| `avatars/my%20photo.jpg` | `avatars/my photo.jpg` (and the encoded name) |
| `avatars/jane.jpg?v=3` | `avatars/jane.jpg` |
| `/storage/avatars/jane.jpg` | `avatars/jane.jpg` on the `public` disk |
| `/var/www/app/storage/app/public/avatars/jane.jpg` | `avatars/jane.jpg` on a local disk with that root |

If a column holds several paths in one string, set `separator`:

```php
['table' => 'products', 'column' => 'gallery', 'type' => 'path', 'separator' => ','],
```

## json

The column holds JSON. `key` is a dot path with `*` wildcards:

```php
['table' => 'comments', 'column' => 'images', 'type' => 'json', 'key' => '*.path'],
```

For a row like this:

```json
[
  { "path": "comments/41/a.jpg", "alt": "Before" },
  { "path": "comments/41/b.jpg", "alt": "After" }
]
```

both images are kept. Deeper structures work the same way:

```php
'key' => 'gallery.*.sizes.*.url',
'key' => ['cover.path', 'gallery.*.path'],   // several keys
```

Without a `key`, every string in the JSON counts as a possible reference. That's safe but slower on large documents, and a caption that happens to look like a path keeps a file. A value that isn't valid JSON is treated as a single path, and JSON stored as an encoded string is decoded twice.

## html

The column holds rich text, HTML or Markdown:

```php
['table' => 'posts', 'column' => 'body', 'type' => 'html'],
```

Paths and URLs are read from `src`, `href`, `srcset`, `poster`, `data-src`, `data-href`, `data-url`, `data-original` and `xlink:href` attributes, CSS `url()` in inline styles, Markdown links and images, and plain `http(s)://` URLs in the text. HTML entities are decoded first, so `url(&quot;/storage/posts/bg.jpg&quot;)` works.

Both of these keep `posts/chart.png`:

```html
<img src="https://example.com/storage/posts/chart.png">
<img srcset="/storage/posts/chart.png 1x, /storage/posts/chart@2x.png 2x">
```

## url

The column holds a full URL, from `Storage::url()`, a CDN or a signed link:

```php
['table' => 'products', 'column' => 'image_url', 'type' => 'url', 'disk' => 's3'],
```

`https://my-bucket.s3.eu-west-1.amazonaws.com/products/shoe.jpg?X-Amz-Signature=...` keeps `products/shoe.jpg`. How URLs are matched to a disk is on the [URLs and CDNs](./urls.md) page.

## Your own types

Any other column format, such as an Editor.js document or a custom JSON shape, needs a small extractor class. See [Custom extractors](../extending/extractors.md).
