import { defineConfig } from 'vitepress'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const librarySrc = resolve(__dirname, '../../../../vue-toastification/src')


const siteOrigin = 'https://erag.in'
const siteBase = '/vue-toastification'
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
  lang: 'en-US',
  title: 'Vue Toastification',
  description:
    'A lightweight, high-performance Toast Notification and Confirmation Modal library for Vue 3.',
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
    [
      'meta',
      {
        name: 'keywords',
        content:
          'Vue toastification, Vue 3 toast, Vue notification, confirmation modal Vue, erag/vue-toastification, Vue toast plugin',
      },
    ],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Vue Toastification — Erag' }],
    ['meta', { property: 'og:title', content: 'Vue Toastification — Toast & Modal Library' }],
    [
      'meta',
      {
        property: 'og:description',
        content:
          'A lightweight, high-performance Toast Notification and Confirmation Modal library for Vue 3.',
      },
    ],
    ['meta', { property: 'og:image', content: 'https://avatars.githubusercontent.com/u/72160684?v=4&size=512' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:creator', content: '@_eramitgupta' }],
    ['meta', { name: 'twitter:title', content: 'Vue Toastification — Toast & Modal Library' }],
    [
      'meta',
      {
        name: 'twitter:description',
        content:
          'A lightweight, high-performance Toast Notification and Confirmation Modal library for Vue 3.',
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
          name: '@erag/vue-toastification',
          description:
            'A lightweight, high-performance Toast Notification and Confirmation Modal library for Vue 3.',
          url,
          codeRepository: 'https://github.com/eramitgupta/vue-toastification',
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
    logoLink: `${siteBase}/index.html`,
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
      }
    }
  }
})
