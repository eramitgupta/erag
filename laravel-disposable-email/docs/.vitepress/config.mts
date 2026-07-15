import { defineConfig } from 'vitepress'

const siteOrigin = 'https://erag.in'
const siteBase = '/laravel-disposable-email'
const siteUrl = `${siteOrigin}${siteBase}`

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
    ['meta', { property: 'og:title', content: 'Laravel Disposable Email' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: 'https://avatars.githubusercontent.com/u/72160684?v=4&size=512' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:creator', content: '@_eramitgupta' }],
    ['meta', { name: 'twitter:title', content: 'Laravel Disposable Email' }],
    [
      'meta',
      {
        name: 'twitter:description',
        content: 'Block disposable email addresses with validation rules, facades, Blade directives, and remote sync support.'
      }
    ],
    ['meta', { name: 'twitter:image', content: 'https://avatars.githubusercontent.com/u/72160684?v=4&size=512' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Block disposable email addresses with validation rules, facades, Blade directives, and remote sync support.'
      }
    ],
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
  transformHead({ page }) {
    const url = canonicalUrl(page)

    return [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      [
        'script',
        { type: 'application/ld+json' },
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareSourceCode',
          name: 'Laravel Disposable Email',
          description: 'Block disposable and temporary email addresses in Laravel. Validation rules, facades, Blade directives, remote sync, and caching support.',
          url,
          codeRepository: 'https://github.com/eramitgupta/laravel-disposable-email',
          programmingLanguage: 'PHP',
          license: 'https://opensource.org/licenses/MIT',
          author: {
            '@type': 'Person',
            name: 'Er Amit Gupta',
            url: 'https://erag.in/'
          }
        })
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
        text: 'Usage',
        items: [
          { text: 'Validation and Runtime', link: '/validation-and-runtime.html' },
          { text: 'Validation', link: '/validation.html' },
          { text: 'Validation Advanced Check', link: '/email-validation-advanced-check.html' },
          { text: 'Runtime Checks', link: '/runtime-checks.html' },
          { text: 'API and Blade', link: '/api-and-blade.html' },
          { text: 'Sync and Blacklist', link: '/sync-and-blacklist.html' },
          { text: 'Schedule Sync', link: '/schedule-syncing-automatically.html' },
          { text: 'Caching', link: '/caching.html' },
          { text: 'Troubleshooting', link: '/troubleshooting.html' },
          { text: 'Contributing', link: '/contributing.html' },
          { text: 'Deprecated 5.0.0', link: '/deprecated-5-0-0.html' }
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
