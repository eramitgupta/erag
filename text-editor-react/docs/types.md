---
title: "TypeScript Types"
description: "Browse all public TypeScript types exported by @erag/text-editor-react with practical examples for editor, mentions, merge tags, templates, and images."
head:
    - - meta
      - name: robots
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    - - meta
      - name: googlebot
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    - - meta
      - name: bingbot
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/text-editor-react/docs/types.md
</div>


# TypeScript types

The package publishes declaration files with its ESM build. Import public types with `import type` so they do not become runtime imports.

```ts
import type {
    EditorEvents,
    EditorInit,
    EditorInstance,
    EditorMenuName,
    EditorPluginName,
    EditorProps,
    EditorSlots,
    EditorTemplateItem,
    EditorTemplatesConfig,
    EditorToolbarGroup,
    ImageBlobInfo,
    ImageDeleteInfo,
    ImagesDeleteHandler,
    ImagesUploadHandler,
    MentionConfig,
    MentionErrorSlotProps,
    MentionItem,
    MentionItemSlotProps,
    MentionQuerySlotProps,
    MentionRemoveEvent,
    MentionSearchEvent,
    MentionSelectEvent,
    MergeTagConfig,
    MergeTagItem,
    MergeTagRemoveEvent,
    MergeTagSelectEvent,
    TemplateInsertEvent,
} from '@erag/text-editor-react';
```

## Editor contracts

### `EditorProps`

`EditorProps` combines the value and configuration props with the callback props (`EditorEvents`) and render props (`EditorSlots`).

```ts
interface EditorProps extends EditorSlots, EditorEvents {
    value?: string;
    defaultValue?: string;
    init?: EditorInit;
    disabled?: boolean;
    readOnly?: boolean;
    id?: string;
    name?: string;
    ariaLabel?: string;
    className?: string;
}

const props: EditorProps = {
    value: '<p>Hello</p>',
    ariaLabel: 'Email body',
};
```

### `EditorEvents`

```ts
interface EditorEvents {
    onChange?: (value: string) => void;
    onCommit?: (value: string) => void;
    onClick?: (event: MouseEvent) => void;
    onFocus?: (event: FocusEvent) => void;
    onBlur?: (event: FocusEvent) => void;
    onInput?: (event: InputEvent) => void;
    onKeyDown?: (event: KeyboardEvent) => void;
    onPaste?: (event: ClipboardEvent) => void;
    onReady?: (root: HTMLElement) => void;
    onSelectionChange?: (selection: Selection) => void;
    onResize?: (value: { height: number }) => void;
    onMentionSearch?: (event: MentionSearchEvent) => void;
    onMentionSelect?: (event: MentionSelectEvent) => void;
    onMentionRemove?: (event: MentionRemoveEvent) => void;
    onMergeTagSelect?: (event: MergeTagSelectEvent) => void;
    onMergeTagRemove?: (event: MergeTagRemoveEvent) => void;
    onTemplateInsert?: (event: TemplateInsertEvent) => void;
    onImageRemove?: (image: ImageDeleteInfo) => void;
}
```

DOM callbacks receive native browser events, not React synthetic events.

### `EditorSlots`

```ts
interface EditorSlots {
    toolbarStart?: ReactNode;
    toolbarEnd?: ReactNode;
    menubarEnd?: ReactNode;
    statusbarStart?: ReactNode;
    statusbarEnd?: ReactNode;
    emptyState?: ReactNode;
    renderMentionItem?: (props: MentionItemSlotProps) => ReactNode;
    renderMentionLoading?: (props: MentionQuerySlotProps) => ReactNode;
    renderMentionEmpty?: (props: MentionQuerySlotProps) => ReactNode;
    renderMentionError?: (props: MentionErrorSlotProps) => ReactNode;
}
```

`EditorInit` is documented option by option in the [configuration reference](/configuration.html). `EditorInstance`, `EditorEvents`, and `EditorSlots` are documented in the [API reference](/api.html).

### `EditorMenuName`

```ts
type EditorMenuName =
    | 'file'
    | 'edit'
    | 'view'
    | 'insert'
    | 'merge-tags'
    | 'templates'
    | 'format'
    | 'tools'
    | 'table'
    | 'help';

const menus: EditorMenuName[] = ['file', 'edit', 'insert', 'help'];
```

### `EditorPluginName`

Plugin names identify supported editor capabilities. An explicit array filters plugin-backed controls; core history, formatting, and list controls are still selected through `toolbar` and `menubar`.

