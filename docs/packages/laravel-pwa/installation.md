## Installation 📦

```bash
composer require erag/laravel-pwa
```

## Register the Service Provider

### Laravel 11.x, 12.x

```php
use EragLaravelPwa\EragLaravelPwaServiceProvider;

return [
    EragLaravelPwaServiceProvider::class,
];
```

### Laravel 8.x, 9.x, 10.x

```php
'providers' => [
    EragLaravelPwa\EragLaravelPwaServiceProvider::class,
],
```

```bash
php artisan erag:install-pwa
```
