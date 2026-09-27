export const homeEditorExampleCode = String.raw`import { useMemo, useRef, useState } from 'react';
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
} from '@erag/text-editor-react';
import '@erag/text-editor-react/style.css';

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
const mergeTagGroups = ['Client', 'Consultant', 'Company', 'Invoice', 'Appointment', 'Account'];
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
        name: group + ' ' + field.replaceAll('_', ' '),
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

const templateItems: EditorTemplateItem[] = templateGroups.flatMap(
    ({ group, labels }) =>
        labels.map((label, templateIndex) => {
            const description =
                label === 'Product demo invitation'
                    ? 'Invite a prospect to a product demonstration.'
                    : 'Ready-to-edit ' + label.toLowerCase() + '.';

            return {
                id: group.toLowerCase().replaceAll(' ', '-') + '-' + (templateIndex + 1),
                label,
                group,
                description,
                content:
                    '<h2>' + label + '</h2>' +
                    '<p>Hi {{client.name}},</p>' +
                    '<p>' + description + '</p>' +
                    '<p>We have prepared the key information and recommended next steps for your review.</p>' +
                    '<p>Please review this update and reply if you have questions, changes, or additional details to share.</p>' +
                    '<p>Thank you for your time. We look forward to helping you move ahead with confidence.</p>' +
                    '<p>Best regards,<br>{{consultant.name}}</p>',
            };
        }),
);

// Values are resolved when a template is inserted.
const mergeTagValues: Readonly<Record<string, string>> = {
    '{{client.name}}': 'Olivia Bennett',
    '{{consultant.name}}': 'Jordan Lee',
};

// Feature callbacks receive typed payloads.
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

export default function App() {
    // Editor content and interactive demo state.
    const [content, setContent] = useState('<h1>Welcome to @erag/text-editor-react</h1>');
    const [showMenubar, setShowMenubar] = useState(true);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isReadonly, setIsReadonly] = useState(false);
    const editor = useRef<EditorInstance>(null);
    const isEditingLocked = isDisabled || isReadonly;

    // Configure the editor without mutating the source options.
    const editorConfig = useMemo<EditorInit>(
        () => ({
            height: 440,
            minHeight: 320,
            maxHeight: 720,
            menubar: showMenubar,
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
        }),
        [showMenubar],
    );

    // Public EditorInstance methods power external controls.
    function insertSample(): void {
        if (isEditingLocked) return;

        editor.current?.focus();
        editor.current?.insertHtml('<p><strong>Sample content</strong></p>');
    }

    function clearContent(): void {
        if (isEditingLocked) return;

        editor.current?.clear();
    }

    function handleChange(value: string): void {
        console.log('change', value);
        setContent(value);
    }

    function replaceInsertedMergeTags(event: TemplateInsertEvent): void {
        console.log('template-insert', event);

        const currentHtml = editor.current?.getHtml();
        if (!currentHtml) return;

        const resolvedHtml = Object.entries(mergeTagValues).reduce(
            (html, [tag, value]) => html.replaceAll(tag, value),
            currentHtml,
        );

        if (resolvedHtml !== currentHtml) {
            editor.current?.setHtml(resolvedHtml);
        }
    }

    return (
        <div>
            <button type="button" onClick={() => setShowMenubar(!showMenubar)}>
                Menubar
            </button>
            <button type="button" onClick={() => setIsDisabled(!isDisabled)}>
                Disabled
            </button>
            <button type="button" onClick={() => setIsReadonly(!isReadonly)}>
                Readonly
            </button>
            <button type="button" disabled={isEditingLocked} onClick={insertSample}>
                Insert sample
            </button>
            <button type="button" disabled={isEditingLocked} onClick={clearContent}>
                Clear
            </button>

            <Editor
                ref={editor}
                value={content}
                onChange={handleChange}
                init={editorConfig}
                disabled={isDisabled}
                readOnly={isReadonly}
                ariaLabel="Rich text editor"
                onMentionSelect={handleMentionSelect}
                onMentionRemove={handleMentionRemove}
                onMergeTagSelect={handleMergeTagSelect}
                onMergeTagRemove={handleMergeTagRemove}
                onTemplateInsert={replaceInsertedMergeTags}
                onImageRemove={handleImageRemove}
            />
        </div>
    );
}`;
