---
title: "Models and the HasStorageFiles Trait"
description: "Declare file columns on an Eloquent model with the HasStorageFiles trait, and control which models are discovered."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-orphan-files/docs/configuration/models.md
</div>

# Models and the Trait

Instead of listing columns in `sources`, you can declare them on the model with the `HasStorageFiles` trait.

```php
use Erag\OrphanFiles\Concerns\HasStorageFiles;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasStorageFiles;

    protected array $storageFiles = [
        'cover' => 'path',
        'gallery' => ['type' => 'json', 'key' => '*.path'],
        'body' => 'html',
    ];

    protected ?string $storageDisk = 'public';
}
```

Each entry in `$storageFiles` becomes a source on the model's table. The value is either a type (`'path'`) or an array with the same options as a [config source](./sources.md), such as `type`, `key`, `disk` or `separator`.

`$storageDisk` is the default disk for every column on the model. A column can override it with its own `disk`. Leave both out and the column matches paths on every scanned disk.

## The trait only declares columns

The trait doesn't listen to model events. Saving, updating or deleting a `Post` never touches storage. Files are only checked when you run `scan`, `clean` or `explain`, and only removed by `orphan:clean --force`.

## Model discovery

```php
'discovery' => [
    'enabled' => true,
    'paths' => [
        app_path('Models'),
    ],
    'models' => [],
],
```

Every class in `paths` that extends `Model`, isn't abstract and uses `HasStorageFiles` is picked up automatically. If some models live elsewhere, for example in a `Domain` folder, list them in `models`:

```php
'models' => [
    App\Domain\Blog\Post::class,
],
```

Set `enabled` to `false` to stop scanning folders. Models in `models` are still used.

You can mix both approaches. A column that is declared on a model and also listed in `sources` is simply read twice.
