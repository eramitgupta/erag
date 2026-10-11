---
title: "React Text Editor: Autosave Guide"
headline: "React Text Editor: Autosave and Draft Recovery"
description: Build a React text editor with rich text autosave, debounced saves, revision checks, recovery prompts and safe server-side HTML handling.
date: 2026-10-11
package: text-editor-react
category: Tutorial
tags: [react, text-editor, rich-text-editor, autosave, drafts, inertia]
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/text-editor-react-draft-recovery.md
</div>

The most painful React text editor bug is not a missing toolbar button. It is writing for twenty minutes, switching tabs for a moment and coming back to an empty page.

React text editor autosave does not need a complicated collaboration system. It needs a clear boundary between the editor and the server: the editor produces HTML, the client decides when to save, and the server decides which revision is current. Once those responsibilities are separate, draft recovery becomes much easier to reason about.

Whether you use a rich text editor, a Markdown editor or a headless React editor with custom controls, the draft problem is the same. Text must remain visible while a request is in flight, older requests must not overwrite newer work and a disconnected browser needs a safe recovery path.

This article builds that flow around `@erag/text-editor-react`. It covers controlled content, debounced requests, stale revisions, network failures, browser recovery and the security decisions that come with storing HTML.

## Keep the React editor controlled

The editor accepts a `value` and calls `onChange` whenever the generated HTML changes:

```tsx
import { useState } from 'react';
import { Editor } from '@erag/text-editor-react';
import '@erag/text-editor-react/style.css';

export default function DraftEditor({ initialContent }: { initialContent: string }) {
    const [content, setContent] = useState(initialContent);

    return <Editor value={content} onChange={setContent} />;
}
```

Controlled content makes the save boundary visible in the component. It also lets the server replace the editor value after loading a draft, recovering a local copy or resolving a conflict.

The alternative is an uncontrolled editor with `defaultValue`. That can be useful for a simple form, but a draft screen usually needs to compare the current HTML with the last saved HTML and show recovery choices. Controlled state is the better fit there.

## Do not send a request for every keystroke

Saving every `onChange` event causes three problems:

- a long document can create dozens of requests in a minute;
- responses can complete out of order;
- a slow network can make the UI look permanently busy.

Debounce the request after the user pauses. Keep the latest content in a ref so the timer always saves the newest value:

```tsx
import { useEffect, useRef } from 'react';

export function useDraftAutosave(
    content: string,
    save: (value: string) => Promise<void>,
): void {
    const latest = useRef(content);

    useEffect(() => {
        latest.current = content;

        const timeout = window.setTimeout(() => {
            void save(latest.current);
        }, 1200);

        return () => window.clearTimeout(timeout);
    }, [content, save]);
}
```

In the component, keep `save` stable with `useCallback`. If a new function is created on every render, the effect will restart even when the editor content did not change:

```tsx
const save = useCallback(async (value: string): Promise<void> => {
    await fetch(`/drafts/${draftId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({ content: value, revision }),
    });
}, [csrfToken, draftId, revision]);
```

For an Inertia application, use the request approach already established in your app and keep the same server-side revision rule. The important part is not whether the request uses `fetch` or an Inertia form; it is that saves have an ordering guarantee.

## Protect the draft with a revision number

“Last request wins” sounds reasonable until the same draft is open in two tabs. Tab A saves revision 5, Tab B still has revision 4 and submits later. If the server accepts both writes, the older tab can erase newer work.

Store a revision with the draft:

```php
Schema::table('drafts', function (Blueprint $table): void {
    $table->unsignedInteger('revision')->default(0);
});
```

Require the client to send the revision it last received:

```php
public function update(UpdateDraftRequest $request, Draft $draft): JsonResponse
{
    abort_unless($draft->user_id === $request->user()->id, 403);

    if ($request->integer('revision') !== $draft->revision) {
        return response()->json([
            'message' => 'A newer draft exists.',
            'revision' => $draft->revision,
            'content' => $draft->content,
        ], 409);
    }

    $draft->update([
        'content' => $request->validated('content'),
        'revision' => $draft->revision + 1,
    ]);

    return response()->json([
        'revision' => $draft->revision,
    ]);
}
```

On success, update the client revision. On a `409`, keep the user’s current content visible and show a choice: keep this tab’s work, load the newer server version or open a comparison view. Never replace the editor silently after a conflict.

## Show a trustworthy save state

Users should not have to guess whether “Saving…” means their work is safe. Put a small status close to the editor:

```tsx
<p aria-live="polite">
    {saving ? 'Saving…' : saveError ? 'Could not save' : dirty ? 'Unsaved changes' : 'Saved'}
