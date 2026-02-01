## 🛠 Configuration

Laravel Disposable Email Detection works out of the box with sensible defaults.  
For advanced control, you can publish and customize the configuration file.

---

### 📄 Publish Configuration

Run the following Artisan command:

```bash
php artisan erag:install-disposable-email
````

This will publish the configuration file at:

```
config/disposable-email.php
```

---

### ⚙️ Configuration Options

```php
return [

    /*
    |--------------------------------------------------------------------------
    | Disposable Email Blacklist Path
    |--------------------------------------------------------------------------
    |
    | Path where disposable email domain files are stored.
    | You can manually add your own disposable domains here.
    |
    */
    'blacklist_file' => storage_path('app/blacklist_file'),

    /*
    |--------------------------------------------------------------------------
    | Remote Disposable Domain Sources
    |--------------------------------------------------------------------------
    |
    | One or more remote URLs containing disposable email domain lists.
    | Each file must contain only domain names, one per line.
    |
    */
    'remote_url' => [
        'https://raw.githubusercontent.com/eramitgupta/disposable-email/main/disposable_email.txt',
    ],

    /*
    |--------------------------------------------------------------------------
    | Cache Settings
    |--------------------------------------------------------------------------
    |
    | Enable caching to improve performance when working with large domain lists.
    | Recommended for high-traffic applications.
    |
    */
    'cache_enabled' => false,
    'cache_ttl' => 60, // Cache lifetime in minutes
];
```

---

::: info
**Blacklist File Usage**
You can add your own disposable domains manually inside the directory defined by
`blacklist_file`. The package will automatically load and merge them.
:::

::: tip
**Remote Domain Lists**
Use `remote_url` to keep your disposable domain list up to date.
Each remote file must contain **only domain names**, one per line.
:::

::: warning
**Invalid File Format**
If a blacklist file contains comments, spaces, or extra data, it may cause parsing issues.
Always ensure the file contains plain domain names only.
:::

---

### 🧠 Caching Configuration

Enable caching to reduce filesystem reads and improve performance:

```php
'cache_enabled' => true,
'cache_ttl' => 60,
```

::: tip
Caching is highly recommended for **large-scale or high-traffic applications**.
:::

If you update domain lists manually, clear the cache to apply changes:

```bash
php artisan cache:clear
```

---

This configuration system allows you to fine-tune disposable email detection while keeping the default setup simple, performant, and production-ready.
