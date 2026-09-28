import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitepress';

const __dirname = dirname(fileURLToPath(import.meta.url));
const localLibrary = resolve(__dirname, '../../../../text-editor-react/src/index.ts');
const ciLibrary = resolve(__dirname, '../../../text-editor-react-library/src/index.ts');
const librarySource = existsSync(localLibrary) ? localLibrary : ciLibrary;

const siteOrigin = 'https://erag.in';
const siteBase = '/text-editor-react';
const siteUrl = `${siteOrigin}${siteBase}`;
const socialImage =
    'https://avatars.githubusercontent.com/u/72160684?v=4&size=512';

const searchConsoleVerification = 'OZHlBl5qnZRHEArDBmPQeDqrhUr0K32DjQDZ8YxrtuM';

const canonicalUrl = (page: string): string => {
    const path = page
        .replace(/(^|\/)index\.md$/, '$1')
        .replace(/\.md$/, '.html');

    if (!path || path === '/') {
        return `${siteUrl}/`;
    }
    return `${siteUrl}/${path.replace(/^\//, '')}`;
};

export default defineConfig({
    base: `${siteBase}/`,
    lang: 'en-US',
    title: 'Text Editor React',
    titleTemplate: ':title | Text Editor React',
    description:
        'A modern dependency-free React rich text editor (WYSIWYG). Supports TypeScript, mentions, merge tags, templates, image uploads, tables, and customizable toolbars.',
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
                    url:
                        pageUrl === 'index.html'
                            ? `${siteBase}/`
                            : `${siteBase}/${pageUrl}`,
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
        ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }],
        ['meta', { name: 'googlebot', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }],
        ['meta', { name: 'bingbot', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }],
        [
            'meta',
            { property: 'og:site_name', content: 'Text Editor React — Erag' },
        ],
        ['meta', { property: 'og:image', content: socialImage }],
        [
            'meta',
            {
                property: 'og:image:alt',
                content: 'Text Editor React documentation',
            },
        ],
        ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
        ['meta', { name: 'twitter:creator', content: '@_eramitgupta' }],
        ['meta', { name: 'twitter:image', content: socialImage }],
        [
            'meta',
            {
                name: 'twitter:image:alt',
                content: 'Text Editor React documentation',
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
        const pageTitle = pageData.title || 'React Rich Text Editor';
        const isHomePage = page === 'index.md';

        return [
            ['link', { rel: 'canonical', href: url }],
            [
                'meta',
                {
                    property: 'og:type',
                    content: isHomePage ? 'website' : 'article',
                },
            ],
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
                    '@type': isHomePage
                        ? ['WebSite', 'SoftwareApplication']
                        : 'TechArticle',
                    name: '@erag/text-editor-react',
                    headline:
                        pageData.title || '@erag/text-editor-react documentation',
                    description,
                    url,
                    image: socialImage,
                    inLanguage: 'en-US',
                    applicationCategory: 'DeveloperApplication',
                    operatingSystem: 'Any',
                    offers: {
                        '@type': 'Offer',
                        price: '0',
                        priceCurrency: 'USD',
                    },
                    downloadUrl:
                        'https://www.npmjs.com/package/@erag/text-editor-react',
                    softwareVersion: '1.0.0',
                    mainEntityOfPage: {
                        '@type': 'WebPage',
                        '@id': url,
                    },
                    isPartOf: {
                        '@type': 'WebSite',
                        name: '@erag/text-editor-react documentation',
                        url: `${siteUrl}/`,
                    },
                    codeRepository:
                        'https://github.com/erag-labs/text-editor-react',
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
        ];
    },
    themeConfig: {
        logo: '/logo.svg',
        logoLink: `${siteBase}/`,
        siteTitle: 'Text Editor React',
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
                    { text: 'Basic & Controlled Usage', link: '/usage.html' },
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
                link: 'https://github.com/erag-labs/text-editor-react',
            },
        ],
    },
    vite: {
        resolve: {
            alias: [{ find: /^@erag\/text-editor-react$/, replacement: librarySource }],
            dedupe: ['react', 'react-dom'],
        },
        esbuild: { jsx: 'automatic' },
        ssr: { noExternal: ['@erag/text-editor-react'] },
    },
});
