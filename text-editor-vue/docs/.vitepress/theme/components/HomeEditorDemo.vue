<script setup lang="ts">
import { computed, onBeforeUnmount, shallowRef, useTemplateRef } from 'vue';
import {
    Editor,
    type EditorInit,
    type EditorInstance,
    type EditorTemplateItem,
    type MentionItem,
    type MergeTagItem,
} from '@erag/text-editor-vue';
import '@erag/text-editor-vue/style.css';
import HomeEditorCode from './HomeEditorCode.vue';
import { homeEditorExampleCode } from './homeEditorExampleCode';

const githubProfilePhoto =
    'https://avatars.githubusercontent.com/u/72160684?v=4&size=512';

const content = shallowRef(
    '<h1>Welcome to @erag/text-editor-vue</h1>' +
        '<p><img src="' +
        githubProfilePhoto +
        '" class="erag-demo-profile-photo" alt="Er Amit Gupta" width="72" height="72"></p>' +
        '<p><strong>Er Amit Gupta</strong><br>Creator and maintainer of @erag/text-editor-vue, focused on building a flexible and dependency-free editing experience for Vue 3.</p>' +
        '<p>Build rich content directly in the browser with a dependency-free Vue 3 editor.</p>' +
        '<p>Select this text and explore formatting, lists, links, colors, tables, media, source editing, preview, and fullscreen mode.</p>' +
        '<p>Type <strong>@</strong> for a mention or <strong>{{</strong> for a merge tag.</p>',
);

const mentionItems: MentionItem[] = Array.from({ length: 50 }, (_, index) => {
    const itemNumber = index + 1;

    if (index === 0) {
        return {
            id: itemNumber,
            label: 'Amit Gupta',
            description: 'Project author',
            avatar: githubProfilePhoto,
            value: 'amit@example.com',
        };
    }

    return {
        id: itemNumber,
        label: `Demo User ${String(itemNumber).padStart(2, '0')}`,
        description: `Team member ${String(itemNumber).padStart(2, '0')}`,
        avatar: `https://i.pravatar.cc/96?img=${(index % 70) + 1}`,
        value: `user${itemNumber}@example.com`,
    };
});

const mergeTagGroups = [
    'Client',
    'Company',
    'Invoice',
    'Appointment',
    'Account',
];
const mergeTagFields = [
    'name',
    'email',
    'phone',
    'address',
    'city',
    'state',
    'country',
    'reference',
    'created_at',
    'updated_at',
];

const mergeTagItems: MergeTagItem[] = mergeTagGroups.flatMap((group) =>
    mergeTagFields.map((field) => ({
        value: `{{${group.toLowerCase()}.${field}}}`,
        group,
    })),
);

