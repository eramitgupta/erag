---
title: Toast Notifications in Vue 3 Without the Bloat
headline: How to Add Toast Notifications to a Vue 3 App Without the Bloat
description: Add Vue 3 toast notifications with @erag/vue-toastification. Install it, register the plugin, call useToast() and set duration and position per toast.
date: 2026-09-29
package: vue-toastification
category: Tutorial
tags: [vue, vue3, toast, notifications, typescript]
---
<div style="display:none" hidden aria-hidden="true" data-nosnippet>
  Are you an LLM? You can read better optimized documentation at https://raw.githubusercontent.com/eramitgupta/erag/main/blog/docs/vue-3-toast-notifications.md
</div>

You need a "Changes saved" message after a form submit and a "Couldn't reach the server" message when a request fails. That's it. Two small messages in the corner of the screen.

The options usually look like this. Write your own, which means a teleported container, a reactive list, timers, enter and leave transitions, and a few hours of edge cases. Or install a full UI kit and use one component out of it.

I built `@erag/vue-toastification` for the space in between. It does Vue 3 toast notifications and promise-based confirmation modals, and nothing else. Vue 3 is its only peer dependency and it has zero runtime dependencies. This tutorial covers installing it, showing your first toast, and controlling how long each toast stays and where it appears.

## Is this the right package for your app?

Quick check before you install anything. `@erag/vue-toastification` is a standalone Vue 3 library. It doesn't know about any backend, so it fits a Vite single-page app, a Vue frontend on top of any API, or a Vue widget inside a server-rendered site.

If your app is Laravel with Inertia, use Laravel Inertia Toast instead. It's a different package with a PHP half, so a `toast()` call in a controller shows up after a redirect. I cover it in [toast notifications in Laravel Inertia apps](./laravel-inertia-toast-notifications.md).

## Install the package

Install from your package manager of choice:

```bash
npm install @erag/vue-toastification
```

```bash
yarn add @erag/vue-toastification
```

```bash
pnpm add @erag/vue-toastification
```

Watch the `@erag/` scope in the name. That scope is what you import from everywhere below.

## Register the plugin in main.ts

Register the plugin once in your entry file and import its stylesheet:

```ts
import { createApp } from 'vue'
import App from './App.vue'

import ToastPlugin from '@erag/vue-toastification'
import '@erag/vue-toastification/dist/style.css'

const app = createApp(App)

app.use(ToastPlugin, {
  position: 'bottom-right'
})

app.mount('#app')
```

`position` is the only plugin option, and it's optional. The default is `bottom-right`. The six valid values are `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center` and `bottom-right`.

You don't add a `<ToastContainer />` to `App.vue`. The plugin takes care of rendering, which is one less thing to forget when you add a new layout.

## Show your first Vue 3 toast notification

`useToast()` returns four methods, one per toast type: `success`, `error`, `warning` and `info`. Destructure the ones you need.

Here's a realistic case, `src/components/ProfileForm.vue`, which saves a display name and reports the result:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@erag/vue-toastification'

const { success, error } = useToast()

const displayName = ref('')
const isSaving = ref(false)

const saveProfile = async () => {
  isSaving.value = true

  try {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName: displayName.value })
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    success('Your profile has been updated.', 'Saved')
  } catch {
    error('We could not save your profile. Please try again.', 'Save failed')
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <form @submit.prevent="saveProfile">
    <input v-model="displayName" type="text" placeholder="Display name" />
    <button type="submit" :disabled="isSaving">Save</button>
  </form>
</template>
```

The first argument is the message and the second is an optional title. Each type gets its own colour and a matching icon, so the user can tell a success from an error without reading the text.

## Control duration and position per toast

All four methods share one signature:

```ts
success(message: string, title?: string, duration?: number, position?: ToastPosition)
```

`duration` is in milliseconds and defaults to `4500`. Pass `0` and the toast stays until it's dismissed, which is what I use for errors the user has to act on:

```ts
const { success, warning } = useToast()

// A longer success message, shown top-center for 10 seconds
success('Your export is ready. Check your downloads folder.', 'Export complete', 10000, 'top-center')

// Stays on screen until dismissed
warning('You are offline. Changes will not be saved.', 'No connection', 0)
```

`position` overrides the global default for that toast only. I'd use it sparingly. Toasts that jump around the screen are harder to notice than toasts that always appear in the same place.

There's also `setPosition(position)`, which changes the global default at runtime. That's useful if you let users pick where notifications appear in a settings screen:

```ts
import { useToast, type ToastPosition } from '@erag/vue-toastification'

const { setPosition } = useToast()

const applyNotificationPreference = (position: ToastPosition) => {
  setPosition(position)
}
```

## Put toast calls in a composable, not every component

Once a few components save data, the same `try`/`catch` plus toast pattern shows up everywhere. Since `useToast()` is a regular composable, you can call it inside your own composables and keep the messages in one place.

Here's `src/composables/useSaveProject.ts`:

```ts
import { ref } from 'vue'
import { useToast } from '@erag/vue-toastification'

export function useSaveProject() {
  const { success, error } = useToast()
  const isSaving = ref(false)

  const saveProject = async (projectId: number, name: string) => {
    isSaving.value = true

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      success(`${name} was saved.`, 'Project saved')
      return true
    } catch {
      error('The project could not be saved. Please try again.', 'Save failed', 0)
      return false
    } finally {
      isSaving.value = false
    }
  }

  return { isSaving, saveProject }
}
```

Components call `saveProject()` and don't import the toast package at all. When you later decide error toasts should stay longer, or the wording should change, you edit one file instead of hunting through every form.

## Show the right toast type from an API response

Some APIs return a status alongside a message, like `{ "status": "warning", "message": "Your plan renews tomorrow" }`. Instead of a chain of `if` statements, call the matching method with bracket notation. The package exports a `ToastType` type for this.

I add a guard so an unexpected status from the server falls back to `info` rather than throwing:

```ts
import { useToast, type ToastType } from '@erag/vue-toastification'

