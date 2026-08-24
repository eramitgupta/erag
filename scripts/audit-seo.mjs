import { readFile, readdir } from 'node:fs/promises'
import { basename, relative, resolve, sep } from 'node:path'

const siteOrigin = 'https://erag.in'
const siteDirectory = resolve(process.argv[2] ?? 'site')

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true })

  return (await Promise.all(entries.map((entry) => {
    const path = resolve(directory, entry.name)

    return entry.isDirectory() ? walk(path) : [path]
  }))).flat()
}

const decodeHtml = (value) => value
  .replaceAll('&amp;', '&')
  .replaceAll('&quot;', '"')
  .replaceAll('&#39;', "'")
  .replace(/\s+/g, ' ')
  .trim()

const attributeValues = (html, element, attribute, value, targetAttribute) => {
  const elements = html.match(new RegExp(`<${element}\\b[^>]*>`, 'gi')) ?? []

  return elements.flatMap((tag) => {
    const marker = tag.match(new RegExp(`\\b${attribute}=["']([^"']+)["']`, 'i'))

    if (marker?.[1].toLowerCase() !== value.toLowerCase()) {
      return []
    }

    const target = tag.match(new RegExp(`\\b${targetAttribute}=["']([^"']+)["']`, 'i'))

    return target ? [decodeHtml(target[1])] : []
  })
}

const pageUrl = (file) => {
  const path = relative(siteDirectory, file).split(sep).join('/')

  if (path === 'index.html') {
    return `${siteOrigin}/`
  }

  return path.endsWith('/index.html')
    ? `${siteOrigin}/${path.slice(0, -'index.html'.length)}`
    : `${siteOrigin}/${path}`
}

const errors = []
const htmlFiles = (await walk(siteDirectory))
  .filter((file) => file.endsWith('.html') && basename(file) !== '404.html')
const pages = []

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8')
  const url = pageUrl(file)
  const titles = [...html.matchAll(/<title>([\s\S]*?)<\/title>/gi)].map((match) => decodeHtml(match[1]))
  const descriptions = attributeValues(html, 'meta', 'name', 'description', 'content')
  const robots = attributeValues(html, 'meta', 'name', 'robots', 'content')
  const canonicals = attributeValues(html, 'link', 'rel', 'canonical', 'href')
  const keywords = attributeValues(html, 'meta', 'name', 'keywords', 'content')

  if (titles.length !== 1 || !titles[0]) {
    errors.push(`${url}: expected exactly one non-empty title`)
  } else if (titles[0].length > 65) {
    errors.push(`${url}: title is ${titles[0].length} characters`)
  }

  if (descriptions.length !== 1 || !descriptions[0]) {
    errors.push(`${url}: expected exactly one non-empty meta description`)
  } else if (descriptions[0].length > 170) {
    errors.push(`${url}: meta description is ${descriptions[0].length} characters`)
  }

  if (canonicals.length !== 1 || !canonicals[0]?.startsWith(`${siteOrigin}/`)) {
    errors.push(`${url}: expected exactly one absolute canonical URL`)
  }

  if (robots.length !== 1 || robots[0].toLowerCase().includes('noindex')) {
    errors.push(`${url}: expected one indexable robots directive`)
  }

  if (keywords.length > 0) {
    errors.push(`${url}: meta keywords are unsupported and must not be emitted`)
  }

  for (const [, json] of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(json)
    } catch {
      errors.push(`${url}: contains invalid JSON-LD`)
    }
  }

  pages.push({ url, canonical: canonicals[0] })
}

const expectedUrls = new Set(pages.map((page) => page.url))
const selfCanonicalUrls = new Set()

for (const page of pages) {
  if (page.canonical === page.url) {
    selfCanonicalUrls.add(page.url)
  } else if (!expectedUrls.has(page.canonical)) {
    errors.push(`${page.url}: canonical target does not exist in the generated site`)
  }
}

const sitemap = await readFile(resolve(siteDirectory, 'sitemap.xml'), 'utf8')
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => decodeHtml(match[1]))
const uniqueSitemapUrls = new Set(sitemapUrls)

if (uniqueSitemapUrls.size !== sitemapUrls.length) {
  errors.push('sitemap.xml: contains duplicate URLs')
}

for (const url of selfCanonicalUrls) {
  if (!uniqueSitemapUrls.has(url)) {
    errors.push(`sitemap.xml: missing canonical URL ${url}`)
  }
}

for (const url of uniqueSitemapUrls) {
  if (!selfCanonicalUrls.has(url)) {
    errors.push(`sitemap.xml: contains non-canonical or missing URL ${url}`)
  }
}

if (errors.length > 0) {
  console.error(`SEO audit failed with ${errors.length} error(s):`)
  errors.forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}

console.log(`SEO audit passed for ${pages.length} pages and ${sitemapUrls.length} canonical URLs.`)
