import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Erag",
  description: 'Open source documentation by Er Amit Gupta — Sr. Full Stack Engineer specializing in PHP, Laravel, Vue.js, React.js, and modern web technologies.',
  base: '/',
  cleanUrls: false,
  lastUpdated: true,

  head: [
    ['meta', { charset: 'utf-8' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    ['link', { rel: 'icon', href: 'https://avatars.githubusercontent.com/u/72160684?v=4&size=64' }],
    [
      'meta',
      {
        name: 'keywords',
        content:
            'Laravel packages, PHP developer, Laravel documentation, Vue.js, React.js, Inertia.js, Livewire, Tailwind CSS, Open Source, Full Stack Engineer',
      },
    ],
    [
      'meta',
      {
        name: 'author',
        content: 'Er Amit Gupta',
      },
    ],

    ['link', { rel: 'canonical', href: 'https://erag.in/' }],
    ['meta', { name: 'robots', content: 'index, follow' }],

    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Erag — Open Source Documentation' }],
    [
      'meta',
      {
        property: 'og:description',
        content:
            'Open source PHP, Laravel, Vue.js, React.js documentation by Er Amit Gupta, Sr. Full Stack Engineer.',
      },
    ],
    ['meta', { property: 'og:url', content: 'https://erag.in/' }],
    ['meta', { property: 'og:site_name', content: 'Erag' }],

    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Erag Documentation' }],
    [
      'meta',
      {
        name: 'twitter:description',
        content:
            'Laravel packages, PHP docs, and Vue.js, React.js integrations by Er Amit Gupta.',
      },
    ],
    ['meta', { name: 'twitter:creator', content: '@_eramitgupta' }],
  ],

  sitemap: {
    hostname: 'https://erag.in/',
    transformItems(items) {
      return items.filter((item) => !item.url.includes('migration'))
    }
  },

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: {
      '/packages/': [
        {
          text: 'Laravel Disposable Email',
          collapsed: true,
          items: [
            { text: 'Introduction', link: '/packages/laravel-disposable-email/' },
            { text: 'Features', link: '/packages/laravel-disposable-email/features' },
            { text: 'Installation', link: '/packages/laravel-disposable-email/installation' },
            { text: 'Configuration', link: '/packages/laravel-disposable-email/configuration' },
            { text: 'Usage', link: '/packages/laravel-disposable-email/usage' },
            { text: 'Sync From Remote', link: '/packages/laravel-disposable-email/sync' },
            { text: 'Custom Domains', link: '/packages/laravel-disposable-email/custom-domains' },
            { text: 'Caching', link: '/packages/laravel-disposable-email/caching' },
          ]
        },
        {
          text: 'Laravel PWA',
          collapsed: true,
          items: [
            { text: 'Introduction', link: '/packages/laravel-pwa/' },
            { text: 'Features', link: '/packages/laravel-pwa/features' },
            { text: 'Installation', link: '/packages/laravel-pwa/installation' },
            { text: 'Configuration', link: '/packages/laravel-pwa/configuration' },
            { text: 'Usage', link: '/packages/laravel-pwa/usage' },
            { text: 'Logo Upload', link: '/packages/laravel-pwa/logo-upload' },
            { text: 'Screenshots', link: '/packages/laravel-pwa/screenshots' },
          ]
        },
        {
          text: 'Laravel Lang Sync Inertia',
          collapsed: true,
          items: [
            { text: 'Introduction', link: '/packages/laravel-lang-sync-inertia/' },
            { text: 'Features', link: '/packages/laravel-lang-sync-inertia/features' },
            { text: 'Installation', link: '/packages/laravel-lang-sync-inertia/installation' },
            { text: 'Configuration', link: '/packages/laravel-lang-sync-inertia/configuration' },
            { text: 'Usage', link: '/packages/laravel-lang-sync-inertia/usage' },
            { text: 'Vue Frontend', link: '/packages/laravel-lang-sync-inertia/frontend-vue' },
            { text: 'React Frontend', link: '/packages/laravel-lang-sync-inertia/frontend-react' },
            { text: 'API Reference', link: '/packages/laravel-lang-sync-inertia/api' },
            { text: 'Contribution', link: '/packages/laravel-lang-sync-inertia/contribution' },
          ]
        },
        {
          text: 'Vue Toastification',
          collapsed: true,
          items: [
            { text: 'Introduction', link: '/packages/vue-toastification/' },
            { text: 'Features', link: '/packages/vue-toastification/features' },
            { text: 'Installation', link: '/packages/vue-toastification/installation' },
            { text: 'Setup', link: '/packages/vue-toastification/setup' },
            { text: 'Toast Usage', link: '/packages/vue-toastification/toast-usage' },
            { text: 'Modal Usage', link: '/packages/vue-toastification/modal-usage' },
            { text: 'API Reference', link: '/packages/vue-toastification/api-reference' },
            { text: 'Styling', link: '/packages/vue-toastification/styling' },
          ]
        },
        {
          text: 'Laravel Case Mapper Request',
          collapsed: true,
          items: [
            { text: 'Introduction', link: '/packages/laravel-case-mapper-request/' },
            { text: 'Features', link: '/packages/laravel-case-mapper-request/features' },
            { text: 'Supported Mappers', link: '/packages/laravel-case-mapper-request/supported-mappers' },
            { text: 'Installation', link: '/packages/laravel-case-mapper-request/installation' },
            { text: 'Usage', link: '/packages/laravel-case-mapper-request/usage' },
            { text: 'Frontend Example', link: '/packages/laravel-case-mapper-request/frontend-example' },
            { text: 'Custom Mapper', link: '/packages/laravel-case-mapper-request/custom-mapper' },
            { text: 'License', link: '/packages/laravel-case-mapper-request/license' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/eramitgupta' }
    ],
    search: {
      provider: 'algolia',
      options: {
        appId: '50ZXKABVY5',
        apiKey: '544d121096852fb243589be8c64f108a',
        indexName: 'Erag Documentation'
      }
    }
  }
})
