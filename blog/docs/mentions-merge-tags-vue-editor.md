---
title: Mentions and Merge Tags in a Vue Text Editor
headline: "Mentions and Merge Tags in a Vue Text Editor, With a Laravel Backend"
description: Add @mentions with Laravel user search and double-brace merge tags to a Vue editor, then read mentions from the saved HTML to send notifications.
date: 2026-09-29
package: text-editor-vue
category: Tutorial
tags: [vue, mentions, merge-tags, laravel, rich-text-editor]
---

Two features come up in almost every app that has a comment box or a template editor. People want to type `@` and tag a teammate. And whoever writes the templates wants to drop in <code>&#123;&#123;client.name&#125;&#125;</code> and have it filled in later.

They look alike in the UI: type a trigger, pick from a list, get a chip. Underneath they mean different things. A mention points at a real person right now. A merge tag is a placeholder that gets resolved when the content is used.

`@erag/text-editor-vue` has both built in, and both are off by default. This post covers Vue editor mentions backed by a Laravel user search, merge tags with the sidebar, and the part people usually skip: what to do with the saved HTML. If you haven't set up the editor yet, start with the [Vue 3 rich text editor tutorial](./vue-3-rich-text-editor.md).

## Mentions or merge tags: which do you need?

| | Mentions | Merge tags |
| --- | --- | --- |
| Trigger | `@` (fixed) | <code>&#123;&#123;</code> (fixed) |
| Items | People, often searched from your API | A fixed list you define |
| Resolved | Never, the chip is the final content | Later, on the server |
| Typical use | Comments, tasks, internal notes | Emails, proposals, PDFs |

Neither trigger is configurable, which keeps the saved markup predictable for whatever reads it on the backend.

## How to add Vue editor mentions from a static list

For a small team you can pass the users directly:

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Editor, type EditorInit, type MentionItem } from '@erag/text-editor-vue';

const comment = shallowRef('');

const teamMembers: MentionItem[] = [
    { id: 1, label: 'Damon Cross', description: 'Backend Developer' },
    { id: 2, label: 'Ava Mitchell', description: 'Product Designer' },
];

const editorConfig: EditorInit = {
    height: 240,
    menubar: false,
    statusbar: false,
    toolbar: 'bold italic | bullist numlist | link',
    mentions: {
        enabled: true,
        minimumCharacters: 0,
        limit: 8,
        items: teamMembers,
    },
};
</script>

<template>
    <Editor v-model="comment" :init="editorConfig" />
</template>
```

Static items are searched case-insensitively across `label`, `description` and `value`, and matches that start with the query come first. An `avatar` URL is optional. Without one, the hover card shows initials.

The dropdown only opens for a standalone mention query like `@da` or `Hello @damon`. It stays closed inside links, inline code, email addresses and URL paths, so typing `amit@example.com` doesn't pop up a list of users.

## Searching users from Laravel

A static list stops working once you have more than a handful of users. Pass a function instead. It receives the query and an `AbortSignal`:

```ts
import type { MentionItem } from '@erag/text-editor-vue';

interface MentionUser {
    id: number;
    name: string;
}

export async function searchMentionUsers(
    query: string,
    signal: AbortSignal,
): Promise<MentionItem[]> {
    const response = await fetch(`/mentions/users?q=${encodeURIComponent(query)}`, {
        signal,
        headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
        throw new Error('Mention search failed');
    }

    const users = (await response.json()) as MentionUser[];

    return users.map((user) => ({ id: user.id, label: user.name }));
}
```

Then point `items` at it:

```ts
const editorConfig: EditorInit = {
    mentions: {
        enabled: true,
        debounce: 200,
        items: searchMentionUsers,
    },
};
```

The editor handles the boring parts for you. It waits `debounce` milliseconds (200 by default) after the last keystroke, aborts the previous request when the user keeps typing, and caches identical queries for the editor session. If the request throws, the dropdown shows an error state with a Retry action.

On the Laravel side, an invokable controller is enough:

```php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MentionUserController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $search = $request->string('q')->trim()->toString();

        $users = User::query()
            ->when($search !== '', fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->limit(8)
            ->get(['id', 'name']);

        return response()->json($users);
    }
}
```

```php
use App\Http\Controllers\MentionUserController;

Route::get('/mentions/users', MentionUserController::class)
    ->middleware('auth')
    ->name('mentions.users');
```

Two opinions here. Keep the route behind `auth`, and scope the query to people the current user is allowed to see, such as members of the same team. And notice I left out `value`. A mention item can carry one (often an email address), and it gets written into the saved HTML as `data-erag-mention-value`. If the content is visible to people who shouldn't see your users' emails, don't put emails there. When `value` is missing, the attribute is simply omitted.

## What a mention looks like in the saved HTML

Picking a user inserts a non-editable chip:

```html
<span
    class="erag-mention"
    data-erag-mention="true"
    data-erag-mention-id="1"
    data-erag-mention-label="Damon Cross"
    contenteditable="false"
    >@Damon Cross</span
>
```

Backspace right after the chip, or Delete right before it, removes the whole thing in one step, and the removal can be undone.

## Sending notifications from mentions

The editor gives you `mention-select` and `mention-remove` events:

```vue
<Editor
    v-model="comment"
    :init="editorConfig"
    @mention-select="(event) => console.log('Tagged', event.item.label)"
    @mention-remove="(event) => console.log('Untagged', event.item.label)"
/>
```

Use these for UI feedback only. Don't send notifications from them. A user can tag someone, delete the chip, retype it, and then abandon the comment entirely. The only mentions that count are the ones in the HTML you actually save.

So I read them from the saved HTML on the server. Here's a small helper:

```php
namespace App\Support;

