---
title: "useToast Composable Usage"
description: "Trigger success, error, warning, and info toasts inside Vue 3 script setup components with the lightweight useToast Composition API hook."
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

# Toast Usage

Trigger non-blocking toast notifications inside your Vue 3 components using the `useToast` hook.

## Basic Usage

Import `useToast` and call the helper methods corresponding to the four default alert states:

```vue
<script setup lang="ts">
import { useToast } from '@erag/vue-toastification'

const { success, error, warning, info } = useToast()

const showToasts = () => {
  // Green success alert
  success('Profile information has been updated.', 'Good Job')

  // Red error alert
  error('Connection to the server failed.', 'Error')

  // Orange warning alert
  warning('Your login session will expire in 2 minutes.', 'Warning')

  // Blue info alert
  info('New product features have been unlocked.', 'Info')
}
</script>

<template>
  <button @click="showToasts">Show Notifications</button>
</template>
```

## API Method Signatures

All toast trigger functions (`success`, `error`, `warning`, `info`) use the following signature:

```typescript
success(message: string, title?: string, duration?: number, position?: ToastPosition)
```

## Overriding Duration and Position

You can pass custom timeout duration in milliseconds or layout positioning to override global settings:

```typescript
const { success } = useToast()

const triggerAlert = () => {
  // Show a success toast at top-center for 10 seconds
  success(
    'File exported successfully!',
    'Success',
    10000,
    'top-center'
  )
}
```

## Dynamic API Casting

If you receive the toast status directly from an API response (e.g. `'success'` or `'error'`), you can invoke the matching toast method dynamically using bracket notation:

```typescript
import { useToast, type ToastType } from '@erag/vue-toastification'

const toast = useToast()

const handleResponse = (apiResponse: { status: string; message: string }) => {
  const type = apiResponse.status as ToastType
  
  // Dynamically calls toast.success() or toast.error()
  toast[type](apiResponse.message, 'System Alert')
}
```