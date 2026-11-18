---
title: "Normalizers"
description: "Add extra ways to read stored references, for example legacy path prefixes, with a PathNormalizer."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-orphan-files/docs/extending/normalizers.md
</div>

# Normalizers

A normalizer gives the package another way to read a stored value. Use one when old rows store paths in a format the built-in matching doesn't cover.

## Example: a legacy prefix

Say rows saved before a migration store `uploads/avatars/jane.jpg`, but the files now live at `avatars/jane.jpg`:

```php
namespace App\Orphans;

use Erag\OrphanFiles\Contracts\PathNormalizer;

class LegacyUploadsNormalizer implements PathNormalizer
{
    public function normalize(string $path, string $disk): ?string
    {
        return str_starts_with($path, 'uploads/') ? substr($path, 8) : null;
    }
}
```

```php
'normalizers' => [App\Orphans\LegacyUploadsNormalizer::class],
```

Return the extra path, or `null` when the normalizer has nothing to add. `$disk` is the disk the value is being matched against, in case the rule only applies to one disk.

## Normalizers only add

The original reading of a value is always kept. In the example, both `uploads/avatars/jane.jpg` and `avatars/jane.jpg` are kept. A normalizer can therefore only make the package keep more files. A mistake in one costs disk space; it can't get a file deleted.

## Closures

A closure works too, but a closure in a config file breaks `php artisan config:cache`. Register it in a service provider instead:

```php
use Erag\OrphanFiles\Facades\OrphanFiles;

OrphanFiles::normalizeUsing(
    fn (string $path, string $disk): ?string => str_starts_with($path, 'uploads/') ? substr($path, 8) : null
);
```

## One side effect

`orphan:explain` normally narrows the search with a `LIKE` on the file name. With normalizers configured it reads every row of each source instead, because a normalizer could turn any value into the path. On large tables explain gets slower; scans and cleans are not affected.
