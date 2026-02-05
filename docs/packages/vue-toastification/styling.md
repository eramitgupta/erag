---
title: Styling · Toast & Modal CSS
description: Learn how styling works in @erag/vue-toastification. All CSS is safely scoped with the erag- prefix to avoid conflicts with Tailwind, Bootstrap, or custom styles.
keywords:
  - vue toast css
  - vue modal css
  - vue notification styling
  - erag toast styling
  - scoped css vue plugin
  - vue toast css prefix
  - @erag/vue-toastification styling
---

# Styling

**@erag/vue-toastification** is designed to be **safe by default** when it comes to CSS.

All styles used by the library are **scoped with a unique `erag-` prefix**, so they never clash with your existing styles or UI frameworks.

This means you can use it confidently with **Tailwind CSS**, **Bootstrap**, **Vuetify**, or your own custom CSS.

---

## 🛡️ Scoped CSS (No Conflicts)

Every CSS class used internally starts with:

```

erag-

````

This prevents issues like:
- Button styles being overridden
- Modal layouts breaking
- Toast animations conflicting with global styles

You don’t need to rename anything or worry about conflicts.

---

## 🎨 Common CSS Classes

Here are some of the most important classes used by the library:

### Toast

- `.erag-toast-container` – Main toast wrapper
- `.erag-toast` – Individual toast item
- `.erag-toast-success` – Success toast (green)
- `.erag-toast-error` – Error toast (red)
- `.erag-toast-warning` – Warning toast (orange)
- `.erag-toast-info` – Info toast (blue)

---

### Modal

- `.erag-modal-backdrop` – Modal overlay background
- `.erag-modal` – Modal container
- `.erag-modal-title` – Modal heading
- `.erag-modal-message` – Modal text content
- `.erag-btn-confirm` – Confirm button
- `.erag-btn-cancel` – Cancel button

---

## ✏️ Custom Styling (Optional)

If you want to customize the look, you can safely override styles using the same class names.

### Example: Custom Toast Width

```css
.erag-toast {
  max-width: 420px;
}
````

---

### Example: Change Confirm Button Color

```css
.erag-btn-confirm {
  background-color: #dc2626;
}
```
