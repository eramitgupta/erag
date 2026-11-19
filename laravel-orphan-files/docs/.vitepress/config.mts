import { defineConfig } from 'vitepress'

const siteOrigin = 'https://erag.in'
const siteBase = '/laravel-orphan-files'
const siteUrl = `${siteOrigin}${siteBase}`
const socialImage = 'https://avatars.githubusercontent.com/u/72160684?v=4&size=512'
const repository = 'https://github.com/eramitgupta/laravel-orphan-files'

const searchConsoleVerification = 'OZHlBl5qnZRHEArDBmPQeDqrhUr0K32DjQDZ8YxrtuM'

const canonicalUrl = (page: string): string => {
  const path = page
    .replace(/(^|\/)index\.md$/, '$1')
    .replace(/\.md$/, '.html')

  if (!path || path === '/') {
    return `${siteUrl}/`
  }
  return `${siteUrl}/${path.replace(/^\//, '')}`
}

export default defineConfig({
  base: `${siteBase}/`,
  lang: 'en-US',
  title: 'Laravel Orphan Files',
  titleTemplate: ':title | Laravel Orphan Files',
  description:
    'Find files on your Laravel disks that no database row points to any more, and move them to a trash folder you can restore from. Works with local, public, S3 and S3-compatible storage such as MinIO and RustFS.',
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
    ['link', { rel: 'icon', href: 'https://avatars.githubusercontent.com/u/72160684?v=4&size=64' }],
    ['meta', { name: 'theme-color', content: '#f53003' }],
    ['meta', { name: 'author', content: 'Er Amit Gupta' }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }],
    ['meta', { name: 'googlebot', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }],
    ['meta', { name: 'bingbot', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }],
    ['meta', { property: 'og:site_name', content: 'Laravel Orphan Files — ERAG' }],
    ['meta', { property: 'og:image', content: socialImage }],
    ['meta', { property: 'og:image:alt', content: 'Laravel Orphan Files documentation' }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:creator', content: '@_eramitgupta' }],
    ['meta', { name: 'twitter:image', content: socialImage }],
    ['meta', { name: 'twitter:image:alt', content: 'Laravel Orphan Files documentation' }],
    ['meta', { name: 'google-site-verification', content: searchConsoleVerification }],
  ],
  transformHead({ page, pageData, description, title }) {
    const url = canonicalUrl(page)
    const pageTitle = pageData.title || title || 'Laravel Orphan Files'
    const isHomePage = page === 'index.md'

    const structuredData: any = {
      '@context': 'https://schema.org',
      '@type': isHomePage ? ['WebSite', 'SoftwareApplication', 'SoftwareSourceCode'] : 'TechArticle',
      name: 'erag/laravel-orphan-files',
      headline: pageTitle,
      description,
      url,
      image: socialImage,
      inLanguage: 'en-US',
      operatingSystem: 'All',
      applicationCategory: 'DeveloperApplication',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      downloadUrl: 'https://packagist.org/packages/erag/laravel-orphan-files',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url,
      },
      isPartOf: {
        '@type': 'WebSite',
        name: 'Laravel Orphan Files documentation',
        url: `${siteUrl}/`,
      },
      codeRepository: repository,
      programmingLanguage: 'PHP',
      license: 'https://opensource.org/licenses/MIT',
      author: {
        '@type': 'Person',
        name: 'Er Amit Gupta',
        url: 'https://erag.in/',
      },
      publisher: {
        '@type': 'Organization',
        name: 'ERAG',
        url: 'https://erag.in/',
      },
    }

    if (pageData.lastUpdated) {
      structuredData.dateModified = new Date(pageData.lastUpdated).toISOString()
    }

    return [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:type', content: isHomePage ? 'website' : 'article' }],
      ['meta', { property: 'og:title', content: pageTitle }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { name: 'twitter:title', content: pageTitle }],
      ['meta', { name: 'twitter:description', content: description }],
      [
        'script',
        { type: 'application/ld+json' },
        JSON.stringify(structuredData),
      ],
    ]
  },
  themeConfig: {
    logo: { src: '/logo.svg', width: 28, height: 28, alt: '' },
    logoLink: `${siteBase}/`,
    nav: [
      { text: 'Guide', link: '/introduction.html' },
      { text: 'Configuration', link: '/configuration/disks.html' },
      { text: 'Commands', link: '/commands/scan.html' },
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Overview', link: '/index.html' },
          { text: 'Introduction', link: '/introduction.html' },
          { text: 'Installation', link: '/installation.html' },
          { text: 'Quick Start', link: '/quick-start.html' },
        ],
      },
      {
        text: 'Configuration',
        items: [
          { text: 'Disks and Directories', link: '/configuration/disks.html' },
          { text: 'Sources', link: '/configuration/sources.html' },
          { text: 'Models and the Trait', link: '/configuration/models.html' },
          { text: 'URLs and CDNs', link: '/configuration/urls.html' },
          { text: 'Exclusions and Grace Period', link: '/configuration/filters.html' },
          { text: 'Trash and Safety Limit', link: '/configuration/cleanup.html' },
          { text: 'Performance, Queue and Export', link: '/configuration/performance.html' },
        ],
      },
      {
        text: 'Commands',
        items: [
          { text: 'install', link: '/commands/install.html' },
          { text: 'scan', link: '/commands/scan.html' },
          { text: 'clean', link: '/commands/clean.html' },
          { text: 'restore', link: '/commands/restore.html' },
          { text: 'purge-trash', link: '/commands/purge-trash.html' },
          { text: 'explain', link: '/commands/explain.html' },
        ],
      },
      {
        text: 'Guides',
        items: [
          { text: 'Scheduling', link: '/guides/scheduling.html' },
          { text: 'Running It Safely', link: '/guides/safety.html' },
          { text: 'Using It From Code', link: '/guides/code.html' },
        ],
      },
      {
        text: 'Extending',
        items: [
          { text: 'Custom Extractors', link: '/extending/extractors.html' },
          { text: 'Normalizers', link: '/extending/normalizers.html' },
          { text: 'Filters', link: '/extending/filters.html' },
        ],
      },
      {
        text: 'Help',
        items: [
          { text: 'FAQ', link: '/faq.html' },
          { text: 'Troubleshooting', link: '/troubleshooting.html' },
        ],
      },
    ],
    search: { provider: 'local' },
    outline: { level: [2, 3], label: 'On this page' },
    docFooter: { prev: 'Previous', next: 'Next' },
    footer: { message: 'MIT License © <a href="https://github.com/eramitgupta">eramitgupta</a>' },
    socialLinks: [
      { icon: 'github', link: repository },
    ],
  },
})