const templateGroups = [
    {
        group: 'Sales',
        templates: [
            [
                'Lead introduction',
                'Thank you for your interest. Here is a quick introduction to how we can help your team.',
            ],
            [
                'Product demo invitation',
                'Choose a convenient time for a personalized product demonstration.',
            ],
            [
                'Proposal follow-up',
                'I wanted to follow up on the proposal and answer any remaining questions.',
            ],
            [
                'Quote delivery',
                'Your requested quote is ready for review and approval.',
            ],
            [
                'Trial ending reminder',
                'Your trial ends soon. Let us help you choose the right next step.',
            ],
            [
                'Deal confirmation',
                'Your order is confirmed and our team is preparing the next steps.',
            ],
        ],
    },
    {
        group: 'Marketing',
        templates: [
            [
                'Newsletter welcome',
                'Welcome to our newsletter. You will receive useful product news and practical guides.',
            ],
            [
                'Product launch',
                'Our latest product is now available with new tools designed for your workflow.',
            ],
            [
                'Webinar invitation',
                'Join our upcoming live webinar for product insights and a question-and-answer session.',
            ],
            [
                'Event reminder',
                'This is a friendly reminder that our event is coming up soon.',
            ],
            [
                'Feature announcement',
                'A new feature is available and ready to use in your account.',
            ],
            [
                'Re-engagement message',
                'We have missed you and would love to help you get value from your account again.',
            ],
        ],
    },
    {
        group: 'Support',
        templates: [
            [
                'Ticket received',
                'We received your support request and a team member will review it shortly.',
            ],
            [
                'Issue update',
                'Here is the latest progress update for your open support request.',
            ],
            [
                'Resolution confirmation',
                'The reported issue has been resolved. Please confirm everything is working correctly.',
            ],
            [
                'Feedback request',
                'Please share your experience so we can continue improving our support.',
            ],
            [
                'Maintenance notice',
                'Scheduled maintenance may temporarily affect service availability.',
            ],
            [
                'Service restored',
                'Service has been fully restored and systems are operating normally.',
            ],
        ],
    },
    {
        group: 'Customer Success',
        templates: [
            [
                'Onboarding welcome',
                'Welcome aboard. Your onboarding plan and first steps are included below.',
            ],
            [
                'Kickoff scheduling',
                'Let us schedule a kickoff meeting with your team.',
            ],
            [
                'Customer check-in',
                'I am checking in to see how things are progressing and where we can help.',
            ],
            [
                'Renewal reminder',
                'Your subscription renewal is approaching. Let us review your current plan.',
            ],
            [
                'Training invitation',
                'Your team is invited to a guided training session.',
            ],
            [
                'Success review',
                'Let us review your results, goals, and priorities for the next period.',
            ],
        ],
    },
    {
        group: 'Billing',
        templates: [
            [
                'Invoice issued',
                'A new invoice has been generated and is ready for payment.',
            ],
            [
                'Payment receipt',
                'Thank you. Your payment has been received successfully.',
            ],
            [
                'Payment reminder',
                'This is a friendly reminder that payment is due soon.',
            ],
            [
                'Overdue payment notice',
                'The invoice is now overdue. Please arrange payment or contact our billing team.',
            ],
            [
                'Refund confirmation',
                'Your refund has been processed and will appear in your account shortly.',
            ],
            [
                'Subscription renewal',
                'Your subscription has renewed successfully for the next billing period.',
            ],
        ],
    },
    {
        group: 'Human Resources',
        templates: [
            [
                'Interview invitation',
                'We would like to invite you to an interview with our hiring team.',
            ],
            [
                'Interview follow-up',
                'Thank you for meeting with us. We will share the next update soon.',
            ],
            [
                'Offer letter',
                'We are pleased to offer you a position with our team.',
            ],
            [
                'New employee welcome',
                'Welcome to the team. Here are the details for your first day.',
            ],
            [
                'Policy update',
                'An important company policy has been updated for all employees.',
            ],
            [
                'Leave approval',
                'Your leave request has been reviewed and approved.',
            ],
        ],
    },
    {
        group: 'Appointments',
        templates: [
            [
                'Booking confirmation',
                'Your appointment has been booked successfully.',
            ],
            [
                'Appointment reminder',
                'This is a reminder about your upcoming appointment.',
            ],
            [
                'Reschedule request',
                'Please select a new time that works for your schedule.',
            ],
            [
                'Cancellation confirmation',
                'Your appointment has been cancelled as requested.',
            ],
            [
                'Appointment follow-up',
                'Thank you for meeting with us. Here are the agreed next steps.',
            ],
            [
                'No-show follow-up',
                'We missed you at the scheduled appointment and can help you book another time.',
            ],
        ],
    },
    {
        group: 'Operations',
        templates: [
            [
                'Order confirmation',
                'Your order has been received and is being prepared.',
            ],
            [
                'Shipping update',
                'Your order is on the way. Tracking information is included below.',
            ],
            [
                'Delivery confirmation',
                'Your order has been delivered successfully.',
            ],
            [
                'Service scheduled',
                'Your requested service has been scheduled with our operations team.',
            ],
            [
                'Status update',
                'Here is the latest operational status for your request.',
            ],
            [
                'Completion report',
                'The requested work is complete. A summary is included below.',
            ],
        ],
    },
    {
        group: 'General',
        templates: [
            [
                'Thank-you message',
                'Thank you for your time, support, and continued partnership.',
            ],
            [
                'General announcement',
                'We have an important update to share with you.',
            ],
        ],
    },
] as const;

