---
title: Configuration
description: Learn how to configure Laravel PWA using the config/pwa.php file to customize manifest settings, install behavior, debug mode, and Livewire support.
keywords: Laravel PWA configuration, config pwa php, Laravel progressive web app settings, PWA manifest Laravel
---

## Configuration ⚙️

Laravel PWA can be customized using a single configuration file:  
`config/pwa.php`

This file lets you control how your application behaves as a Progressive Web App, including its name, appearance, install behavior, and debugging options.

---

### Main Configuration File: `config/pwa.php`

Inside this file, you’ll find a few important options:

- **Install Button**  
  You can enable or disable the “Add to Home Screen” install button globally.

- **Manifest Settings**  
  This section controls how your PWA looks and behaves:
  - App name and short name  
  - Theme and background colors  
  - Display mode (fullscreen, standalone, etc.)  
  - App description  
  - App icons  

- **Debug Mode**  
  Allows you to show or hide browser console logs, usually based on `APP_DEBUG`.

- **Livewire Support**  
  Enable this option if your application is primarily built using Livewire.

Example structure:

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
        'icons' => [
            [
                'src' => 'logo.png',
                'sizes' => '512x512',
                'type' => 'image/png',
            ],
        ],
    ],

    'debug' => env('APP_DEBUG', false),

    'livewire-app' => false,
];
````

---

### Update the Manifest After Changes

Whenever you update any values inside the `manifest` section, you need to regenerate the manifest file:

```bash
php artisan erag:update-manifest
```

This command updates the `manifest.json` file inside the `public` directory so your changes take effect.

---

By editing `config/pwa.php`, you can fully customize the look, behavior, and install experience of your Laravel PWA.