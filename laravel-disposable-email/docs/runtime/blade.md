---
title: Blade Conditional
description: Branch Blade output based on disposable email status.
head:
    - - meta
      - name: keywords
        content: 'Laravel disposable email Blade directive, Blade disposable email check, conditional email validation'
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