const templateRecipients = [
    'Priya Sharma',
    'Arjun Mehta',
    'Sophia Wilson',
    'Daniel Carter',
    'Olivia Martin',
    'Noah Thompson',
    'Isabella Clark',
    'Ethan Walker',
] as const;

const templateSenders = [
    'Neha Kapoor',
    'Rahul Verma',
    'Emily Davis',
    'Michael Brown',
] as const;

const templateDates = [
    '22 July 2026',
    '24 July 2026',
    '28 July 2026',
    '1 August 2026',
    '5 August 2026',
    '8 August 2026',
] as const;

const templateReferencePrefixes: Readonly<Record<string, string>> = {
    Sales: 'SAL',
    Marketing: 'MKT',
    Support: 'SUP',
    'Customer Success': 'CS',
    Billing: 'BIL',
    'Human Resources': 'HR',
    Appointments: 'APT',
    Operations: 'OPS',
    General: 'GEN',
};

const templateNextSteps: Readonly<Record<string, string>> = {
    Sales: 'Please reply with a suitable time, and we will prepare the next step for your review.',
    Marketing:
        'You can review the details below and choose the option that best fits your interests.',
    Support:
        'Your request is being tracked by our support team, and we will keep you informed of any changes.',
    'Customer Success':
        'Your customer success manager is available to help your team complete the next milestone.',
    Billing:
        'If you have any billing questions, reply to this message and include the reference number above.',
    'Human Resources':
        'Please review the information and contact the people team if you need any clarification.',
    Appointments:
        'Reply to this message if the scheduled details need to be changed.',
    Operations:
        'Our operations team will continue monitoring the request until every action is complete.',
    General:
        'Please contact us if you would like any additional information or assistance.',
};

const templateItems: EditorTemplateItem[] = templateGroups.flatMap(
    ({ group, templates }, groupIndex) =>
        templates.map(([label, description], templateIndex) => {
            const itemIndex = groupIndex * 6 + templateIndex;
            const recipient =
                templateRecipients[itemIndex % templateRecipients.length];
            const sender = templateSenders[itemIndex % templateSenders.length];
            const date = templateDates[itemIndex % templateDates.length];
            const referencePrefix = templateReferencePrefixes[group] ?? 'ERAG';
            const reference = `${referencePrefix}-2026-${String(1001 + itemIndex).padStart(4, '0')}`;

            return {
                id: `${group.toLowerCase().replaceAll(' ', '-')}-${templateIndex + 1}`,
                label,
                group,
                description,
                content:
                    `<h2>${label}</h2>` +
                    `<p><strong>To:</strong> ${recipient}<br>` +
                    `<strong>Date:</strong> ${date}<br>` +
                    `<strong>Reference:</strong> ${reference}</p>` +
                    `<p>Hello ${recipient.split(' ')[0]},</p>` +
                    `<p>${description}</p>` +
                    `<p>${templateNextSteps[group]}</p>` +
                    `<p>Regards,<br><strong>${sender}</strong></p>`,
            };
        }),
);

const editor = useTemplateRef<EditorInstance>('editor');
const showCode = shallowRef(false);
const showMenubar = shallowRef(true);
const isDisabled = shallowRef(false);
const isReadonly = shallowRef(false);
const copyStatus = shallowRef<'copied' | 'failed' | 'idle'>('idle');
let copyResetTimer: ReturnType<typeof setTimeout> | undefined;

const isEditingLocked = computed(() => isDisabled.value || isReadonly.value);
const copyButtonLabel = computed(() => {
    if (copyStatus.value === 'copied') {
        return 'Copied';
    }

    if (copyStatus.value === 'failed') {
        return 'Copy failed';
    }

    return 'Copy';
});

