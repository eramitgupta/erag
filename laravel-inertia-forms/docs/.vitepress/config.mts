import tailwindcss from '@tailwindcss/vite';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, postcssIsolateStyles } from 'vitepress';

const __dirname = dirname(fileURLToPath(import.meta.url));
const localLibrary = resolve(__dirname, '../../../../InertiaForms');
const ciLibrary = resolve(__dirname, '../../../inertia-forms-library');
const librarySource = existsSync(localLibrary) ? localLibrary : ciLibrary;

const siteOrigin = 'https://erag.in';
const siteBase = '/laravel-inertia-forms';
const siteUrl = `${siteOrigin}${siteBase}`;
const siteName = 'Laravel Inertia Forms';
const homeImage = `${siteUrl}/og-image.png`;
const docsImage = `${siteUrl}/og-docs.png`;
const organizationId = `${siteOrigin}/#organization`;
const websiteId = `${siteUrl}/#website`;

/** The sidebar group each docs folder belongs to, used for breadcrumbs. */
const sections: Record<string, { name: string; url: string }> = {
    guide: { name: 'Getting Started', url: `${siteUrl}/guide/introduction.html` },
    concepts: { name: 'Core Concepts', url: `${siteUrl}/concepts/form-class.html` },
    fields: { name: 'Fields', url: `${siteUrl}/fields/text-input.html` },
    frontend: { name: 'Frontend', url: `${siteUrl}/frontend/form-component.html` },
    reference: { name: 'Reference', url: `${siteUrl}/reference/artisan-config.html` },
};

/**
 * Every docs page as plain Markdown in one file, for AI agents (llms-full.txt).
 * Example snippets (`<<< @/../examples/...#example`) are inlined.
 */
