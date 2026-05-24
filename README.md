# Erag Docs

Main documentation workspace for Erag open source packages.

## Projects

- `index.html` - root documentation landing page.
- `laravel-disposable-email/` - VitePress docs for Laravel Disposable Email.
- `laravel-inertia-toast/` - VitePress docs for Laravel Inertia Toast.
- `laravel-lang-sync-inertia/` - VitePress docs for Laravel Lang Sync Inertia.

## Local Setup

Install dependencies in the root workspace:

```bash
npm install
```

Install dependencies for each documentation package:

```bash
cd laravel-disposable-email && npm install
cd ../laravel-inertia-toast && npm install
cd ../laravel-lang-sync-inertia && npm install
cd ..
```

Start the complete docs environment from the root `docs` directory:

```bash
npm run dev
```

The root server prints the local URLs for the landing page and each package docs site.

## Contributing

1. Keep documentation clear, practical, and implementation-focused.
2. Prefer short examples that solve real Laravel, Inertia, Vue, or React use cases.
3. Update the relevant package docs folder when changing package-specific content.
4. Update `index.html` only for landing page, navigation, visual, or hub-level changes.
5. Check responsive layout after UI changes, especially mobile navigation and cards.
6. Run the affected docs server before submitting changes.

## Notes

- The root dev server reads `index.html` fresh on each request, so browser refresh should show landing page edits.
- Package docs are served through their own VitePress dev servers and proxied by `scripts/dev.mjs`.