const demoMergeTagValues: Readonly<Record<string, string>> = {
    '{{client.name}}': 'Amit Gupta',
    '{{company.name}}': 'ERAG',
    '{{account.reference}}': 'ERAG-2026-001',
};

const editorConfig = computed<EditorInit>(() => ({
    height: 440,
    minHeight: 320,
    maxHeight: 720,
    menubar: showMenubar.value,
    toolbar: true,
    statusbar: true,
    resize: true,
    placeholder: 'Start writing...',
    mentions: {
        enabled: true,
        limit: 50,
        items: mentionItems,
    },
    mergeTags: {
        enabled: true,
        limit: 50,
        items: mergeTagItems,
    },
    templates: {
        enabled: true,
        items: templateItems,
    },
}));

function insertSample(): void {
    if (isEditingLocked.value) {
        return;
    }

    editor.value?.focus();
    editor.value?.insertHtml(
        '<p><strong>Sample content:</strong> This text was inserted through the public EditorInstance API.</p>',
    );
}

function clearContent(): void {
    if (isEditingLocked.value) {
        return;
    }

    editor.value?.clear();
}

function replaceInsertedMergeTags(): void {
    const currentHtml = editor.value?.getHtml();

    if (!currentHtml) {
        return;
    }

    const resolvedHtml = Object.entries(demoMergeTagValues).reduce(
        (html, [tag, value]) => html.replaceAll(tag, value),
        currentHtml,
    );

    if (resolvedHtml !== currentHtml) {
        editor.value?.setHtml(resolvedHtml);
    }
}

async function copyExampleCode(): Promise<void> {
    try {
        await navigator.clipboard.writeText(homeEditorExampleCode);
        copyStatus.value = 'copied';
    } catch {
        copyStatus.value = 'failed';
    }

    if (copyResetTimer !== undefined) {
        clearTimeout(copyResetTimer);
    }

    copyResetTimer = setTimeout(() => {
        copyStatus.value = 'idle';
        copyResetTimer = undefined;
    }, 2000);
}

onBeforeUnmount(() => {
    if (copyResetTimer !== undefined) {
        clearTimeout(copyResetTimer);
    }
});
</script>

