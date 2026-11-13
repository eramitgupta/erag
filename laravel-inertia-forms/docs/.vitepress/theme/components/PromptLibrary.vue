<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

type StepKind = 'run' | 'read' | 'write' | 'edit' | 'test';

interface Step {
    kind: StepKind;
    target: string;
    detail: string;
}

interface Session {
    key: string;
    label: string;
    prompt: string;
    reply: string;
    steps: Step[];
    done: string;
    summary: string[];
}

/**
 * Example agent sessions: the prompt someone gives an AI coding agent, the
 * work it does in a Laravel + Inertia app, and what it reports at the end.
 */
const sessions: Session[] = [
    {
        key: 'contact',
        label: 'Contact form',
        prompt: 'Add a contact form at /contact with name, email and message. Validate it on the server and save every message.',
        reply: "I'll build it with Laravel Inertia Forms: one form class, a controller, two routes and a page.",
        steps: [
            { kind: 'run', target: 'php artisan make:form ContactForm', detail: 'Created app/Forms/ContactForm.php' },
            { kind: 'write', target: 'app/Forms/ContactForm.php', detail: 'name, email, message and a Send button · +24' },
            { kind: 'run', target: 'php artisan make:model ContactMessage -m', detail: 'Model and migration created' },
            { kind: 'write', target: 'app/Http/Controllers/ContactController.php', detail: 'show() and store() with #[Validate] · +31' },
            { kind: 'edit', target: 'routes/web.php', detail: 'GET and POST /contact · +2' },
            { kind: 'write', target: 'resources/js/pages/contact.vue', detail: 'Renders the form with one <Form> · +12' },
            { kind: 'test', target: 'php artisan test --filter=Contact', detail: '3 passed' },
        ],
        done: 'Done. The contact form is live at /contact.',
        summary: [
            'ContactForm class with three fields; required, email and length rules come from the fields.',
            'ContactController validates with the same class and stores a ContactMessage.',
            'The page is a single <Form> component, no inputs or error handling written by hand.',
            'Three Pest tests cover showing, saving and validation errors.',
        ],
    },
    {
        key: 'profile',
        label: 'Edit profile',
        prompt: 'Let users edit their profile: name, email, bio and an avatar image up to 2 MB. Prefill it with their current data.',
        reply: 'One form class bound to the signed-in user, with an image upload. I will reuse the existing settings layout.',
        steps: [
            { kind: 'read', target: 'app/Http/Controllers/Settings/ProfileController.php', detail: 'Current edit and update actions' },
            { kind: 'run', target: 'php artisan make:form ProfileForm', detail: 'Created app/Forms/ProfileForm.php' },
            { kind: 'write', target: 'app/Forms/ProfileForm.php', detail: 'TextInput, Textarea and FileUpload image() maxSize(2048) · +29' },
            { kind: 'edit', target: 'app/Http/Controllers/Settings/ProfileController.php', detail: 'ProfileForm::make()->bind($user) and store the avatar · +14 −38' },
            { kind: 'edit', target: 'resources/js/pages/settings/profile.vue', detail: 'Replaced the hand-written inputs with <Form> · +6 −71' },
            { kind: 'test', target: 'php artisan test --filter=Profile', detail: '5 passed' },
        ],
        done: 'Done. The profile page now uses a form class.',
        summary: [
            'ProfileForm opens filled in with the user’s data through bind().',
            'Avatar upload with drag and drop, image preview and a 2 MB limit.',
            'The update route and PUT method are read from the route, files are sent the way Laravel expects.',
            'The page lost 71 lines of inputs, state and error handling.',
        ],
    },
    {
        key: 'wizard',
        label: 'Onboarding wizard',
        prompt: 'Build a three-step onboarding: account, company, and plan. Check each step before the user can continue.',
        reply: 'A wizard form fits: each fieldset becomes a step, and every step is validated on the server.',
        steps: [
            { kind: 'run', target: 'php artisan make:form OnboardingForm', detail: 'Created app/Forms/OnboardingForm.php' },
            { kind: 'write', target: 'app/Forms/OnboardingForm.php', detail: 'Three fieldsets and protected bool $wizard = true · +48' },
            { kind: 'write', target: 'app/Http/Controllers/OnboardingController.php', detail: 'Creates the user and the company in one transaction · +36' },
            { kind: 'edit', target: 'routes/web.php', detail: 'GET and POST /onboarding · +2' },
            { kind: 'write', target: 'resources/js/pages/onboarding.vue', detail: 'One <Form> renders the steps and progress · +10' },
            { kind: 'test', target: 'php artisan test --filter=Onboarding', detail: '4 passed' },
        ],
        done: 'Done. Onboarding is a three-step wizard at /onboarding.',
        summary: [
            'Account, Company and Plan steps with a progress bar and Back / Continue buttons.',
            'Continue checks the current step on the server before moving on.',
            'Plan is a radio card picker, team size a slider, country a searchable select.',
            'Tests cover each step’s errors and the final submit.',
        ],
    },
    {
        key: 'conditional',
        label: 'Conditional fields',
        prompt: 'In checkout, ask for company name and VAT number only when “Buying for a company” is checked.',
        reply: 'I will add the fields with visibleWhen() so they only show, and only validate, when the box is checked.',
        steps: [
            { kind: 'read', target: 'app/Forms/CheckoutForm.php', detail: 'Existing billing fieldset' },
            { kind: 'edit', target: 'app/Forms/CheckoutForm.php', detail: 'Checkbox is_company, two fields with visibleWhen() and clearWhenHidden() · +9' },
            { kind: 'edit', target: 'app/Http/Controllers/CheckoutController.php', detail: 'Saves the VAT number on the order · +3' },
            { kind: 'run', target: 'php artisan make:migration add_vat_number_to_orders_table', detail: 'Migration created' },
            { kind: 'test', target: 'php artisan test --filter=Checkout', detail: '6 passed' },
        ],
        done: 'Done. Company details appear only for company purchases.',
        summary: [
            'Company name and VAT number show when the checkbox is ticked and hide again when it is not.',
            'Hidden fields are skipped by validation and left out of the saved data.',
            'Values are cleared when the fields hide, so nothing stale is submitted.',
            'No frontend code changed: the rules live in the form class.',
        ],
    },
    {
        key: 'translate',
        label: 'Translate to Hindi',
        prompt: 'Make all our forms available in Hindi, including the buttons, placeholders and calendar of the form components.',
        reply: 'Three parts: your labels with __(), the package messages, and the text the components show in the browser.',
        steps: [
            { kind: 'edit', target: 'app/Forms/*.php', detail: 'Wrapped labels, help and options in __() in 7 forms · +64 −64' },
            { kind: 'write', target: 'lang/hi/forms.php', detail: 'Hindi copy for your labels · +88' },
            { kind: 'run', target: 'php artisan vendor:publish --tag=inertia-forms-lang', detail: 'Published the package messages' },
            { kind: 'write', target: 'lang/vendor/inertia-forms/hi/inertia-forms.php', detail: 'Hindi validation messages · +40' },
            { kind: 'write', target: 'resources/js/lang/inertia-forms/hi.ts', detail: 'All component keys in Hindi · +134' },
            { kind: 'edit', target: 'resources/js/app.ts', detail: 'setTranslations() for the active locale · +6' },
        ],
        done: 'Done. Every form follows the app locale, Hindi included.',
        summary: [
            'Labels, help texts and options come from lang/hi/forms.php.',
            'Package validation messages are translated in the published language file.',
            'Buttons, placeholders, empty states and calendar names are set with setTranslations().',
            'Switching the locale updates open forms without a reload.',
        ],
    },
];

