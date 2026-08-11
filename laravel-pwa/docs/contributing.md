---
title: Contributing
description: How to contribute to erag/laravel-pwa — setup locally, coding standards, and PR workflows.
head:
    - - meta
      - name: keywords
        content: 'Laravel PWA contribution, erag laravel pwa development, Laravel package pull request'
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

# Contributing

Contributions to `erag/laravel-pwa` are welcome.

## Reporting Issues

If you find a bug or think a configuration setting is missing, check active issues or open a new one on GitHub:

[github.com/eramitgupta/laravel-pwa/issues](https://github.com/eramitgupta/laravel-pwa/issues)

Please share:
- Steps to reproduce
- Laravel version
- Browser details and console log outputs (enable `debug => true` to log PWA activities)

## Development Setup

```bash
git clone https://github.com/eramitgupta/laravel-pwa.git
cd laravel-pwa
composer install
```

### Coding Standards

- Follow the [PSR-12](https://www.php-fig.org/psr/psr-12/) PHP coding standards.
- Write descriptive commit messages.

## Submitting Pull Requests

1. Fork the repository and create a branch.
2. Code your changes.
3. Test your changes locally on a secure (HTTPS) sandbox site.
4. Squash your commits into one clean commit and submit a PR with a description.

## License

MIT — Copyright Er Amit Gupta
