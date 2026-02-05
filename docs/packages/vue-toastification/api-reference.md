---
title: API Reference
description: Complete API reference for @erag/vue-toastification. Learn how to use useToast() and useModal() composables in Vue 3 with clear examples.
keywords:
  - vue toast api
  - vue modal api
  - useToast vue
  - useModal vue
  - vue notification api
  - vue confirmation modal api
  - @erag/vue-toastification api
---

## 🎨 API Reference

This package exposes two main composables:

- `useToast()` → for showing toast notifications
- `useModal()` → for showing confirmation dialogs

Both are easy to use, promise-based, and fully typed.

---

## 🍞 `useToast()`

The `useToast()` composable is used to show **non-blocking toast notifications** like success messages, errors, warnings, or info alerts.

### Available Methods

| Method | Arguments | What it does |
|------|----------|--------------|
| `success` | `(msg, title?, duration?, position?)` | Shows a **green** success toast |
| `error` | `(msg, title?, duration?, position?)` | Shows a **red** error toast |
| `warning` | `(msg, title?, duration?, position?)` | Shows an **orange** warning toast |
| `info` | `(msg, title?, duration?, position?)` | Shows a **blue** info toast |
| `setPosition` | `(position)` | Changes the toast position globally |
| `remove` | `(id)` | Removes a specific toast manually |

### Example

```ts
const toast = useToast();

toast.success('Saved successfully');
toast.error('Something went wrong');
toast.warning('Session is about to expire');
toast.info('New update available');
````

You can also control **duration** and **position** per toast if needed.

---

## 💬 `useModal()`

The `useModal()` composable is used to show **confirmation dialogs**.

It is **promise-based**, which means your code waits until the user clicks **Confirm** or **Cancel**.

### Available Method

| Method    | Arguments   | Returns            | What it does                              |
| --------- | ----------- | ------------------ | ----------------------------------------- |
| `confirm` | `(options)` | `Promise<boolean>` | Opens a modal and waits for user response |

* Returns `true` → user confirmed
* Returns `false` → user cancelled

---

### `ModalOptions`

These options control how the confirmation modal looks and behaves:

| Property      | Type                              | Description                      |
| ------------- | --------------------------------- | -------------------------------- |
| `title`       | `string`                          | Modal heading (**required**)     |
| `message`     | `string`                          | Modal description (**required**) |
| `confirmText` | `string`                          | Text for the confirm button      |
| `cancelText`  | `string`                          | Text for the cancel button       |
| `type`        | `'danger' \| 'warning' \| 'info'` | Button style (red, orange, blue) |

---