const STEP_LABEL: Record<StepKind, string> = {
    run: 'Run',
    read: 'Read',
    write: 'Write',
    edit: 'Edit',
    test: 'Test',
};

const activeKey = ref(sessions[0].key);
const session = computed(() => sessions.find((item) => item.key === activeKey.value)!);

/** How far the replay has got: typed prompt, then reply, steps, summary. */
const typed = ref('');
const showReply = ref(false);
const stepsDone = ref(0);
const stepRunning = ref(false);
const showSummary = ref(false);
const playing = ref(false);
const copied = ref(false);

const root = ref<HTMLElement | null>(null);
const log = ref<HTMLElement | null>(null);
let timers: ReturnType<typeof setTimeout>[] = [];
let observer: IntersectionObserver | undefined;
let started = false;
let copyTimer: ReturnType<typeof setTimeout> | undefined;

function clearTimers(): void {
    timers.forEach(clearTimeout);
    timers = [];
}

function later(ms: number, fn: () => void): void {
    timers.push(setTimeout(fn, ms));
}

function scrollLog(): void {
    nextTick(() => {
        if (log.value) {
            log.value.scrollTop = log.value.scrollHeight;
        }
    });
}

function showAll(): void {
    clearTimers();
    typed.value = session.value.prompt;
    showReply.value = true;
    stepsDone.value = session.value.steps.length;
    stepRunning.value = false;
    showSummary.value = true;
    playing.value = false;
}

