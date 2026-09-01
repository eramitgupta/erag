---
title: "Configuration Settings"
description: "Configure web application manifest name, theme colors, display modes, orientation, scope, and icon asset paths in config/pwa.php."
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

# Configuration

The package behavior and manifest file output are controlled through `config/pwa.php`.

## Main Options

Here is the default structure of `config/pwa.php`:

```php
return [
    // Show or hide the install prompt button globally on your site
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

    // Toggle service worker logging in the browser console
    'debug' => env('APP_DEBUG', false), 
    
    // Set to true if using Livewire to ensure smooth script loading
    'livewire-app' => false,
];
```

## Option Details

### `manifest` array
Defines the standard web application manifest options. When you configure these settings, they compile directly into the output `manifest.json` file.

- **`name`**: The full name of your application displayed on the splash screen and app directories.
- **`short_name`**: The name displayed on user home screens when space is limited.
- **`background_color`**: The background color of the splash screen shown when launching the PWA.
- **`theme_color`**: The toolbar/browser header theme color for the PWA screen shell.
- **`display`**: Display mode. Can be `fullscreen`, `standalone`, `minimal-ui`, or `browser`. We default to `fullscreen`.

### `icons`
Defines the app icon sizes and formats. The primary logo filename is fixed as `logo.png` and must be placed inside the `public/logo.png` directory.

---

## Updating the Manifest File

Whenever you change properties inside the `manifest` array in `config/pwa.php`, you must regenerate the actual manifest file by running the Artisan update command:

```bash
php artisan erag:update-manifest
```

This will parse your configuration settings and write the updated `manifest.json` file to the root of your application's public directory.
