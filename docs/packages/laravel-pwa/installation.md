---
title: Installation
description: Learn how to install and set up Laravel PWA step by step, including package installation, configuration publishing, and required Blade directives.
keywords: Laravel PWA installation, install Laravel PWA, progressive web app Laravel setup, service worker Laravel, PWA Blade directives
---

## Installation 📦

Getting started with **Laravel PWA** is quick and straightforward.  
You only need to install the package, publish its configuration, and add a few Blade directives.

---

### 1️⃣ Install the Package

From the root of your Laravel project, run:

```bash
composer require erag/laravel-pwa
````

This will download and install the package along with everything it needs.

---

### 2️⃣ Register the Service Provider

Laravel automatically discovers the package in most cases.

#### ✅ Laravel 11.x & 12.x

Auto-discovery is enabled by default.
If it’s disabled, add the service provider to `bootstrap/providers.php`:

```php
use EragLaravelPwa\EragLaravelPwaServiceProvider;

return [
    // ...
    EragLaravelPwaServiceProvider::class,
];
```

#### ✅ Laravel 8.x, 9.x & 10.x

Register the service provider manually in `config/app.php`:

```php
'providers' => [
    // ...
    EragLaravelPwa\EragLaravelPwaServiceProvider::class,
],
```

---

### 3️⃣ Publish Configuration Files

After installation, publish the PWA configuration files:

```bash
php artisan erag:install-pwa
```

This will create the configuration file:

```
config/pwa.php
```

---

### ⚙️ Customize Your PWA

You can customize your Progressive Web App by editing the `config/pwa.php` file.

From here, you can control:

* App name and short name
* App icons and theme color
* Display mode (fullscreen, standalone, etc.)
* Enable or disable the install button
* Debug options

This file gives you full control over how your Laravel app behaves as a PWA.

---

### 4️⃣ Add Blade Directives (Required)

To enable PWA functionality, you must add **two Blade directives** to your main layout file.

These directives automatically:

* Link the `manifest.json`
* Register the service worker
* Enable install prompt
* Activate offline support (browser-dependent)

#### Example: `resources/views/layouts/app.blade.php`


```blade
<!DOCTYPE html>
<html lang="en">
<head>
    @PwaHead <!-- Add this directive to include the PWA meta tags -->
    <title>Your App Title</title>
</head>
<body>
```

### 2. **Register Service Worker**

Just before the closing `</body>` tag in your main layout file, add:

```blade
    @RegisterServiceWorkerScript <!-- This registers the service worker -->
</body>
</html>
```
These directives will automatically generate the necessary tags and JavaScript for the PWA.

