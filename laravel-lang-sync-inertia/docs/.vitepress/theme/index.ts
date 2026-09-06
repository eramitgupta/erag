// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import './style.css';

export default {
    extends: DefaultTheme,
    enhanceApp({ app, router, siteData }) {
        if (typeof window !== 'undefined') {
            document.documentElement.classList.remove('dark');
            try {
                localStorage.removeItem('vitepress-theme-appearance');
            } catch {}
        }
    },
} satisfies Theme;
