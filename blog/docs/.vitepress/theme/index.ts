import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import CopyPage from './components/CopyPage.vue'
import { h } from 'vue'
import BlogIndex from './components/BlogIndex.vue'
import PostFooter from './components/PostFooter.vue'
import PostMeta from './components/PostMeta.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'doc-before': () => [h(CopyPage), h(PostMeta)],
    'doc-after': () => h(PostFooter),
  }),
  enhanceApp({ app }) {
    app.component('BlogIndex', BlogIndex)
  },
} satisfies Theme
