---
title: Promise-Based Confirm Modals in Vue 3
headline: How to Build a Vue Confirm Modal You Can Await
description: Build a Vue confirm modal you can await in Vue 3. Replace v-if state and emit handlers with one async call, plus delete and unsaved-changes examples.
date: 2026-09-29
package: vue-toastification
category: Tutorial
tags: [vue, vue3, modal, confirm, async]
---

Look at how a typical Vue codebase asks "Are you sure?" before deleting something. Usually it's a `<ConfirmModal>` in the template, a ref for whether it's open, a ref for which item is pending, a handler for `@confirm` and another for `@cancel`. The logic for a single action ends up spread across five places.

There's a simpler shape for a Vue confirm modal: a function that opens the dialog and returns a promise. You `await` it, get `true` or `false`, and carry on. This post shows the difference, then builds delete and unsaved-changes flows with `useModal()` from `@erag/vue-toastification`.

## What the usual Vue confirm modal looks like

Here's the pattern most of us have written at least once. It's shortened, but the structure is real:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const isConfirmOpen = ref(false)
const pendingInvoiceId = ref<number | null>(null)

const askToDelete = (invoiceId: number) => {
  pendingInvoiceId.value = invoiceId
  isConfirmOpen.value = true
}

const onConfirm = async () => {
  isConfirmOpen.value = false
  await fetch(`/api/invoices/${pendingInvoiceId.value}`, { method: 'DELETE' })
  pendingInvoiceId.value = null
}

const onCancel = () => {
  isConfirmOpen.value = false
  pendingInvoiceId.value = null
}
</script>

<template>
  <div>
    <button type="button" @click="askToDelete(42)">Delete invoice</button>

    <ConfirmModal
      v-if="isConfirmOpen"
      title="Delete invoice?"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </div>
</template>
```

It works. But the action "delete this invoice" is now split across `askToDelete`, `onConfirm` and `onCancel`, joined by a piece of shared state. Add a second confirmable action to the same page and you either duplicate all of it or add a "which action is pending" variable. Neither is fun to review.

## How a promise-based confirm modal works

The alternative is to make the modal a function call. When you call `confirm()`, the library mounts the dialog and returns a native promise. Clicking the confirm button resolves it to `true`; clicking cancel resolves it to `false`. Your code pauses at `await` in the meantime.

That gives you the ergonomics of `window.confirm()`, one line that returns a boolean, but with a dialog you can title, style and label properly. No template markup, no open/closed state in your component.

## Set up @erag/vue-toastification

The modal ships in the same package as the toasts, so the setup is one plugin registration in `main.ts`. If you haven't done that yet, the [Vue 3 toast notifications tutorial](./vue-3-toast-notifications.md) covers it step by step, or follow the [setup guide](https://erag.in/vue-toastification/setup.html). Registering the plugin is all the modal needs.

The composable is exported as `useModal()`. The docs also mention `useConfirmation()` as another name for it. I use `useModal()` below.

## Delete an item with a Vue confirm modal

Here's the invoice example again, as a self-contained `DeleteInvoiceButton.vue`:

```vue
<script setup lang="ts">
import { useModal, useToast } from '@erag/vue-toastification'

const props = defineProps<{
  invoiceId: number
  invoiceNumber: string
}>()

const emit = defineEmits<{
  deleted: [invoiceId: number]
}>()

const modal = useModal()
const toast = useToast()

const deleteInvoice = async () => {
  const confirmed = await modal.confirm({
    title: `Delete invoice ${props.invoiceNumber}?`,
    message: 'The invoice will be removed permanently. This cannot be undone.',
    confirmText: 'Delete invoice',
    cancelText: 'Keep invoice',
    type: 'danger'
  })

  if (!confirmed) {
    return
  }

  const response = await fetch(`/api/invoices/${props.invoiceId}`, { method: 'DELETE' })

  if (!response.ok) {
    toast.error('The invoice could not be deleted. Please try again.', 'Delete failed')
    return
  }

  toast.success(`Invoice ${props.invoiceNumber} deleted.`, 'Deleted')
  emit('deleted', props.invoiceId)
}
</script>

<template>
  <button type="button" @click="deleteInvoice">Delete</button>
</template>
```

Everything about this action lives in `deleteInvoice()`: the question, the request, and both outcomes. Nothing is left in component state when it finishes. You can drop the button into a table row fifty times without fifty modals in the DOM.

`type: 'danger'` gives the dialog a red confirm button, which is the right signal for deleting data.

## Warn before discarding unsaved changes

Not every confirmation is destructive in the same way. For "you'll lose your edits", use `type: 'warning'`:

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useModal } from '@erag/vue-toastification'

const props = defineProps<{
  initialTitle: string
}>()

const emit = defineEmits<{
  close: []
}>()

const modal = useModal()
const title = ref(props.initialTitle)
const isDirty = computed(() => title.value !== props.initialTitle)

const closeEditor = async () => {
  if (isDirty.value) {
    const discard = await modal.confirm({
      title: 'Unsaved changes',
      message: 'You have unsaved changes. Do you want to close without saving?',
      confirmText: 'Discard changes',
      cancelText: 'Keep editing',
      type: 'warning'
    })

    if (!discard) {
      return
    }
  }

  emit('close')
}
</script>

<template>
  <div>
    <input v-model="title" type="text" />
    <button type="button" @click="closeEditor">Close</button>
  </div>
</template>
```

