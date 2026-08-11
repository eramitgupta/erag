---
title: Facade API
description: Update manifest files dynamically at runtime in controllers or jobs using the PWA Facade.
head:
    - - meta
      - name: keywords
        content: 'Laravel PWA facade, update PWA manifest Laravel, runtime PWA config'
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

# Facade API

You can update PWA configuration and manifest settings dynamically at runtime using the `PWA` Facade.

## Basic Usage

Import the facade inside your controller, job, or service class:

```php
use EragLaravelPwa\Facades\PWA;

PWA::update([
    'name' => 'Laravel Apps',
    'short_name' => 'LA',
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
]);
```

## How it works

1. The `update()` method accepts an array of manifest properties.
2. It parses and merges the new values with your existing manifest configuration.
3. It immediately regenerates and writes the updated `manifest.json` file to the root of your application's public directory.

---

## Directory Permissions 🛡️

> [!IMPORTANT]
> Since the facade writes files directly at runtime, make sure your application's **`public/` folder is writable** by the web server process (e.g. `www-data` or `nginx`). If the folder is read-only, dynamic manifest updates will throw file permission exceptions.
