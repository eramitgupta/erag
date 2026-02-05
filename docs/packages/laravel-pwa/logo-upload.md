---
title: Upload App Logo
description: Learn how to upload and update your Progressive Web App logo dynamically in Laravel PWA without rebuilding or editing the manifest manually.
keywords: Laravel PWA logo upload, update PWA logo Laravel, PWA manifest logo Laravel, Laravel PWA branding
---


## Uploading Logo via PWA 🌟

Laravel PWA allows you to **update your app logo dynamically** without manually editing files or rebuilding the project.  
This is useful when you want to change branding from an admin panel or settings page.

Once uploaded, the new logo is automatically:
- Saved in the `public` directory
- Used in the PWA manifest
- Reflected when users install or refresh the PWA

---

### 📌 Logo Requirements

Before uploading, make sure your logo meets these requirements:

- Format: **PNG**
- Minimum size: **512 × 512 pixels**
- Maximum file size: **1024 KB**
- Background: Transparent (recommended)

---

###  Create a File Input

Add a file input field in your form.  
The **input name must be `logo`**:

```html
<input type="file" name="logo" accept=".png">
````

---

###  Handle the Upload in Controller

Use the built-in PWA helper to process the logo upload.
You don’t need to write any custom image logic.

```php
namespace App\Http\Controllers;

use EragLaravelPwa\Core\PWA;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class SettingsController extends Controller
{
    public function uploadLogo(Request $request)
    {
        $response = PWA::processLogo($request);

        if ($response['status']) {
            return redirect()->back()->with('success', $response['message']);
        }

        return redirect()->back()->withErrors(
            $response['errors'] ?? ['Something went wrong.']
        );
    }
}
```

---

### Result After Upload

Once the logo is uploaded successfully:

* The file is saved as **`logo.png`** in the `public` directory
* The PWA manifest is updated automatically
* The new logo will appear in:

  * Installed PWA app
  * Browser install prompt
  * App icon on mobile and desktop

You can access the logo at:

```
https://yourdomain.com/logo.png
```

---

### ✅ No Extra Steps Required

* No manual manifest editing
* No service worker changes
* No rebuild or cache clearing needed

Your PWA logo is now updated and ready 🚀