```ts
const plugins: EditorPluginName[] = [
    'history',
    'formatting',
    'lists',
    'link',
    'image',
    'media',
    'table',
    'code',
    'preview',
    'fullscreen',
    'find-replace',
    'special-character',
    'emoji',
    'horizontal-rule',
    'anchor',
    'merge-tags',
    'templates',
    'date-time',
];
```

### `EditorToolbarGroup`

The array form and string form use the same toolbar renderer.

```ts
const toolbar: EditorToolbarGroup[] = [
    { name: 'history', items: ['undo', 'redo'] },
    { name: 'text', items: ['bold', 'italic', 'underline'] },
    { name: 'insert', items: ['link', 'image', 'table'] },
];
```

Valid item names are: `undo`, `redo`, `blocks`, `fontfamily`, `fontsize`, `lineheight`, `bold`, `italic`, `underline`, `strikethrough`, `superscript`, `subscript`, `casechange`, `forecolor`, `backcolor`, `alignment`, `alignleft`, `aligncenter`, `alignright`, `alignjustify`, `bullist`, `numlist`, `checklist`, `outdent`, `indent`, `link`, `image`, `media`, `table`, `hr`, `removeformat`, `code`, `preview`, `fullscreen`, and `more`.

## Mention types

```ts
interface MentionItem {
    id: string | number;
    label: string;
    description?: string;
    avatar?: string;
    value?: string;
}

interface MentionConfig {
    enabled?: boolean;
    minimumCharacters?: number;
    debounce?: number;
    limit?: number;
    items?:
        | MentionItem[]
        | ((
              query: string,
              signal: AbortSignal,
          ) => MentionItem[] | Promise<MentionItem[]>);
}
```

`MentionItem` intentionally has no arbitrary metadata field. Keep application-specific data outside the editor item.

```ts
const mention: MentionItem = {
    id: 7,
    label: 'Amit Gupta',
    description: 'Senior Software Developer',
    value: 'amit@example.com',
};

const searchEvent: MentionSearchEvent = { query: 'am' };
const selectEvent: MentionSelectEvent = { item: mention, query: 'am' };
const removeEvent: MentionRemoveEvent = { item: mention };
```

The mention render props receive these payloads:

```ts
interface MentionItemSlotProps {
    item: MentionItem;
    active: boolean;
}

interface MentionQuerySlotProps {
    query: string;
}

interface MentionErrorSlotProps extends MentionQuerySlotProps {
    retry: () => void;
}
```

## Merge-tag types

```ts
interface MergeTagItem {
    value: string;
    name?: string;
    group?: string;
}

interface MergeTagConfig {
    enabled?: boolean;
    limit?: number;
    items?: MergeTagItem[];
}

const tag: MergeTagItem = {
    value: '{{client.name}}',
    name: 'Client name',
    group: 'Client',
};

const selected: MergeTagSelectEvent = { item: tag, query: 'client' };
const removed: MergeTagRemoveEvent = { item: tag };
```

The optional `name` is a friendly label for autocomplete and sidebar lists. The normalized wrapped `value` remains the inserted token and both fields are included in select/remove events when available.

## Template types

```ts
interface EditorTemplateItem {
    id: string | number;
    label: string;
    content: string;
    group?: string;
    description?: string;
}

interface EditorTemplatesConfig {
    enabled?: boolean;
    items?: EditorTemplateItem[];
}

const template: EditorTemplateItem = {
    id: 'follow-up',
    label: 'Follow-up message',
    description: 'A short follow-up for a client.',
    group: 'Quick replies',
    content: '<p>Hello {{client.name}},</p><p>Just checking in.</p>',
};

const event: TemplateInsertEvent = { item: template };
```

## Image types

```ts
interface ImageBlobInfo {
    id(): string;
    name(): string;
    filename(): string;
    blob(): Blob;
    base64(): string;
    blobUri(): string;
}

type ImagesUploadHandler = (
    blobInfo: ImageBlobInfo,
    progress: (percentage: number) => void,
) => Promise<string>;
```

```ts
interface ImageDeleteInfo {
    src: string;
    alt: string;
    width: number;
    height: number;
}

type ImagesDeleteHandler = (image: ImageDeleteInfo) => void | Promise<void>;

const removeImage: ImagesDeleteHandler = async (image) => {
    await fetch('/api/editor-images', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ src: image.src }),
    });
};
```

The delete callback receives rendered dimensions. The editor passes the same `ImageDeleteInfo` to `onImageRemove` only after removal succeeds.
