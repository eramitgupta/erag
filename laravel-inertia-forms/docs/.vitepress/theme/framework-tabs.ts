/**
 * Keeps the Vue / React / Svelte tabs in sync: picking React in one code
 * group switches every code group on the page, and the choice is remembered
 * for the next pages and visits.
 */

export type Framework = 'vue' | 'react' | 'svelte';

const STORAGE_KEY = 'erag-inertia-forms-framework';
const CHANGE_EVENT = 'erag-framework-change';
const FRAMEWORKS: readonly Framework[] = ['vue', 'react', 'svelte'];

let applying = false;

function toFramework(value: string | null | undefined): Framework | null {
    const name = value?.trim().toLowerCase();

    return FRAMEWORKS.find((framework) => framework === name) ?? null;
}

export function preferredFramework(): Framework | null {
    try {
        return toFramework(localStorage.getItem(STORAGE_KEY));
    } catch {
        return null;
    }
}

/** Remember the framework and switch every tab group that has it. */
export function setPreferredFramework(framework: Framework): void {
    try {
        localStorage.setItem(STORAGE_KEY, framework);
    } catch {}

    selectInCodeGroups(document, framework);
    window.dispatchEvent(new CustomEvent<Framework>(CHANGE_EVENT, { detail: framework }));
}

/** Call `callback` whenever the framework is changed anywhere on the page. */
export function onFrameworkChange(callback: (framework: Framework) => void): () => void {
    const listener = (event: Event) => callback((event as CustomEvent<Framework>).detail);
    window.addEventListener(CHANGE_EVENT, listener);

    return () => window.removeEventListener(CHANGE_EVENT, listener);
}

function tabFramework(input: HTMLInputElement): Framework | null {
    const label = input.nextElementSibling as HTMLElement | null;

    return toFramework(label?.dataset.title ?? label?.textContent);
}

/**
 * Click the matching tab in each code group. VitePress swaps the visible
 * block on the input's click event, so a real click keeps it in charge.
 */
function selectInCodeGroups(root: ParentNode, framework: Framework): void {
    applying = true;

    try {
        root.querySelectorAll<HTMLElement>('.vp-code-group').forEach((group) => {
            const inputs = Array.from(group.querySelectorAll<HTMLInputElement>(':scope > .tabs > input'));
            const match = inputs.find((input) => tabFramework(input) === framework);

            if (match && !match.checked) {
                match.click();
            }
        });
    } finally {
        applying = false;
    }
}

export function installFrameworkTabs(): void {
    // A tab clicked by the reader: remember it and switch the other groups,
    // keeping the clicked tab at the same place on screen.
    window.addEventListener('click', (event) => {
        const input = event.target;

        if (applying || !(input instanceof HTMLInputElement) || !input.closest('.vp-code-group')) {
            return;
        }

        const framework = tabFramework(input);

        if (!framework) {
            return;
        }

        const top = input.getBoundingClientRect().top;

        requestAnimationFrame(() => {
            setPreferredFramework(framework);
            window.scrollBy(0, input.getBoundingClientRect().top - top);
        });
    });

    // Code groups appear on first load, on every page change, and inside
    // examples that load later, so apply the choice as they are added.
    const observer = new MutationObserver((mutations) => {
        const framework = preferredFramework();

        if (!framework) {
            return;
        }

        for (const mutation of mutations) {
            mutation.addedNodes.forEach((node) => {
                if (node instanceof HTMLElement && (node.matches('.vp-code-group') || node.querySelector('.vp-code-group'))) {
                    selectInCodeGroups(node.parentNode ?? node, framework);
                }
            });
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const framework = preferredFramework();

    if (framework) {
        selectInCodeGroups(document, framework);
    }
}
