---
title: Installation
description: Install erag/laravel-pwa using composer and set up service providers and package configurations.
---

# Installation

Set up Progressive Web App capabilities in your Laravel app in just a few quick steps.

## 1. Install the package

Require the package via Composer:

```bash
composer require erag/laravel-pwa
```

## 2. Register Service Provider

### Laravel 11, 12, and 13

Manual registration is optional as Laravel package discovery automatically registers the service provider. If you prefer manual configuration, add the provider class inside `bootstrap/providers.php`:

```php
use EragLaravelPwa\EragLaravelPwaServiceProvider;

return [
    // ...
    EragLaravelPwaServiceProvider::class,
];
```

### Laravel 8, 9, and 10

Add the provider class inside the `providers` array in `config/app.php`:

```php
'providers' => [
    // ...
    EragLaravelPwa\EragLaravelPwaServiceProvider::class,
],
```

## 3. Publish Configuration File

Run the installation command to publish the default configuration files:

```bash
php artisan erag:install-pwa
```

This command will copy the main configuration file `config/pwa.php` into your Laravel configuration folder.

## Next steps

After publishing the configuration file, you can customize the manifest properties or immediately register the PWA assets inside your Blade layouts using the directives.
