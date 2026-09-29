---
title: "Toast Notification UX: When and How to Use Them"
headline: "Toast Notification UX: When to Use a Toast and When to Skip It"
description: "Toast notification UX rules that hold up: which messages belong in a toast, how long to show them, where to place them and how to keep them accessible."
date: 2026-09-29
package: vue-toastification
category: Best practices
tags: [ux, toast, accessibility, vue, notifications]
---

Toasts are easy to add, and that's the problem. Once showing one is a single line of code, every action gets one. Validation errors end up in a message that disappears after four seconds. A bulk action fires twenty toasts at once. Screen reader users hear nothing at all.

I maintain two toast packages, one for plain Vue 3 and one for Laravel + Inertia. The API is the easy part. The harder part is toast notification UX: when to use a toast, what to put in it, and how long to leave it up. These are the rules I follow. They apply to any library; where code helps, the examples use `@erag/vue-toastification`.

## What a toast is actually for

A toast is a brief, non-blocking message about something that just happened. It confirms an action the user took ("Settings saved") or reports low-priority status ("Export started"). It appears, it goes away, and the user keeps working the whole time.

A useful test: **if the user missed this message completely, would anything go wrong?** If the answer is no, a toast is fine. If the answer is yes, the message needs a component that stays put until the user has seen it.

## When to use a toast, and when not to

Here's how I'd place common messages:

| Message | Best fit |
| --- | --- |
| "Settings saved" after pressing Save | Toast |
| "Link copied" | Toast |
| "Export started, we'll email you" | Toast (info) |
| A form field is invalid | Inline error under the field |
| Payment failed, card needs updating | Inline alert or banner near the action |
| "Delete this project?" | Confirm dialog before the action, toast after |
| Session about to expire, needs a click | Modal or persistent banner |
| New feature announcement | Banner or in-app message, not a toast |

The pattern: toasts **report**. They don't ask, and they don't carry anything the user must act on to continue.

## Don't put validation errors in toasts

This is the most common misuse I see. The form fails, and a red toast says "The email field is required" in the corner of the screen, far from the email field, and then vanishes while the user is still scrolling back up to find it.

Field errors belong next to the field. They stay visible while the user fixes them, and they point at exactly what's wrong. If you want a toast as well, keep it to one short summary ("Some fields need your attention") and still show the inline errors. The toast is an extra, never a replacement.

## How long should a toast stay on screen?

Long enough to read, twice if needed. A few practical rules:

- **Scale with length.** "Saved" needs very little time. A sentence with a filename in it needs more.
- **Give errors more time than successes.** Error messages tend to be longer, and they matter more.
- **Make errors that need action sticky.** If the user has to do something, don't let the message disappear on a timer.
- **Don't make everything sticky either.** A screen full of success toasts waiting to be closed is its own kind of noise.

There's an accessibility angle too. WCAG's "Timing Adjustable" criterion is about giving people enough time to read and use content. Short-lived toasts with important information in them are a common way to fail it.

In `@erag/vue-toastification` the default is `4500` ms, and passing `0` as the duration turns off automatic removal:

```ts
import { useToast } from '@erag/vue-toastification'

const { success, error } = useToast()

// Short confirmation, default duration
success('Draft saved.', 'Saved')

// Longer message, more time
success('Your export is ready. Check your downloads folder.', 'Export complete', 8000)

// Needs action, stays until dismissed
error('Upload failed: the file is larger than 10 MB.', 'Upload failed', 0)
```

## Where to place toasts

Pick one position for the whole app and stick with it. People learn where messages appear, and a toast that shows up somewhere new each time is easy to miss.

When choosing that position, check what's underneath it. A bottom-right toast that covers a chat input or a floating Save button is annoying. A top-right toast that sits over the account menu gets in the way just as much. Look at your busiest screens, at desktop and phone widths, before you commit.

Set the default once, then override only when there's a clear reason:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import ToastPlugin from '@erag/vue-toastification'
import '@erag/vue-toastification/dist/style.css'

createApp(App)
  .use(ToastPlugin, { position: 'bottom-right' })
  .mount('#app')
