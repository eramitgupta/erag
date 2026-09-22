---
title: "Blade Directives & Helpers"
description: "Use conditional Blade directives like @disposable and @notdisposable to customize UI rendering based on email domain authenticity."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-disposable-email/docs/runtime/blade.md
</div>


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
