import DefaultTheme from 'vitepress/theme';
import { Editor } from '@erag/text-editor-vue';
import DemoTab from './components/DemoTab.vue';
import '@erag/text-editor-vue/style.css';
import './custom.css';

export default {
    extends: DefaultTheme,
    enhanceApp({ app }: { app: any }) {
        app.component('Editor', Editor);
        app.component('DemoTab', DemoTab);
    },
};

