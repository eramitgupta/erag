---
title: Custom Blacklist
description: Add application-specific disposable domains from text files.
head:
    - - meta
      - name: keywords
        content: 'Laravel disposable email blacklist, custom disposable domain list, Laravel email blocklist'
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
