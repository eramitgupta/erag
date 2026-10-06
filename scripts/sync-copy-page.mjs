// Copies shared/CopyPage.vue into every docs site's theme, so each site
// bundles it with its own Vue. Run after editing the shared component.
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const source = join(import.meta.dirname, '..', 'shared', 'CopyPage.vue')
const root = join(import.meta.dirname, '..')

for (const site of readdirSync(root)) {
  const theme = join(root, site, 'docs', '.vitepress', 'theme')

  if (!existsSync(theme)) {
    continue
  }

  mkdirSync(join(theme, 'components'), { recursive: true })
  copyFileSync(source, join(theme, 'components', 'CopyPage.vue'))
  console.log(`✓ ${site}`)
}
