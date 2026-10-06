import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import CopyPage from './components/CopyPage.vue'
import PhonePlayground from './components/PhonePlayground.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, { 'doc-before': () => h(CopyPage) }),
  enhanceApp({ app }) {
    app.component('PhonePlayground', PhonePlayground)
  }
} satisfies Theme
