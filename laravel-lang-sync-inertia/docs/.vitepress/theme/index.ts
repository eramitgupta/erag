// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import { withBase } from 'vitepress'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HeroStackIcons from './components/HeroStackIcons.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h('img', {
        class: 'hero-sync-art',
        src: withBase('/server-sync.svg'),
        alt: 'Laravel Lang Sync Inertia',
      }),
      'home-hero-actions-after': () => h(HeroStackIcons)
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  }
} satisfies Theme
