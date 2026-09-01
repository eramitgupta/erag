---
title: "Configuration Reference"
description: "Comprehensive config/disposable-email.php guide for blacklist paths, remote domain feeds, cache drivers, and RFC validation settings."
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

The configuration file gives you control over where domains are loaded from, where custom blacklist files live, and whether domain lookups should be cached.

## Default configuration

```php
return [
    'blacklist_file' => storage_path('app/blacklist_file'),

    'remote_url' => [
       'https://raw.githubusercontent.com/eramitgupta/disposable-email/main/disposable_email.txt',
    ],

    'sync_timeout' => 30,

    'cache_enabled' => false,
    'cache_ttl' => 60,

    'whitelist' => [
        // 'example.com',
    ],

    'block_subdomains' => true,
];
```

## Configuration options

### `blacklist_file`

This is the directory where your custom blacklist files live. The package reads every `.txt` file inside it.

### `remote_url`

This is the list of remote files the package will pull when you run the sync command.

### `sync_timeout`

This sets the timeout, in seconds, for HTTP requests made by the sync command (`php artisan erag:sync-disposable-email-list`).

### `cache_enabled`

This enables caching for the compiled disposable domain list.

### `cache_ttl`

This sets the cache lifetime in seconds.

### `whitelist`

This is the list of domains that should always pass even if they appear in a disposable domain list.

```php
'whitelist' => [
    'company-temp-domain.com',
],
```

### `block_subdomains`

This controls whether blocked parent domains also block subdomains.

```php
'block_subdomains' => true,
```

When enabled, blocking `tempmail.com` also blocks `mail.tempmail.com`.

## Example configuration

```php
return [
    'blacklist_file' => storage_path('app/disposable-domains'),

    'remote_url' => [
        'https://raw.githubusercontent.com/eramitgupta/disposable-email/main/disposable_email.txt',
        'https://example.com/internal-disposable-domains.txt',
    ],

    'sync_timeout' => 30,

    'cache_enabled' => true,
    'cache_ttl' => 120,

    'whitelist' => [
        'trusted-test-domain.com',
    ],

    'block_subdomains' => true,
];
```

## Remote file format

Each remote file must contain one domain per line:

```text
0-00.usa.cc
0-30-24.com
0-attorney.com
0-mail.com
00-tv.com
00.msk.ru
00.pe
00000000000.pro
000728.xyz
000777.info
```

::: warning
Do not include comments, metadata, or extra text in these files. Each line should contain only a domain name.
:::
