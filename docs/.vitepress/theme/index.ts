import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import ToastPlugin from "@erag/vue-toastification";
import '@erag/vue-toastification/dist/style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
    })
  },
  enhanceApp({ app, router, siteData }) {
    if (typeof window !== 'undefined') {
      import('@erag/vue-toastification').then(({ default: ToastPlugin }) => {
        app.use(ToastPlugin)
      })
    }
  }
} satisfies Theme
