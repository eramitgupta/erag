<script setup lang="ts">
import { icons } from '@erag/inertia-forms-core';
import iconSet from '@erag/inertia-forms-icons';
import { computed, ref } from 'vue';

/**
 * Every icon name `icon()` accepts, grouped and searchable. Clicking a tile
 * copies the name, ready for `->icon('rocket')`.
 */
const set = iconSet as Record<string, Record<string, string>>;
const builtIn = icons as Record<string, string>;

/** The icons the frontend packages draw themselves, placed in the matching group. */
const BUILT_IN_GROUPS: Record<string, string[]> = {
    People: ['user'],
    Communication: ['mail', 'send'],
    Files: ['fileText', 'save', 'upload', 'copy'],
    'Text and code': ['eyedropper', 'linkChain'],
    Actions: ['x', 'plus', 'check', 'trash', 'grip', 'sliders'],
    Arrows: ['arrowLeft', 'arrowRight', 'chevronLeft', 'chevronRight', 'chevronUp', 'chevronDown', 'chevronsLeft', 'chevronsRight'],
    'Status and controls': ['circleInfo', 'circleCheck', 'triangleAlert', 'circleX'],
    Commerce: ['creditCard', 'briefcase'],
    Time: ['calendar', 'clock'],
    Places: ['home', 'mapPin', 'flag'],
    Security: ['shield', 'lock'],
};

const allGroups = Object.entries(set).map(([title, entries]) => ({
    title,
    icons: [
        ...(BUILT_IN_GROUPS[title] ?? []).filter((name) => name in builtIn).map((name) => ({ name, d: builtIn[name]! })),
        ...Object.entries(entries).map(([name, d]) => ({ name, d })),
    ].sort((a, b) => a.name.localeCompare(b.name)),
}));

const query = ref('');
const copied = ref<string | null>(null);
let copiedTimer: ReturnType<typeof setTimeout> | undefined;

const groups = computed(() => {
    const search = query.value.trim().toLowerCase().replace(/[-_\s]/g, '');

    return allGroups
        .map((group) => ({ title: group.title, icons: group.icons.filter((icon) => icon.name.toLowerCase().includes(search)) }))
        .filter((group) => group.icons.length > 0);
});

const count = computed(() => groups.value.reduce((total, group) => total + group.icons.length, 0));

async function copy(name: string): Promise<void> {
    try {
        await navigator.clipboard.writeText(name);
    } catch {
        return;
    }

    copied.value = name;
    clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => (copied.value = null), 1400);
}
</script>

<template>
    <div class="icon-gallery">
        <div class="icon-gallery-toolbar">
            <input
                v-model="query"
                type="search"
                class="icon-gallery-search"
                placeholder="Search icons…"
                aria-label="Search icons"
            />
            <span class="icon-gallery-count">{{ count }} {{ count === 1 ? 'icon' : 'icons' }}</span>
        </div>

        <section v-for="group in groups" :key="group.title" class="icon-gallery-group">
            <h4 class="icon-gallery-title">{{ group.title }}</h4>
            <div class="icon-gallery-grid">
                <button
                    v-for="icon in group.icons"
                    :key="icon.name"
                    type="button"
                    class="icon-gallery-tile"
                    :title="`Copy “${icon.name}”`"
                    @click="copy(icon.name)"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <path :d="icon.d" />
                    </svg>
                    <span class="icon-gallery-name">{{ copied === icon.name ? 'Copied!' : icon.name }}</span>
                </button>
            </div>
        </section>

        <p v-if="count === 0" class="icon-gallery-empty">No icon matches “{{ query }}”.</p>
    </div>
</template>

<style scoped>
.icon-gallery {
    margin: 24px 0;
    padding: 20px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 14px;
    background: var(--vp-c-bg);
}

.icon-gallery-toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
}

.icon-gallery-search {
    flex: 1;
    min-width: 0;
    padding: 8px 12px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    background: var(--vp-c-bg-soft);
    font-size: 14px;
}

.icon-gallery-search:focus {
    outline: 2px solid var(--vp-c-brand-1);
    outline-offset: 1px;
}

.icon-gallery-count {
    font-size: 13px;
    color: var(--vp-c-text-2);
    white-space: nowrap;
}

.icon-gallery-group + .icon-gallery-group {
    margin-top: 4px;
}

.icon-gallery .icon-gallery-title {
    margin: 16px 0 10px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--vp-c-text-2);
}

.icon-gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));
    gap: 8px;
}

.icon-gallery-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 14px 6px 10px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 10px;
    background: var(--vp-c-bg);
    color: var(--vp-c-text-1);
    cursor: pointer;
    transition:
        border-color 0.15s ease,
        background-color 0.15s ease;
}

.icon-gallery-tile:hover,
.icon-gallery-tile:focus-visible {
    border-color: var(--vp-c-brand-1);
    background: var(--vp-c-bg-soft);
    outline: none;
}

.icon-gallery-tile svg {
    width: 22px;
    height: 22px;
}

.icon-gallery-name {
    max-width: 100%;
    overflow: hidden;
    font-family: var(--vp-font-family-mono);
    font-size: 12px;
    color: var(--vp-c-text-2);
    text-overflow: ellipsis;
    white-space: nowrap;
}

.icon-gallery-empty {
    margin: 12px 0 0;
    font-size: 14px;
    color: var(--vp-c-text-2);
}
</style>
