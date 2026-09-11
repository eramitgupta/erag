import { defineConfig } from 'vitepress'

const siteOrigin = 'https://erag.in'
const siteBase = '/laravel-pwa'
const siteUrl = `${siteOrigin}${siteBase}`
const socialImage = 'https://avatars.githubusercontent.com/u/72160684?v=4&size=512'

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
  title: 'Laravel PWA',
  titleTemplate: ':title | Laravel PWA',
  description:
    'Transform your Laravel application into an installable Progressive Web App with auto-generated manifests, service workers, install prompts, and offline cache.',
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
    ['meta', { property: 'og:site_name', content: 'Laravel PWA — Erag' }],
    ['meta', { property: 'og:image', content: socialImage }],
    ['meta', { property: 'og:image:alt', content: 'Laravel PWA documentation' }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:creator', content: '@_eramitgupta' }],
    ['meta', { name: 'twitter:image', content: socialImage }],
    ['meta', { name: 'twitter:image:alt', content: 'Laravel PWA documentation' }],
    ['meta', { name: 'google-site-verification', content: searchConsoleVerification }],
  ],
  transformHead({ page, pageData, description, title }) {
    const url = canonicalUrl(page)
    const pageTitle = pageData.title || title || 'Laravel PWA'
    const isHomePage = page === 'index.md'

    const structuredData: any = {
      '@context': 'https://schema.org',
      '@type': isHomePage ? ['WebSite', 'SoftwareApplication', 'SoftwareSourceCode'] : 'TechArticle',
      name: 'erag/laravel-pwa',
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
      downloadUrl: 'https://packagist.org/packages/erag/laravel-pwa',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url,
      },
      isPartOf: {
        '@type': 'WebSite',
        name: 'Laravel PWA documentation',
        url: `${siteUrl}/`,
      },
      codeRepository: 'https://github.com/eramitgupta/laravel-pwa',
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
    logoLink: `${siteBase}/`,
    nav: [
      { text: 'Guide', link: '/introduction.html' },
      { text: 'Configuration', link: '/configuration.html' },
      { text: 'Blade Directives', link: '/directives.html' },
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Overview', link: '/index.html' },
          { text: 'Introduction', link: '/introduction.html' },
          { text: 'Installation', link: '/installation.html' },
        ],
      },
      {
        text: 'Usage',
        items: [
          { text: 'Configuration Settings', link: '/configuration.html' },
          { text: 'Blade Directives', link: '/directives.html' },
          { text: 'Install & Offline Prompts', link: '/install-prompt.html' },
          { text: 'PWA Facade API', link: '/facade.html' },
          { text: 'Dynamic Logo Upload', link: '/logo-upload.html' },
          { text: 'Framework Integrations', link: '/frameworks.html' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'Contributing', link: '/contributing.html' },
        ],
      },
    ],
    search: { provider: 'local' },
    outline: { level: [2, 3], label: 'On this page' },
    docFooter: { prev: 'Previous', next: 'Next' },
    footer: { message: 'MIT License. Copyright Er Amit Gupta' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/eramitgupta/laravel-pwa' },
    ],
  },
})
