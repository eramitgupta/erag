---
title: Rule Object
description: Use the disposable email class-based validation rule.
---

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
