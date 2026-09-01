---
title: "Manual & API Validation"
description: "Validate disposable email addresses programmatically in REST API controllers, manual Validator instances, and middleware pipelines."
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

# Manual and API Validation

Create a validator directly when validation is outside a controller request:

```php
use Illuminate\Support\Facades\Validator;

$validator = Validator::make($data, [
    'email' => ['required', 'email', 'disposable_email'],
]);
```

API endpoints use the same rule:

```php
$validated = $request->validate([
    'email' => ['required', 'email', 'disposable_email'],
]);

return response()->json($validated);
```

Laravel automatically returns the appropriate validation response for failed API requests.
