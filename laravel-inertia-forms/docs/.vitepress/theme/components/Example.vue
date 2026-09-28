<script setup lang="ts">
import { Form, type FormSchema } from '@erag/inertia-forms-vue';
import { onMounted, ref, shallowRef } from 'vue';
import { describeValue, requiredErrors } from '../demo-validation';
import CodeInput from './fields/CodeInput.vue';
import QuantityStepper from './fields/QuantityStepper.vue';
import Rating from './fields/Rating.vue';

/**
 * A live preview of one `examples/<id>.php` file, with the code block from
 * the page (the default slot) underneath.
 *
 *     <Example id="concepts/fieldsets/basic">
 *
 *     <<< @/../examples/concepts/fieldsets/basic.php#example
 *
 *     </Example>
 */
const props = withDefaults(defineProps<{ id: string; accent?: string; submit?: boolean }>(), {
    accent: undefined,
    submit: true,
});

const schemas = import.meta.glob<FormSchema>('../examples/**/*.json', { import: 'default' });
const customFields = { Rating, CodeInput, QuantityStepper };

const schema = shallowRef<FormSchema | null>(null);
const missing = ref(false);
const payload = ref<string | null>(null);
const version = ref(0);

onMounted(async () => {
    const load = schemas[`../examples/${props.id}.json`];

    if (!load) {
        missing.value = true;
        return;
    }

    schema.value = await load();
});

function beforeSubmit(
    data: Record<string, unknown>,
    helpers: { setErrors: (errors: Record<string, string>) => void },
): boolean {
    if (!schema.value) {
        return false;
    }

    const errors = requiredErrors(schema.value, data);

    if (Object.keys(errors).length > 0) {
        helpers.setErrors(errors);
        payload.value = null;
        return false;
    }

    payload.value = JSON.stringify(data, describeValue, 4);

    return false;
}

function reset(): void {
    payload.value = null;
    version.value++;
}
</script>

<template>
    <div class="erag-example">
        <div class="erag-example-preview erag-demo vp-raw">
            <ClientOnly>
                <Form
                    v-if="schema"
                    :key="version"
                    :form="schema"
                    :accent="accent"
                    :components="customFields"
                    :on-before-submit="beforeSubmit"
                />
                <p v-else-if="missing" class="text-sm text-red-600">Example “{{ id }}” not found. Run php examples/export.php.</p>
                <div v-else class="h-24 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
            </ClientOnly>

            <div v-if="submit && payload" class="mt-5 rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60">
                <div class="flex items-center justify-between border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">
                    <span class="text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400">Submitted data</span>
                    <button
                        type="button"
                        class="rounded-md px-2 py-0.5 text-xs font-medium text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                        @click="reset"
                    >
                        Reset
                    </button>
                </div>
                <pre class="max-h-72 overflow-auto p-3 font-mono text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">{{ payload }}</pre>
            </div>
        </div>

        <div class="erag-example-code">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.erag-example {
    margin: 24px 0;
    border: 1px solid var(--vp-c-divider);
    border-radius: 14px;
    overflow: hidden;
    background: var(--vp-c-bg);
}

.erag-example-preview {
    padding: 28px 24px;
    background-color: #fff;
    background-image: radial-gradient(circle, rgb(228 228 231 / 0.9) 1px, transparent 1px);
    background-size: 16px 16px;
}

:global(.dark .erag-example-preview) {
    background-color: #0c0c0e;
    background-image: radial-gradient(circle, rgb(63 63 70 / 0.55) 1px, transparent 1px);
}

.erag-example-preview > :deep(form),
.erag-example-preview > :deep(div) {
    max-width: 640px;
    margin-left: auto;
    margin-right: auto;
}

@media (max-width: 640px) {
    .erag-example-preview {
        padding: 20px 16px;
    }
}

.erag-example-code {
    border-top: 1px solid var(--vp-c-divider);
}

.erag-example-code :deep(div[class*='language-']) {
    margin: 0 !important;
    border-radius: 0 !important;
}
</style>
