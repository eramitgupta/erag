---
title: "Vue Editor Merge Tags"
description: "Configure dynamic merge tags with autocomplete, grouped sidebar insertion, atomic tokens, typed events, and safe backend replacement guidance."
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

# Merge Tags

Merge tags provide dynamic, interactive placeholders (such as `client.name` or `invoice.amount`) for document generation and email templates. Typing <code>&#123;&#123;</code> opens an autocomplete dropdown at the cursor caret, and enabling the feature unlocks a slide-out **Merge Tag** sidebar panel in the menubar.

Merge tags are disabled by default. The trigger is fixed as <code>&#123;&#123;</code>; item values are normalized to the same double-braced form before display, insertion, and event emission.

---

## Key Highlights

<div class="features-grid">
  <div class="feature-card">
    <div class="fc-icon-large"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 13 8-11 4 2 1.5 5 2.5 2v4l-4 4-2-1.5-5-1.5-4-2Z"/><path d="M12 12 4 13"/><path d="M12 12l8-4"/></svg></div>
    <h3>Fixed Trigger</h3>
    <p>Typing <code>&#123;&#123;</code> instantly opens a filtered popup menu at the cursor position.</p>
  </div>
  <div class="feature-card">
    <div class="fc-icon-large"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="15" x2="15" y1="3" y2="21"/></svg></div>
    <h3>Grouped Slide-out Drawer</h3>
    <p>A right slide-out panel categorizes merge tags by custom group names (e.g. <code>Client</code>, <code>Proposal</code>, <code>Billing</code>).</p>
  </div>
  <div class="feature-card">
    <div class="fc-icon-large"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg></div>
    <h3>Atomic Token Chips</h3>
    <p>Inserted tags render as non-editable inline tokens that delete cleanly as a single unit when pressing <code>Backspace</code> or <code>Delete</code>.</p>
  </div>
  <div class="feature-card">
    <div class="fc-icon-large"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
    <h3>Safe HTML Storage</h3>
    <p>Content is saved as structured HTML data attributes (<code>data-erag-merge-tag-value="client.name"</code>).</p>
  </div>
</div>

---

## Configuration & Item Interface

Define merge tag items in `init.mergeTags`:

```ts
import { computed } from 'vue';
import type { EditorInit, MergeTagItem } from '@erag/text-editor-vue';

const mergeTagItems = computed<MergeTagItem[]>(() => [
    { value: '{{amit}}', name: 'Consultant name' },
    { value: '{{client.name}}', name: 'Client name', group: 'Client' },
    {
        value: '{{client.salutation}}',
        name: 'Client salutation',
        group: 'Client',
    },
    {
        value: '{{submission.date}}',
        name: 'Submission date',
        group: 'Proposal',
    },
    {
        value: '{{proposal.number}}',
        name: 'Proposal number',
        group: 'Proposal',
    },
]);

const editorConfig = computed<EditorInit>(() => ({
    mergeTags: {
        enabled: true,
        limit: 10,
        items: mergeTagItems.value,
    },
}));
```

| Option    | Type             | Default | Description                                      |
| --------- | ---------------- | ------- | ------------------------------------------------ |
| `enabled` | `boolean`        | `true`  | Enables the feature for an object configuration. |
| `limit`   | `number`         | `10`    | Maximum autocomplete results.                    |
| `items`   | `MergeTagItem[]` | `[]`    | Consumer-provided tags displayed by the UI.      |

The package does not invent merge tags. Supply at least one item for the menubar entry, sidebar, and suggestions to have content.

### Merge Tag Item Interface (`MergeTagItem`)

| Property | Type     | Required | Description                                                                                                                                                          |
| :------- | :------- | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`  | `string` | **Yes**  | Visible and stored token value, normally supplied as <code>&#123;&#123;client.name&#125;&#125;</code>. A bare or single-braced value is normalized to double braces. |
| `name`   | `string` | Optional | Friendly display name shown in autocomplete and the sidebar. The inserted token remains the normalized `value`.                                                      |
| `group`  | `string` | Optional | Group name used to categorize tags in the right slide-out drawer (e.g. `Client`, `Proposal`).                                                                        |

---

## Sidebar Panel & Menubar Integration

When `mergeTags.enabled` is `true`, a **Merge tag** menu option is added to the menubar. Clicking it opens a right slide-out sidebar drawer organized by category groups.

If you specify an explicit `menubar` array in configuration, include `'merge-tags'`:

```ts
const editorConfig: EditorInit = {
    menubar: ['file', 'edit', 'insert', 'format', 'merge-tags'],
    mergeTags: {
        enabled: true,
        items: mergeTagItems.value,
    },
};
```

The sidebar keeps ungrouped items in a common list and renders named groups as separate sections. Clicking an item restores the saved editor selection and inserts the tag at that caret position.

## Autocomplete controls

After typing <code>&#123;&#123;</code>, suggestions are filtered against friendly names, normalized values, and group names. Starts-with matches appear before contains matches, and `limit` controls the maximum visible results.

- `ArrowDown` / `ArrowUp` moves through results and wraps.
- `Home` / `End` jumps to the first or last result.
- `Enter` / `Tab` inserts the active result.
- `Escape` closes the dropdown.
- Backspace after a token or Delete before it removes the complete token and emits `merge-tag-remove`.

---

## Merge Tag Events

Listen to tag selection and removal events:

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import {
    Editor,
    type MergeTagRemoveEvent,
    type MergeTagSelectEvent,
} from '@erag/text-editor-vue';

const content = shallowRef('');

function handleTagSelect(event: MergeTagSelectEvent) {
    console.log('Inserted merge tag:', event.item.value);
}

function handleTagRemove(event: MergeTagRemoveEvent) {
    console.log('Removed merge tag:', event.item.value);
}
</script>

<template>
    <Editor
        v-model="content"
        :init="editorConfig"
        @merge-tag-select="handleTagSelect"
        @merge-tag-remove="handleTagRemove"
    />
</template>
```

---

## HTML Output & Backend Replacement

Inserted merge tags render as atomic non-editable token chips in exported HTML:

```html
<span
    class="erag-merge-tag"
    data-erag-merge-tag="true"
    data-erag-merge-tag-value="{{client.name}}"
    contenteditable="false"
    >&#123;&#123;client.name&#125;&#125;</span
>
```

### Backend Placeholder Resolution Example (Laravel / PHP)

Before sending an email or rendering a PDF report, parse the stored HTML and replace only recognized merge-tag elements. Avoid a global string replacement because it also changes the token's data attribute and leaves stale chip markup behind.

```php
$document = new DOMDocument();
$document->loadHTML(
    '<meta charset="utf-8"><body>'.$template->body.'</body>',
    LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD,
);

$replacements = [
    '{{client.name}}' => $client->name,
    '{{client.salutation}}' => $client->salutation,
    '{{consultant.name}}' => $consultant->name,
];

$xpath = new DOMXPath($document);

foreach ($xpath->query('//span[@data-erag-merge-tag="true"]') as $node) {
    $token = $node->attributes?->getNamedItem('data-erag-merge-tag-value')?->nodeValue;

    if ($token !== null && array_key_exists($token, $replacements)) {
        $node->parentNode?->replaceChild(
            $document->createTextNode($replacements[$token]),
            $node,
        );
    }
}
```

Serialize the body children after replacement and pass the result through your server-side HTML sanitizer. Only replace values from an application allowlist. Do not treat a stored tag as executable code or as an arbitrary object path.
