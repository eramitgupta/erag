---
title: "Custom Extractors"
description: "Teach Laravel Orphan Files to read your own column formats with a ReferenceExtractor class."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-orphan-files/docs/extending/extractors.md
</div>

# Custom Extractors

An extractor reads one column value and returns the paths or URLs it contains. The built-in types `path`, `json`, `html` and `url` are extractors too. Write your own when a column has a format they don't understand.

## Example: Editor.js content

```php
namespace App\Orphans;

use Erag\OrphanFiles\Contracts\ReferenceExtractor;
use Erag\OrphanFiles\References\Source;

class EditorJsExtractor implements ReferenceExtractor
{
    public function extract(mixed $value, Source $source): iterable
    {
        foreach (json_decode((string) $value, true)['blocks'] ?? [] as $block) {
            if ($block['type'] === 'image') {
                yield $block['data']['file']['url'];
            }
        }
    }
}
```

Register the type and use it in a source:

```php
'extractors' => [
    // the built-in types stay here
    'editorjs' => App\Orphans\EditorJsExtractor::class,
],

'sources' => [
    ['table' => 'articles', 'column' => 'content', 'type' => 'editorjs'],
],
```

You can also register it at runtime, for example in a service provider:

```php
use Erag\OrphanFiles\Facades\OrphanFiles;

OrphanFiles::extend('editorjs', App\Orphans\EditorJsExtractor::class);
```

## What to return

Yield plain strings: paths like `articles/12/cover.jpg` or full URLs. The package normalises them the same way as the built-in types, so URLs from `Storage::url()` or a CDN work without extra code.

To be more specific, yield a `Reference`:

```php
use Erag\OrphanFiles\References\Reference;

yield Reference::file('articles/12/cover.jpg', 's3');   // only on the s3 disk
yield Reference::directory('exports/12/', 'local');     // keep everything under this folder
```

A directory reference keeps every file below that folder. That's useful when a row owns a whole folder of generated files.

## Reading the whole row

Set `'column' => '*'` and the extractor gets the whole row as an array:

```php
['table' => 'attachments', 'column' => '*', 'type' => 'attachment'],
```

```php
public function extract(mixed $value, Source $source): iterable
{
    yield Reference::file("{$value['folder']}/{$value['file_name']}", $value['disk']);
}
```

Whole-row sources still need a `primary_key`, because tables are always read in chunks.

## Your own options

Any key in the source array that the package doesn't use is passed to the extractor in `$source->options`:

```php
['table' => 'articles', 'column' => 'content', 'type' => 'editorjs', 'block' => 'image'],
```

```php
$type = $source->options['block'] ?? 'image';
```

## When the extractor fails

Throw an exception rather than returning nothing. A run with an extractor that throws stops before anything is cleaned. An extractor that silently returns nothing would make every file of that source look like an orphan.
