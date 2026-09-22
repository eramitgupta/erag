---
title: "Custom Domain Blacklist"
description: "Block custom spam domains, wildcard patterns, and temporary burner email services in Laravel using local blacklist configuration files."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-disposable-email/docs/domains/blacklist.md
</div>


# Custom Blacklist

Put `.txt` files in the configured `blacklist_file` directory:

```text
storage/app/blacklist_file/custom.txt
```

Use one domain per line:

```text
abakiss.com
fakemail.org
trashbox.io
```

The package reads every `.txt` file and also normalizes `user@domain.tld` entries to their domain. Blank and invalid lines are ignored.