</p>
```

Use the last confirmed server value to calculate `dirty`. A request being sent does not mean the content is saved. Mark the draft as saved only after the server responds successfully and returns the new revision.

If a save fails, keep the content in the editor, keep `dirty` true and offer a retry. A network failure should never clear the component state. That single rule prevents many of the worst draft experiences.

## Flush when the user leaves

The debounce timer is useful while typing, but it should not be the only save. If the user clicks a navigation link or closes a modal immediately after typing, the timer may be cancelled before it runs.

Add an explicit Save button for people who want certainty. You can also flush on page visibility changes, but browser lifecycle events are not guaranteed to finish an asynchronous request before the page disappears. Treat the lifecycle flush as a helpful extra, not your only durability guarantee.

```tsx
useEffect(() => {
    const handleVisibilityChange = (): void => {
        if (document.visibilityState === 'hidden' && dirty) {
            void save(content);
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
}, [content, dirty, save]);
```

If you need a reliable final request, use a small “Save draft” action before navigation rather than depending on an unload event.

## Keep a short-lived browser recovery copy

For a brief network outage, `sessionStorage` can preserve the latest HTML in the current browser tab:

```ts
const storageKey = `draft:${draftId}`;

sessionStorage.setItem(storageKey, content);

const localDraft = sessionStorage.getItem(storageKey);
if (localDraft && localDraft !== serverContent) {
    // Ask whether to restore the local draft or keep the server version.
}
```

Do not silently overwrite the server with the browser copy. Show the last server save time and let the user choose. After a successful server save, remove the local copy:

```ts
sessionStorage.removeItem(storageKey);
```

`sessionStorage` is intentionally limited to the current tab. Use `localStorage` only if you have a clear reason to recover across tabs, because shared browser storage makes conflict handling more complicated.

## Treat saved HTML as untrusted input

The editor output is HTML. It should not be treated as safe merely because it came from your own component. A user can send a handcrafted request, paste unexpected markup or modify a request in the browser.

Validate the request, sanitize HTML on the server according to your product’s allowed tags and attributes and render the saved content in a safe context. The [rich text HTML sanitization guide](./sanitize-rich-text-html-laravel.md) explains the Laravel side of this boundary.

Keep draft HTML and published HTML separate when possible. Drafts can be edited by their owner, while published content may need a stricter policy, an approval step and a content revision history.

If the editor supports mentions or merge tags, preserve their structured attributes during sanitization. A mention is not just decorative text; it may contain an ID used for notifications. The [React rich text editor guide](./react-rich-text-editor-wysiwyg.md) covers the editor’s controlled value and content model before you add those features.

## Avoid overlapping saves

Debouncing limits how often saves begin, but it does not prevent an older request from remaining in flight when a newer one starts. You have two practical options:

1. Abort the previous request when a new save starts.
2. Let requests finish and rely on the server revision check.

Aborting saves reduces wasted work. Revision checks protect correctness even when a request cannot be cancelled, so keep the server check either way.

Your save function can track the active controller:

```ts
let controller: AbortController | null = null;

async function saveDraft(content: string): Promise<void> {
    controller?.abort();
    controller = new AbortController();

    await fetch(`/drafts/${draftId}`, {
        method: 'PUT',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, revision }),
    });
}
```

Treat an `AbortError` as a normal replacement of an older save. Treat a `409` as a conflict that needs the user’s attention. Treat a `422` as a validation error that should remain visible near the editor.

## Test the failures users actually experience

The useful test cases are behavioral:

- content saves after the debounce period;
- a failed request leaves content and dirty state intact;
- a successful save updates the revision;
- an older revision gets a conflict response;
- a local recovery copy is offered when it differs from the server;
- a successful save removes the local copy;
- unauthorized users cannot update another user’s draft;
- unsafe HTML is removed before public rendering.

Use a fake timer for the debounce in the React test and a feature test for the Laravel revision endpoint. Do not test only that `onChange` was passed to the component; that checks wiring but not the behavior that protects the user’s work.

## React rich text editor autosave checklist

Before calling the draft flow finished, verify:

- The editor is controlled with `value` and `onChange`.
- The save function is stable and debounced.
- The latest content is saved, not the value from an old timer.
- The server rejects stale revisions.
- A failed request does not clear the editor.
- The status text distinguishes saving, saved and failed.
- Navigation does not depend only on an unload event.
- Recovery never overwrites the server without a choice.
- Draft HTML is sanitized on the server.
- Draft and published content have appropriate permissions.

### How often should a rich text editor autosave?

Start with roughly one second after the user stops typing, then adjust based on document size and server cost. The right interval gives the user confidence without turning every pause into a request.

### Is browser storage enough for drafts?

No. It is a recovery layer for short outages, not the source of truth. Store important drafts on the server and use browser storage only to recover content that has not reached it yet.

### Do I need revisions if only one person edits a draft?

Yes, if the draft can be open in two tabs or on two devices. The revision check is inexpensive and prevents an old page from overwriting newer work.

Reliable React rich text editor autosave is mostly about respecting the content lifecycle. Keep the editor controlled, debounce carefully, let the server order revisions, make failures visible and give users a choice when two versions disagree. The result feels calm because the application is handling the messy parts quietly and honestly.
