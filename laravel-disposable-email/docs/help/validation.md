---
title: "Validation Troubleshooting"
description: "Diagnose and fix false positive rejections, DNS MX lookup timeouts, and custom validation rule errors in Laravel Disposable Email."
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

# Validation Help

If a disposable address passes:

- Confirm the rule is exactly `disposable_email`.
- Check the domain in built-in/custom lists and the whitelist.
- Clear cache and sync remote sources again.
- Use `Disposable::check($email)->toArray()` to inspect the match source.

If RFC/DNS validation fails, verify the selected mode, network DNS access, and PHP `intl` for `dns` or `spoof`.
