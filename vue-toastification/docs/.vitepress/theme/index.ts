import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import CopyPage from './components/CopyPage.vue'
import ToastPlugin from '@erag/vue-toastification'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, { 'doc-before': () => h(CopyPage) }),
  enhanceApp({ app }) {
    if (typeof window !== 'undefined') {
      app.use(ToastPlugin)
    }
  }
} satisfies Theme
