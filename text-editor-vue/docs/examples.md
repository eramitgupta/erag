---
title: Examples & Live Demos
sidebar: false
aside: false
description: 'Explore live Vue 3 rich text editor demos for mentions, merge tags, templates, image uploads, tables, and advanced editing.'
head:
    - - meta
      - name: robots
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    - - meta
      - name: googlebot
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    - - meta
      - name: bingbot
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
---

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import type { EditorInit, EditorInstance, ImagesUploadHandler, MentionItem, MergeTagItem } from '@erag/text-editor-vue';

// Demo 1
const demo1Content = ref('<h2>Basic Editor</h2><p>This is a minimal controlled editor component.</p>');

// Demo 2
const demo2Content = ref('<h2>Custom Toolbar</h2><p>Simplified toolbar layout without top menubar.</p>');
const demo2Config: EditorInit = {
    height: 240,
    menubar: false,
    statusbar: true,
    toolbar:
        'undo redo | bold italic underline | lineheight alignment | ' +
        'bullist numlist checklist outdent indent | removeformat',
};

// Demo 3
const demo3Content = ref('<p>Toggle the checkboxes above to test <strong>Readonly</strong> and <strong>Disabled</strong> modes.</p>');
const demo3Readonly = ref(false);
const demo3Disabled = ref(false);

// Demo 4
const demo4Content = ref('<p>Click the buttons above to interact with the editor via <code>useTemplateRef</code> API.</p>');
const demo4Editor = useTemplateRef<EditorInstance>('demo4EditorRef');

function insertDemo4Greeting() {
    demo4Editor.value?.focus();
    demo4Editor.value?.insertHtml('<p><strong>Hello from Template Ref API!</strong> 👋</p>');
}

function clearDemo4() {
    demo4Editor.value?.clear();
}

// Demo 5
const demo5Content = ref('<p>Type <strong>@</strong> in the editor to open the team member mention dropdown.</p>');
const demo5Members: MentionItem[] = [
    { id: 1, label: 'Damon Cross', description: 'Senior Backend Developer', value: 'damon@example.com' },
    { id: 2, label: 'Ava Mitchell', description: 'Product Designer', value: 'ava@example.com' },
    { id: 3, label: 'Ethan Clark', description: 'Frontend Lead', value: 'ethan@example.com' },
];
const demo5Config: EditorInit = {
    height: 280,
    mentions: {
        enabled: true,
        debounce: 150,
        limit: 5,
        items: demo5Members,
    },
};

// Demo 6
const demo6Content = ref('<p>Dear <code>&#123;&#123; client.name &#125;&#125;</code>, your proposal <code>&#123;&#123; proposal.id &#125;&#125;</code> is ready.</p>');
const demo6Tags: MergeTagItem[] = [
    { name: 'Client name', value: 'client.name', group: 'Client Details' },
    { name: 'Client email', value: 'client.email', group: 'Client Details' },
    { name: 'Proposal ID', value: 'proposal.id', group: 'Proposal' },
    { name: 'Creation date', value: 'proposal.date', group: 'Proposal' },
];
const demo6Config: EditorInit = {
    height: 280,
    mergeTags: {
        enabled: true,
        items: demo6Tags,
    },
};

// Demo 7
const demo7Content = ref('<p>Select a template from the top <strong>Insert → Templates</strong> menubar or toolbar icon...</p>');
const demo7Config: EditorInit = {
    height: 280,
    templates: {
        enabled: true,
        items: [
            {
                id: 'welcome-email',
                title: 'Welcome Email',
                description: 'Client onboarding template',
                content: 'html content...',
            },
            {
                id: 'meeting-notes',
                title: 'Meeting Notes',
                description: 'Action items structure',
                content: 'html content...',
            },
        ],
    },
};

