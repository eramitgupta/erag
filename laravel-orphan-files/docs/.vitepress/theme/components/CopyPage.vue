<script setup lang="ts">
/**
 * "Copy page" split button shown above every docs page. It copies the page as
 * Markdown and opens it in ChatGPT or Claude. The Markdown is the
 * page's source file on GitHub, so it always matches what is published.
 *
 * Shared by every docs site: edit shared/CopyPage.vue and run
 * `npm run sync:copy-page` to update the copies in each site's theme.
 */
import { useData } from 'vitepress';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const REPOSITORY = 'eramitgupta/erag';
const BRANCH = 'main';

const { page, site } = useData();

const open = ref(false);
const copied = ref(false);
const root = ref<HTMLElement | null>(null);
let resetTimer: ReturnType<typeof setTimeout> | undefined;

/** The site's folder in the repository, e.g. `laravel-inertia-forms`. */
const folder = computed(() => site.value.base.replace(/^\/|\/$/g, ''));

const markdownUrl = computed(
    () => `https://raw.githubusercontent.com/${REPOSITORY}/${BRANCH}/${folder.value}/docs/${page.value.relativePath}`,
);

const prompt = computed(
    () => `Read ${markdownUrl.value} so I can ask questions about it.`,
);

const assistants = computed(() => [
    { key: 'chatgpt', label: 'Open in ChatGPT', url: `https://chatgpt.com/?q=${encodeURIComponent(prompt.value)}` },
    { key: 'claude', label: 'Open in Claude', url: `https://claude.ai/new?q=${encodeURIComponent(prompt.value)}` },
]);

/** The page source without its front matter and the hidden note for LLMs. */
function cleanMarkdown(source: string): string {
    return source
        .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
        .replace(/<div style="display:none"[^>]*data-nosnippet>[\s\S]*?<\/div>\s*/, '')
        .replace(/^<div class="doc-category">.*<\/div>\s*/m, '')
        .trim();
}

async function copyPage(): Promise<void> {
    open.value = false;

    let text = markdownUrl.value;

    try {
        const response = await fetch(markdownUrl.value);

        if (response.ok) {
            text = `${cleanMarkdown(await response.text())}\n\nSource: ${window.location.href.split('#')[0]}\n`;
        }
    } catch {
        // Offline or blocked: copy the Markdown link instead.
    }

    try {
        await navigator.clipboard.writeText(text);
    } catch {
        return;
    }

    copied.value = true;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => (copied.value = false), 1800);
}

function onDocumentClick(event: MouseEvent): void {
    if (open.value && root.value && !root.value.contains(event.target as Node)) {
        open.value = false;
    }
}

function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
        open.value = false;
    }
}

onMounted(() => {
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keydown', onKeydown);
    clearTimeout(resetTimer);
});
</script>

<template>
    <div class="copy-page-bar">
        <div ref="root" class="copy-page">
            <button type="button" class="copy-page-main" @click="copyPage">
                <svg v-if="!copied" viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="8" y="8" width="13" height="13" rx="2" />
                    <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
                </svg>
                <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                {{ copied ? 'Copied' : 'Copy page' }}
            </button>
            <button
                type="button"
                class="copy-page-toggle"
                aria-label="More ways to use this page"
                aria-haspopup="menu"
                :aria-expanded="open"
                @click="open = !open"
            >
                <svg viewBox="0 0 24 24" aria-hidden="true" :class="{ 'is-open': open }"><path d="m6 9 6 6 6-6" /></svg>
            </button>

            <div v-if="open" class="copy-page-menu" role="menu">
                <button type="button" role="menuitem" class="copy-page-item" @click="copyPage">
                    <span class="copy-page-icon">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <rect x="8" y="8" width="13" height="13" rx="2" />
                            <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
                        </svg>
                    </span>
                    <span class="copy-page-text">
                        <strong>Copy page</strong>
                        <small>Copy page as Markdown for LLMs</small>
                    </span>
                </button>

                <a role="menuitem" class="copy-page-item" :href="markdownUrl" target="_blank" rel="noopener" @click="open = false">
                    <span class="copy-page-icon">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <rect x="2" y="5" width="20" height="14" rx="2" />
                            <path d="M6 15V9l2.5 3L11 9v6M17 9v6M14.5 12.5 17 15l2.5-2.5" />
                        </svg>
                    </span>
                    <span class="copy-page-text">
                        <strong>View as Markdown <span class="copy-page-arrow">↗</span></strong>
                        <small>View this page as plain text</small>
                    </span>
                </a>

                <a
                    v-for="assistant in assistants"
                    :key="assistant.key"
                    role="menuitem"
                    class="copy-page-item"
                    :href="assistant.url"
                    target="_blank"
                    rel="noopener"
                    @click="open = false"
                >
                    <span class="copy-page-icon">
                        <svg v-if="assistant.key === 'chatgpt'" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 3.5 19.4 7.75v8.5L12 20.5l-7.4-4.25v-8.5z" />
                            <path d="M12 3.5v8.5m0 0 7.4 4.25M12 12l-7.4 4.25" />
                        </svg>
                        <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
                        </svg>
                    </span>
                    <span class="copy-page-text">
                        <strong>{{ assistant.label }} <span class="copy-page-arrow">↗</span></strong>
                        <small>Ask questions about this page</small>
                    </span>
                </a>
            </div>
        </div>
    </div>
