import { defineConfig } from 'vitepress'

const siteOrigin = 'https://erag.in'
const siteBase = '/phone-number-vue'
const siteUrl = `${siteOrigin}${siteBase}`

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
  description:
    'Headless Vue composable for country-aware phone input. Manages country selection, local digit normalization, calling codes, mask patterns, and phone validation — no masking dependency.',
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
          'Vue phone number input, Vue composable phone, country phone input Vue, phone mask Vue, dial code Vue, usePhoneNumber, @erag/phone-number-vue, headless phone input',
      },
    ],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Phone Number Vue — Erag' }],
    ['meta', { property: 'og:title', content: 'Phone Number Vue — @erag/phone-number-vue' }],
    [
      'meta',
      {
        property: 'og:description',
        content:
          'Headless Vue composable for country-aware phone input. Calling codes, masks, digit normalization, and validation.',
      },
    ],
    ['meta', { property: 'og:image', content: 'https://avatars.githubusercontent.com/u/72160684?v=4&size=512' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:creator', content: '@_eramitgupta' }],
    ['meta', { name: 'twitter:title', content: 'Phone Number Vue — @erag/phone-number-vue' }],
    [
      'meta',
      {
        name: 'twitter:description',
        content:
          'Headless Vue composable for country-aware phone input. Calling codes, masks, digit normalization, and validation.',
      },
    ],
    ['meta', { name: 'twitter:image', content: 'https://avatars.githubusercontent.com/u/72160684?v=4&size=512' }],
    ['meta', { name: 'google-site-verification', content: searchConsoleVerification }],
  ],
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
          name: '@erag/phone-number-vue',
          description:
            'Headless Vue composable for country-aware phone input. Calling codes, masks, digit normalization, and validation.',
          url,
          codeRepository: 'https://github.com/eramitgupta/phone-number-vue',
          programmingLanguage: 'TypeScript',
          license: 'https://opensource.org/licenses/MIT',
          author: {
            '@type': 'Person',
            name: 'Er Amit Gupta',
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
