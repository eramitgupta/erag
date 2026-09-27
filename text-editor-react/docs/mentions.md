---
title: "React Editor Mentions"
description: "Add accessible @mention autocomplete with static or async items, avatars, keyboard navigation, custom render props, caching, and typed events."
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
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/text-editor-react/docs/mentions.md
</div>


# Mentions (`@`)

Mentions enable quick inline user suggestions when typing `@`. As users type, a debounced autocomplete dropdown appears at the cursor location. Selecting a user inserts a non-editable chip element complete with an accessible hover user card.

Mentions are disabled by default. Enable them with `mentions: true` or with an object whose `enabled` value is `true`. The trigger is always `@` and is not configurable.

---

## Key Highlights

<div class="features-grid">
  <div class="feature-card">
    <div class="fc-icon-large"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/></svg></div>
    <h3>Fixed @ Trigger</h3>
    <p>Typing <code>@</code> opens an autocomplete dropdown at the current cursor position.</p>
  </div>
  <div class="feature-card">
    <div class="fc-icon-large"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg></div>
    <h3>Debounced Async Fetching</h3>
    <p>Automatically debounces network requests (200ms default) and injects <code>AbortSignal</code> to cancel stale requests when users type rapidly.</p>
  </div>
  <div class="feature-card">
    <div class="fc-icon-large"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg></div>
    <h3>Session Caching</h3>
    <p>Identical search queries within the active editor session are cached locally to minimize backend server load.</p>
  </div>
  <div class="feature-card">
    <div class="fc-icon-large"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><line x1="6" y1="8" x2="6" y2="8"/><line x1="10" y1="8" x2="10" y2="8"/><line x1="14" y1="8" x2="14" y2="8"/><line x1="18" y1="8" x2="18" y2="8"/><line x1="6" y1="12" x2="6" y2="12"/><line x1="10" y1="12" x2="10" y2="12"/><line x1="14" y1="12" x2="14" y2="12"/><line x1="18" y1="12" x2="18" y2="12"/><line x1="8" y1="16" x2="16" y2="16"/></svg></div>
    <h3>Keyboard Navigation</h3>
    <p>Use <code>Up</code> / <code>Down</code> arrows to navigate suggestions, <code>Enter</code> or <code>Tab</code> to insert, and <code>Esc</code> to dismiss.</p>
  </div>
</div>

---

## Static Mentions

To use a fixed list of users, pass an array of `MentionItem` objects in `init.mentions.items`:

```tsx
import { useState } from 'react';
import {
    Editor,
    type EditorInit,
    type MentionItem,
} from '@erag/text-editor-react';
import '@erag/text-editor-react/style.css';

const mentionItems: MentionItem[] = [
    {
        id: 1,
        label: 'Damon Cross',
        description: 'Senior Backend Developer',
        avatar: 'https://i.pravatar.cc/96?img=12',
        value: 'damon@example.com',
    },
    {
        id: 2,
        label: 'Daniel Long',
        description: 'Operations Manager',
        avatar: 'https://i.pravatar.cc/96?img=11',
        value: 'daniel@example.com',
    },
    {
        id: 5,
        label: 'Amit Gupta',
        description: 'Senior Software Developer',
        avatar: 'https://i.pravatar.cc/96?img=14',
        value: 'amit@example.com',
    },
];

const editorConfig: EditorInit = {
    mentions: {
        enabled: true,
        minimumCharacters: 0,
        debounce: 200,
        limit: 8,
        items: mentionItems,
    },
};

export default function App() {
    const [content, setContent] = useState('');

    return <Editor value={content} onChange={setContent} init={editorConfig} />;
}
```

Static mentions search case-insensitively across `label`, `description`, and `value`. Matches starting with the search query appear first.

---

## Async Mentions (Fetch API)

For dynamic user searches from a database or API endpoint, pass an asynchronous function to `items`:

```tsx
import { useState } from 'react';
import {
    Editor,
    type EditorInit,
    type MentionItem,
} from '@erag/text-editor-react';
import '@erag/text-editor-react/style.css';

interface UserResponse {
    id: number;
    name: string;
    designation?: string;
    avatar?: string;
    email?: string;
}

// Async fetcher function
async function fetchUserMentions(
    query: string,
    signal: AbortSignal,
): Promise<MentionItem[]> {
    const response = await fetch(
        `/api/users/search?q=${encodeURIComponent(query)}`,
        {
            signal,
            headers: { Accept: 'application/json' },
        },
    );

    if (!response.ok) {
        throw new Error('Mention search failed');
    }

    const users = (await response.json()) as UserResponse[];

    return users.map((user) => ({
        id: user.id,
        label: user.name,
        description: user.designation,
        avatar: user.avatar,
        value: user.email,
    }));
}

// Editor configuration (defined outside the component so it stays stable)
const editorConfig: EditorInit = {
    mentions: {
        enabled: true,
        debounce: 200,
        items: fetchUserMentions,
    },
};

export default function App() {
    const [content, setContent] = useState('');

    return <Editor value={content} onChange={setContent} init={editorConfig} />;
}
```

### Key Features

1. **Debounce Delay (`debounce: 200`)**: Prevents spamming your backend by waiting 200ms after keypress.
2. **Auto Cancellation (`AbortSignal`)**: Automatically cancels outdated HTTP requests when the user continues typing.
3. **Session Cache**: Caches duplicate queries locally so repeated searches hit memory instead of the network.

---

## Mention Configuration Options

