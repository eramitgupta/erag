import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import CopyPage from './components/CopyPage.vue';
import { Editor } from '@erag/text-editor-vue';
import DemoTab from './components/DemoTab.vue';
import '@erag/text-editor-vue/style.css';
import './custom.css';

export default {
    extends: DefaultTheme,
    Layout: () => h(DefaultTheme.Layout, null, { 'doc-before': () => h(CopyPage) }),
    enhanceApp({ app }: { app: any }) {
        app.component('Editor', Editor);
        app.component('DemoTab', DemoTab);
    },
};
