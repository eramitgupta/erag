// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import CopyPage from './components/CopyPage.vue';
import './style.css';

export default {
    extends: DefaultTheme,
    Layout: () => h(DefaultTheme.Layout, null, { 'doc-before': () => h(CopyPage) }),
    enhanceApp({ app, router, siteData }) {
        if (typeof window !== 'undefined') {
            document.documentElement.classList.remove('dark');
            try {
                localStorage.removeItem('vitepress-theme-appearance');
            } catch {}
        }
    },
} satisfies Theme;
