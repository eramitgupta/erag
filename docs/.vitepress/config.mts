import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Erag Docs",
  description: 'Open source documentation by Er Amit Gupta',
  base: '/',
  cleanUrls: false,
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Projects',
        items: [
          {
            text: 'Laravel Disposable Email',
            link: '/projects/laravel-disposable-email/'
          },
          {
            text: 'Laravel PWA',
            link: '/projects/laravel-pwa/'
          }
        ]
      }
    ],

    sidebar: {
      '/projects/': [
        {
          text: 'Laravel Disposable Email',
          collapsed: true,
          collapsible: true,
          items: [
            { text: 'Introduction', link: '/projects/laravel-disposable-email/' },
            { text: 'Features', link: '/projects/laravel-disposable-email/features' },
            { text: 'Installation', link: '/projects/laravel-disposable-email/installation' },
            { text: 'Configuration', link: '/projects/laravel-disposable-email/configuration' },
            { text: 'Usage', link: '/projects/laravel-disposable-email/usage' },
            { text: 'Sync From Remote', link: '/projects/laravel-disposable-email/sync' },
            { text: 'Custom Domains', link: '/projects/laravel-disposable-email/custom-domains' },
            { text: 'Caching', link: '/projects/laravel-disposable-email/caching' },
          ]
        },
        {
          text: 'Laravel PWA',
          collapsed: true,
          collapsible: true,
          items: [
            { text: 'Introduction', link: '/projects/laravel-pwa/' },
            { text: 'Features', link: '/projects/laravel-pwa/features' },
            { text: 'Installation', link: '/projects/laravel-pwa/installation' },
            { text: 'Configuration', link: '/projects/laravel-pwa/configuration' },
            { text: 'Usage', link: '/projects/laravel-pwa/usage' },
            { text: 'Facade Usage', link: '/projects/laravel-pwa/facade' },
            { text: 'Logo Upload', link: '/projects/laravel-pwa/logo-upload' },
            { text: 'Screenshots', link: '/projects/laravel-pwa/screenshots' },
            { text: 'Contribution', link: '/projects/laravel-pwa/contribution' }
          ]
        },
        {
          text: 'Laravel Lang Sync Inertia',
          collapsed: true,
          collapsible: true,
          items: [
            { text: 'Introduction', link: '/projects/laravel-lang-sync-inertia/' },
            { text: 'Features', link: '/projects/laravel-lang-sync-inertia/features' },
            { text: 'Installation', link: '/projects/laravel-lang-sync-inertia/installation' },
            { text: 'Configuration', link: '/projects/laravel-lang-sync-inertia/configuration' },
            { text: 'Usage', link: '/projects/laravel-lang-sync-inertia/usage' },
            { text: 'Vue Frontend', link: '/projects/laravel-lang-sync-inertia/frontend-vue' },
            { text: 'React Frontend', link: '/projects/laravel-lang-sync-inertia/frontend-react' },
            { text: 'API Reference', link: '/projects/laravel-lang-sync-inertia/api' },
            { text: 'Contribution', link: '/projects/laravel-lang-sync-inertia/contribution' },
          ]
        },
        {
          text: 'Vue Toastification',
          collapsed: true,
          collapsible: true,
          items: [
            { text: 'Introduction', link: '/projects/vue-toastification/' },
            { text: 'Features', link: '/projects/vue-toastification/features' },
            { text: 'Installation', link: '/projects/vue-toastification/installation' },
            { text: 'Setup', link: '/projects/vue-toastification/setup' },
            { text: 'Toast Usage', link: '/projects/vue-toastification/toast-usage' },
            { text: 'Modal Usage', link: '/projects/vue-toastification/modal-usage' },
            { text: 'API Reference', link: '/projects/vue-toastification/api' },
            { text: 'Styling', link: '/projects/vue-toastification/styling' },
            { text: 'License', link: '/projects/vue-toastification/license' },
          ]
        },
        {
          text: 'Laravel Case Mapper Request',
          collapsed: true,
          collapsible: true,
          items: [
            { text: 'Introduction', link: '/projects/laravel-case-mapper-request/' },
            { text: 'Features', link: '/projects/laravel-case-mapper-request/features' },
            { text: 'Supported Mappers', link: '/projects/laravel-case-mapper-request/supported-mappers' },
            { text: 'Installation', link: '/projects/laravel-case-mapper-request/installation' },
            { text: 'Usage', link: '/projects/laravel-case-mapper-request/usage' },
            { text: 'Frontend Example', link: '/projects/laravel-case-mapper-request/frontend-example' },
            { text: 'Custom Mapper', link: '/projects/laravel-case-mapper-request/custom-mapper' },
            { text: 'License', link: '/projects/laravel-case-mapper-request/license' },
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
        indexName: 'Erag Documentation',
        askAi: {
          assistantId: 'g0Fs5gMvhjmQ',
          sidePanel: true
        }
      }
    }
  }
})
