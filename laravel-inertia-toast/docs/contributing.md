---
title: "Contributing Guide"
description: "Learn how to contribute to Laravel Inertia Toast, including documentation workflow, pull request guidelines, local development, and contribution expectations."
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
    - - meta
      - name: description
        content: 'Learn how to contribute to Laravel Inertia Toast, including documentation workflow, pull request guidelines, local development, and contribution expectations.'
---

# Contributing

Thank you for considering contributing to Laravel Inertia Toast.

## How You Can Help

- improve the documentation
- fix examples, wording, and usage notes
- report or clarify Laravel integration issues
- suggest Vue API improvements
- suggest React API improvements
- propose package features and bug fixes

## Repository Scope

This branch is focused on the documentation site and published docs assets.

In this branch you can contribute:

- VitePress documentation pages in `docs`
- navigation, theme, and styling inside `docs/.vitepress`
- examples and contributor-facing documentation

If you want to contribute to Laravel, Vue, or React package behavior, open a pull request with:

- a clear explanation of the change
- documentation updates for the new behavior
- focused examples showing the expected usage

## Local Development

Install dependencies:

```bash
npm install
```

Run the docs site:

```bash
npm run dev
```

Build the docs site:

```bash
npm run build
```

If your change also includes PHP package updates in a branch that contains Composer scripts, run:

```bash
composer lint
```

## Recommended Flow

1. Fork the repository.
2. Create a small, focused branch.
3. Make one clear improvement at a time.
4. Run `npm run build` before opening your pull request.
5. Explain what changed, why it changed, and which docs pages were updated.

## Contribution Guidelines

- keep pull requests small and reviewable
- preserve the existing Laravel-style documentation tone
- update relevant docs when behavior, API, or setup changes
- prefer practical examples over long theory
- avoid unrelated formatting-only changes in the same pull request

## Useful Links

- Docs home: [https://erag.in/laravel-inertia-toast/](https://erag.in/laravel-inertia-toast/)
- Installation: [https://erag.in/laravel-inertia-toast/installation.html](https://erag.in/laravel-inertia-toast/installation.html)
- Laravel guide: [https://erag.in/laravel-inertia-toast/laravel.html](https://erag.in/laravel-inertia-toast/laravel.html)
- Vue guide: [https://erag.in/laravel-inertia-toast/vue.html](https://erag.in/laravel-inertia-toast/vue.html)
- React guide: [https://erag.in/laravel-inertia-toast/react.html](https://erag.in/laravel-inertia-toast/react.html)
