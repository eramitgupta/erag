import { defineConfig } from 'vitepress'

const siteOrigin = 'https://erag.in'
const siteBase = '/laravel-inertia-toast'
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
  title: 'Laravel Inertia Toast',
  description:
    'Toast notifications and confirmation dialogs for Laravel, Inertia.js, Vue 3, and React. Installation, demos, API reference, and framework usage guides.',
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
    [
      'link',
      {
        rel: 'icon',
        href: 'https://avatars.githubusercontent.com/u/72160684?v=4&size=64',
      },
    ],
    ['meta', { name: 'theme-color', content: '#f24e1e' }],
    ['meta', { name: 'author', content: 'Er Amit Gupta' }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }],
    ['meta', { name: 'googlebot', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }],
    [
      'meta',
      {
        name: 'keywords',
        content:
          'Laravel Inertia Toast, Laravel toast notifications, Inertia.js toast, Vue 3 toast plugin, React toast package, Laravel confirmation dialog',
      },
    ],
    ['meta', { property: 'og:site_name', content: 'Laravel Inertia Toast — Erag' }],
    ['meta', { property: 'og:image', content: socialImage }],
    ['meta', { property: 'og:image:alt', content: 'Laravel Inertia Toast documentation' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:creator', content: '@_eramitgupta' }],
    ['meta', { name: 'twitter:image', content: socialImage }],
    ['meta', { name: 'twitter:image:alt', content: 'Laravel Inertia Toast documentation' }],
  ].concat(searchConsoleVerification ? [
    ['meta', { name: 'google-site-verification', content: searchConsoleVerification }]
  ] : []),
  transformHead({ page, pageData, description, title }) {
    const url = canonicalUrl(page)
    const pageTitle = pageData.title || title || 'Laravel Inertia Toast'
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
          name: 'Laravel Inertia Toast',
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
            name: 'Laravel Inertia Toast documentation',
            url: `${siteUrl}/`,
          },
          codeRepository: 'https://github.com/eramitgupta/laravel-inertia-toast',
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
        }),
      ],
    ]
  },
  themeConfig: {
    nav: [
      { text: 'Demo', link: '/demo' },
      { text: 'Laravel', link: '/laravel' },
      { text: 'Vue', link: '/vue' },
      { text: 'React', link: '/react' },
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Overview', link: '/' },
          { text: 'Demo', link: '/demo' },
          { text: 'Installation', link: '/installation' },
        ],
      },
      {
        text: 'Usage',
        items: [
          { text: 'Laravel Usage', link: '/laravel' },
          { text: 'Vue Usage', link: '/vue' },
          { text: 'React Usage', link: '/react' },
          { text: 'Modal Usage', link: '/modal-usage' },
          { text: 'Styling', link: '/styling' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'API Reference', link: '/api-reference' },
          { text: 'Contributing', link: '/contributing' },
        ],
      },
    ],
    outline: {
      level: [2, 3],
      label: 'On this page',
    },
    search: {
      provider: 'local',
    },
    footer: {
      message: 'MIT License. Copyright Er Amit Gupta',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/eramitgupta/laravel-inertia-toast' }
    ],
  },
})
