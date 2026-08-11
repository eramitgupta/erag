import { defineConfig } from 'vitepress'

const siteOrigin = 'https://erag.in'
const siteBase = '/laravel-disposable-email'
const siteUrl = `${siteOrigin}${siteBase}`
const socialImage = 'https://avatars.githubusercontent.com/u/72160684?v=4&size=512'

const canonicalUrl = (page: string): string => {
  const path = page
    .replace(/(^|\/)index\.md$/, '$1')
    .replace(/\.md$/, '.html')

  if (!path || path === '/') {
    return `${siteUrl}/`
  }
  return `${siteUrl}/${path.replace(/^\//, '')}`
}

const searchConsoleVerification = 'OZHlBl5qnZRHEArDBmPQeDqrhUr0K32DjQDZ8YxrtuM'

export default defineConfig({
  base: `${siteBase}/`,
  title: 'Laravel Disposable Email',
  description: 'Block disposable and temporary email addresses in Laravel. Validation rules, facades, Blade directives, remote sync, and caching support.',
  cleanUrls: false,
  lastUpdated: true,
  sitemap: {
    hostname: siteOrigin,
    transformItems: (items) => items.map((item) => ({
      ...item,
      url: `${siteBase}/${item.url}`.replace(/\/+/g, '/'),
    })),
  },
  head: [
    ['meta', { name: 'theme-color', content: '#f53003' }],
    ['meta', { name: 'author', content: 'Er Amit Gupta' }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }],
    ['meta', { name: 'googlebot', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }],
    [
      'meta',
      {
        name: 'keywords',
        content: 'laravel disposable email, temporary email validation, disposable email blocker, laravel email validation, temp mail protection, fake email detection'
      }
    ],
    ['meta', { property: 'og:site_name', content: 'Laravel Disposable Email — Erag' }],
    ['meta', { property: 'og:image', content: socialImage }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:creator', content: '@_eramitgupta' }],
    ['meta', { name: 'twitter:image', content: socialImage }],
    [
      'link',
      {
        rel: 'icon',
        href: 'https://avatars.githubusercontent.com/u/72160684?v=4&size=64'
      }
    ]
  ].concat(searchConsoleVerification ? [
    ['meta', { name: 'google-site-verification', content: searchConsoleVerification }]
  ] : []),
  transformHead({ page, pageData, title, description }) {
    const url = canonicalUrl(page)
    const isHomePage = page === 'index.md'
    const articleTitle = pageData.title || title
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': isHomePage ? ['TechArticle', 'SoftwareSourceCode'] : 'TechArticle',
      headline: articleTitle,
      description,
      url,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url,
      },
      codeRepository: 'https://github.com/eramitgupta/laravel-disposable-email',
      programmingLanguage: 'PHP',
      license: 'https://opensource.org/licenses/MIT',
      author: {
        '@type': 'Person',
        name: 'Er Amit Gupta',
        url: 'https://erag.in/',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Erag',
        url: 'https://erag.in/',
      },
    }

    if (pageData.lastUpdated) {
      structuredData.dateModified = new Date(pageData.lastUpdated).toISOString()
    }

    return [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:type', content: isHomePage ? 'website' : 'article' }],
      ['meta', { property: 'og:title', content: articleTitle }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { name: 'twitter:title', content: articleTitle }],
      ['meta', { name: 'twitter:description', content: description }],
      [
        'script',
        { type: 'application/ld+json' },
        JSON.stringify(structuredData)
      ]
    ]
  },
  themeConfig: {
    logoLink: `${siteBase}/index.html`,
    nav: [
      { text: 'Get started', link: '/introduction.html' },
    ],
    sidebar: [
      {
        text: 'Docs',
        items: [
          { text: 'Overview', link: '/index.html' },
          { text: 'Introduction', link: '/introduction.html' },
          { text: 'Installation', link: '/getting-started.html' },
          { text: 'Config', link: '/configuration.html' }
        ]
      },
      {
        text: 'Validation',
        items: [
          { text: 'Basic', link: '/validation/basic.html' },
          { text: 'Form Request', link: '/validation/form-request.html' },
          { text: 'Rule Object', link: '/validation/rule-object.html' },
          { text: 'Manual and API', link: '/validation/manual-api.html' }
        ]
      },
      {
        text: 'Runtime',
        items: [
          { text: 'Email and Domain Checks', link: '/runtime/checks.html' },
          { text: 'Detailed Result', link: '/runtime/result.html' },
          { text: 'Blade Conditional', link: '/runtime/blade.html' }
        ]
      },
      {
        text: 'Domain Lists',
        items: [
          { text: 'Remote Sync', link: '/domains/sync.html' },
          { text: 'Custom Blacklist', link: '/domains/blacklist.html' },
          { text: 'Whitelist', link: '/domains/whitelist.html' },
          { text: 'Subdomain Blocking', link: '/domains/subdomains.html' },
          { text: 'Package Stats', link: '/domains/stats.html' }
        ]
      },
      {
        text: 'Advanced',
        items: [
          { text: 'RFC / DNS Validation', link: '/advanced/rfc-dns.html' },
          { text: 'Caching', link: '/advanced/cache.html' },
          { text: 'Schedule Sync', link: '/advanced/schedule.html' }
        ]
      },
      {
        text: 'Maintainers',
        items: [
          { text: 'Contributing', link: '/maintainers/contributing.html' }
        ]
      },
      {
        text: 'Help',
        items: [
          { text: 'Validation', link: '/help/validation.html' },
          { text: 'Sync and Cache', link: '/help/sync-cache.html' },
          { text: 'Setup and Blade', link: '/help/setup-blade.html' }
        ]
      },
      {
        text: 'Upgrades',
        items: [
          { text: 'Version 5.x', link: '/upgrades/v5.html' }
        ]
      }
    ],
    search: {
      provider: 'local'
    },
    outline: {
      level: [2, 3],
      label: 'On this page'
    },
    docFooter: {
      prev: 'Previous',
      next: 'Next'
    },
    footer: {
        message: 'MIT License. Copyright Er Amit Gupta',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/eramitgupta/laravel-disposable-email' }
    ]
  }
})
