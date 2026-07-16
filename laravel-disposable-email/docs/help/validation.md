---
title: Validation Help
description: Troubleshoot disposable email validation results.
---

# Validation Help

If a disposable address passes:

- Confirm the rule is exactly `disposable_email`.
- Check the domain in built-in/custom lists and the whitelist.
- Clear cache and sync remote sources again.
- Use `Disposable::check($email)->toArray()` to inspect the match source.

If RFC/DNS validation fails, verify the selected mode, network DNS access, and PHP `intl` for `dns` or `spoof`.
