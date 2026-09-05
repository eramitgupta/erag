import { defineConfig } from 'vitepress'

const siteOrigin = 'https://erag.in'
const siteBase = '/laravel-lang-sync-inertia'
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
  cleanUrls: false,
  title: 'Laravel Lang Sync Inertia',
  titleTemplate: ':title | Laravel Lang Sync',
  lang: 'en-US',

  description:
    'Seamlessly export and synchronize Laravel PHP language & translation files to Inertia.js applications with Vue, React, and Svelte i18n helpers.',

  lastUpdated: true,

  sitemap: {
    hostname: siteOrigin,
    transformItems: (items) => items.map((item) => ({
      ...item,
      url: `${siteBase}/${item.url}`.replace(/\/+/g, '/'),
    })),
  },

  head: [
    // Basic SEO
    ['meta', { name: 'author', content: 'Er Amit Gupta' }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }],
    ['meta', { name: 'googlebot', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }],
    ['meta', { name: 'theme-color', content: '#09090b' }],

    // Google Verification
    [
      'meta',
      {
        name: 'google-site-verification',
        content: searchConsoleVerification,
      },
    ],

    [
      'meta',
      { property: 'og:site_name', content: 'Laravel Lang Sync Inertia — Erag' },
    ],
    [
      'meta',
      {
        property: 'og:image',
        content: socialImage,
      },
    ],
    ['meta', { property: 'og:locale', content: 'en_US' }],

    // Twitter
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    [
      'meta',
      {
        name: 'twitter:image',
        content: socialImage,
      },
    ],
    ['meta', { name: 'twitter:creator', content: '@_eramitgupta' }],

    // Favicon
    [
      'link',
      {
        rel: 'icon',
        href: 'https://avatars.githubusercontent.com/u/72160684?v=4&size=64',
      },
    ],
  ],

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
      codeRepository: 'https://github.com/eramitgupta/laravel-lang-sync-inertia',
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
        JSON.stringify(structuredData),
      ],
    ]
  },

  themeConfig: {
    logoLink: `${siteBase}/index.html`,

    sidebar: [
      { text: 'Overview', link: '/index.html' },
      { text: 'Introduction', link: '/introduction.html' },
      { text: 'Installation', link: '/installation.html' },
      { text: 'Config', link: '/config.html' },
      {
        text: 'Framework Guides',
        items: [
          { text: 'Laravel', link: '/laravel.html' },
          { text: 'Export to JSON', link: '/exporting.html' },
          { text: 'Vue', link: '/vue.html' },
          { text: 'React', link: '/react.html' },
          { text: 'Svelte', link: '/svelte.html' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'API Helpers', link: '/api.html' },
          { text: 'Contributing', link: '/contributing.html' },
        ],
      },
    ],

    search: {
      provider: 'local',
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/eramitgupta/laravel-lang-sync-inertia',
      },
    ],

    footer: {
      message: 'MIT License © Er Amit Gupta',
    },

    outline: {
      level: [2, 3],
      label: 'On this page',
    },

    docFooter: {
      prev: 'Previous page',
      next: 'Next page',
    },
  },
})