```

A per-toast `position` argument exists for the odd exception. If you find yourself using it often, your default is probably wrong.

## Write toast copy that says what happened

Most toast text is too vague to be useful. Compare:

| Vague | Specific |
| --- | --- |
| "Success!" | "Invoice INV-1042 sent." |
| "Error" | "Couldn't save the post. Check your connection and try again." |
| "Updated" | "Billing address updated." |
| "Something went wrong" | "The image is larger than 10 MB. Choose a smaller file." |

A few habits that help:

- **Name the thing.** Include the invoice number, the file name, the project. It confirms the right item was affected.
- **Use past tense for finished actions.** "Invoice sent", not "Sending invoice".
- **For errors, say what to do next.** "Try again", "Choose a smaller file", "Check your connection".
- **Don't repeat the type in the title and the message.** A green toast titled "Success" with the message "Success!" says one thing three times. Use the title for the category ("Saved") and the message for the detail.

## Don't stack a pile of toasts

One action should produce one toast. When an action touches many records, summarise:

```ts
import { useToast } from '@erag/vue-toastification'

const { success, warning } = useToast()

const reportBulkSend = (sentCount: number, failedCount: number) => {
  if (failedCount === 0) {
    success(`${sentCount} invoices sent.`, 'Done')
    return
  }

  warning(
    `${sentCount} sent, ${failedCount} failed. Check the list for details.`,
    'Partly done',
    0
  )
}
```

The same goes for polling and background sync. Toast when something changes, not every time a check runs. And don't toast on page load about things the page already shows.

## Pick the type by meaning, not colour

The four standard types each mean something specific:

- **success**: the action the user asked for worked.
- **error**: it didn't, and the user probably needs to do something.
- **warning**: it worked, or will, but with a catch.
- **info**: neutral news that isn't about success or failure.

Deleting a post the user asked to delete is a **success**, even though "delete" feels negative. Using red for it tells the user something went wrong.

Also, never rely on colour alone. Some users can't tell green from red. A type-matched icon plus clear wording does the job; `@erag/vue-toastification` adds an icon per type, but the words still have to carry the meaning.

## Make toasts accessible

Toasts appear outside the user's focus, so a screen reader won't announce them unless they're in a live region. Whatever library you use, open your browser's dev tools and check the toast container's markup. You're looking for an [`aria-live`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live) region, or a role such as `status`, that assistive technology will announce.

Beyond that:

- **Don't move focus to a toast.** It interrupts whatever the user was doing.
- **Don't put the only copy of important information in a toast.** If it matters later, show it on the page too.
- **Be careful with links and buttons inside auto-dismissing toasts.** Keyboard and screen reader users may not reach them before they disappear.
- **Respect reduced motion.** If your toasts slide and bounce, check how they behave for users with `prefers-reduced-motion` turned on.

## Toasts inform, modals ask

The line between a toast and a modal is simple. A toast tells the user something after the fact. A modal stops them and asks for a decision before it.

For destructive actions you often want both, in that order: confirm first, then report the result:

```ts
import { useModal, useToast } from '@erag/vue-toastification'

const modal = useModal()
const toast = useToast()

const deleteProject = async (projectName: string) => {
  const confirmed = await modal.confirm({
    title: `Delete ${projectName}?`,
    message: 'All tasks in this project will be removed. This cannot be undone.',
    confirmText: 'Delete project',
    cancelText: 'Cancel',
    type: 'danger'
  })

  if (!confirmed) {
    return
  }

  // ...send the delete request here, then report the result:
  toast.success(`${projectName} deleted.`, 'Deleted')
}
```

For reversible actions, skip the modal. Do the action and report it. [Promise-based confirm modals in Vue 3](./promise-confirm-modal-vue-3.md) covers the confirm side in more depth.

## A toast notification UX checklist

Before shipping a new toast, run through this:

- Would it matter if the user missed it? If yes, it's not a toast.
- Is it a field error? Put it next to the field.
- Does the text name the thing and, for errors, the next step?
- Is the duration long enough to read, and sticky if action is needed?
- Is it the only toast this action produces?
- Does the type match the meaning, not the mood?
- Will a screen reader announce it?

## Where to go next

If you're adding toasts to a Vue 3 app, the [Vue 3 toast notifications tutorial](./vue-3-toast-notifications.md) covers setup. The [toast usage docs](https://erag.in/vue-toastification/toast-usage.html) and [API reference](https://erag.in/vue-toastification/api.html) list every option, and the [playground](https://erag.in/vue-toastification/playground.html) is a quick way to compare positions and durations. On Laravel with Inertia, the same rules apply to [Inertia toast notifications](./laravel-inertia-toast-notifications.md) sent from your controllers.