// Demo 8
const demo8Content = ref('<p>Drag and drop an image or click the <strong>Image</strong> toolbar icon to test simulated upload progress.</p>');
const demo8UploadHandler: ImagesUploadHandler = async (blobInfo, progress) => {
    return new Promise((resolve) => {
        let p = 0;
        const interval = setInterval(() => {
            p += 25;
            progress(p);
            if (p >= 100) {
                clearInterval(interval);
                resolve('https://picsum.photos/600/350');
            }
        }, 150);
    });
};
const demo8Config: EditorInit = {
    height: 300,
    imagesUploadHandler: demo8UploadHandler,
};

// Demo 9
const demo9Content = ref('<h2>Enterprise Editor Suite 🚀</h2><p>Type <strong>@</strong> to mention, <code>&#123;&#123;</code> for merge tags, or use the toolbar templates.</p>');
const demo9Config: EditorInit = {
    height: 350,
    minHeight: 250,
    menubar: true,
    statusbar: true,
    imagesUploadHandler: demo8UploadHandler,
    mentions: {
        enabled: true,
        items: demo5Members,
    },
    mergeTags: {
        enabled: true,
        items: demo6Tags,
    },
    templates: {
        enabled: true,
        items: [
            {
                id: 'invoice-cover',
                title: 'Invoice Cover Letter',
                description: 'Billing document template',
                content: '<p>Dear customer, please find your statement attached.</p>',
            },
        ],
    },
    toolbar:
        'undo redo | blocks fontfamily fontsize lineheight | ' +
        'bold italic underline strikethrough | forecolor backcolor | ' +
        'alignment | ' +
        'bullist numlist checklist outdent indent | link image media table | ' +
        'hr removeformat | code preview fullscreen',
};
</script>

# Examples & Live Demos

Switch between the **Live Preview** tab to test interactive editors directly in your browser and the **Vue Code** tab to view the complete code snippets.

---

## 1. Basic Controlled Component

Minimal two-way binding using Vue 3 `v-model`.

<DemoTab title="1. Basic Controlled Component">
<template #preview>
<ClientOnly>
  <Editor v-model="demo1Content" placeholder="Start typing..." />
</ClientOnly>
</template>

<template #code>

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Editor } from '@erag/text-editor-vue';
import '@erag/text-editor-vue/style.css';

const content = shallowRef('<p>Hello World!</p>');
</script>

<template>
    <Editor v-model="content" placeholder="Start typing..." />
</template>
```

</template>
</DemoTab>

---

## 2. Custom Toolbar & Menubar

Minimal custom toolbar preset with top menubar disabled.

<DemoTab title="2. Custom Toolbar Configuration">
<template #preview>
<ClientOnly>
  <Editor v-model="demo2Content" :init="demo2Config" />
</ClientOnly>
</template>

<template #code>

```vue
<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { Editor, type EditorInit } from '@erag/text-editor-vue';
import '@erag/text-editor-vue/style.css';

const content = shallowRef('<h2>Customized Editor</h2>');

const editorConfig = computed<EditorInit>(() => ({
    height: 240,
    menubar: false,
    statusbar: true,
    toolbar:
        'undo redo | bold italic underline | lineheight alignment | ' +
        'bullist numlist checklist outdent indent | removeformat',
}));
</script>

<template>
    <Editor v-model="content" :init="editorConfig" />
</template>
```

</template>
</DemoTab>

---

## 3. Readonly & Disabled Modes

Dynamically toggle the editor between editable, readonly, and disabled states.

<DemoTab title="3. Readonly & Disabled Modes">
<template #preview>
<div style="margin-bottom: 1rem; display: flex; gap: 1.5rem; align-items: center; font-size: 0.9rem;">
  <label style="display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer;">
    <input v-model="demo3Readonly" type="checkbox" /> Readonly Mode
  </label>
  <label style="display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer;">
    <input v-model="demo3Disabled" type="checkbox" /> Disabled State
  </label>
</div>

<ClientOnly>
  <Editor
    v-model="demo3Content"
    :readonly="demo3Readonly"
    :disabled="demo3Disabled"
  />
</ClientOnly>
</template>

<template #code>

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Editor } from '@erag/text-editor-vue';
import '@erag/text-editor-vue/style.css';

const content = shallowRef('<p>Dynamic state toggling.</p>');
const isReadonly = shallowRef(false);
const isDisabled = shallowRef(false);
</script>

<template>
    <div class="controls">
        <label><input v-model="isReadonly" type="checkbox" /> Readonly</label>
        <label><input v-model="isDisabled" type="checkbox" /> Disabled</label>
    </div>

    <Editor v-model="content" :readonly="isReadonly" :disabled="isDisabled" />
</template>
```

