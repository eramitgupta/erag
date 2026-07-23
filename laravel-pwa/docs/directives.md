---
title: Blade Directives
description: Integrate PWA manifest metadata tags and register service workers inside Laravel layouts using Blade directives.
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

# Blade Directives

To connect PWA features to your website layout, the package provides custom Blade directives.

## 1. `@PwaHead`

Place the `@PwaHead` directive inside the `<head>` block of your main HTML layout file. This directive generates the `<link rel="manifest">` tags, icon formats, iOS splash metadata, and mobile viewports automatically.

```blade
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    @PwaHead <!-- Inserts PWA manifest headers and meta tags -->
    
    <title>My App</title>
</head>
```

## 2. `@RegisterServiceWorkerScript`

Add the `@RegisterServiceWorkerScript` directive just before the closing `</body>` tag in your layout file. This registers the background service worker in the client's browser.

```blade
    <script src="/js/app.js"></script>
    
    @RegisterServiceWorkerScript <!-- Registers service workers on load -->
</body>
</html>
```

---

### App Installation Experience
When both directives are set up on an HTTPS domain, modern browsers will detect the service worker and manifest rules, prompting the user with a native install interface:

![Installing PWA App](https://github.com/user-attachments/assets/5e58a596-3267-42d9-98d5-c48b0f54d3ed)
