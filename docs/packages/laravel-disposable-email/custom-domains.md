---
title: Add Custom Disposable Domains
description: Learn how to add your own disposable email domains in Laravel Disposable Email without modifying package code or running extra commands.
keywords: Laravel disposable email custom domains, email blacklist Laravel, block disposable emails, Laravel email validation
---

## 🧩 Add Your Own Disposable Domains

In addition to the built-in disposable email domain list, you may want to block
custom or newly discovered disposable email providers that are specific to your application.

Laravel Disposable Email Detection allows you to extend the blacklist **without modifying any package code** and **without running any additional commands**.

---

### 📂 Adding Custom Disposable Domains

1. Navigate to the blacklist directory defined in your configuration:
```

storage/app/blacklist_file/

```

2. Create or open the following file:
```

disposable_domains.txt

````

3. Add each disposable email domain on a new line.

#### 📄 Example: `disposable_domains.txt`

```txt
abakiss.com
fakemail.org
trashbox.io
mail-temp.example
````

Once added, these domains will automatically be included in all validation rules,
runtime checks, and Blade directives provided by the package.

---

::: tip
This approach is ideal for blocking **private**, **internal**, or **recently discovered**
disposable email providers without waiting for remote list updates.
:::

---

::: warning
Ensure that each line contains **only a valid domain name**.
Do not add comments, spaces, or extra characters, as they may cause parsing issues.
:::

---

### ⚙️ Configuration Requirement

Make sure the blacklist directory matches the path defined in `config/disposable-email.php`:

```php
'blacklist_file' => storage_path('app/blacklist_file'),
```

If the configured path does not match, the custom blacklist will not be applied.

---

By using this method, you maintain full control over which disposable email domains are blocked,
while keeping your application configuration clean and easy to manage.
