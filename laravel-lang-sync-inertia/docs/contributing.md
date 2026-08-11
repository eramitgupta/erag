---
title: Contributing to Laravel Lang Sync Inertia
description: Follow the contribution workflow for Laravel Lang Sync Inertia, including package changes, frontend helper updates, tests, and documentation pull requests.
head:
  - ['meta', { name: 'keywords', content: 'contribute Laravel Lang Sync Inertia, Laravel localization package contribution, Inertia translation pull request, package documentation guide' }]
---

# Contributing

Contributions, issues, and pull requests are welcome.

## Repositories

- Laravel backend package: [eramitgupta/laravel-lang-sync-inertia](https://github.com/eramitgupta/laravel-lang-sync-inertia)
- Documentation branch: [eramitgupta/laravel-lang-sync-inertia/tree/docs](https://github.com/eramitgupta/laravel-lang-sync-inertia/tree/docs)
- Frontend package: [eramitgupta/lang-sync-inertia](https://github.com/eramitgupta/lang-sync-inertia)

## Before opening a PR

1. Open an issue if the change is large or changes API behavior.
2. Keep examples and docs in sync with the implementation.
3. Add or update tests where behavior changes.
4. Keep Vue and React examples aligned when the frontend API changes.

## Local workflow

```bash
npm install
npm run dev
```

For Laravel package work, test changes inside a Laravel + Inertia app where translation sharing can be verified end to end.

## What to include

- clear reproduction steps for bugs
- expected vs actual behavior
- small, focused pull requests
- docs updates for public API changes
