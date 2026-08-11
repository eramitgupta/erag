---
title: Dynamic Logo Uploads
description: Handle dynamic PWA logo uploads, validation requirements, and resizing steps inside controllers.
head:
    - - meta
      - name: keywords
        content: 'Laravel PWA logo upload, dynamic PWA icon, processLogo Laravel'
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

# Dynamic Logo Uploads

The package provides a built-in helper method `processLogo()` to handle logo updates dynamically from forms.

## 1. Create the Form Input

Create a standard file upload input in your blade layout. The file key name **must be `logo`**:

```html
<form action="/settings/logo" method="POST" enctype="multipart/form-data">
    @csrf
    <label>Upload App Logo</label>
    <input type="file" name="logo" accept=".png">
    <button type="submit">Upload</button>
</form>
```

---

## 2. Validation Requirements 🛡

> [!IMPORTANT]
> The logo processor validates the uploaded file to ensure it meets strict PWA requirements:
> - **Format**: Must be a valid PNG image (`.png`).
> - **Dimensions**: Must be at least **512x512 pixels** to scale well on high-density displays.
> - **File Size**: Must not exceed **1024 KB** (1 MB).

---

## 3. Handle the Controller Action

Call the `PWA::processLogo` method inside your controller. Pass the current request as the parameter:

```php
namespace App\Http\Controllers;

use EragLaravelPwa\Core\PWA;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class SettingsController extends Controller
{
    public function uploadLogo(Request $request)
    {
        // Validates and processes the logo
        $response = PWA::processLogo($request);

        if ($response['status']) {
            return redirect()->back()->with('success', $response['message']);
        }

        // Return error messages if validation fails
        return redirect()->back()->withErrors($response['errors'] ?? ['Logo upload failed.']);
    }
}
```

## Behind the Scenes

- The helper checks if the file is valid and meets the size, format, and dimension thresholds.
- If validation passes, it replaces the existing `logo.png` file inside the `public/` directory.
- The new logo immediately becomes available at `http://yourdomain.com/logo.png`, matching the manifest definitions.
