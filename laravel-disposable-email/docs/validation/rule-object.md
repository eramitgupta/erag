---
title: "Class Validation Rule"
description: "Use the new Disposable validation rule object in Laravel validator arrays for type safety, autocomplete, and strict domain checking."
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
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-disposable-email/docs/validation/rule-object.md
</div>


# Rule Object

Use the explicit rule class when array rules or dependency injection are clearer:

```php
use EragLaravelDisposableEmail\Rules\DisposableEmailRule;

$request->validate([
    'email' => ['required', 'email', new DisposableEmailRule()],
]);
```

The facade provides equivalent factories:

```php
use Disposable;

'email' => ['required', 'email', Disposable::rule()];
'email' => ['required', 'email', Disposable::make()];
```

Validation modes can be passed to either helper:

```php
'email' => ['required', Disposable::rule('rfc', 'dns')];
```