</template>

<style scoped>
.copy-page-bar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
}

.copy-page {
    position: relative;
    display: inline-flex;
    border: 1px solid var(--vp-c-divider);
    border-radius: 10px;
    background: var(--vp-c-bg);
}

.copy-page svg {
    width: 15px;
    height: 15px;
    flex-shrink: 0;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.copy-page-main,
.copy-page-toggle {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: var(--vp-c-text-1);
    font-size: 13px;
    font-weight: 500;
    line-height: 1;
    transition: background-color 0.15s ease;
}

.copy-page-main {
    padding: 8px 12px;
    border-radius: 9px 0 0 9px;
}

.copy-page-toggle {
    padding: 8px 9px;
    border-left: 1px solid var(--vp-c-divider);
    border-radius: 0 9px 9px 0;
}

.copy-page-main:hover,
.copy-page-toggle:hover,
.copy-page-toggle[aria-expanded='true'] {
    background: var(--vp-c-bg-soft);
}

.copy-page-toggle svg {
    transition: transform 0.15s ease;
}

.copy-page-toggle svg.is-open {
    transform: rotate(180deg);
}

.copy-page-menu {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    z-index: 30;
    display: grid;
    gap: 2px;
    width: 300px;
    max-width: calc(100vw - 32px);
    padding: 6px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 14px;
    background: var(--vp-c-bg);
    box-shadow: var(--vp-shadow-3);
}

.copy-page-item {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 8px;
    border-radius: 10px;
    color: var(--vp-c-text-1);
    text-align: left;
    text-decoration: none !important;
    transition: background-color 0.15s ease;
}

.copy-page-item:hover,
.copy-page-item:focus-visible {
    background: var(--vp-c-bg-soft);
}

.copy-page-icon {
    display: grid;
    flex-shrink: 0;
    width: 34px;
    height: 34px;
    place-items: center;
    border: 1px solid var(--vp-c-divider);
    border-radius: 9px;
    color: var(--vp-c-text-2);
}

.copy-page-icon svg {
    width: 17px;
    height: 17px;
}

.copy-page-text {
    display: grid;
    gap: 2px;
    min-width: 0;
}

.copy-page-text strong {
    color: var(--vp-c-text-1);
    font-size: 14px;
    font-weight: 600;
    line-height: 1.3;
}

.copy-page-text small {
    color: var(--vp-c-text-2);
    font-size: 12.5px;
    line-height: 1.3;
}

.copy-page-arrow {
    color: var(--vp-c-text-3);
    font-weight: 400;
}

/* On wider screens the button sits on the title line, at the right. */
@media (min-width: 768px) {
    .copy-page-bar {
        position: relative;
        z-index: 10;
        height: 0;
        margin-bottom: 0;
    }

    .copy-page {
        position: absolute;
        top: 0;
        right: 0;
    }
}
</style>

<style>
/* Keep the page title clear of the button. */
@media (min-width: 768px) {
    .content-container:has(> .copy-page-bar) .vp-doc > div > h1:first-of-type {
        padding-right: 170px;
    }
}
</style>