function buildLlmsFull(srcDir: string, outDir: string): void {
    const files: string[] = [];
    const walk = (dir: string) => {
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
            if (entry.name.startsWith('.') || entry.name === 'public') continue;
            const path = join(dir, entry.name);
            if (entry.isDirectory()) walk(path);
            else if (entry.name.endsWith('.md')) files.push(path);
        }
    };
    walk(srcDir);

    const order = ['index.md', 'guide/', 'concepts/', 'fields/', 'frontend/', 'reference/'];
    const rank = (file: string) => {
        const index = order.findIndex((prefix) => file === prefix || file.startsWith(prefix));
        return index === -1 ? order.length : index;
    };
    const pages = files
        .map((file) => relative(srcDir, file))
        .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));

    const body = pages.map((page) => {
        let text = readFileSync(join(srcDir, page), 'utf8')
            .replace(/^---[\s\S]*?\n---\n/, '')
            .replace(/<div style="display:none"[\s\S]*?<\/div>\n?/g, '')
            .replace(/<div class="doc-category">.*?<\/div>\n?/g, '');
        text = text.replace(/^<<< @\/\.\.\/(examples\/[^#\s]+)#example$/gm, (_, file: string) => {
            const source = readFileSync(join(srcDir, '..', file), 'utf8');
            const region = source.match(/\/\/ #region example\n([\s\S]*?)\n\s*\/\/ #endregion example/);
            return '```php\n' + (region ? region[1] : source).trim() + '\n```';
        });
        text = text.replace(/<\/?Example[^>]*>\n?/g, '');
        const url = canonicalUrl(page);
        return `<!-- ${url} -->\n\n${text.trim()}\n`;
    });

    writeFileSync(
        join(outDir, 'llms-full.txt'),
        `# ${siteName}: full documentation\n\n> Every page of ${siteUrl}/ in one file.\n\n${body.join('\n---\n\n')}`,
    );
}

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
    appearance: true,
    base: `${siteBase}/`,
    cleanUrls: false,
    title: 'Laravel Inertia Forms',
    titleTemplate: ':title | Laravel Inertia Forms',
    lang: 'en-US',

    description:
        'Define Laravel forms in PHP and render them in Inertia with one Form component for Vue, React, or Svelte. Validation, conditional fields, and uploads included.',

    lastUpdated: true,

    sitemap: {
        hostname: siteOrigin,
        transformItems: (items) =>
            items.map((item) => {
                const path = item.url.replace(/^\//, '');
                const priority =
                    path === '' || path === 'index.html'
                        ? 1.0
                        : ['demo.html', 'icons.html', 'guide/introduction.html', 'guide/installation.html', 'guide/quick-start.html'].includes(path)
                          ? 0.9
                          : 0.7;

                return {
                    ...item,
                    url: `${siteBase}/${item.url}`.replace(/\/+/g, '/'),
                    changefreq: 'weekly',
                    priority,
                };
            }),
    },

    buildEnd(siteConfig) {
        buildLlmsFull(siteConfig.srcDir, siteConfig.outDir);
    },

    head: [
        ['meta', { name: 'color-scheme', content: 'light dark' }],
        ['meta', { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' }],
        ['meta', { name: 'theme-color', content: '#09090b', media: '(prefers-color-scheme: dark)' }],

        // Basic SEO
        ['meta', { name: 'author', content: 'Er Amit Gupta' }],
        [
            'meta',
            {
                name: 'robots',
                content:
                    'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
            },
        ],
        [
            'meta',
            {
                name: 'googlebot',
                content:
                    'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
            },
        ],
        [
            'meta',
            {
                name: 'bingbot',
                content:
                    'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
            },
        ],

        // Google Verification
        [
            'meta',
            {
                name: 'google-site-verification',
                content: searchConsoleVerification,
            },
        ],

        ['meta', { name: 'application-name', content: siteName }],
        ['meta', { name: 'apple-mobile-web-app-title', content: siteName }],
        ['meta', { name: 'format-detection', content: 'telephone=no' }],
        ['meta', { property: 'og:site_name', content: siteName }],
        ['meta', { property: 'og:locale', content: 'en_US' }],

        // Twitter
        ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
        ['meta', { name: 'twitter:creator', content: '@_eramitgupta' }],

        // Icons, app manifest and the AI summary
        ['link', { rel: 'icon', type: 'image/svg+xml', href: `${siteBase}/favicon.svg` }],
        ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${siteBase}/favicon-32.png` }],
        ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: `${siteBase}/apple-touch-icon.png` }],
        ['link', { rel: 'manifest', href: `${siteBase}/site.webmanifest` }],
        ['link', { rel: 'alternate', type: 'text/plain', title: 'LLM summary', href: `${siteBase}/llms.txt` }],
    ],

    transformHead({ page, pageData, title, description }) {
        const url = canonicalUrl(page);
        const isHomePage = page === 'index.md';
        const pageTitle = pageData.title || title;
        const image = isHomePage ? homeImage : docsImage;
        const imageAlt = isHomePage ? 'Laravel Inertia Forms: build Inertia forms in PHP' : pageTitle;
        const modified = pageData.lastUpdated ? new Date(pageData.lastUpdated).toISOString() : null;
        const section = sections[page.split('/')[0] ?? ''];

        const organization = {
            '@type': 'Organization',
            '@id': organizationId,
            name: 'ERAG Labs',
            url: `${siteOrigin}/`,
            logo: { '@type': 'ImageObject', url: `${siteUrl}/icon-512.png`, width: 512, height: 512 },
            sameAs: ['https://github.com/erag-labs', 'https://github.com/eramitgupta'],
        };
        const website = {
            '@type': 'WebSite',
            '@id': websiteId,
            name: siteName,
            url: `${siteUrl}/`,
            description:
                'Documentation for Laravel Inertia Forms: define forms in PHP and render them in Vue, React or Svelte.',
            inLanguage: 'en-US',
            publisher: { '@id': organizationId },
        };
        const graph: Record<string, unknown>[] = [organization, website];

        if (isHomePage) {
            graph.push({
                '@type': 'SoftwareApplication',
                name: siteName,
                description,
                url: `${siteUrl}/`,
                image,
                applicationCategory: 'DeveloperApplication',
                operatingSystem: 'Any',
                softwareVersion: '1.0.0',
                license: 'https://opensource.org/licenses/MIT',
                downloadUrl: 'https://packagist.org/packages/erag/inertia-forms',
                offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
                author: { '@type': 'Person', name: 'Er Amit Gupta', url: 'https://github.com/eramitgupta' },
                publisher: { '@id': organizationId },
            });
        } else {
            graph.push({
                '@type': 'TechArticle',
                headline: pageTitle,
                ...(section ? { articleSection: section.name } : {}),
                description,
                url,
                image,
                inLanguage: 'en-US',
                isPartOf: { '@id': websiteId },
                publisher: { '@id': organizationId },
                author: { '@type': 'Person', name: 'Er Amit Gupta', url: 'https://github.com/eramitgupta' },
                ...(modified ? { dateModified: modified } : {}),
            });
            const crumbs = [
                { name: 'erag.in', item: `${siteOrigin}/` },
                { name: siteName, item: `${siteUrl}/` },
                ...(section ? [{ name: section.name, item: section.url }] : []),
                { name: pageTitle, item: url },
            ];
            graph.push({
                '@type': 'BreadcrumbList',
                itemListElement: crumbs.map((crumb, index) => ({ '@type': 'ListItem', position: index + 1, ...crumb })),
            });
        }

        return [
            ['link', { rel: 'canonical', href: url }],
            ['meta', { property: 'og:type', content: isHomePage ? 'website' : 'article' }],
            ['meta', { property: 'og:title', content: pageTitle }],
            ['meta', { property: 'og:description', content: description }],
            ['meta', { property: 'og:url', content: url }],
            ['meta', { property: 'og:image', content: image }],
            ['meta', { property: 'og:image:type', content: 'image/png' }],
            ['meta', { property: 'og:image:width', content: '1200' }],
            ['meta', { property: 'og:image:height', content: '630' }],
            ['meta', { property: 'og:image:alt', content: imageAlt }],
            ['meta', { name: 'twitter:title', content: pageTitle }],
            ['meta', { name: 'twitter:description', content: description }],
            ['meta', { name: 'twitter:image', content: image }],
            ['meta', { name: 'twitter:image:alt', content: imageAlt }],
            ...(modified && !isHomePage
                ? [['meta', { property: 'article:modified_time', content: modified }] as [string, Record<string, string>]]
                : []),
            [
                'script',
                { type: 'application/ld+json' },
                JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
            ],
        ];
    },

    themeConfig: {
        logo: { src: '/logo.svg', alt: 'Laravel Inertia Forms logo', width: 28, height: 28 },
        logoLink: `${siteBase}/index.html`,

        nav: [
            { text: 'All packages', link: `${siteOrigin}/`, target: '_self', noIcon: true },
            { text: 'Icons', link: '/icons.html', activeMatch: '^/icons' },
            { text: 'SaaS Kit', link: 'https://saas-laravel.com' },
            {
                text: '<span class="nav-support-btn">Support the Project <svg class="nav-star-icon" viewBox="0 0 24 24" width="14" height="14" fill="#fbbf24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></span>',
                link: 'https://github.com/eramitgupta/laravel-Inertia-forms',
                noIcon: true,
            },
        ],

        sidebar: [
            { text: 'Overview', link: '/index.html' },
            { text: 'Live Demo', link: '/demo.html' },
            { text: 'Icons', link: '/icons.html' },
            {
                text: 'Getting Started',
                items: [
                    { text: 'Introduction', link: '/guide/introduction.html' },
                    { text: 'Requirements', link: '/guide/requirements.html' },
                    { text: 'Installation', link: '/guide/installation.html' },
                    { text: 'Quick Start', link: '/guide/quick-start.html' },
                ],
            },
            {
                text: 'Core Concepts',
                items: [
                    { text: 'Form Class', link: '/concepts/form-class.html' },
                    { text: 'Fieldsets & Layout', link: '/concepts/fieldsets.html' },
                    { text: 'Conditional Visibility', link: '/concepts/visibility.html' },
                    { text: 'Validation', link: '/concepts/validation.html' },
                    { text: 'Authorization', link: '/concepts/authorization.html' },
                    { text: 'Model Binding', link: '/concepts/model-binding.html' },
                    { text: 'Wizard', link: '/concepts/wizard.html' },
                ],
            },
            {
                text: 'Fields',
                collapsed: false,
                items: [
                    {
                        text: 'Text and input',
                        collapsed: false,
                        items: [
                            { text: 'Text Input', link: '/fields/text-input.html' },
                            { text: 'Textarea', link: '/fields/textarea.html' },
                            { text: 'Slug', link: '/fields/slug.html' },
                            { text: 'Link', link: '/fields/link.html' },
                            { text: 'Key Value', link: '/fields/key-value.html' },
                            { text: 'Hidden', link: '/fields/hidden.html' },
                        ],
                    },
                    {
                        text: 'Choices and records',
                        collapsed: false,
                        items: [
                            { text: 'Combobox', link: '/fields/combobox.html' },
                            { text: 'Tags Input', link: '/fields/tags-input.html' },
                            { text: 'Radio', link: '/fields/radio.html' },
                            { text: 'Checkbox', link: '/fields/checkbox.html' },
                            { text: 'Checkbox Group', link: '/fields/checkbox-group.html' },
                            { text: 'Toggle', link: '/fields/toggle.html' },
                        ],
                    },
                    {
                        text: 'Dates, values and media',
                        collapsed: false,
                        items: [
                            { text: 'Date Picker', link: '/fields/date-picker.html' },
                            { text: 'Time Picker', link: '/fields/time-picker.html' },
                            { text: 'File Upload', link: '/fields/file-upload.html' },
                            { text: 'Slider', link: '/fields/slider.html' },
                            { text: 'Color Picker', link: '/fields/color-picker.html' },
                            { text: 'OTP Input', link: '/fields/otp-input.html' },
                        ],
                    },
                    {
                        text: 'Editors and structure',
                        collapsed: false,
                        items: [
                            { text: 'Composer', link: '/fields/composer.html' },
                            { text: 'Repeater', link: '/fields/repeater.html' },
                            { text: 'Blocks', link: '/fields/blocks.html' },
                            { text: 'Submit', link: '/fields/submit.html' },
                        ],
                    },
                    {
                        text: 'Display',
                        collapsed: false,
                        items: [
                            { text: 'Display Helpers', link: '/fields/display.html' },
                        ],
                    },
                ],
            },
            {
                text: 'Frontend',
                items: [
                    { text: 'Form Component & Events', link: '/frontend/form-component.html' },
                    { text: 'Styling', link: '/frontend/styling.html' },
                    { text: 'Custom Fields', link: '/frontend/custom-fields.html' },
                    { text: 'Standalone Components', link: '/frontend/standalone.html' },
                ],
            },
            {
                text: 'Reference',
                items: [
                    { text: 'Visibility Operators', link: '/reference/visibility-operators.html' },
                    { text: 'Serialized Schema', link: '/reference/schema.html' },
                    { text: 'Artisan & Config', link: '/reference/artisan-config.html' },
                    { text: 'Contributing & Credits', link: '/reference/contributing.html' },
                ],
            },
        ],

        search: {
            provider: 'local',
        },

        socialLinks: [
            {
                icon: 'github',
                link: 'https://github.com/eramitgupta/laravel-Inertia-forms',
            },
        ],

        footer: {
            message: 'MIT License © <a href="https://github.com/eramitgupta">Amit Gupta</a>',
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
    vite: {
        plugins: [tailwindcss()],
        css: {
            // Keep VitePress content styles out of `.vp-raw` blocks (the live demo).
            postcss: { plugins: [postcssIsolateStyles({ includeFiles: [/base\.css/, /vp-doc\.css/] })] },
        },
        resolve: {
            alias: [
                {
                    find: /^@erag\/inertia-forms-vue$/,
                    replacement: resolve(librarySource, 'packages/vue/src/index.ts'),
                },
                {
                    find: /^@erag\/inertia-forms-core$/,
                    replacement: resolve(librarySource, 'packages/core/src/index.ts'),
                },
                {
                    // The icon set Laravel sends as SVG, shown in the Icons gallery.
                    find: /^@erag\/inertia-forms-icons$/,
                    replacement: resolve(librarySource, 'resources/icons/icons.json'),
                },
            ],
            dedupe: ['vue', '@inertiajs/vue3', '@inertiajs/core'],
        },
        server: {
            fs: { allow: [resolve(__dirname, '../../..'), librarySource] },
        },
    },
});