<template>
    <section id="live-demo" class="home-editor-demo">
        <div class="home-editor-demo__container">
            <div class="home-editor-demo__heading">
                <span class="home-editor-demo__eyebrow">Live demo</span>
                <h2 class="home-editor-demo__title">Try the full editor</h2>
                <p class="home-editor-demo__description">
                    Edit the content below and explore the complete menubar,
                    toolbar, mentions, merge tags, templates, tables, media,
                    preview, and source tools.
                </p>
            </div>

            <div class="home-editor-demo__shell">
                <div
                    class="home-editor-demo__controls"
                    role="toolbar"
                    aria-label="Live editor controls"
                >
                    <button
                        type="button"
                        class="home-editor-demo__control"
                        :class="{
                            'home-editor-demo__control--active': showMenubar,
                        }"
                        :aria-pressed="showMenubar"
                        @click="showMenubar = !showMenubar"
                    >
                        Menubar
                    </button>
                    <button
                        type="button"
                        class="home-editor-demo__control"
                        :class="{
                            'home-editor-demo__control--active': isDisabled,
                        }"
                        :aria-pressed="isDisabled"
                        @click="isDisabled = !isDisabled"
                    >
                        Disabled
                    </button>
                    <button
                        type="button"
                        class="home-editor-demo__control"
                        :class="{
                            'home-editor-demo__control--active': isReadonly,
                        }"
                        :aria-pressed="isReadonly"
                        @click="isReadonly = !isReadonly"
                    >
                        Readonly
                    </button>
                    <span
                        class="home-editor-demo__control-divider"
                        aria-hidden="true"
                    ></span>
                    <button
                        type="button"
                        class="home-editor-demo__control"
                        :disabled="isEditingLocked"
                        @click="insertSample"
                    >
                        Insert sample
                    </button>
                    <button
                        type="button"
                        class="home-editor-demo__control home-editor-demo__control--danger"
                        :disabled="isEditingLocked"
                        @click="clearContent"
                    >
                        Clear
                    </button>
                    <button
                        type="button"
                        class="home-editor-demo__control home-editor-demo__control--code"
                        :class="{
                            'home-editor-demo__control--active': showCode,
                        }"
                        :aria-pressed="showCode"
                        @click="showCode = !showCode"
                    >
                        <svg
                            class="home-editor-demo__control-icon"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path d="m8 9-3 3 3 3" />
                            <path d="m16 9 3 3-3 3" />
                            <path d="m14 5-4 14" />
                        </svg>
                        Code
                    </button>
                </div>

                <div v-show="!showCode" class="home-editor-demo__editor-panel">
                    <ClientOnly>
                        <Editor
                            ref="editor"
                            v-model="content"
                            :init="editorConfig"
                            :disabled="isDisabled"
                            :readonly="isReadonly"
                            aria-label="Live rich text editor demo"
                            @template-insert="replaceInsertedMergeTags"
                        />

                        <template #fallback>
                            <div class="home-editor-demo__loading">
                                Loading editor…
                            </div>
                        </template>
                    </ClientOnly>
                </div>

                <div
                    v-if="showCode"
                    class="home-editor-demo__code-panel"
                    tabindex="0"
                >
                    <div class="home-editor-demo__code-header">
                        <span class="home-editor-demo__code-dot"></span>
                        <span class="home-editor-demo__code-file">App.vue</span>
                        <span class="home-editor-demo__code-meta">
                            <span class="home-editor-demo__code-language">
                                Vue + TypeScript
                            </span>
                            <button
                                type="button"
                                class="home-editor-demo__copy-button"
                                :class="{
                                    'home-editor-demo__copy-button--copied':
                                        copyStatus === 'copied',
                                }"
                                :aria-label="`${copyButtonLabel} editor example code`"
                                @click="copyExampleCode"
                            >
                                <svg
                                    class="home-editor-demo__copy-icon"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path d="M8 8h11v11H8z" />
                                    <path d="M16 8V5H5v11h3" />
                                </svg>
                                <span aria-live="polite">{{
                                    copyButtonLabel
                                }}</span>
                            </button>
                        </span>
                    </div>
                    <HomeEditorCode :code="homeEditorExampleCode" />
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.home-editor-demo {
    scroll-margin-top: calc(var(--vp-nav-height) + 1rem);
    padding: 2.5rem 2rem;
    background: linear-gradient(
        180deg,
        var(--vp-c-bg) 0%,
        var(--vp-c-bg-soft) 100%
    );
    border-top: 1px solid var(--vp-c-divider);
    border-bottom: 1px solid var(--vp-c-divider);
}

.home-editor-demo__container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
}

.home-editor-demo__heading {
    max-width: 720px;
    margin: 0 auto 2.5rem;
    text-align: center;
}

.home-editor-demo__eyebrow {
    display: inline-flex;
    margin-bottom: 0.9rem;
    padding: 0.35rem 0.8rem;
    border: 1px solid var(--vp-c-brand-1);
    border-radius: 999px;
    color: var(--vp-c-brand-1);
    background: var(--vp-c-brand-soft);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.home-editor-demo__title {
    margin: 0 0 1rem;
    font-size: 2.5rem;
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -0.02em;
}

.home-editor-demo__description {
    margin: 0;
    color: var(--vp-c-text-2);
    font-size: 1.1rem;
    line-height: 1.7;
}

.home-editor-demo__shell {
    padding: 1rem;
    border: 1px solid var(--vp-c-border);
    border-radius: 18px;
    background: var(--vp-c-bg);
    box-shadow: 0 24px 60px -30px rgba(15, 23, 42, 0.35);
}

.home-editor-demo__shell :deep(.erag-editor__content .erag-demo-profile-photo) {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    object-fit: cover;
}

.home-editor-demo__code-panel {
    max-height: 620px;
    overflow: auto;
    border: 1px solid #27272a;
    border-radius: 12px;
    background: #111113;
}

.home-editor-demo__code-header {
    position: sticky;
    top: 0;
    z-index: 1;
    display: flex;
    gap: 0.45rem;
    align-items: center;
    padding: 0.55rem 1rem;
    border-bottom: 1px solid #27272a;
    color: #d4d4d8;
    background: #18181b;
    font-family: var(--vp-font-family-mono);
    font-size: 0.8rem;
    font-weight: 700;
}

.home-editor-demo__code-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #42b883;
}

