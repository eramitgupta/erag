
## 🔄 Sync From Remote

Laravel Disposable Email Detection supports syncing disposable email domains from a remote, community-maintained source.  
This allows your application to stay protected against newly created disposable email providers without manual intervention.

### 🔗 Official Disposable Email Repository

The package uses the following repository as its primary remote source:

👉 https://github.com/eramitgupta/disposable-email

This repository contains a continuously maintained list of disposable and temporary email domains, optimized for automated syncing.

---

### ⚙️ Configure Remote Source

The remote source is defined in `config/disposable-email.php`:

```php
'remote_url' => [
    'https://raw.githubusercontent.com/eramitgupta/disposable-email/main/disposable_email.txt',
],
````

You may add multiple remote URLs if required.

---

### ▶️ Run the Sync Command

To fetch and sync the latest disposable email domains from the remote repository, run:

```bash
php artisan erag:sync-disposable-email-list
```

The command will automatically download the domain list and merge it with your local blacklist while ignoring duplicates.

---

::: tip
**Automate with Cron Jobs**
For production applications, you can schedule this sync command using a cron job or Laravel’s task scheduler.
This ensures your disposable email domain list stays up to date automatically without requiring manual execution.
:::

---

### 🧠 Cache Considerations

If caching is enabled, remember to clear the cache after syncing to ensure the latest domains are applied.
