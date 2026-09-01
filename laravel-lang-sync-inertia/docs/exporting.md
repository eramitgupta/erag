---
title: "Export PHP Lang to JSON"
description: "Generate frontend-ready JSON translation files from Laravel PHP language arrays with automated artisan sync commands and file watchers."
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

# Export to JSON

Use the Artisan command when you want frontend-ready JSON files generated from Laravel PHP lang files.

Generate frontend-ready `.json` files from your `.php` language files when you want to use translations without relying only on Inertia shared props.

## Command

```bash
php artisan erag:generate-lang
```

The generated files are written to the `output_lang` path from `config/inertia-lang.php`.

## Input

File: `lang/en/auth.php`

```php
return [
    'greeting' => 'Hello!',
    'welcome' => 'Welcome, :name!',
    'legacy_welcome' => 'Welcome, {name}!',
];
```

## Output

File: `resources/js/lang/en/auth.json`

```json
{
    "greeting": "Hello!",
    "welcome": "Welcome, :name!",
    "legacy_welcome": "Welcome, {name}!"
}
```

Use `:name` for new translation strings. `{name}` is still supported for existing language files and is exported unchanged.

Nested input files keep their directory structure. For example, `lang/en/admin/auth.php` is generated as `resources/js/lang/en/admin/auth.json` and resolves with keys like `admin.auth.name`.

## Generated structure

```text
resources/js/lang/
├── en/
│   ├── auth.json
│   ├── admin/
│   │   └── auth.json
│   ├── validation.json
│   └── pagination.json
└── hi/
    ├── auth.json
    ├── admin/
    │   └── auth.json
    └── validation.json
```

## When to use this

- you want static JSON output for the frontend
- you do not want to rely only on Inertia shared props
- you need generated files during a build or deployment flow