function play(): void {
    clearTimers();
    typed.value = '';
    showReply.value = false;
    stepsDone.value = 0;
    stepRunning.value = false;
    showSummary.value = false;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        showAll();

        return;
    }

    playing.value = true;
    const prompt = session.value.prompt;
    let at = 0;

    prompt.split('').forEach((_, index) => {
        at += 14;
        later(at, () => (typed.value = prompt.slice(0, index + 1)));
    });

    at += 450;
    later(at, () => {
        showReply.value = true;
        scrollLog();
    });

    session.value.steps.forEach((_, index) => {
        at += 350;
        later(at, () => {
            stepRunning.value = true;
            scrollLog();
        });
        at += 750;
        later(at, () => {
            stepsDone.value = index + 1;
            stepRunning.value = false;
            scrollLog();
        });
    });

    at += 500;
    later(at, () => {
        showSummary.value = true;
        playing.value = false;
        scrollLog();
    });
}

function select(key: string): void {
    activeKey.value = key;
    play();
}

async function copyPrompt(): Promise<void> {
    try {
        await navigator.clipboard.writeText(session.value.prompt);
    } catch {
        return;
    }

    copied.value = true;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => (copied.value = false), 1600);
}

onMounted(() => {
    // Without JavaScript-driven playback (or before it starts) the full session is visible.
    showAll();

    if (!('IntersectionObserver' in window) || !root.value) {
        return;
    }

    observer = new IntersectionObserver(
        (entries) => {
            if (!started && entries.some((entry) => entry.isIntersecting)) {
                started = true;
                play();
                observer?.disconnect();
            }
        },
        { threshold: 0.35 },
    );
    observer.observe(root.value);
});

onBeforeUnmount(() => {
    clearTimers();
    clearTimeout(copyTimer);
    observer?.disconnect();
});
</script>

