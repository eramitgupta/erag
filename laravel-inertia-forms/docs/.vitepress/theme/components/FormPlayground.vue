<script setup lang="ts">
import { Form, type FormSchema } from '@erag/inertia-forms-vue';
import { icons } from '@erag/inertia-forms-core';
import iconSet from '@erag/inertia-forms-icons';
import { describeValue, requiredErrors } from '../demo-validation';
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, useId, watch } from 'vue';
import CodeInput from './fields/CodeInput.vue';
import QuantityStepper from './fields/QuantityStepper.vue';
import Rating from './fields/Rating.vue';
import type { DemoCode, DemoFramework } from '../demo-code.data.mts';
import { onFrameworkChange, preferredFramework, setPreferredFramework } from '../framework-tabs';
interface DemoForm {
    key: string;
    label: string;
    /** Path data for the icon on the form's tab. */
    icon: string;
    className: string;
    schema: FormSchema;
}

const props = withDefaults(defineProps<{ initial?: string }>(), { initial: 'all-fields' });

/**
 * Schemas exported from the PHP classes in `demo/` by `php demo/export.php`.
 */
const schemas = import.meta.glob<FormSchema>('../demo/*.json', { eager: true, import: 'default' });

/** Path data for a built-in icon, or one from the icon set Laravel sends as SVG. */
const iconSetPaths = Object.assign({}, ...Object.values(iconSet as Record<string, Record<string, string>>)) as Record<string, string>;
function iconPath(name: string): string {
    return (icons as Record<string, string>)[name] ?? iconSetPaths[name] ?? '';
}

const forms: DemoForm[] = [
    ['all-fields', 'All fields', 'grid'],
    ['custom-fields', 'Custom fields', 'sparkles'],
    ['onboarding-wizard', 'Onboarding wizard', 'user'],
    ['landing-page', 'Landing page', 'layout'],
    ['support-chat', 'Support chat', 'messageCircle'],
    ['product-launch', 'Product launch', 'rocket'],
    ['project-kickoff', 'Project kickoff', 'flag'],
    ['support-triage', 'Support triage', 'inbox'],
    ['event-session', 'Event session', 'calendar'],
    ['campaign-plan', 'Campaign plan', 'megaphone'],
    ['hiring-pipeline', 'Hiring pipeline', 'users'],
    ['subscription-billing', 'Subscription billing', 'creditCard'],
    ['clinic-intake', 'Clinic intake', 'clipboardCheck'],
    ['property-booking', 'Property booking', 'building'],
    ['editorial-calendar', 'Editorial calendar', 'calendarCheck'],
].map(([key, label, icon]) => ({
    key: key!,
    label: label!,
    icon: iconPath(icon!),
    className: `${key!
        .split('-')
        .map((word) => word[0]!.toUpperCase() + word.slice(1))
        .join('')}Form`,
    schema: schemas[`../demo/${key}.json`]!,
}));

/**
 * Components for the custom fields in `demo/Fields`, keyed by `component()`.
 */
const customFields = { Rating, CodeInput, QuantityStepper };

const accents = [
    { name: 'Indigo', value: '#4f46e5' },
    { name: 'Sky', value: '#0284c7' },
    { name: 'Emerald', value: '#059669' },
    { name: 'Amber', value: '#d97706' },
    { name: 'Rose', value: '#e11d48' },
    { name: 'Violet', value: '#7c3aed' },
];

