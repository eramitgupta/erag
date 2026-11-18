import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import CopyPage from './components/CopyPage.vue'
import OrphanHome from './components/home/OrphanHome.vue'
import './style.css'
import './home.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'doc-before': () => h(CopyPage),
  }),
  enhanceApp({ app }) {
    app.component('OrphanHome', OrphanHome)
  },
} satisfies Theme
