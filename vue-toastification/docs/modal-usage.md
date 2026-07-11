# Confirmation Modals

Trigger interactive, promise-based confirmation dialog overlays using the `useModal` (or `useConfirmation`) composable hooks.

## Awaiting Confirmations

Unlike traditional modal dialog frameworks that require template markup registration or reactive state handlers, `@erag/vue-toastification` confirmation dialogs return a **Promise** that resolves to `true` (Confirmed) or `false` (Cancelled).

This allows you to pause code execution using `await` directly inside your business logic!

## Destructive Actions (Danger Modals)

Pass `type: 'danger'` to apply visual warnings and render a red confirmation button for destructive actions like data deletion:

```vue
<script setup lang="ts">
import { useModal, useToast } from '@erag/vue-toastification'

const modal = useModal()
const toast = useToast()

const handleDelete = async () => {
  // Logic pauses here until the overlay resolves
  const isConfirmed = await modal.confirm({
    title: 'Delete user account?',
    message: 'Are you sure? This action is permanent and cannot be undone.',
    confirmText: 'Deactivate Account',
    cancelText: 'Cancel',
    type: 'danger'
  })

  if (isConfirmed) {
    // User clicked confirm
    toast.success('Account deactivated.', 'Completed')
  } else {
    // User clicked cancel
    toast.info('Deactivation cancelled.', 'System')
  }
}
</script>

<template>
  <button @click="handleDelete">Delete Account</button>
</template>
```

## Standard Modal Settings

You can customize titles, button labels, messages, and icons:

```typescript
const ok = await modal.confirm({
  title: 'Unsaved Changes',
  message: 'You have unsaved form data. Do you want to exit without saving?',
  confirmText: 'Discard Changes',
  cancelText: 'Keep Editing',
  type: 'warning'
})
```