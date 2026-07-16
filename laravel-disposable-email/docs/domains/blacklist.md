---
title: Custom Blacklist
description: Add application-specific disposable domains from text files.
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
