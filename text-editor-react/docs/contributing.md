---
title: "Contributing and Development"
description: "Set up the @erag/text-editor-react repository, run formatting, linting, TypeScript checks, Vite builds, and the package publishing workflow."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/text-editor-react/docs/contributing.md
</div>


# Contributing & Development

Thank you for contributing to `@erag/text-editor-react`! This guide explains how to set up the development environment, run linters, check types, and build the project.

Local development, builds, and publishing require Node.js 24 or newer. React and React DOM are peer dependencies, and the package intentionally has no runtime dependencies.

The editor is written in TypeScript with React function components and hooks (`.tsx`). The `src/` directory is organized into `types`, `commands`, `controllers`, `hooks`, `config`, `utils`, and `components`.

---

## Repository Setup

1. **Clone the repository**:

```bash
git clone https://github.com/erag-technologies/text-editor-react.git
cd text-editor-react
```

2. **Install dependencies**:

```bash
npm install
```

---

## Available Development Scripts

```bash
# Run Vite build in watch mode for development
npm run dev

# Run Prettier code formatting & ESLint fixes
npm run lint

# Check ESLint & Prettier without modifying files
npm run lint:check

# Run TypeScript typecheck without emitting output
npm run typecheck

# Build ESM bundle and TypeScript declaration files
npm run build
```

---

## Pre-publish Checklist

Before creating a release or publishing, run:

```bash
npm run prepublishOnly
```

This command automatically executes code formatting, ESLint checks, TypeScript verification, and the final production build.