.home-editor-demo__code-language {
    color: #71717a;
    font-weight: 500;
}

.home-editor-demo__code-meta {
    display: flex;
    gap: 0.65rem;
    align-items: center;
    margin-inline-start: auto;
}

.home-editor-demo__copy-button {
    display: inline-flex;
    gap: 0.3rem;
    align-items: center;
    min-height: 22px;
    padding: 0.1rem 0.4rem;
    border: 1px solid #3f3f46;
    border-radius: 5px;
    color: #a1a1aa;
    background: #27272a;
    font: inherit;
    font-size: 0.72rem;
    cursor: pointer;
    transition:
        border-color 0.15s ease,
        color 0.15s ease,
        background-color 0.15s ease;
}

.home-editor-demo__copy-button:hover {
    border-color: #52525b;
    color: #f4f4f5;
    background: #3f3f46;
}

.home-editor-demo__copy-button--copied {
    border-color: #15803d;
    color: #86efac;
    background: rgb(21 128 61 / 18%);
}

.home-editor-demo__copy-button:focus-visible {
    outline: 2px solid #42b883;
    outline-offset: 2px;
}

.home-editor-demo__copy-icon {
    width: 13px;
    height: 13px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.home-editor-demo__controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding: 0.65rem;
    border: 1px solid var(--vp-c-border);
    border-radius: 12px;
    background: var(--vp-c-bg-soft);
}

.home-editor-demo__control {
    min-height: 36px;
    padding: 0.45rem 0.8rem;
    border: 1px solid var(--vp-c-border);
    border-radius: 8px;
    color: var(--vp-c-text-1);
    background: var(--vp-c-bg);
    font: inherit;
    font-size: 0.85rem;
    font-weight: 650;
    cursor: pointer;
    transition:
        border-color 0.18s ease,
        color 0.18s ease,
        background-color 0.18s ease,
        transform 0.18s ease;
}

.home-editor-demo__control:hover:not(:disabled) {
    border-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
    transform: translateY(-1px);
}

.home-editor-demo__control--active {
    border-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
    background: var(--vp-c-brand-soft);
}

.home-editor-demo__control--danger:hover:not(:disabled) {
    border-color: #dc2626;
    color: #dc2626;
}

.home-editor-demo__control:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.home-editor-demo__control--code {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
}

.home-editor-demo__control-icon {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.home-editor-demo__control-divider {
    width: 1px;
    height: 26px;
    margin: 0 0.15rem;
    background: var(--vp-c-divider);
}

.home-editor-demo__loading {
    display: grid;
    min-height: 440px;
    place-items: center;
    border: 1px solid var(--vp-c-border);
    border-radius: 12px;
    color: var(--vp-c-text-2);
    background: var(--vp-c-bg-soft);
}

@media (max-width: 640px) {
    .home-editor-demo {
        padding: 2.5rem 1rem 2rem;
    }

    .home-editor-demo__title {
        font-size: 2rem;
    }

    .home-editor-demo__shell {
        padding: 0.5rem;
        border-radius: 14px;
    }

    .home-editor-demo__controls {
        align-items: stretch;
    }

    .home-editor-demo__control {
        flex: 1 1 auto;
    }

    .home-editor-demo__control-divider {
        display: none;
    }
}
</style>
