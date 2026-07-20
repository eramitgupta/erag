---
title: Blade Conditional
description: Branch Blade output based on disposable email status.
---

# Blade Conditional

Use `@disposableEmail` for presentation branching:

```blade
@disposableEmail($user->email)
    <p>Disposable email detected.</p>
@else
    <p>Email looks acceptable.</p>
@enddisposableEmail
```

The conditional checks disposable-domain status. It does not replace request validation; validate input with `disposable_email` before saving it.
