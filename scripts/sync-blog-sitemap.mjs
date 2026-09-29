import { readFile, readdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const siteOrigin = 'https://erag.in'
const blogDirectory = resolve('blog/docs')
const sitemapPath = resolve('public/sitemap.xml')
const startMarker = '  <!-- blog:start -->'
const endMarker = '  <!-- blog:end -->'

const frontmatterValue = (source, key) => source
  .match(/^---\n([\s\S]*?)\n---/)?.[1]
  .match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+)["']?\\s*$`, 'm'))?.[1]
  .trim()

const toLastmod = (date) => `${new Date(date).toISOString().slice(0, 19)}+00:00`

const entry = (loc, lastmod, priority) => [
  '  <url>',
  `       <loc>${loc}</loc>`,
  `       <lastmod>${lastmod}</lastmod>`,
  `       <priority>${priority}</priority>`,
  '  </url>',
].join('\n')

const postFiles = (await readdir(blogDirectory))
  .filter((file) => file.endsWith('.md') && file !== 'index.md')
  .sort()

const posts = await Promise.all(postFiles.map(async (file) => {
  const source = await readFile(resolve(blogDirectory, file), 'utf8')
  const date = frontmatterValue(source, 'updated') ?? frontmatterValue(source, 'date')

  if (!date) {
    throw new Error(`blog/docs/${file} is missing a date in its frontmatter`)
  }

  return { slug: file.replace(/\.md$/, ''), lastmod: toLastmod(date) }
}))

const newestPost = posts.map(({ lastmod }) => lastmod).sort().at(-1) ?? toLastmod(new Date())

const block = [
  startMarker,
  entry(`${siteOrigin}/blog/`, newestPost, '0.8000'),
  ...posts.map(({ slug, lastmod }) => entry(`${siteOrigin}/blog/${slug}.html`, lastmod, '0.6400')),
  endMarker,
].join('\n')

const sitemap = await readFile(sitemapPath, 'utf8')
const start = sitemap.indexOf(startMarker)
const end = sitemap.indexOf(endMarker)

const updated = start !== -1 && end !== -1
  ? `${sitemap.slice(0, start)}${block}${sitemap.slice(end + endMarker.length)}`
  : sitemap.replace('</urlset>', `${block}\n</urlset>`)

await writeFile(sitemapPath, updated)

console.log(`Blog sitemap synced: ${posts.length} posts.`)