</template>
</DemoTab>

---

## 4. Programmatic Control (Template Ref API)

Trigger focus, insert HTML, or clear content programmatically using `useTemplateRef`.

<DemoTab title="4. Programmatic API Control">
<template #preview>
<div style="margin-bottom: 1rem; display: flex; gap: 0.5rem;">
  <button
    type="button"
    style="padding: 0.4rem 0.8rem; font-size: 0.85rem; border-radius: 6px; background: var(--vp-c-brand-1); color: #fff; border: none; cursor: pointer;"
    @click="insertDemo4Greeting"
  >
    Insert Greeting
  </button>
  <button
    type="button"
    style="padding: 0.4rem 0.8rem; font-size: 0.85rem; border-radius: 6px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); border: 1px solid var(--vp-c-border); cursor: pointer;"
    @click="clearDemo4"
  >
    Clear Content
  </button>
</div>

<ClientOnly>
  <Editor ref="demo4EditorRef" v-model="demo4Content" />
</ClientOnly>
</template>

<template #code>

```vue
<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue';
import { Editor, type EditorInstance } from '@erag/text-editor-vue';
import '@erag/text-editor-vue/style.css';

const content = shallowRef('<p>Initial content...</p>');
const editor = useTemplateRef<EditorInstance>('editor');

function insertGreeting(): void {
    editor.value?.focus();
    editor.value?.insertHtml('<p><strong>Hello from API!</strong> 👋</p>');
}

function clearContent(): void {
    editor.value?.clear();
}
</script>

<template>
    <button type="button" @click="insertGreeting">Insert Greeting</button>
    <button type="button" @click="clearContent">Clear</button>

    <Editor ref="editor" v-model="content" />
</template>
```

</template>
</DemoTab>

---

## 5. Mentions (@) Autocomplete

Type `@` in the editor to trigger team member autocomplete.

<DemoTab title="5. Mentions (@) Autocomplete">
<template #preview>
<ClientOnly>
  <Editor v-model="demo5Content" :init="demo5Config" />
</ClientOnly>
</template>

<template #code>

```vue
<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import {
    Editor,
    type EditorInit,
    type MentionSelectEvent,
} from '@erag/text-editor-vue';
import '@erag/text-editor-vue/style.css';

const content = shallowRef(
    '<p>Type <strong>@</strong> to mention someone.</p>',
);

const teamMembers = [
    {
        id: 1,
        label: 'Damon Cross',
        description: 'Senior Backend Developer',
        value: 'damon@example.com',
    },
    {
        id: 2,
        label: 'Ava Mitchell',
        description: 'Product Designer',
        value: 'ava@example.com',
    },
];

const editorConfig = computed<EditorInit>(() => ({
    height: 280,
    mentions: {
        enabled: true,
        items: teamMembers,
    },
}));
</script>

<template>
    <Editor v-model="content" :init="editorConfig" />
</template>
```

</template>
</DemoTab>

---

## 6. Merge Tags (<code>&#123;&#123;</code>) & Slide-out Drawer

Type <code>&#123;&#123;</code> or open the **Merge Tags** sidebar drawer.

<DemoTab title="6. Merge Tags & Drawer">
<template #preview>
<ClientOnly>
  <Editor v-model="demo6Content" :init="demo6Config" />
</ClientOnly>
</template>

<template #code>