<template>
    <div ref="root" class="agent-demo">
        <div class="agent-tabs" role="tablist" aria-label="Example prompts">
            <button
                v-for="item in sessions"
                :key="item.key"
                type="button"
                role="tab"
                :aria-selected="item.key === activeKey"
                @click="select(item.key)"
            >
                {{ item.label }}
            </button>
        </div>

        <div class="agent-window">
            <div class="agent-titlebar">
                <span class="agent-dots" aria-hidden="true"><i /><i /><i /></span>
                <span class="agent-title">~/laravel-app · AI coding agent</span>
                <button type="button" class="agent-replay" :disabled="playing" @click="play">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg>
                    Replay
                </button>
            </div>

            <div ref="log" class="agent-log" aria-live="polite">
                <div class="agent-prompt">
                    <span class="agent-caret" aria-hidden="true">›</span>
                    <p>
                        {{ typed }}<span v-if="playing && typed.length < session.prompt.length" class="agent-cursor" aria-hidden="true" />
                    </p>
                </div>

                <p v-if="showReply" class="agent-reply">
                    <span class="agent-bullet" aria-hidden="true">●</span>
                    {{ session.reply }}
                </p>

                <ol v-if="showReply" class="agent-steps">
                    <li
                        v-for="(step, index) in session.steps.slice(0, stepsDone + (stepRunning ? 1 : 0))"
                        :key="`${session.key}-${index}`"
                        :class="['agent-step', `is-${step.kind}`, { 'is-running': index === stepsDone }]"
                    >
                        <span class="agent-status" aria-hidden="true">
                            <span v-if="index === stepsDone" class="agent-spinner" />
                            <svg v-else viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
                        </span>
                        <span class="agent-kind">{{ STEP_LABEL[step.kind] }}</span>
                        <span class="agent-target">{{ step.target }}</span>
                        <span class="agent-detail">{{ index === stepsDone ? 'Working…' : step.detail }}</span>
                    </li>
                </ol>

                <div v-if="showSummary" class="agent-summary">
                    <p class="agent-done">
                        <span class="agent-bullet is-done" aria-hidden="true">●</span>
                        {{ session.done }} Here is what I added:
                    </p>
                    <ul>
                        <li v-for="line in session.summary" :key="line">{{ line }}</li>
                    </ul>
                </div>
            </div>

            <div class="agent-input">
                <span class="agent-input-text">{{ session.prompt }}</span>
                <button type="button" class="agent-copy" @click="copyPrompt">
                    <svg v-if="!copied" viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="9" y="9" width="12" height="12" rx="2" />
                        <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
                    </svg>
                    <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                    {{ copied ? 'Copied' : 'Copy prompt' }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.agent-demo {
    max-width: 920px;
    margin: 40px auto 0;
    text-align: left;
}

.agent-tabs {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-bottom: 20px;
}

.agent-tabs button {
    padding: 6px 14px;
    border: 1px solid #e4e4e7;
    border-radius: 999px;
    background: #ffffff;
    color: #3f3f46;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition:
        background-color 0.2s ease,
        border-color 0.2s ease,
        color 0.2s ease;
}

.agent-tabs button:hover {
    border-color: #a1a1aa;
}

.agent-tabs button[aria-selected='true'] {
    border-color: #2563eb;
    background: #2563eb;
    color: #ffffff;
}

.agent-window {
    overflow: hidden;
    border: 1px solid #27272a;
    border-radius: 16px;
    background: #0b0b0d;
    box-shadow: 0 24px 60px rgba(9, 9, 11, 0.18);
    color: #e4e4e7;
    font-family: var(--vp-font-family-mono);
    font-size: 0.82rem;
    line-height: 1.6;
}

.agent-titlebar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-bottom: 1px solid #1f1f23;
    background: #121215;
}

.agent-dots {
    display: inline-flex;
    gap: 6px;
}

.agent-dots i {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: #3f3f46;
}

.agent-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: #a1a1aa;
    font-size: 0.78rem;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.agent-replay,
.agent-copy {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border: 1px solid #27272a;
    border-radius: 8px;
    background: #18181b;
    color: #d4d4d8;
    font-family: var(--vp-font-family-base);
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
}

.agent-replay:hover:not(:disabled),
.agent-copy:hover {
    border-color: #52525b;
    color: #ffffff;
}

.agent-replay:disabled {
    opacity: 0.45;
    cursor: default;
}

