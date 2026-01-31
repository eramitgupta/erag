## 🚀 Installation

```bash
composer require erag/laravel-disposable-email
```

## Register the Service Provider

### For Laravel (Optional) v11.x, v12.x

```php
use EragLaravelDisposableEmail\LaravelDisposableEmailServiceProvider;

return [
    LaravelDisposableEmailServiceProvider::class,
];
```

### For Laravel v10.x

```php
'providers' => [
    EragLaravelDisposableEmail\LaravelDisposableEmailServiceProvider::class,
],
```
