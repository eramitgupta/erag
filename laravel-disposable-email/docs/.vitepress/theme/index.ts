import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import CopyPage from './components/CopyPage.vue'
import EmailCheckDemo from './components/EmailCheckDemo.vue'
import HomeLanding from './components/HomeLanding.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, { 'doc-before': () => h(CopyPage) }),
  enhanceApp({ app }) {
    app.component('EmailCheckDemo', EmailCheckDemo)
    app.component('HomeLanding', HomeLanding)
  }
} satisfies Theme
