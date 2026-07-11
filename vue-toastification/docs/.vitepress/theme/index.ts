import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ToastPlugin from '@erag/vue-toastification'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    if (typeof window !== 'undefined') {
      app.use(ToastPlugin)
    }
  }
} satisfies Theme
