// CI-trigger: library export pushed successfully
import { defineConfig } from 'vitepress'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { existsSync } from 'node:fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const localPath = resolve(__dirname, '../../../../vue-toastification/src')
const ciPath = resolve(__dirname, '../../../vue-toastification-library/src')
const librarySrc = existsSync(localPath) ? localPath : ciPath


const siteOrigin = 'https://erag.in'
const siteBase = '/vue-toastification'
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
  lang: 'en-US',
  title: 'Vue Toastification',
  titleTemplate: ':title | Vue Toastification',
  description:
    'Lightweight, high-performance toast notifications and promise-based confirmation modals for Vue 3 with smooth Apple-style animations and Composition API support.',
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
    ['meta', { name: 'theme-color', content: '#2980b9' }],
    ['meta', { name: 'author', content: 'Er Amit Gupta' }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }],
    ['meta', { name: 'googlebot', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }],
    ['meta', { property: 'og:site_name', content: 'Vue Toastification — Erag' }],
    ['meta', { property: 'og:image', content: socialImage }],
    ['meta', { property: 'og:image:alt', content: 'Vue Toastification documentation' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:creator', content: '@_eramitgupta' }],
    ['meta', { name: 'twitter:image', content: socialImage }],
    ['meta', { name: 'twitter:image:alt', content: 'Vue Toastification documentation' }],
    ['meta', { name: 'google-site-verification', content: searchConsoleVerification }],
  ],
  transformHead({ page, pageData, description, title }) {
    const url = canonicalUrl(page)
    const pageTitle = pageData.title || title || 'Vue Toastification'
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
          name: '@erag/vue-toastification',
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
            name: 'Vue Toastification documentation',
            url: `${siteUrl}/`,
          },
          codeRepository: 'https://github.com/eramitgupta/vue-toastification',
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
    logoLink: `${siteBase}/`,
    nav: [
      { text: 'Guide', link: '/index.html' },
      { text: 'Playground', link: '/playground.html' },
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Overview', link: '/index.html' },
          { text: 'Installation', link: '/installation.html' },
          { text: 'Features', link: '/features.html' },
          { text: 'Setup', link: '/setup.html' },
          { text: 'Playground', link: '/playground.html' },
        ],
      },
      {
        text: 'Usage',
        items: [
          { text: 'Toast Usage', link: '/toast-usage.html' },
          { text: 'Modal Usage', link: '/modal-usage.html' },
          { text: 'Styling', link: '/styling.html' },
          { text: 'API Reference', link: '/api.html' },
        ],
      },
    ],
    search: { provider: 'local' },
    outline: { level: [2, 3], label: 'On this page' },
    docFooter: { prev: 'Previous', next: 'Next' },
    footer: { message: 'MIT License. Copyright Er Amit Gupta' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/eramitgupta/vue-toastification' },
    ],
  },
  vite: {
    resolve: {
      alias: {
        '@erag/vue-toastification': librarySrc
      },
      dedupe: ['vue']
    }
  }
})
