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
  titleTemplate: ':title | Laravel Disposable Email',
  description:
    'Block disposable and temporary emails in Laravel with offline validation, custom blocklists, automatic domain updates, and optional RFC and DNS checks.',
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
  transformHead({ page, pageData, title, description, head }) {
    const url = canonicalUrl(page)
    const isHomePage = page === 'index.md'
    const articleTitle = pageData.title || title
    const hasCanonical = (head || []).some(
      (entry: any) => entry[0] === 'link' && entry[1]?.rel === 'canonical'
    )
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

    const faqStructuredData = isHomePage
      ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How do I validate and block disposable emails in Laravel forms and requests?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Add the disposable_email validation rule directly inside your Form Request or controller validator: [\'email\' => [\'required\', \'email\', \'disposable_email\']]. It automatically blocks known temporary domains with sub-millisecond offline speed.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does this Laravel disposable email validator work 100% offline without third-party API keys?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Disposable-domain lookups are completely offline. The package ships with a pre-downloaded database of 124,220+ known disposable domains stored locally, executing lookups in under 0.02ms directly on your application server without any third-party API keys or recurring fees. Optional live DNS MX checks and remote list updates require network access.',
            },
          },
          {
            '@type': 'Question',
            name: 'How can I enable strict RFC 5322 syntax and live MX record DNS verification?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You can append parameters to the validation rule: \'email\' => [\'required\', \'disposable_email:rfc,dns,spoof\']. The :dns modifier checks real-time DNS MX records, :rfc enforces RFC 5322 compliance, and :spoof blocks deceptive Unicode homoglyph attacks.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I check disposable emails in services, background jobs, or controllers via Facade?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Use the Disposable facade anywhere in your PHP application: if (Disposable::email($user->email)) { ... }. It returns a boolean immediately, making it ideal for webhooks, queues, and command-line imports.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I use disposable email validation in Laravel Blade views?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Use the @disposableEmail($email) directive directly in Blade templates: @disposableEmail($user->email) ... warning banner ... @else ... verified ... @enddisposableEmail.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I keep the disposable email domains blocklist updated automatically?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Run php artisan disposable:sync anytime, or schedule it weekly in your routes/console.php: Schedule::command(\'disposable:sync\')->weekly(); to automatically fetch new domain updates.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I whitelist custom test domains or configure a private blacklist file?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. In config/disposable-email.php you can define a \'whitelist\' array of corporate or QA domains that always pass, and specify a \'blacklist_file\' to append custom blocked domains.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I cache disposable email domain checks in Redis for maximum throughput?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Enable caching in config/disposable-email.php by setting \'cache.enabled\' => true and \'cache.store\' => \'redis\'. In-memory checks take less than 0.02ms and eliminate disk reads.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which PHP and Laravel versions are supported?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The package supports PHP 8.1, 8.2, 8.3, and 8.4+, as well as Laravel 10.x, 11.x, and upcoming 12.x, with strict typing and PSR-12 standards.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does this package stop free trial abuse and fake bot signups in SaaS apps?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'By rejecting 124,220+ disposable domain providers at signup, bad actors cannot create infinite free accounts or harvest welcome credits with burner inboxes, eliminating automated trial farming and protecting email sender reputation.',
            },
          },
        ],
      }
      : null

    const headElements: any[] = [
      ...(hasCanonical ? [] : [['link', { rel: 'canonical', href: url }]]),
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

    if (faqStructuredData) {
      headElements.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify(faqStructuredData)
      ])
    }

    return headElements
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