.agent-replay svg,
.agent-copy svg {
    width: 13px;
    height: 13px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.agent-log {
    height: 440px;
    overflow-y: auto;
    padding: 18px 18px 8px;
    scroll-behavior: smooth;
}

.agent-prompt {
    display: flex;
    gap: 10px;
    padding: 10px 12px;
    border: 1px solid #27272a;
    border-radius: 10px;
    background: #141418;
}

.agent-prompt p {
    margin: 0 !important;
    color: #fafafa;
    font-size: 0.82rem;
    line-height: 1.6;
}

.agent-caret {
    color: #60a5fa;
    font-weight: 700;
}

.agent-cursor {
    display: inline-block;
    width: 7px;
    height: 1em;
    margin-left: 1px;
    background: #60a5fa;
    vertical-align: text-bottom;
    animation: agent-blink 1s steps(1) infinite;
}

.agent-reply,
.agent-done {
    display: flex;
    gap: 10px;
    margin: 16px 0 0 !important;
    color: #e4e4e7;
    font-size: 0.82rem;
    line-height: 1.6;
}

.agent-bullet {
    flex-shrink: 0;
    color: #a1a1aa;
    font-size: 0.7rem;
    line-height: 1.9;
}

.agent-bullet.is-done {
    color: #4ade80;
}

.agent-steps {
    margin: 10px 0 0 !important;
    padding: 0 0 0 4px !important;
    list-style: none;
}

.agent-step {
    display: grid;
    grid-template-columns: 18px 46px minmax(0, auto) minmax(0, 1fr);
    align-items: baseline;
    gap: 8px;
    margin: 0 !important;
    padding: 3px 0;
    animation: agent-in 0.25s ease;
}

.agent-status {
    display: inline-flex;
    align-self: center;
    justify-content: center;
}

.agent-status svg {
    width: 13px;
    height: 13px;
    fill: none;
    stroke: #4ade80;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.agent-spinner {
    width: 11px;
    height: 11px;
    border: 2px solid #3f3f46;
    border-top-color: #60a5fa;
    border-radius: 999px;
    animation: agent-spin 0.7s linear infinite;
}

.agent-kind {
    color: #a1a1aa;
    font-weight: 700;
}

.is-write .agent-kind {
    color: #4ade80;
}

.is-edit .agent-kind {
    color: #facc15;
}

.is-run .agent-kind,
.is-test .agent-kind {
    color: #60a5fa;
}

.agent-target {
    overflow: hidden;
    color: #fafafa;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.agent-detail {
    overflow: hidden;
    color: #71717a;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.is-running .agent-detail {
    color: #60a5fa;
}

.agent-summary {
    margin: 6px 0 12px;
    animation: agent-in 0.3s ease;
}

.agent-summary ul {
    margin: 8px 0 0 !important;
    padding: 0 0 0 22px !important;
    list-style: none;
}

.agent-summary li {
    position: relative;
    margin: 0 0 4px !important;
    color: #d4d4d8;
    font-family: var(--vp-font-family-base);
    font-size: 0.86rem;
    line-height: 1.55;
}

.agent-summary li::before {
    position: absolute;
    left: -14px;
    color: #4ade80;
    content: '✓';
}

.agent-input {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-top: 1px solid #1f1f23;
    background: #121215;
}

.agent-input-text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: #71717a;
    text-overflow: ellipsis;
    white-space: nowrap;
}

@keyframes agent-spin {
    to {
        transform: rotate(360deg);
    }
}

@keyframes agent-blink {
    50% {
        opacity: 0;
    }
}

@keyframes agent-in {
    from {
        opacity: 0;
        transform: translateY(4px);
    }
}

:root.dark .agent-tabs button {
    border-color: #27272a;
    background: #18181b;
    color: #d4d4d8;
}

:root.dark .agent-tabs button[aria-selected='true'] {
    border-color: #2563eb;
    background: #2563eb;
    color: #ffffff;
}

:root.dark .agent-window {
    box-shadow: 0 0 0 1px #18181b;
}

@media (max-width: 640px) {
    .agent-log {
        height: 480px;
        padding: 14px 12px 6px;
    }

    .agent-step {
        grid-template-columns: 18px 42px minmax(0, 1fr);
    }

    .agent-detail {
        grid-column: 3;
        white-space: normal;
    }

    .agent-input-text {
        display: none;
    }

    .agent-input {
        justify-content: flex-end;
    }
}

@media (prefers-reduced-motion: reduce) {
    .agent-step,
    .agent-summary {
        animation: none;
    }

    .agent-log {
        scroll-behavior: auto;
    }
}
</style>