| Option              | Type                        | Default | Description                                                                      |
| :------------------ | :-------------------------- | :------ | :------------------------------------------------------------------------------- |
| `enabled`           | `boolean`                   | `true`  | Enables mention autocomplete when typing `@`.                                    |
| `minimumCharacters` | `number`                    | `0`     | Characters required after `@` before searching starts.                           |
| `debounce`          | `number`                    | `200`   | Search debounce delay in milliseconds.                                           |
| `limit`             | `number`                    | `8`     | Maximum visible options in dropdown list.                                        |
| `items`             | `MentionItem[] \| Function` | `[]`    | Static item array or `async (query, signal) => Promise<MentionItem[]>` function. |

The detector only opens for a standalone mention query such as `@`, `@da`, or `Hello @damon`. It does not activate inside links, inline code, `<pre>` blocks, existing mentions, non-editable elements, email addresses, URL paths, disabled editors, or readonly editors. Whitespace closes the query.

## Dropdown states and controls

The caret-positioned dropdown supports loading, empty, error, and results states. Failed async requests show a Retry action. The first result is active automatically, and the dropdown flips above the caret when there is not enough viewport space below it.

| Key         | Behavior                                       |
| ----------- | ---------------------------------------------- |
| `ArrowDown` | Select the next result, wrapping at the end.   |
| `ArrowUp`   | Select the previous result, wrapping at start. |
| `Home`      | Select the first result.                       |
| `End`       | Select the last result.                        |
| `Enter`     | Insert the active result.                      |
| `Tab`       | Insert the active result without moving focus. |
| `Escape`    | Close without inserting.                       |

Hovering a result updates the active option. Clicking uses pointer handling that preserves the editor selection, so the mention is inserted once at the original query range.

The default result UI is intentionally compact: each row has a `50px` minimum height, `6px 10px` padding, an `8px` content gap, and a `38px` avatar. The description uses only a `1px` top margin. Override `.erag-mention-dropdown__item`, `.erag-mention-dropdown__avatar`, and `.erag-mention-dropdown__description` after the package stylesheet when a denser or roomier application style is required.

## Hover card

Hover an inserted mention to display its known avatar, label, description, and value. If the avatar is missing or cannot load, the card shows initials. The card remains inside the viewport and uses the item data cached during the current editor session.

---

## Mention Lifecycle Events

Track mention search, insertion, and deletion events in your application:

```tsx
import { useState } from 'react';
import {
    Editor,
    type EditorInit,
    type MentionSearchEvent,
    type MentionSelectEvent,
    type MentionRemoveEvent,
} from '@erag/text-editor-react';

const editorConfig: EditorInit = {
    mentions: {
        enabled: true,
        items: fetchUserMentions, // from the async example above
    },
};

export default function App() {
    const [content, setContent] = useState('');

    function handleMentionSearch(event: MentionSearchEvent) {
        console.log(`Searching mentions for "@${event.query}".`);
    }

    function handleMentionSelect(event: MentionSelectEvent) {
        console.log(`Selected ${event.item.label} using query "@${event.query}".`);
    }

    function handleMentionRemove(event: MentionRemoveEvent) {
        console.log(`Removed mention chip for ${event.item.label}.`);
    }

    return (
        <Editor
            value={content}
            onChange={setContent}
            init={editorConfig}
            onMentionSearch={handleMentionSearch}
            onMentionSelect={handleMentionSelect}
            onMentionRemove={handleMentionRemove}
        />
    );
}
```

- **`onMentionSearch`**: Called with `{ query }` when debounced search starts.
- **`onMentionSelect`**: Called with `{ item, query }` when a user selects a mention option.
- **`onMentionRemove`**: Called with `{ item }` when `Backspace` or `Delete` removes an inserted mention chip.

---

## Mention render props

The editor supplies a complete default UI, but these render props can customize dropdown content without replacing its keyboard handling:

```tsx
<Editor
    value={content}
    onChange={setContent}
    init={editorConfig}
    renderMentionItem={({ item, active }) => (
        <span>
            {active ? '→' : ''} {item.label}
        </span>
    )}
    renderMentionLoading={({ query }) => <>Loading {query}…</>}
    renderMentionEmpty={({ query }) => <>No result for {query}</>}
    renderMentionError={({ query, retry }) => (
        <button type="button" onClick={retry}>
            Retry {query}
        </button>
    )}
/>
```

| Prop                   | Arguments (type)                               | Renders                                   |
| :--------------------- | :--------------------------------------------- | :---------------------------------------- |
| `renderMentionItem`    | `{ item, active }` (`MentionItemSlotProps`)    | Content of each result row.               |
| `renderMentionLoading` | `{ query }` (`MentionQuerySlotProps`)          | Loading state while an async search runs. |
| `renderMentionEmpty`   | `{ query }` (`MentionQuerySlotProps`)          | Empty state when no result matches.       |
| `renderMentionError`   | `{ query, retry }` (`MentionErrorSlotProps`)   | Error state; call `retry()` to search again. |

---

## HTML Output Format

Inserted mentions render as non-editable inline chips:

```html
<span
    class="erag-mention"
    data-erag-mention="true"
    data-erag-mention-id="1"
    data-erag-mention-label="Damon Cross"
    data-erag-mention-value="damon@example.com"
    contenteditable="false"
    >@Damon Cross</span
>
```

When `value` is absent, `data-erag-mention-value` is omitted. Pressing Backspace immediately after a mention or Delete immediately before it removes the complete chip and keeps the removal undoable.
