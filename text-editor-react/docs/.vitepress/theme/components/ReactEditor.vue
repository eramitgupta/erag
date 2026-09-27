<script setup lang="ts">
/**
 * Mounts the real React `<Editor>` from @erag/text-editor-react inside VitePress.
 * React is loaded only in the browser, so static rendering stays safe.
 */
import { onBeforeUnmount, onMounted, shallowRef, toRaw, useTemplateRef, watch } from 'vue';
import type { Root } from 'react-dom/client';
import type {
    EditorInit,
    EditorInstance,
    ImageDeleteInfo,
    MentionRemoveEvent,
    MentionSearchEvent,
    MentionSelectEvent,
    MergeTagRemoveEvent,
    MergeTagSelectEvent,
    TemplateInsertEvent,
} from '@erag/text-editor-react';

const props = withDefaults(
    defineProps<{
        modelValue?: string;
        init?: EditorInit;
        disabled?: boolean;
        readonly?: boolean;
        ariaLabel?: string;
        name?: string;
    }>(),
    { modelValue: '', disabled: false, readonly: false, ariaLabel: 'Rich text editor' },
);

const emit = defineEmits<{
    'update:modelValue': [value: string];
    change: [value: string];
    'mention-search': [event: MentionSearchEvent];
    'mention-select': [event: MentionSelectEvent];
    'mention-remove': [event: MentionRemoveEvent];
    'merge-tag-select': [event: MergeTagSelectEvent];
    'merge-tag-remove': [event: MergeTagRemoveEvent];
    'template-insert': [event: TemplateInsertEvent];
    'image-remove': [image: ImageDeleteInfo];
}>();

const host = useTemplateRef<HTMLDivElement>('host');
const ready = shallowRef(false);
let root: Root | null = null;
let instance: EditorInstance | null = null;
let renderEditor: (() => void) | null = null;

onMounted(async () => {
    const [{ createElement }, { createRoot }, { Editor }] = await Promise.all([
        import('react'),
        import('react-dom/client'),
        import('@erag/text-editor-react'),
    ]);
    if (!host.value) return;
    root = createRoot(host.value);
    renderEditor = () =>
        root?.render(
            createElement(Editor, {
                ref: (value: EditorInstance | null) => {
                    instance = value;
                },
                value: props.modelValue,
                init: props.init ? toRaw(props.init) : undefined,
                disabled: props.disabled,
                readOnly: props.readonly,
                ariaLabel: props.ariaLabel,
                name: props.name,
                onChange: (value: string) => emit('update:modelValue', value),
                onCommit: (value: string) => emit('change', value),
                onMentionSearch: (event: MentionSearchEvent) => emit('mention-search', event),
                onMentionSelect: (event: MentionSelectEvent) => emit('mention-select', event),
                onMentionRemove: (event: MentionRemoveEvent) => emit('mention-remove', event),
                onMergeTagSelect: (event: MergeTagSelectEvent) => emit('merge-tag-select', event),
                onMergeTagRemove: (event: MergeTagRemoveEvent) => emit('merge-tag-remove', event),
                onTemplateInsert: (event: TemplateInsertEvent) => emit('template-insert', event),
                onImageRemove: (image: ImageDeleteInfo) => emit('image-remove', image),
            }),
        );
    renderEditor();
    ready.value = true;
});

watch(
    () => [props.modelValue, props.init, props.disabled, props.readonly, props.ariaLabel],
    () => renderEditor?.(),
    { deep: true },
);

onBeforeUnmount(() => {
    root?.unmount();
    root = null;
    instance = null;
});

defineExpose({
    focus: () => instance?.focus(),
    blur: () => instance?.blur(),
    getHtml: () => instance?.getHtml() ?? '',
    setHtml: (value: string) => instance?.setHtml(value),
    getText: () => instance?.getText() ?? '',
    clear: () => instance?.clear(),
    insertHtml: (value: string) => instance?.insertHtml(value),
    insertText: (value: string) => instance?.insertText(value),
    selectAll: () => instance?.selectAll(),
    undo: () => instance?.undo(),
    redo: () => instance?.redo(),
    openSourceCode: () => instance?.openSourceCode(),
    openPreview: () => instance?.openPreview(),
    getRootElement: () => instance?.getRootElement() ?? null,
});
</script>

<template>
    <div class="react-editor-host">
        <div
            v-if="!ready"
            class="react-editor-host__loading"
        >
            Loading editor…
        </div>
        <div ref="host" />
    </div>
</template>
