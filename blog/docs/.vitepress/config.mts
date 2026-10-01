import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createContentLoader, defineConfig } from 'vitepress'
import { packages } from './theme/packages'

const siteOrigin = 'https://erag.in'
const siteBase = '/blog'
const siteUrl = `${siteOrigin}${siteBase}`
const socialImage = 'https://avatars.githubusercontent.com/u/72160684?v=4&size=512'
const authorName = 'Amit Gupta'
const searchConsoleVerification = 'OZHlBl5qnZRHEArDBmPQeDqrhUr0K32DjQDZ8YxrtuM'

const escapeXml = (value: string): string => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')

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
  title: 'ERAG Blog',
  titleTemplate: ':title | ERAG Blog',
  description:
    'Practical guides for Laravel, Inertia.js, Vue and React developers: validation, forms, notifications, PWAs, rich text editors and more.',
  appearance: 'dark',
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
    ['meta', { name: 'theme-color', content: '#7c5cff' }],
    ['meta', { name: 'author', content: authorName }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { property: 'og:site_name', content: 'ERAG Blog' }],
    ['meta', { property: 'og:image', content: socialImage }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:creator', content: '@_eramitgupta' }],
    ['meta', { name: 'twitter:image', content: socialImage }],
    ['meta', { name: 'google-site-verification', content: searchConsoleVerification }],
    ['link', { rel: 'icon', href: 'https://avatars.githubusercontent.com/u/72160684?v=4&size=64' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: 'ERAG Blog', href: `${siteUrl}/feed.xml` }],
  ],
  markdown: {
    config(md) {
      const renderLinkOpen = md.renderer.rules.link_open
        ?? ((tokens, index, options, env, self) => self.renderToken(tokens, index, options))

      // Links to the erag.in docs are internal to the site, so they open in the same tab.
      md.renderer.rules.link_open = (tokens, index, options, env, self) => {
        const html = renderLinkOpen(tokens, index, options, env, self)
        const href = tokens[index].attrGet('href') ?? ''

        return href.startsWith(`${siteOrigin}/`)
          ? html.replace(/\s(target|rel)="[^"]*"/g, '')
          : html
      }
    },
  },
  async buildEnd({ outDir }) {
    const posts = (await createContentLoader('*.md').load())
      .filter(({ url }) => url !== '/' && url !== '/index.html')
      .sort((first, second) => String(second.frontmatter.date).localeCompare(String(first.frontmatter.date)))

    const items = posts.map(({ url, frontmatter }) => {
      const link = `${siteUrl}${url}`

      return [
        '    <item>',
        `      <title>${escapeXml(frontmatter.headline ?? frontmatter.title)}</title>`,
        `      <link>${link}</link>`,
        `      <guid isPermaLink="true">${link}</guid>`,
        `      <description>${escapeXml(frontmatter.description)}</description>`,
        `      <pubDate>${new Date(frontmatter.date).toUTCString()}</pubDate>`,
        `      <dc:creator>${authorName}</dc:creator>`,
        '    </item>',
      ].join('\n')
    })

    const feed = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">',
      '  <channel>',
      '    <title>ERAG Blog</title>',
      `    <link>${siteUrl}/</link>`,
      '    <description>Practical guides for Laravel, Inertia.js, Vue and React developers.</description>',
      '    <language>en-us</language>',
      ...items,
      '  </channel>',
      '</rss>',
      '',
    ].join('\n')

    await writeFile(join(outDir, 'feed.xml'), feed)
  },
  transformPageData(pageData) {
    if (pageData.relativePath !== 'index.md' && !pageData.frontmatter.layout) {
      pageData.frontmatter.aside ??= true
      pageData.frontmatter.sidebar = false
      pageData.frontmatter.prev = false
      pageData.frontmatter.next = false
      pageData.frontmatter.editLink = false
    }
  },
  transformHead({ page, pageData, title, description }) {
    const url = canonicalUrl(page)
    const isIndex = page === 'index.md'
    const frontmatter = pageData.frontmatter
    const headline = frontmatter.headline || pageData.title || title
    const author = {
      '@type': 'Person',
      name: authorName,
      url: 'https://erag.in/',
      sameAs: ['https://github.com/eramitgupta', 'https://www.linkedin.com/in/eramitgupta/'],
    }

    const structuredData: Record<string, unknown> = isIndex
      ? {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'ERAG Blog',
        description,
        url,
        inLanguage: 'en-US',
        author,
        publisher: { '@type': 'Organization', name: 'ERAG', url: 'https://erag.in/' },
      }
      : {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline,
        description,
        url,
        image: socialImage,
        inLanguage: 'en-US',
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        author,
        publisher: { '@type': 'Organization', name: 'ERAG', url: 'https://erag.in/' },
        ...(frontmatter.date ? { datePublished: new Date(frontmatter.date).toISOString() } : {}),
        ...(pageData.lastUpdated || frontmatter.date
          ? { dateModified: new Date(pageData.lastUpdated || frontmatter.date).toISOString() }
          : {}),
        ...(Array.isArray(frontmatter.tags) ? { keywords: frontmatter.tags.join(', ') } : {}),
        ...(frontmatter.package && packages[frontmatter.package]
          ? { about: { '@type': 'SoftwareSourceCode', name: packages[frontmatter.package].name, url: packages[frontmatter.package].docs } }
          : {}),
      }

    return [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:type', content: isIndex ? 'website' : 'article' }],
      ['meta', { property: 'og:title', content: headline }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { name: 'twitter:title', content: headline }],
      ['meta', { name: 'twitter:description', content: description }],
      ...(isIndex ? [] : [['meta', { property: 'article:author', content: authorName }]]),
      ...(frontmatter.date ? [['meta', { property: 'article:published_time', content: new Date(frontmatter.date).toISOString() }]] : []),
      ['script', { type: 'application/ld+json' }, JSON.stringify(structuredData)],
    ]
  },
  themeConfig: {
    siteTitle: 'ERAG Blog',
    logoLink: `${siteBase}/`,
    nav: [
      { text: 'All posts', link: '/' },
      {
        text: 'Packages',
        items: Object.values(packages).map((item) => ({ text: item.name, link: item.docs, target: '_self' })),
      },
      { text: 'erag.in', link: 'https://erag.in/', target: '_self' },
      { text: 'SaaS Laravel', link: 'https://saas-laravel.com/' },
    ],
    sidebar: false,
    search: {
      provider: 'local',
    },
    outline: {
      level: [2, 3],
      label: 'On this page',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/eramitgupta' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/eramitgupta/' },
    ],
    footer: {
      message: 'Written by Amit Gupta. Code samples are MIT licensed.',
      copyright: 'ERAG — Engineer • Research • Advance • Grow',
    },
  },
})
