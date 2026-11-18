---
title: "Filters"
description: "Keep unreferenced files by your own rules with a FileFilter class."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-orphan-files/docs/extending/filters.md
</div>

# Filters

A filter can keep an orphan that would otherwise be cleaned. The built-in exclusions, size and extension rules and the grace period are filters too. Write your own for rules that depend on your app.

## Example: keep files of archived tenants

```php
namespace App\Orphans;

use App\Models\Tenant;
use Erag\OrphanFiles\Contracts\FileFilter;
use Erag\OrphanFiles\Scanner\FileInfo;

class ArchivedTenantFilter implements FileFilter
{
    /** @var array<string, true> */
    private array $archived;

    public function __construct()
    {
        $this->archived = Tenant::onlyTrashed()->pluck('id')->mapWithKeys(fn ($id) => ["tenants/{$id}/" => true])->all();
    }

    public function reasonToKeep(FileInfo $file): ?string
    {
        foreach (array_keys($this->archived) as $prefix) {
            if (str_starts_with($file->path, $prefix)) {
                return 'it belongs to an archived tenant';
            }
        }

        return null;
    }
}
```

Return a short reason to keep the file, or `null` if it may be cleaned. The reason shows up in `orphan:explain`, in the CSV export and as a "Protected" line in the scan.

Register it in the config:

```php
'filters' => [App\Orphans\ArchivedTenantFilter::class],
```

or at runtime:

```php
use Erag\OrphanFiles\Facades\OrphanFiles;

OrphanFiles::filterUsing(new App\Orphans\ArchivedTenantFilter);
```

## What a filter gets

`FileInfo` has `disk`, `path`, `size` (bytes, or `null` if unknown) and `lastModified` (a Unix timestamp, or `null`), plus `basename()` and `extension()`.

Filters run once for every orphan, so load what you need in the constructor, as in the example, rather than querying per file. A class listed in `filters` is created when a run starts, not once per file.
