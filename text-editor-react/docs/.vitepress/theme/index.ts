import DefaultTheme from 'vitepress/theme';
import DemoTab from './components/DemoTab.vue';
import ReactEditor from './components/ReactEditor.vue';
import './custom.css';

export default {
    extends: DefaultTheme,
    enhanceApp({ app }: { app: any }) {
        app.component('ReactEditor', ReactEditor);
        app.component('DemoTab', DemoTab);
    },
};