const toast = useToast()
const toastTypes: ToastType[] = ['success', 'error', 'warning', 'info']

const notifyFromResponse = (payload: { status: string; message: string }) => {
  const type = toastTypes.includes(payload.status as ToastType)
    ? (payload.status as ToastType)
    : 'info'

  toast[type](payload.message, 'System Alert')
}
```

The [toast usage docs](https://erag.in/vue-toastification/toast-usage.html) show the shorter version without the guard.

## Style toasts to match your app

Every class the package uses starts with `erag-`, so its styles don't leak into Tailwind, Bootstrap or your own CSS, and your global styles don't break the toasts. When you want to change the look, target the documented selectors in your own stylesheet:

```css
.erag-toast {
  border-radius: 10px;
  font-family: inherit;
}

.erag-toast-error {
  border-left: 4px solid #dc2626;
}
```

The main selectors are `.erag-toast-container`, `.erag-toast`, and one per type: `.erag-toast-success`, `.erag-toast-error`, `.erag-toast-warning` and `.erag-toast-info`. The [styling guide](https://erag.in/vue-toastification/styling.html) lists them with the modal selectors too.

## The confirm modal comes with it

The same package ships `useModal()`, a confirmation dialog you can `await`:

```ts
import { useModal } from '@erag/vue-toastification'

const modal = useModal()

const confirmed = await modal.confirm({
  title: 'Delete project?',
  message: 'This is permanent.',
  type: 'danger'
})
```

It resolves `true` on confirm and `false` on cancel. There's enough to say about it that it has its own post: [promise-based confirm modals in Vue 3](./promise-confirm-modal-vue-3.md).

## When you don't need this package

Being honest about the limits:

- **Your UI kit already has a toast component.** If you use a component library with its own toast or snackbar, keep it. Two notification systems in one app look inconsistent.
- **You need more than message, title, duration and position.** That's the documented toast API, deliberately small. If you need things like buttons inside a toast, check the [API reference](https://erag.in/vue-toastification/api.html) first to see if it covers your case before committing.
- **Your app is Laravel + Inertia.** Use Laravel Inertia Toast, linked above, so your controllers can send toasts too.

## FAQ

### Does it support TypeScript?

Yes. Positions, durations and modal options are typed, and you can import types such as `ToastType` and `ToastPosition` directly from the package.

### Can a toast stay open until the user closes it?

Yes. Pass `0` as the duration, for example `error('Upload failed', 'Error', 0)`.

### Does it work with Vue 2?

No. Vue 3 is the package's one peer dependency, and the API is built on the Composition API (`useToast()`, `useModal()`). On Vue 2 you'd need a different library.

### Do I have to import the stylesheet?

Yes, once, next to `app.use()`: `import '@erag/vue-toastification/dist/style.css'`. That file holds the default look for toasts and the modal. Your own overrides go in your app's stylesheet, loaded after it.

### Can I change the default position after the app has started?

Yes, with `setPosition()` from `useToast()`. It changes the default for every toast shown afterwards, while a `position` argument still overrides it for a single toast.

## Where to go next

Try the [interactive playground](https://erag.in/vue-toastification/playground.html) to see each type and position before you pick defaults. Then read [toast notification UX best practices](./toast-notification-ux-best-practices.md) for the harder question: which messages belong in a toast at all.
