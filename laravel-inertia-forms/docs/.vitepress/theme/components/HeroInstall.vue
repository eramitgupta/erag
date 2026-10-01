<script setup lang="ts">
import { computed, ref } from 'vue';

/** The package for each part of the stack, shown in the hero. */
const packages = [
    { key: 'laravel', label: 'Laravel', name: 'composer require erag/inertia-forms', manager: 'composer' },
    { key: 'vue', label: 'Vue', name: '@erag/inertia-forms-vue', manager: 'npm' },
    { key: 'react', label: 'React', name: '@erag/inertia-forms-react', manager: 'npm' },
    { key: 'svelte', label: 'Svelte', name: '@erag/inertia-forms-svelte', manager: 'npm' },
] as const;

const stack = [
    { name: 'Laravel', version: '13', logo: 'laravel' },
    { name: 'Inertia', version: '3', logo: 'inertia' },
    { name: 'Vue', version: '3.5', logo: 'vue' },
    { name: 'React', version: '19', logo: 'react' },
    { name: 'Svelte', version: '5', logo: 'svelte' },
    { name: 'Tailwind CSS', version: '4', logo: 'tailwind' },
];

const selectedKey = ref<(typeof packages)[number]['key']>('laravel');
const selected = computed(() => packages.find((item) => item.key === selectedKey.value)!);
const copied = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

async function copy(): Promise<void> {
    try {
        await navigator.clipboard.writeText(selected.value.name);
    } catch {
        return;
    }

    copied.value = true;
    clearTimeout(timer);
    timer = setTimeout(() => (copied.value = false), 1600);
}
</script>

<template>
    <div class="hero-install">
        <div class="hero-install-card">
            <div class="hero-install-tabs" role="tablist" aria-label="Package">
                <button
                    v-for="item in packages"
                    :key="item.key"
                    type="button"
                    role="tab"
                    :aria-selected="item.key === selectedKey"
                    @click="selectedKey = item.key"
                >
                    <i :class="['hero-install-logo', `is-${item.key}`]" aria-hidden="true" />
                    {{ item.label }}
                </button>
            </div>

            <div class="hero-install-package">
                <code>{{ selected.name }}</code>
                <span class="hero-install-manager">{{ selected.manager }}</span>
                <button
                    type="button"
                    class="hero-install-copy"
                    :aria-label="copied ? 'Copied' : `Copy ${selected.name}`"
                    @click="copy"
                >
                    <svg v-if="!copied" viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="9" y="9" width="12" height="12" rx="2" />
                        <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
                    </svg>
                    <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                </button>
            </div>
        </div>

        <p class="hero-install-stack" aria-label="Works with">
            <span class="hero-install-label">Works with</span>
            <span v-for="item in stack" :key="item.name" class="hero-install-chip">
                <i :class="['hero-install-logo', `is-${item.logo}`]" aria-hidden="true" />
                {{ item.name }} <b>{{ item.version }}</b>
            </span>
        </p>
    </div>
</template>

<style scoped>
.hero-install {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 22px;
    width: 100%;
    margin-top: 32px;
}

.hero-install-card {
    width: min(100%, 460px);
    padding: 6px;
    border: 1px solid #e4e4e7;
    border-radius: 16px;
    background: #ffffff;
    box-shadow: 0 12px 30px rgba(9, 9, 11, 0.08);
}

.hero-install-tabs {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 4px;
    padding: 3px;
    border-radius: 11px;
    background: #f4f4f5;
}

.hero-install-tabs button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-width: 0;
    padding: 6px 4px;
    border-radius: 8px;
    color: #71717a;
    font-size: 0.8rem;
    font-weight: 600;
    transition:
        background-color 0.15s ease,
        color 0.15s ease;
}

.hero-install-tabs button:hover {
    color: #18181b;
}

.hero-install-tabs button[aria-selected='true'] {
    background: #ffffff;
    color: #09090b;
    box-shadow: 0 1px 3px rgba(9, 9, 11, 0.12);
}

.hero-install-package {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 8px 8px 14px;
}

.hero-install-package code {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    padding: 0 !important;
    background: none !important;
    color: #09090b !important;
    font-family: var(--vp-font-family-mono);
    font-size: 0.95rem !important;
    font-weight: 600;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.hero-install-manager {
    color: #a1a1aa;
    font-family: var(--vp-font-family-mono);
    font-size: 0.75rem;
}

.hero-install-copy {
    display: grid;
    flex-shrink: 0;
    width: 34px;
    height: 34px;
    place-items: center;
    border: 1px solid #e4e4e7;
    border-radius: 9px;
    color: #52525b;
    transition:
        background-color 0.15s ease,
        color 0.15s ease;
}

.hero-install-copy:hover {
    background: #f4f4f5;
    color: #09090b;
}

.hero-install-copy svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.hero-install-stack {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin: 0 !important;
}

.hero-install-label {
    margin-right: 4px;
    color: #71717a;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.hero-install-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 11px;
    border: 1px solid #e4e4e7;
    border-radius: 999px;
    background: #ffffff;
    color: #3f3f46;
    font-size: 0.82rem;
    font-weight: 500;
}

.hero-install-chip b {
    color: #09090b;
    font-weight: 700;
}

.hero-install-logo {
    display: inline-block;
    flex-shrink: 0;
    width: 14px;
    height: 14px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
}

:global(.dark .hero-install-card) {
    border-color: #27272a;
    background: #111113;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
}

:global(.dark .hero-install-tabs) {
    background: #18181b;
}

:global(.dark .hero-install-tabs button) {
    color: #a1a1aa;
}

:global(.dark .hero-install-tabs button:hover) {
    color: #fafafa;
}

:global(.dark .hero-install-tabs button[aria-selected='true']) {
    background: #27272a;
    color: #fafafa;
    box-shadow: none;
}

:global(.dark .hero-install-package code) {
    color: #fafafa !important;
}

:global(.dark .hero-install-manager) {
    color: #71717a;
}

:global(.dark .hero-install-copy) {
    border-color: #27272a;
    color: #a1a1aa;
}

:global(.dark .hero-install-copy:hover) {
    background: #27272a;
    color: #ffffff;
}

:global(.dark .hero-install-chip) {
    border-color: #27272a;
    background: #18181b;
    color: #a1a1aa;
}

:global(.dark .hero-install-chip b) {
    color: #fafafa;
}

@media (max-width: 420px) {
    .hero-install-manager {
        display: none;
    }
}
</style>
