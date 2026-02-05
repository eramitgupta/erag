## Usage 🛠️

Laravel PWA is designed to be easy to use.  
Once the package is installed and configured, you only need to add a couple of Blade directives to your main layout file.

---

### 1️⃣ Add PWA Meta Tags

To enable PWA features like the manifest and theme color, add the `@PwaHead` directive inside the `<head>` section of your main layout.

```blade
<!DOCTYPE html>
<html lang="en">
<head>
    @PwaHead
    <title>Your App Title</title>
</head>
<body>
````

This automatically adds all required PWA meta tags and links for you.

---

### 2️⃣ Register the Service Worker

To enable offline support and background features, register the service worker by adding the following directive just before the closing `</body>` tag:

```blade
    @RegisterServiceWorkerScript
</body>
</html>
```

Once this is added, your app will start behaving like a PWA in supported browsers.

---

### 3️⃣ Update the Manifest When Needed

If you change any PWA settings (like app name, icons, or theme color) inside `config/pwa.php`, regenerate the manifest file using:

```bash
php artisan erag:update-manifest
```

This updates the `manifest.json` file in the `public` directory.

---

### 4️⃣ Update PWA Settings at Runtime (Optional)

You can also update the PWA manifest dynamically from your code using the `PWA` facade.

```php
use EragLaravelPwa\Facades\PWA;

PWA::update([
    'name' => 'Laravel Apps',
    'short_name' => 'LA',
    'theme_color' => '#6777ef',
]);
```

This is useful if you want to change PWA settings from an admin panel or controller.

---

### 5️⃣ Upload or Change the App Icon

Laravel PWA allows you to upload and update the app icon dynamically.

* The file input name must be `logo`
* Image must be in PNG format
* Minimum size: 512×512
* Maximum size: 1024 KB

After uploading, the new icon will automatically be used by the PWA.

---

That’s it 🎉
With these simple steps, your Laravel application will support installation, offline usage, and an app-like experience.

