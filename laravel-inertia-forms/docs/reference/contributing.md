---
title: 'Contributing & Credits'
description: 'Who maintains Laravel Inertia Forms, where the code lives, how to report bugs or security issues, and how to contribute or sponsor the project.'
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/laravel-inertia-forms/docs/reference/contributing.md
</div>


<div class="doc-category">Reference</div>

# Contributing & Credits

Contributions, issues, and pull requests are welcome.

## Maintainers

| Who | Role |
| --- | --- |
| [Er Amit Gupta](https://github.com/eramitgupta) | Creator and maintainer |
| [Erag Labs](https://github.com/erag-labs) | Organization and repository home |
| [Contributors](https://github.com/erag-labs/laravel-Inertia-forms/graphs/contributors) | Everyone who has sent a fix or improvement |

## Packages

| Package | Registry |
| --- | --- |
| `erag/inertia-forms` | [Packagist](https://packagist.org/packages/erag/inertia-forms) |
| `@erag/inertia-forms-vue` | [npm](https://www.npmjs.com/package/@erag/inertia-forms-vue) |
| `@erag/inertia-forms-react` | [npm](https://www.npmjs.com/package/@erag/inertia-forms-react) |
| `@erag/inertia-forms-svelte` | [npm](https://www.npmjs.com/package/@erag/inertia-forms-svelte) |

All four live in one repository: [erag-labs/laravel-Inertia-forms](https://github.com/erag-labs/laravel-Inertia-forms).

## Before opening a PR

1. Open an issue first if the change is large or changes the public API.
2. Keep behavior the same in PHP and in the Vue, React, and Svelte packages.
3. Add or update tests where behavior changes.
4. Update these docs when a public method, prop, or event changes.

## Step by step

You need PHP 8.3+ with Composer, and Node.js 22+ with npm.

1. **Fork and clone** [erag-labs/laravel-Inertia-forms](https://github.com/erag-labs/laravel-Inertia-forms):

```bash
git clone https://github.com/<your-username>/laravel-Inertia-forms.git
cd laravel-Inertia-forms
git remote add upstream https://github.com/erag-labs/laravel-Inertia-forms.git
```

2. **Install** the PHP package and all three frontend packages (npm workspaces):

```bash
composer install
npm install
```

3. **Create a branch** from an up-to-date `main`:

```bash
git checkout main
git pull upstream main
git checkout -b fix/combobox-keyboard
```

4. **Make the change.** PHP lives in `src/`, the shared TypeScript core (logic and Tailwind classes) in `packages/core`, and the renderers in `packages/vue`, `packages/react` and `packages/svelte`. Change all three renderers together, and add tests for what changes. Use `npm run dev -w packages/vue` to rebuild a package on save.

5. **Run the checks.** These are the same checks CI runs:

```bash
vendor/bin/pint
vendor/bin/pest
```

```bash
npm run format
npm run typecheck
npm test
npm run build
```

6. **Commit and push** with a short, imperative message:

```bash
git commit -am "Fix keyboard navigation in Combobox"
git push origin fix/combobox-keyboard
```

7. **Open a pull request** against `main` and fill in the template: what changed and why, the type of change, and the checklist. Link the issue it fixes, for example `Fixes #12`.

The full guide, including how to try your change in a Laravel app and how to update these docs, is in [CONTRIBUTING.md](https://github.com/erag-labs/laravel-Inertia-forms/blob/main/CONTRIBUTING.md).

## Reporting bugs

Open a [GitHub issue](https://github.com/erag-labs/laravel-Inertia-forms/issues) with:

- the smallest form class that shows the problem
- your frontend (Vue, React, or Svelte) and package versions
- expected and actual behavior

Report security issues privately from the repository's [Security tab](https://github.com/erag-labs/laravel-Inertia-forms/security) (**Report a vulnerability**), not in public issues.

## Support the project

If the package saves you time, [sponsor Er Amit Gupta on GitHub](https://github.com/sponsors/eramitgupta) or give the repository a ⭐.