const views = [
    { key: 'preview', label: 'Preview', icon: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z' },
    { key: 'code', label: 'Code', icon: 'm16 18 6-6-6-6M8 6l-6 6 6 6' },
] as const;

const uid = useId();
const view = ref<'preview' | 'code'>('preview');
const activeFile = ref(0);
const frameworks: Array<{ key: DemoFramework; label: string }> = [
    { key: 'vue', label: 'Vue' },
    { key: 'react', label: 'React' },
    { key: 'svelte', label: 'Svelte' },
];
const framework = ref<DemoFramework>('vue');
const activeKey = ref(forms.some((form) => form.key === props.initial) ? props.initial : forms[0]!.key);
const accent = ref(accents[0]!.value);
const payload = ref<string | null>(null);
const errorCount = ref(0);
const formVersion = ref(0);

const active = computed(() => forms.find((form) => form.key === activeKey.value) ?? forms[0]!);
const demoCode = shallowRef<DemoCode | null>(null);
const files = computed(() =>
    (demoCode.value?.[active.value.key] ?? []).filter((file) => !file.framework || file.framework === framework.value),
);

/** The reader's pick applies to every page, see framework-tabs.ts. */
function selectFramework(key: DemoFramework): void {
    setPreferredFramework(key);
}

function showFramework(key: DemoFramework): void {
    if (framework.value === key) {
        return;
    }

    const current = files.value[activeFile.value];
    framework.value = key;
    // Stay on the same kind of file (e.g. the page) when switching frameworks.
    const match = current?.framework
        ? files.value.findIndex((file) => file.framework && file.name.split('.')[0] === current.name.split('.')[0])
        : activeFile.value;
    activeFile.value = Math.max(match, 0);
}

let stopFrameworkSync: (() => void) | null = null;

onMounted(() => {
    const preferred = preferredFramework();

    if (preferred) {
        showFramework(preferred);
    }

    stopFrameworkSync = onFrameworkChange(showFramework);
});

onBeforeUnmount(() => stopFrameworkSync?.());

// Highlighted sources are only downloaded the first time the Code view opens.
watch(view, async (current) => {
    if (current === 'code' && !demoCode.value) {
        demoCode.value = (await import('../demo-code.data.mts')).data;
    }
});

function selectForm(key: string): void {
    activeKey.value = key;
    activeFile.value = 0;
    reset();
}

function reset(): void {
    payload.value = null;
    errorCount.value = 0;
    formVersion.value++;
}

function beforeSubmit(
    data: Record<string, unknown>,
    helpers: { setErrors: (errors: Record<string, string>) => void },
): boolean {
    const errors = requiredErrors(active.value.schema, data);
    errorCount.value = Object.keys(errors).length;

    if (errorCount.value > 0) {
        helpers.setErrors(errors);
        payload.value = null;
        return false;
    }

    payload.value = JSON.stringify(data, describeValue, 4);

    return false;
}
</script>

<template>
    <div class="@container" :style="{ '--demo-accent': accent }">
        <section
            class="erag-demo vp-raw flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/50"
        >
            <div class="flex flex-col gap-3">
                <h3 :id="`${uid}-heading`" class="text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase dark:text-zinc-400">
                    Form class
                </h3>
                <div class="grid grid-cols-2 gap-2 @lg:grid-cols-3 @3xl:grid-cols-5" role="tablist" :aria-labelledby="`${uid}-heading`">
                    <button
                        v-for="form in forms"
                        :key="form.key"
                        type="button"
                        role="tab"
                        :aria-selected="form.key === activeKey"
                        class="group flex min-w-0 items-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-left text-sm font-medium text-zinc-600 shadow-xs transition hover:border-zinc-300 hover:text-zinc-900 aria-selected:border-[color-mix(in_oklab,var(--demo-accent)_45%,transparent)] aria-selected:bg-[color-mix(in_oklab,var(--demo-accent)_8%,white)] aria-selected:text-[var(--demo-accent)] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100 dark:aria-selected:bg-[color-mix(in_oklab,var(--demo-accent)_18%,#18181b)] dark:aria-selected:text-[color-mix(in_oklab,var(--demo-accent)_55%,white)]"
                        @click="selectForm(form.key)"
                    >
                        <span
                            class="grid size-7 shrink-0 place-items-center rounded-lg bg-zinc-100 text-zinc-500 transition group-hover:text-zinc-900 group-aria-selected:bg-[var(--demo-accent)] group-aria-selected:text-white dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-100 dark:group-aria-selected:bg-[var(--demo-accent)] dark:group-aria-selected:text-white"
                            aria-hidden="true"
                        >
                            <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="form.icon" /></svg>
                        </span>
                        <span class="truncate">{{ form.label }}</span>
                    </button>
                </div>
            </div>

            <div class="flex flex-wrap items-center gap-2" role="group" aria-label="Accent color">
                <span class="text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase dark:text-zinc-400">Accent</span>
                <button
                    v-for="color in accents"
                    :key="color.value"
                    type="button"
                    class="size-6 rounded-full ring-offset-2 transition hover:scale-110 aria-pressed:ring-2"
                    :style="{ backgroundColor: color.value, '--tw-ring-color': color.value }"
                    :aria-label="color.name"
                    :aria-pressed="accent === color.value"
                    @click="accent = color.value"
                />
                <label class="relative size-6 cursor-pointer overflow-hidden rounded-full border border-dashed border-zinc-400 dark:border-zinc-600" title="Custom color">
                    <span class="sr-only">Custom accent color</span>
                    <input v-model="accent" type="color" class="absolute inset-0 size-full cursor-pointer opacity-0" />
                </label>
            </div>
        </section>

        <div class="mt-4 grid gap-4 @3xl:grid-cols-[minmax(0,1fr)_17rem]">
            <div class="min-w-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div class="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50/70 px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div class="inline-flex rounded-lg border border-zinc-200 bg-white p-0.5 dark:border-zinc-800 dark:bg-zinc-900" role="tablist" aria-label="View">
                        <button
                            v-for="option in views"
                            :key="option.key"
                            type="button"
                            role="tab"
                            :aria-selected="view === option.key"
                            class="inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium text-zinc-500 transition hover:text-zinc-900 aria-selected:bg-zinc-900 aria-selected:text-white dark:text-zinc-400 dark:hover:text-zinc-100"
                            @click="view = option.key"
                        >
                            <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path :d="option.icon" />
                            </svg>
                            {{ option.label }}
                        </button>
                    </div>
                    <span class="font-mono text-xs text-zinc-500 dark:text-zinc-400">{{ active.className }}.php</span>
                </div>

                <div v-show="view === 'preview'" class="erag-demo vp-raw p-5 sm:p-6">
                    <ClientOnly>
                        <Form
                            :key="`${active.key}-${formVersion}`"
                            :form="active.schema"
                            :accent="accent"
                            :components="customFields"
                            :on-before-submit="beforeSubmit"
                        />
                    </ClientOnly>
                </div>

                <div v-if="view === 'code'" class="demo-code">
                    <div class="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">
                        <span class="text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase dark:text-zinc-400">Frontend</span>
                        <div class="inline-flex rounded-lg border border-zinc-200 bg-white p-0.5 dark:border-zinc-800 dark:bg-zinc-900" role="tablist" aria-label="Frontend framework">
                            <button
                                v-for="option in frameworks"
                                :key="option.key"
                                type="button"
                                role="tab"
                                :aria-selected="framework === option.key"
                                :data-framework="option.key"
                                class="demo-framework-tab inline-flex items-center rounded-md px-3 py-1 text-xs font-semibold text-zinc-500 transition hover:text-zinc-900 aria-selected:bg-[color-mix(in_oklab,var(--demo-accent,#4f46e5)_12%,white)] aria-selected:text-[var(--demo-accent,#4f46e5)] dark:text-zinc-400 dark:hover:text-zinc-100 dark:aria-selected:bg-[color-mix(in_oklab,var(--demo-accent,#4f46e5)_22%,#18181b)] dark:aria-selected:text-[color-mix(in_oklab,var(--demo-accent,#4f46e5)_55%,white)]"
                                @click="selectFramework(option.key)"
                            >
                                {{ option.label }}
                            </button>
                        </div>
                    </div>
                    <div v-if="files.length > 1" class="flex flex-wrap gap-1 border-b border-zinc-200 px-3 pt-2 dark:border-zinc-800" role="tablist" aria-label="Files">
                        <button
                            v-for="(file, index) in files"
                            :key="file.name"
                            type="button"
                            role="tab"
                            :aria-selected="activeFile === index"
                            class="-mb-px rounded-t-md border border-transparent px-3 py-1.5 font-mono text-xs text-zinc-500 transition hover:text-zinc-900 aria-selected:border-zinc-200 aria-selected:border-b-white aria-selected:bg-white aria-selected:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 dark:aria-selected:border-zinc-800 dark:aria-selected:bg-zinc-900 dark:aria-selected:text-zinc-100"
                            @click="activeFile = index"
                        >
                            {{ file.name }}
                        </button>
                    </div>
                    <div v-if="files[activeFile]" class="demo-code-body" v-html="files[activeFile]!.html" />
                    <div v-else class="p-6 text-sm text-zinc-500 dark:text-zinc-400">Loading code…</div>
                </div>
            </div>

            <aside class="erag-demo vp-raw flex min-w-0 flex-col rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
                <div class="flex items-center justify-between gap-2">
                    <p class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Submitted data</p>
                    <button
                        type="button"
                        class="rounded-md px-2 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                        @click="reset"
                    >
                        Reset
                    </button>
                </div>
                <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Rendered from <code class="font-mono">{{ active.className }}</code>. Nothing is sent to a server.
                </p>
                <pre
                    v-if="payload"
                    class="mt-3 max-h-[28rem] flex-1 overflow-auto rounded-lg bg-zinc-900 p-3 font-mono text-xs leading-relaxed text-zinc-100"
                    >{{ payload }}</pre
                >
                <p v-else-if="errorCount" class="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                    {{ errorCount }} required {{ errorCount === 1 ? 'field is' : 'fields are' }} empty. The errors are
                    shown under each field, just like Laravel validation errors.
                </p>
                <p v-else class="mt-3 rounded-lg border border-dashed border-zinc-300 p-3 text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                    Fill in the form and press submit to see the data Laravel would receive.
                </p>
            </aside>
        </div>
    </div>
</template>

<style scoped>
/* The highlighted block comes from VitePress, so it keeps the docs code style and copy button. */
.demo-code-body :deep(div[class*='language-']) {
    margin: 0 !important;
    border-radius: 0 !important;
}

.demo-code-body :deep(pre) {
    max-height: 42rem;
    overflow: auto;
}
</style>
