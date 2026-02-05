---
title: Toast Usage · Vue Notifications
description: Learn how to show toast notifications in Vue 3 using @erag/vue-toastification. Covers basic usage, positions, duration, and advanced dynamic toast handling.
keywords:
  - vue toast notification
  - vue 3 toast
  - vue composition api toast
  - vue success error toast
  - vue toast dynamic type
  - @erag/vue-toastification
---

# Toast Usage 🍞

Toast notifications are used to show **quick, non-blocking messages** to users —  
like success messages, errors, warnings, or simple info alerts.

With **@erag/vue-toastification**, showing toasts is:
- Very simple
- Fully typed (TypeScript friendly)
- Customizable
- Smooth and lightweight

---

## 🚀 Getting Started

To use toast notifications, import the `useToast()` composable inside your component.

```ts
import { useToast } from '@erag/vue-toastification';

const toast = useToast();
````

That’s it — you’re ready to show toasts.

---

## 🟢 Basic Toast Usage

The library comes with **four built-in toast types**:

* `success`
* `error`
* `warning`
* `info`

### Example

```vue
<script setup lang="ts">
import { useToast } from '@erag/vue-toastification';

const { success, error, warning, info } = useToast();

const showToasts = () => {
  success('Data saved successfully!', 'Success');
  error('Server connection failed', 'Error');
  warning('Your session is expiring', 'Warning');
  info('New update available', 'Info');
};
</script>
```

Each toast appears automatically and disappears after a short time.

---

## ⏱️ Custom Duration

You can control **how long a toast stays visible** by passing a duration (in milliseconds).

```ts
toast.success('Saved!', 'Done', 5000); // stays for 5 seconds
toast.error('Failed!', 'Oops', 8000); // stays for 8 seconds
```

If duration is not provided, the default duration is used.

---

## 📍 Toast Position

### Available Positions

* `top-left`
* `top-center`
* `top-right`
* `bottom-left`
* `bottom-center`
* `bottom-right`

---

### Change Position Globally

This affects **all future toasts**.

```ts
const { setPosition } = useToast();

setPosition('top-center');
```

---

### Set Position for a Single Toast

You can also control position **per toast**.

```ts
toast.success(
  'Shown at top left',
  'Position',
  4000,
  'top-left'
);
```

---

## 🔄 Advanced: Dynamic Toast Types (API Responses)

Sometimes your API already tells you **which type of message to show**
(`success`, `error`, etc.).

Instead of writing multiple `if / else` blocks, you can call the toast **dynamically**.

### Example

```ts
import { useToast } from '@erag/vue-toastification';
import type { ToastType } from '@erag/vue-toastification';

const toast = useToast();

const handleApiRequest = async () => {
  try {
    // Example API response:
    // { status: 'success', message: 'Profile updated!' }
    const response = await api.updateProfile();

    const type = response.status as ToastType;

    // Dynamically calls toast.success() or toast.error()
    toast[type](response.message, 'Notification');
  } catch (error) {
    toast.error('Something went wrong');
  }
};
```

This keeps your code **clean, readable, and scalable**.

---
