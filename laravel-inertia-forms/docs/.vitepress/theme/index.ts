// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { defineAsyncComponent, h, onMounted } from 'vue';
import HeroBadge from './components/HeroBadge.vue';
import HeroFloaters from './components/HeroFloaters.vue';
import HeroInstall from './components/HeroInstall.vue';
import './demo-reset.css';
import './demo.css';
import { installFrameworkTabs } from './framework-tabs';
import './style.css';

export default {
    extends: DefaultTheme,
    Layout: () =>
        h(DefaultTheme.Layout, null, {
            'home-hero-info-before': () => [h(HeroFloaters), h(HeroBadge)],
            'home-hero-actions-after': () => h(HeroInstall),
        }),
    enhanceApp({ app, router, siteData }) {
        // Loaded on demand so pages without the demo don't download the forms package.
        app.component(
            'FormPlayground',
            defineAsyncComponent(() => import('./components/FormPlayground.vue')),
        );
        app.component(
            'IconGallery',
            defineAsyncComponent(() => import('./components/IconGallery.vue')),
        );
        app.component(
            'Example',
            defineAsyncComponent(() => import('./components/Example.vue')),
        );
    },
    setup() {
        // Picking Vue, React or Svelte in one code group switches them all.
        onMounted(installFrameworkTabs);
    },
} satisfies Theme;
