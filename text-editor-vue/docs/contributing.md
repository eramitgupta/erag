---
title: Contributing and Development
description: 'Set up the @erag/text-editor-vue repository, run formatting, linting, TypeScript checks, Vite builds, and the package publishing workflow.'
head:
    - - meta
      - name: keywords
        content: '@erag/text-editor-vue, Vue editor contribution guide, build Vue library, publish Vue package, Vite TypeScript library'
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

# Contributing & Development

Thank you for contributing to `@erag/text-editor-vue`! This guide explains how to set up the development environment, run linters, check types, and build the project.

Local development, builds, and publishing require Node.js 24 or newer. Vue is a peer dependency, and the package intentionally has no runtime dependencies.

---

## Repository Setup

1. **Clone the repository**:

```bash
git clone https://github.com/eramitgupta/text-editor-vue.git
cd text-editor-vue
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