```vue
<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import {
    Editor,
    type EditorInit,
    type MergeTagItem,
} from '@erag/text-editor-vue';
import '@erag/text-editor-vue/style.css';

const content = shallowRef(
    '<p>Dear <code>&#123;&#123; client.name &#125;&#125;</code>...</p>',
);

const tags: MergeTagItem[] = [
    { name: 'Client name', value: 'client.name', group: 'Client Details' },
    { name: 'Proposal ID', value: 'proposal.id', group: 'Proposal' },
];

const editorConfig = computed<EditorInit>(() => ({
    height: 280,
    mergeTags: {
        enabled: true,
        items: tags,
    },
}));
</script>

<template>
    <Editor v-model="content" :init="editorConfig" />
</template>
```

</template>
</DemoTab>

---

## 7. Templates Selection

Select structured document templates from the top menu.

<DemoTab title="7. Templates Selection">
<template #preview>
<ClientOnly>
  <Editor v-model="demo7Content" :init="demo7Config" />
</ClientOnly>
</template>

<template #code>

```vue
<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { Editor, type EditorInit } from '@erag/text-editor-vue';
import '@erag/text-editor-vue/style.css';

const content = shallowRef('<p>Select a template...</p>');

const editorConfig = computed<EditorInit>(() => ({
    height: 280,
    templates: {
        enabled: true,
        items: [
            {
                id: 'welcome-email',
                title: 'Welcome Email',
                description: 'Client onboarding template',
                content:
                    '<h2>Welcome Aboard!</h2><p>Dear Customer, welcome.</p>',
            },
        ],
    },
}));
</script>

<template>
    <Editor v-model="content" :init="editorConfig" />
</template>
```

</template>
</DemoTab>

---

## 8. Image Uploads & Progress

Drag & drop or select images with simulated progress reporting.

<DemoTab title="8. Image Uploads with Progress">
<template #preview>
<ClientOnly>
  <Editor v-model="demo8Content" :init="demo8Config" />
</ClientOnly>
</template>

<template #code>

```vue
<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import {
    Editor,
    type EditorInit,
    type ImagesUploadHandler,
} from '@erag/text-editor-vue';
import '@erag/text-editor-vue/style.css';

const content = shallowRef('<p>Upload or drag an image...</p>');

const handleImageUpload: ImagesUploadHandler = async (blobInfo, progress) => {
    return new Promise((resolve) => {
        let p = 0;
        const interval = setInterval(() => {
            p += 25;
            progress(p);
            if (p >= 100) {
                clearInterval(interval);
                resolve('https://picsum.photos/600/350');
            }
        }, 150);
    });
};

const editorConfig = computed<EditorInit>(() => ({
    height: 300,
    imagesUploadHandler: handleImageUpload,
}));
</script>

<template>
    <Editor v-model="content" :init="editorConfig" />
</template>
```

</template>
</DemoTab>

---

## 9. Enterprise All-in-One Suite

Complete production-grade setup with all plugins, mentions, merge tags, templates, and full toolbar.

<DemoTab title="9. Full Enterprise Suite">
<template #preview>
<ClientOnly>
  <Editor v-model="demo9Content" :init="demo9Config" />
</ClientOnly>
</template>

<template #code>

```vue
<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { Editor, type EditorInit } from '@erag/text-editor-vue';
import '@erag/text-editor-vue/style.css';

const content = shallowRef('<h2>Enterprise Document Editor 🚀</h2>');

const editorConfig = computed<EditorInit>(() => ({
    height: 350,
    menubar: true,
    statusbar: true,
    mentions: { enabled: true, items: [...] },
    mergeTags: { enabled: true, items: [...] },
    templates: { enabled: true, items: [...] },
    toolbar: 'undo redo | blocks fontfamily fontsize lineheight | bold italic underline | forecolor backcolor | alignment | bullist numlist checklist outdent indent | link image media table | code preview fullscreen',
}));
</script>

<template>
    <Editor v-model="content" :init="editorConfig" />
</template>
```

</template>
</DemoTab>