use DOMDocument;
use DOMXPath;

class MentionExtractor
{
    /**
     * @return array<int, string>
     */
    public static function userIds(string $html): array
    {
        if (trim($html) === '') {
            return [];
        }

        $previous = libxml_use_internal_errors(true);

        $document = new DOMDocument();
        $document->loadHTML(
            '<meta charset="utf-8"><body>'.$html.'</body>',
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD,
        );

        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        $ids = [];

        foreach ((new DOMXPath($document))->query('//span[@data-erag-mention="true"]') as $node) {
            $ids[] = $node->getAttribute('data-erag-mention-id');
        }

        return array_values(array_unique(array_filter($ids)));
    }
}
```

In the controller that stores the comment, compare against the previous version so editing a comment doesn't notify the same people twice:

```php
$newIds = array_diff(
    MentionExtractor::userIds($comment->body),
    MentionExtractor::userIds($comment->getOriginal('body') ?? ''),
);

$mentionedUsers = $comment->project->members()->whereKey($newIds)->get();
```

Run this after `$comment->fill(...)` and before `save()`, since `getOriginal()` holds the old body until then. Scoping the lookup to `$comment->project->members()` matters: the chip is just HTML, and anyone can post a span with any ID in it. From there, send your notification the usual Laravel way.

## Customizing the mention dropdown

The default dropdown is compact and handles arrow keys, Home, End, Enter, Tab and Escape. If you want different markup, use the slots. They change what's rendered without touching keyboard handling:

```vue
<Editor v-model="comment" :init="editorConfig">
    <template #mention-item="{ item, active }">
        <span :class="{ 'font-semibold': active }">{{ item.label }}</span>
    </template>

    <template #mention-empty="{ query }">No teammate named "{{ query }}"</template>

    <template #mention-error="{ retry }">
        <button type="button" @click="retry">Search failed, try again</button>
    </template>
</Editor>
```

## Adding merge tags

Merge tags are for placeholders. You define the list, typing <code>&#123;&#123;</code> opens an autocomplete, and a **Merge tag** menubar entry opens a sidebar grouped by category:

```ts
import type { EditorInit, MergeTagItem } from '@erag/text-editor-vue';

const mergeTagItems: MergeTagItem[] = [
    { value: '{{client.name}}', name: 'Client name', group: 'Client' },
    { value: '{{client.salutation}}', name: 'Client salutation', group: 'Client' },
    { value: '{{proposal.number}}', name: 'Proposal number', group: 'Proposal' },
    { value: '{{submission.date}}', name: 'Submission date', group: 'Proposal' },
];

const proposalEditor: EditorInit = {
    menubar: ['file', 'edit', 'insert', 'format', 'merge-tags'],
    mergeTags: {
        enabled: true,
        limit: 10,
        items: mergeTagItems,
    },
};
```

A few details:

- `value` is the token that gets stored. A bare `client.name` or single-braced value is normalized to <code>&#123;&#123;client.name&#125;&#125;</code>.
- `name` is only the friendly label shown in the dropdown and sidebar.
- If you pass an explicit `menubar` array, include `'merge-tags'` or the sidebar entry won't appear.
- The package doesn't invent tags. With an empty `items` list there's nothing to show.

In a real app, don't hard-code the list in the component. The backend decides which tags it can fill, so it should also decide which tags the editor offers. Pass them in as a page prop and build the config with `computed`, so a new tag on the server shows up in the sidebar without a frontend change:

```vue
<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { Editor, type EditorInit, type MergeTagItem } from '@erag/text-editor-vue';

const props = defineProps<{ mergeTags: MergeTagItem[] }>();

const body = shallowRef('');

const proposalEditor = computed<EditorInit>(() => ({
    menubar: ['file', 'edit', 'insert', 'format', 'merge-tags'],
    mergeTags: { enabled: true, limit: 10, items: props.mergeTags },
}));
</script>

<template>
    <Editor v-model="body" :init="proposalEditor" />
</template>
```

Inserted tags become atomic chips with the token in `data-erag-merge-tag-value`. You can listen with `@merge-tag-select` and `@merge-tag-remove`, the same way as mentions.

Resolving them happens on the server when you send the email or render the PDF. The important rule from the [merge tags docs](https://erag.in/text-editor-vue/merge-tags.html) is to replace the chip elements, not run a global string replace, because the token also lives in the data attribute. I walk through a full resolver in [email templates with merge tags](./email-templates-merge-tags-react.md). That post uses React on the frontend, but the Laravel side is identical.

## Keep the attributes when you sanitize

If you sanitize HTML on the server (and you should), your allow-list has to keep the `data-erag-mention-*` attributes, the `erag-mention` and `erag-merge-tag` classes, `data-erag-merge-tag-value` and `contenteditable="false"` on those spans. Strip them and your mentions turn into plain text, and the extractor above finds nothing. The [security page](https://erag.in/text-editor-vue/security.html) lists the exact markup.

## When you don't need this

Skip mentions if nobody is notified and nothing links to the person. Typing a name is fine.

Skip merge tags if the content is never reused. A one-off message doesn't need placeholders, and every tag you add is one more value the backend has to fill correctly.

And if your template language needs loops or conditionals, merge tags aren't enough. They're simple token replacement by design. Use a real template engine for that.

## Wrapping up

Turn on mentions with a static list first, then swap in the async search once it works. Read mentions from the saved HTML, not from events. For the full option tables, the [mentions docs](https://erag.in/text-editor-vue/mentions.html) have everything, including the `mention-search` event.
