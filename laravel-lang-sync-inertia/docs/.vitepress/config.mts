import { defineConfig } from 'vitepress'

const siteOrigin = 'https://eramitgupta.github.io'
const siteBase = '/laravel-lang-sync-inertia/'

export default defineConfig({
    base: siteBase,
    cleanUrls: false,
    title: 'Laravel Lang Sync Inertia',

    description:
        'Bridge Laravel translation files to Inertia.js apps with first-class Vue, React, and Svelte support. Powerful i18n sync for modern Laravel applications.',

    head: [
        // Basic SEO
        ['meta', { name: 'author', content: 'Er Amit Gupta' }],
        [
            'meta',
            {
                name: 'keywords',
                content:
                    'Laravel i18n, Laravel localization, Inertia translations, Vue i18n Laravel, React i18n Laravel, Svelte i18n Laravel, Laravel language sync',
            },
        ],
        ['meta', { name: 'robots', content: 'index, follow' }],
        ['meta', { name: 'theme-color', content: '#3c82f6' }],

        // Google Verification (REPLACE CODE)
        [
            'meta',
            {
                name: 'google-site-verification',
                content: 'OZHlBl5qnZRHEArDBmPQeDqrhUr0K32DjQDZ8YxrtuM',
            },
        ],

        // Canonical URL
        [
            'link',
            {
                rel: 'canonical',
                href: 'https://eramitgupta.github.io/laravel-lang-sync-inertia/',
            },
        ],

        // Open Graph
        ['meta', { property: 'og:type', content: 'website' }],
        [
            'meta',
            {
                property: 'og:title',
                content:
                    'Laravel Lang Sync Inertia – Laravel i18n for Vue, React & Svelte (Inertia.js)',
            },
        ],
        [
            'meta',
            {
                property: 'og:description',
                content:
                    'Bridge Laravel translation files to Inertia.js apps with Vue, React, and Svelte support.',
            },
        ],
        [
            'meta',
            {
                property: 'og:url',
                content:
                    'https://eramitgupta.github.io/laravel-lang-sync-inertia/',
            },
        ],
        [
            'meta',
            { property: 'og:site_name', content: 'Laravel Lang Sync Inertia' },
        ],
        [
            'meta',
            {
                property: 'og:image',
                content:
                    'https://avatars.githubusercontent.com/u/72160684?v=4&size=256',
            },
        ],
        ['meta', { property: 'og:locale', content: 'en_US' }],

        // Twitter
        ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
        [
            'meta',
            {
                name: 'twitter:title',
                content:
                    'Laravel Lang Sync Inertia – Laravel i18n for Vue & React (Inertia.js)',
            },
        ],
        [
            'meta',
            {
                name: 'twitter:description',
                content:
                    'Bridge Laravel translation files to Inertia.js apps with Vue, React, and Svelte support.',
            },
        ],
        [
            'meta',
            {
                name: 'twitter:image',
                content:
                    'https://avatars.githubusercontent.com/u/72160684?v=4&size=256',
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

        // Structured Data (JSON-LD)
        [
            'script',
            { type: 'application/ld+json' },
            JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'SoftwareSourceCode',
                name: 'Laravel Lang Sync Inertia',
                description:
                    'Bridge Laravel translation files to Inertia.js apps with Vue, React, and Svelte support.',
                url: 'https://eramitgupta.github.io/laravel-lang-sync-inertia/',
                codeRepository:
                    'https://github.com/eramitgupta/laravel-lang-sync-inertia',
                author: {
                    '@type': 'Person',
                    name: 'Er Amit Gupta',
                },
            }),
        ],
    ],

    lastUpdated: true,

    themeConfig: {
        logoLink: `${siteBase}index.html`,

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
});
