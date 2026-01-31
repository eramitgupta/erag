## Configuration ⚙️

Main configuration file: `config/pwa.php`

```php
return [
    'install-button' => true,
    'manifest' => [
        'name' => 'Laravel PWA',
        'short_name' => 'LPT',
        'background_color' => '#6777ef',
        'display' => 'fullscreen',
        'description' => 'A Progressive Web Application setup for Laravel projects.',
        'theme_color' => '#6777ef',
    ],
    'debug' => env('APP_DEBUG', false),
    'livewire-app' => false,
];
```

```bash
php artisan erag:update-manifest
```
