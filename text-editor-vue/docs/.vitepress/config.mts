import { defineConfig } from 'vitepress';

const siteOrigin = 'https://erag.in';
const siteBase = '/text-editor-vue';
const siteUrl = `${siteOrigin}${siteBase}`;

const searchConsoleVerification = 'OZHlBl5qnZRHEArDBmPQeDqrhUr0K32DjQDZ8YxrtuM';

const canonicalUrl = (page: string): string => {
    const path = page
        .replace(/(^|\/)index\.md$/, '$1')
        .replace(/\.md$/, '.html');

    if (!path || path === '/') {
        return `${siteUrl}/index.html`;
    }
    return `${siteUrl}/${path.replace(/^\//, '')}`;
};

export default defineConfig({
    base: `${siteBase}/`,
    lang: 'en-US',
    title: '@erag/text-editor-vue',
    titleTemplate: false,
    description:
        'A modern dependency-free Vue 3 rich text editor (WYSIWYG) built with native browser APIs. Supports TypeScript, mentions, merge tags, templates, image uploads, tables, HTML editing, and customizable toolbars.',
    cleanUrls: false,
    lastUpdated: true,
    sitemap: {
        hostname: siteOrigin,
        transformItems: (items) =>
            items.map((item) => {
                const pageUrl =
                    item.url.replace(/^\/+|\/+$/g, '') || 'index.html';

                return {
                    ...item,
                    url: `${siteBase}/${pageUrl}`.replace(/\/+/g, '/'),
                };
            }),
    },
    head: [
        [
            'link',
            {
                rel: 'icon',
                href: `${siteBase}/logo.svg`,
                type: 'image/svg+xml',
            },
        ],
        ['meta', { name: 'theme-color', content: '#0f766e' }],
        ['meta', { name: 'author', content: 'Er Amit Gupta' }],
        ['meta', { property: 'og:type', content: 'website' }],
        [
            'meta',
            { property: 'og:site_name', content: 'Text Editor Vue — Erag' },
        ],
        [
            'meta',
            {
                property: 'og:image',
                content:
                    'https://avatars.githubusercontent.com/u/72160684?v=4&size=512',
            },
        ],
        ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
        ['meta', { name: 'twitter:creator', content: '@_eramitgupta' }],
        [
            'meta',
            {
                name: 'twitter:image',
                content:
                    'https://avatars.githubusercontent.com/u/72160684?v=4&size=512',
            },
        ],
        [
            'meta',
            {
                name: 'google-site-verification',
                content: searchConsoleVerification,
            },
        ],
    ],
    transformHead({ page, pageData, description }) {
        const url = canonicalUrl(page);
        const pageTitle = pageData.title || 'Vue 3 Rich Text Editor';

        return [
            ['link', { rel: 'canonical', href: url }],
            ['meta', { property: 'og:title', content: pageTitle }],
            ['meta', { property: 'og:description', content: description }],
            ['meta', { property: 'og:url', content: url }],
            ['meta', { property: 'og:locale', content: 'en_US' }],
            ['meta', { name: 'twitter:title', content: pageTitle }],
            ['meta', { name: 'twitter:description', content: description }],
            [
                'script',
                { type: 'application/ld+json' },
                JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'TechArticle',
                    headline:
                        pageData.title || '@erag/text-editor-vue documentation',
                    description,
                    url,
                    isPartOf: {
                        '@type': 'WebSite',
                        name: '@erag/text-editor-vue documentation',
                        url: `${siteUrl}/`,
                    },
                    about: {
                        '@type': 'SoftwareSourceCode',
                        name: '@erag/text-editor-vue',
                        codeRepository:
                            'https://github.com/eramitgupta/text-editor-vue',
                        programmingLanguage: 'TypeScript',
                        license: 'https://opensource.org/licenses/MIT',
                    },
                    author: {
                        '@type': 'Person',
                        name: 'Er Amit Gupta',
                        url: 'https://erag.in/',
                    },
                }),
            ],
        ];
    },
    themeConfig: {
        logo: '/logo.svg',
        logoLink: '/index.html',
        siteTitle: 'Text Editor Vue',
        nav: [
            { text: 'Guide', link: '/introduction.html' },
            { text: 'Examples', link: '/examples.html' },
            { text: 'Features', link: '/index.html#features' },
            { text: 'Live Demo', link: '/index.html#live-demo' },
            { text: 'API Reference', link: '/api.html' },
        ],
        sidebar: [
            {
                text: 'Getting Started',
                items: [
                    { text: 'Overview', link: '/index.html' },
                    { text: 'Introduction', link: '/introduction.html' },
                    { text: 'Installation', link: '/installation.html' },
                    { text: 'Configuration', link: '/configuration.html' },
                    { text: 'Examples & Demos', link: '/examples.html' },
                    {
                        text: 'Laravel & Inertia Setup',
                        link: '/laravel-integration.html',
                    },
                ],
            },
            {
                text: 'Core Features',
                items: [
                    { text: 'Basic & Reactive Usage', link: '/usage.html' },
                    {
                        text: 'Workflow & Responsive UI',
                        link: '/editing-experience.html',
                    },
                    {
                        text: 'Menubar Customization',
                        link: '/menubar-customization.html',
                    },
                    {
                        text: 'Text Formatting & Fonts',
                        link: '/text-formatting.html',
                    },
                    {
                        text: 'Lists & Indentation',
                        link: '/lists-and-indentation.html',
                    },
                    {
                        text: 'Links & Anchors',
                        link: '/links-and-anchors.html',
                    },
                    {
                        text: 'Media & Video Embeds',
                        link: '/media-and-embeds.html',
                    },
                    { text: 'Table Editor', link: '/table-editor.html' },
                ],
            },
            {
                text: 'Advanced Plugins',
                items: [
                    { text: 'Mentions (@)', link: '/mentions.html' },
                    { text: 'Merge Tags', link: '/merge-tags.html' },
                    { text: 'Templates', link: '/templates.html' },
                    {
                        text: 'Image Upload & Resizing',
                        link: '/image-upload.html',
                    },
                    {
                        text: 'Special Characters',
                        link: '/special-characters.html',
                    },
                    {
                        text: 'Code, Preview & Fullscreen',
                        link: '/code-and-preview.html',
                    },
                    { text: 'Find & Replace', link: '/find-and-replace.html' },
                    {
                        text: 'Horizontal Rules & Date-Time',
                        link: '/horizontal-rules-and-datetime.html',
                    },
                ],
            },
            {
                text: 'Styling & Reference',
                items: [
                    {
                        text: 'CSS Customization Guide',
                        link: '/css-customization.html',
                    },
                    { text: 'API Reference', link: '/api.html' },
                    { text: 'Public TypeScript Types', link: '/types.html' },
                    { text: 'Security & Sanitization', link: '/security.html' },
                    { text: 'Contributing', link: '/contributing.html' },
                ],
            },
        ],
        search: {
            provider: 'local',
            options: {
                detailedView: true,
            },
        },
        outline: { level: [2, 3], label: 'On this page' },
        docFooter: { prev: 'Previous', next: 'Next' },
        footer: {
            message:
                'Released under the MIT License. Copyright © Er Amit Gupta',
        },
        socialLinks: [
            {
                icon: 'github',
                link: 'https://github.com/eramitgupta/text-editor-vue',
            },
        ],
    },
});
