import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import PhonePlayground from './components/PhonePlayground.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('PhonePlayground', PhonePlayground)
  }
} satisfies Theme