Only ask when something would actually be lost. A dialog that appears on every close, dirty or not, teaches people to click through it.

### The same check on route changes

If you use Vue Router, the same promise plugs straight into a leave guard. `onBeforeRouteLeave` accepts an async function, and returning `false` cancels the route change:

```ts
import { onBeforeRouteLeave } from 'vue-router'

onBeforeRouteLeave(async () => {
  if (!isDirty.value) {
    return true
  }

  return await modal.confirm({
    title: 'Leave this page?',
    message: 'Your changes have not been saved.',
    confirmText: 'Leave page',
    cancelText: 'Stay',
    type: 'warning'
  })
})
```

This is where the promise shape pays off. With the `v-if` modal, wiring a dialog into a router guard is awkward, because the guard needs an answer and the modal answers through events. Here the guard just awaits it.

## Style the modal to fit your design

All selectors are prefixed with `erag-`, so the dialog won't fight with Tailwind or Bootstrap. By default the backdrop blurs the page behind it, the dialog is 90% wide on small screens, and it's capped at 450px on desktop. To adjust the buttons or backdrop, override the documented classes:

```css
.erag-modal-backdrop {
  backdrop-filter: blur(4px);
}

.erag-btn-confirm {
  border-radius: 8px;
}

.erag-btn-cancel {
  font-weight: 500;
}
```

The full list is in the [styling guide](https://erag.in/vue-toastification/styling.html).

## Testing components that use the modal

A side benefit of the function-call shape: it's easy to fake in tests. You don't need to find a modal in the DOM and click its button. Mock the composable and decide what `confirm()` resolves to.

Here's a Vitest test for the `DeleteInvoiceButton` above, checking that cancelling never hits the API:

```ts
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import DeleteInvoiceButton from '@/components/DeleteInvoiceButton.vue'

const { confirm } = vi.hoisted(() => ({ confirm: vi.fn() }))

vi.mock('@erag/vue-toastification', () => ({
  useModal: () => ({ confirm }),
  useToast: () => ({ success: vi.fn(), error: vi.fn() })
}))

describe('DeleteInvoiceButton', () => {
  it('does not call the API when the user cancels', async () => {
    confirm.mockResolvedValue(false)
    const fetchSpy = vi.spyOn(globalThis, 'fetch')

    const wrapper = mount(DeleteInvoiceButton, {
      props: { invoiceId: 7, invoiceNumber: 'INV-1042' }
    })

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(confirm).toHaveBeenCalledOnce()
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})
```

Flip `mockResolvedValue` to `true` for the confirm path. With the `v-if` version, the same test has to open the modal, find its button and trigger a click on it, which ties the test to the modal's markup.

## Mistakes to avoid with confirm modals

- **Asking inside a loop.** For a bulk delete, ask once with the count ("Delete 12 invoices?") rather than awaiting a confirm per item.
- **Generic button labels.** "OK" and "Cancel" say nothing. The confirm button should repeat the verb: "Delete invoice", "Discard changes".
- **Treating the modal as a safety check.** It prevents misclicks, not bad requests. Your API still has to check permissions, because anyone can send the request without seeing the dialog.
- **Confirming reversible actions.** If it can be undone, do it and show a toast. The [toast notification UX guide](./toast-notification-ux-best-practices.md) goes into when each pattern fits.

## When you don't need this

- **You need input inside the dialog.** The documented options are `title`, `message`, `confirmText`, `cancelText` and `type`. That's a yes/no dialog. For "type the project name to confirm" or "pick a reason", build a form in your own dialog component; the native [`<dialog>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) is a good base.
- **Your UI kit already has a confirm service.** Stick with one dialog style across the app.
- **Your app is Laravel + Inertia.** Laravel Inertia Toast has the same `await confirm()` pattern and also sends toasts from controllers. See [confirmation dialogs in Laravel Inertia apps](./confirmation-dialogs-laravel-inertia.md).

## FAQ

### Is useModal() the same as useConfirmation()?

Yes. The docs describe the confirmation dialog as available through `useModal` or `useConfirmation`. Pick one name and use it consistently across your codebase.

### What does confirm() resolve to?

`true` when the user clicks the confirm button, `false` when they click cancel. It's a plain boolean, so `if (!confirmed) return` is all the handling you need.

### Does the dialog work on phones?

Yes. The modal takes 90% of the width on small screens and stops at 450px on larger ones, so you don't need a separate mobile version.

## Where to go next

Pick one page with a hand-rolled confirm modal and move a single action to `await modal.confirm()`. Once it works, delete the refs and handlers it replaced. The [modal usage docs](https://erag.in/vue-toastification/modal-usage.html) have the options and a second example to copy from.
