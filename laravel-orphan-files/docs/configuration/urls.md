---
title: "URLs and CDNs"
description: "How Laravel Orphan Files maps stored URLs back to disk paths, including S3, MinIO, RustFS, CDN prefixes and signed URLs."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-orphan-files/docs/configuration/urls.md
</div>

# URLs and CDNs

Columns often hold a full URL instead of a path. Before comparing, the package strips the part of the URL that points to the disk.

## Known base URLs

A URL is turned back into a path when it starts with one of these:

- the disk's `Storage::url()`, for example `https://example.com/storage/` on the `public` disk
- the disk's `url` option
- an S3 endpoint for the disk's bucket and region, virtual-hosted (`https://my-bucket.s3.eu-west-1.amazonaws.com/`) or path-style (`https://s3.eu-west-1.amazonaws.com/my-bucket/`)
- the `endpoint` of a MinIO, RustFS or other S3-compatible disk, path-style (`http://minio.local:9000/my-bucket/`) or with the bucket as a subdomain
- one of your `url_prefixes`

The disk's `root` (and a scoped disk's `prefix`) is taken into account, so on an S3 disk with `'root' => 'tenant-1'`, `https://my-bucket.s3.amazonaws.com/tenant-1/products/shoe.jpg` keeps `products/shoe.jpg`.

Query strings and fragments are ignored, so signed URLs with `X-Amz-Signature`, or Laravel's `expires` and `signature`, match the same file. URL-encoded characters are decoded: `my%20photo.jpg` keeps `my photo.jpg`.

## MinIO and RustFS

MinIO and RustFS are S3-compatible, so they use Laravel's `s3` driver. Point the disk's `endpoint` at your server:

```php
// config/filesystems.php
'disks' => [
    's3' => [
        'driver' => 's3',
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
        'bucket' => env('AWS_BUCKET'),
        'endpoint' => env('AWS_ENDPOINT'), // for example http://localhost:9000
        'use_path_style_endpoint' => true,
    ],
],
```

The package has no MinIO- or RustFS-specific code. It reads `endpoint`, `bucket` and `url` from the disk, so a stored URL like `http://localhost:9000/my-bucket/avatars/jane.jpg` maps back to `avatars/jane.jpg`. Neither server is tested in CI; they work through the same S3 driver as Amazon S3.

## CDN and custom domains

List extra base URLs per disk:

```php
'url_prefixes' => [
    's3' => ['https://cdn.example.com/', 'https://d111111abcdef8.cloudfront.net/'],
],
```

If the disk has a `root`, both `https://cdn.example.com/{root}/...` and `https://cdn.example.com/...` are accepted, because some CDNs point at the bucket root and some at the prefix.

## Unknown hosts

```php
'match_unknown_hosts' => true,
```

When a URL doesn't start with any known base, the package still keeps every file whose path matches the end of the URL. `https://old-cdn.example.net/media/products/shoe.jpg` keeps `media/products/shoe.jpg`, `products/shoe.jpg` and `shoe.jpg` if they exist.

That way a CDN you forgot to list costs you some disk space, not your files. Set it to `false` if your rich text links to many outside sites and you want those URLs ignored.

## Case sensitivity

```php
'case_sensitive' => true,
```

Set it to `false` if your storage or database ignores case, for example on a macOS volume or with a case-insensitive MySQL collation. Paths are then compared in lower case on both sides. Non-ASCII file names are normalised (NFC) either way, so a name saved on macOS matches the same name stored in the database.

## Custom rewriting

If old rows store paths in a format none of the above covers, such as an `uploads/` prefix from a previous app, write a [normalizer](../extending/normalizers.md).
