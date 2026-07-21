export const homeEditorExampleCode = String.raw`<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from 'vue';
import {
    Editor,
    type EditorInit,
    type EditorInstance,
    type EditorTemplateItem,
    type ImageDeleteInfo,
    type MentionRemoveEvent,
    type MentionSelectEvent,
    type MentionItem,
    type MergeTagRemoveEvent,
    type MergeTagSelectEvent,
    type MergeTagItem,
    type TemplateInsertEvent,
} from '@erag/text-editor-vue';
import '@erag/text-editor-vue/style.css';

// Editor content and interactive demo state.
const content = shallowRef('<h1>Welcome to @erag/text-editor-vue</h1>');
const editor = useTemplateRef<EditorInstance>('editor');
const showMenubar = shallowRef(true);
const isDisabled = shallowRef(false);
const isReadonly = shallowRef(false);

// Mention suggestions shown when the user types @.
const mentionItems: MentionItem[] = Array.from(
    { length: 50 },
    (_, index) => {
        const itemNumber = index + 1;

        return {
            id: itemNumber,
            label: 'Demo User ' + String(itemNumber).padStart(2, '0'),
            description: 'Team member ' + String(itemNumber).padStart(2, '0'),
            avatar: 'https://i.pravatar.cc/96?img=' + ((index % 70) + 1),
            value: 'user' + itemNumber + '@example.com',
        };
    },
);

// Generate grouped merge tags for the picker and autocomplete menu.
const mergeTagGroups = ['Client', 'Company', 'Invoice', 'Appointment', 'Account'];
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
        value: '{{' + group.toLowerCase() + '.' + field + '}}',
        group,
    })),
);

// Create reusable templates grouped by business purpose.
const templateGroups = [
    { group: 'Sales', labels: ['Lead introduction', 'Product demo invitation', 'Proposal follow-up', 'Quote delivery', 'Trial ending reminder', 'Deal confirmation'] },
    { group: 'Marketing', labels: ['Newsletter welcome', 'Product launch', 'Webinar invitation', 'Event reminder', 'Feature announcement', 'Re-engagement message'] },
    { group: 'Support', labels: ['Ticket received', 'Issue update', 'Resolution confirmation', 'Feedback request', 'Maintenance notice', 'Service restored'] },
    { group: 'Customer Success', labels: ['Onboarding welcome', 'Kickoff scheduling', 'Customer check-in', 'Renewal reminder', 'Training invitation', 'Success review'] },
    { group: 'Billing', labels: ['Invoice issued', 'Payment receipt', 'Payment reminder', 'Overdue payment notice', 'Refund confirmation', 'Subscription renewal'] },
    { group: 'Human Resources', labels: ['Interview invitation', 'Interview follow-up', 'Offer letter', 'New employee welcome', 'Policy update', 'Leave approval'] },
    { group: 'Appointments', labels: ['Booking confirmation', 'Appointment reminder', 'Reschedule request', 'Cancellation confirmation', 'Appointment follow-up', 'No-show follow-up'] },
    { group: 'Operations', labels: ['Order confirmation', 'Shipping update', 'Delivery confirmation', 'Service scheduled', 'Status update', 'Completion report'] },
    { group: 'General', labels: ['Thank-you message', 'General announcement'] },
];

const templateRecipients = [
    'Priya Sharma',
    'Arjun Mehta',
    'Sophia Wilson',
    'Daniel Carter',
    'Olivia Martin',
    'Noah Thompson',
];

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

const templateItems: EditorTemplateItem[] = templateGroups.flatMap(
    ({ group, labels }, groupIndex) =>
        labels.map((label, templateIndex) => {
            const itemIndex = groupIndex * 6 + templateIndex;
            const recipient = templateRecipients[itemIndex % templateRecipients.length];
            const reference =
                (templateReferencePrefixes[group] ?? 'ERAG') +
                '-2026-' +
                String(1001 + itemIndex).padStart(4, '0');

            return {
                id: group.toLowerCase().replaceAll(' ', '-') + '-' + (templateIndex + 1),
                label,
                group,
                description: 'Ready-to-edit ' + label.toLowerCase() + '.',
                content:
                    '<h2>' + label + '</h2>' +
                    '<p><strong>To:</strong> ' + recipient + '<br>' +
                    '<strong>Reference:</strong> ' + reference + '</p>' +
                    '<p>Hello ' + recipient.split(' ')[0] + ',</p>' +
                    '<p>This ready-to-edit message includes realistic demo details for the ' +
                    group.toLowerCase() + ' workflow.</p>' +
                    '<p>Regards,<br><strong>Neha Kapoor</strong></p>',
            };
        }),
);

// Configure the editor without mutating the source options.
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

const isEditingLocked = computed(
    () => isDisabled.value || isReadonly.value,
);

// In production, load these replacement values from your API.
const mergeTagValues: Readonly<Record<string, string>> = {
    '{{client.name}}': 'Amit Gupta',
    '{{company.name}}': 'ERAG',
    '{{account.reference}}': 'ERAG-2026-001',
};

// Public EditorInstance methods power external controls.
function insertSample(): void {
    if (isEditingLocked.value) return;

    editor.value?.focus();
    editor.value?.insertHtml('<p><strong>Sample content</strong></p>');
}

function clearContent(): void {
    if (isEditingLocked.value) return;

    editor.value?.clear();
}

function handleModelValueUpdate(value: string): void {
    console.log('update:modelValue', value);
}

// Feature events provide typed payloads for application callbacks.
function handleMentionSelect(event: MentionSelectEvent): void {
    console.log('mention-select', event);
}

function handleMentionRemove(event: MentionRemoveEvent): void {
    console.log('mention-remove', event);
}

function handleMergeTagSelect(event: MergeTagSelectEvent): void {
    console.log('merge-tag-select', event);
}

function handleMergeTagRemove(event: MergeTagRemoveEvent): void {
    console.log('merge-tag-remove', event);
}

function handleImageRemove(event: ImageDeleteInfo): void {
    console.log('image-remove', event);
}

// Replace inserted template tags with values supplied by your application.
function replaceInsertedMergeTags(event: TemplateInsertEvent): void {
    console.log('template-insert', event);

    const currentHtml = editor.value?.getHtml();
    if (!currentHtml) return;

    const resolvedHtml = Object.entries(mergeTagValues).reduce(
        (html, [tag, value]) => html.replaceAll(tag, value),
        currentHtml,
    );

    if (resolvedHtml !== currentHtml) {
        editor.value?.setHtml(resolvedHtml);
    }
}
</script>

<template>
    <div>
        <button type="button" @click="showMenubar = !showMenubar">
            Menubar
        </button>
        <button type="button" @click="isDisabled = !isDisabled">
            Disabled
        </button>
        <button type="button" @click="isReadonly = !isReadonly">
            Readonly
        </button>
        <button
            type="button"
            :disabled="isEditingLocked"
            @click="insertSample"
        >
            Insert sample
        </button>
        <button
            type="button"
            :disabled="isEditingLocked"
            @click="clearContent"
        >
            Clear
        </button>

        <Editor
            ref="editor"
            v-model="content"
            :init="editorConfig"
            :disabled="isDisabled"
            :readonly="isReadonly"
            aria-label="Rich text editor"
            @update:model-value="handleModelValueUpdate"
            @mention-select="handleMentionSelect"
            @mention-remove="handleMentionRemove"
            @merge-tag-select="handleMergeTagSelect"
            @merge-tag-remove="handleMergeTagRemove"
            @template-insert="replaceInsertedMergeTags"
            @image-remove="handleImageRemove"
        />
    </div>
</template>`;
