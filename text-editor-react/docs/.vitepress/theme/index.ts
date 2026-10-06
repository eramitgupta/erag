import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import CopyPage from './components/CopyPage.vue';
import DemoTab from './components/DemoTab.vue';
import ReactEditor from './components/ReactEditor.vue';
import './custom.css';

export default {
    extends: DefaultTheme,
    Layout: () => h(DefaultTheme.Layout, null, { 'doc-before': () => h(CopyPage) }),
    enhanceApp({ app }: { app: any }) {
        app.component('ReactEditor', ReactEditor);
        app.component('DemoTab', DemoTab);
    },
};
