<script setup lang="ts">
import { ref } from 'vue';

interface DemoTabProps {
    title?: string;
}

defineProps<DemoTabProps>();

const activeTab = ref<'preview' | 'code'>('preview');
</script>

<template>
    <div class="demo-card">
        <div class="demo-card__header">
            <div v-if="title" class="demo-card__title">
                {{ title }}
            </div>

            <div class="demo-card__tabs" role="tablist">
                <button
                    type="button"
                    role="tab"
                    :aria-selected="activeTab === 'preview'"
                    class="demo-card__tab"
                    :class="{ 'demo-card__tab--active': activeTab === 'preview' }"
                    @click="activeTab = 'preview'"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    Live Preview
                </button>

                <button
                    type="button"
                    role="tab"
                    :aria-selected="activeTab === 'code'"
                    class="demo-card__tab"
                    :class="{ 'demo-card__tab--active': activeTab === 'code' }"
                    @click="activeTab = 'code'"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                    Vue Code
                </button>
            </div>
        </div>

        <div class="demo-card__body">
            <div v-show="activeTab === 'preview'" class="demo-card__preview">
                <slot name="preview" />
            </div>

            <div v-show="activeTab === 'code'" class="demo-card__code">
                <slot name="code" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.demo-card {
    margin: 1.5rem 0 2.5rem;
    border: 1px solid var(--vp-c-border);
    border-radius: 12px;
    background: var(--vp-c-bg-soft);
    overflow: hidden;
    box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
}

.demo-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 1rem;
    background: var(--vp-c-bg-alt);
    border-bottom: 1px solid var(--vp-c-border);
    gap: 1rem;
    flex-wrap: wrap;
}

.demo-card__title {
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--vp-c-text-1);
}

.demo-card__tabs {
    display: flex;
    gap: 0.35rem;
    background: var(--vp-c-bg);
    padding: 0.25rem;
    border-radius: 8px;
    border: 1px solid var(--vp-c-border);
}

.demo-card__tab {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.75rem;
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--vp-c-text-2);
    border-radius: 6px;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all 0.2s ease;
}

.demo-card__tab:hover {
    color: var(--vp-c-text-1);
}

.demo-card__tab--active {
    background: var(--vp-c-brand-1);
    color: #ffffff !important;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(15, 118, 110, 0.25);
}

.demo-card__body {
    padding: 1.25rem;
    background: var(--vp-c-bg);
}

.demo-card__preview {
    width: 100%;
}

.demo-card__code :deep(div[class*='language-']) {
    margin: 0 !important;
    border-radius: 8px;
}
</style>
