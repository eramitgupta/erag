import { defineConfig } from 'vitepress'

const siteOrigin = 'https://erag.in'
const siteBase = '/phone-number-vue'
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
  title: 'Phone Number Vue',
  titleTemplate: ':title — Phone Number Vue Composable | Erag',
  description:
    'Headless Vue 3 composable (usePhoneNumber) for country-aware phone input. Auto formatting, country dial codes, mask patterns, digit normalization, and phone validation with zero masking dependencies.',
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
    ['meta', { name: 'theme-color', content: '#42b883' }],
    ['meta', { name: 'author', content: 'Er Amit Gupta' }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }],
    ['meta', { name: 'googlebot', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }],
    [
      'meta',
      {
        name: 'keywords',
        content:
          'vue phone number input, usePhoneNumber vue 3, vue country phone input, vue international telephone input composable, headless phone input vue, phone validation vue 3, @erag/phone-number-vue, vue phone mask',
      },
    ],
    ['meta', { property: 'og:site_name', content: 'Phone Number Vue — Erag' }],
    ['meta', { property: 'og:image', content: socialImage }],
    ['meta', { property: 'og:image:alt', content: 'Phone Number Vue documentation' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:creator', content: '@_eramitgupta' }],
    ['meta', { name: 'twitter:image', content: socialImage }],
    ['meta', { name: 'twitter:image:alt', content: 'Phone Number Vue documentation' }],
    ['meta', { name: 'google-site-verification', content: searchConsoleVerification }],
  ],
  transformHead({ page, pageData, description, title }) {
    const url = canonicalUrl(page)
    const pageTitle = pageData.title || title || 'Phone Number Vue'
    const isHomePage = page === 'index.md'
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
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': isHomePage ? ['WebSite', 'SoftwareSourceCode'] : 'TechArticle',
          name: '@erag/phone-number-vue',
          headline: pageTitle,
          description,
          url,
          image: socialImage,
          inLanguage: 'en-US',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url,
          },
          isPartOf: {
            '@type': 'WebSite',
            name: 'Phone Number Vue documentation',
            url: `${siteUrl}/`,
          },
          codeRepository: 'https://github.com/eramitgupta/phone-number-vue',
          programmingLanguage: 'TypeScript',
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
        }),
      ],
    ]
  },
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/introduction.html' },
      { text: 'API', link: '/api.html' },
      { text: 'Examples', link: '/examples.html' },
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
          { text: 'Basic Usage', link: '/usage.html' },
          { text: 'Examples', link: '/examples.html' },
          { text: 'Custom Data', link: '/custom-data.html' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'API Reference', link: '/api.html' },
          { text: 'TypeScript Types', link: '/types.html' },
          { text: 'Contributing', link: '/contributing.html' },
        ],
      },
    ],
    search: { provider: 'local' },
    outline: { level: [2, 3], label: 'On this page' },
    docFooter: { prev: 'Previous', next: 'Next' },
    footer: { message: 'MIT License. Copyright Er Amit Gupta' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/eramitgupta/phone-number-vue' },
    ],
  },
})
