---
title: Contributing
description: How to contribute to @erag/phone-number-vue — reporting issues, submitting pull requests, and development setup.
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
      - name: keywords
        content: 'phone-number-vue contributing, open source Vue phone, report issue phone-number-vue, pull request phone Vue'
---

# Contributing

`@erag/phone-number-vue` is open source under the MIT license. Contributions are welcome.

## Reporting issues

If you find a bug or unexpected behavior, open an issue on GitHub:

[github.com/eramitgupta/phone-number-vue/issues](https://github.com/eramitgupta/phone-number-vue/issues)

Include:
- The package version (`npm list @erag/phone-number-vue`)
- A minimal reproduction (a small Vue SFC or a StackBlitz link)
- The expected and actual behavior

## Development setup

```bash
git clone https://github.com/eramitgupta/phone-number-vue.git
cd phone-number-vue
npm install
```

### Available scripts

| Script | Description |
| ------ | ----------- |
| `npm run build` | Build ESM output with Vite and emit TypeScript declarations |
| `npm run type-check` | Run TypeScript without emitting files |
| `npm run lint` | Format source files with Prettier |
| `npm run lint:check` | Verify source formatting without writing |

## Submitting a pull request

1. Fork the repository and create a branch from `main`
2. Make your change with a clear, focused commit message
3. Run `npm run type-check` and `npm run lint:check` before submitting
4. Open a pull request with a description of what the change does and why

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://github.com/eramitgupta/phone-number-vue/blob/main/CODE_OF_CONDUCT.md). Please be respectful in all interactions.

## License

MIT — Copyright Er Amit Gupta
