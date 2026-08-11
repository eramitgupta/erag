---
title: Validation Help
description: Troubleshoot disposable email validation results.
head:
    - - meta
      - name: keywords
        content: 'Laravel disposable email validation troubleshooting, disposable email rule not working, Laravel email blacklist help'
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
