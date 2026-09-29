import { createContentLoader } from 'vitepress'

export type Post = {
  url: string
  title: string
  headline: string
  description: string
  date: string
  package: string
  category: string
  tags: string[]
  readingMinutes: number
}

declare const data: Post[]
export { data }

const wordsPerMinute = 220

export default createContentLoader('*.md', {
  includeSrc: true,
  transform(raw): Post[] {
    return raw
      .filter(({ url }) => url !== '/' && url !== '/index.html')
      .map(({ url, frontmatter, src }) => {
        const words = (src ?? '')
          .replace(/^---[\s\S]*?---/, '')
          .split(/\s+/)
          .filter(Boolean).length

        return {
          url,
          title: frontmatter.title,
          headline: frontmatter.headline ?? frontmatter.title,
          description: frontmatter.description,
          date: String(frontmatter.date ?? ''),
          package: frontmatter.package ?? '',
          category: frontmatter.category ?? 'Guide',
          tags: frontmatter.tags ?? [],
          readingMinutes: Math.max(1, Math.round(words / wordsPerMinute)),
        }
      })
      .sort((first, second) => second.date.localeCompare(first.date) || first.headline.localeCompare(second.headline))
  },
})
