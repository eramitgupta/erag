---
title: Features · Vue Toast & Confirmation Modal
description: Discover the features of @erag/vue-toastification – a lightweight, fast, and TypeScript-based toast notification and confirmation modal library for Vue 3.
keywords:
  - vue toast features
  - vue 3 toast notification
  - vue confirmation modal
  - vue composition api toast
  - vue promise based modal
  - typescript vue toast
  - vue notification library
  - erag vue toastification
---

# Features

**@erag/vue-toastification** is built to make notifications and confirmations in Vue 3
**simple, clean, and developer-friendly**.  
No heavy setup, no complex configuration — just import and use.

Below are the core features explained in plain, human language 👇

---

## ⚡ Built for Vue 3 & Composition API

This library is designed **only for Vue 3** and fully embraces the **Composition API**.

You work with simple composables:
- `useToast()` for notifications
- `useConfirmation()` for confirmation dialogs

No global event buses or messy patterns.

---

## 🍞 Simple & Powerful Toast Notifications

Show notifications with just **one line of code**.

You get **4 built-in toast types**:
- ✅ Success
- ❌ Error
- ⚠️ Warning
- ℹ️ Info

Each toast supports:
- Custom title
- Auto-dismiss duration
- Flexible screen position

Perfect for API responses, form submissions, and user feedback.

---

## 💬 Promise-Based Confirmation Modals

Confirmation dialogs return a **Promise**, not callbacks.

That means you can simply write:

```ts
const confirmed = await modal.confirm(...)
````

This keeps your code:

* Clean
* Easy to read
* Easy to maintain

Ideal for **delete**, **logout**, and **danger actions**.

---

## ✨ Smooth & Modern Animations

The UI feels polished out of the box.

* Smooth entry & exit animations
* Natural spacing when toasts disappear
* Clean modal transitions

Inspired by modern, Apple-style motion.

---

## 🧠 Fully Typed with TypeScript

Everything is written in **TypeScript**:

* Toast methods
* Modal options
* Toast positions & types

You get:

* Auto-complete
* Type safety
* Fewer runtime errors

Works great in both TS and JS projects.

---

## 🪶 Lightweight & Dependency-Free

* Zero external dependencies
* Small bundle size
* Fast performance

Safe to use in:

* Small apps
* Large dashboards
* Production systems

---

## 🎨 Safe & Scoped CSS

All styles use an **`erag-` prefix**, so they never clash with:

* Tailwind CSS
* Bootstrap
* Your custom styles

Drop-in friendly for any project.

---

## 📍 Flexible Toast Positioning

Choose where notifications appear:

* Top / Bottom
* Left / Center / Right

You can:

* Set a global position
* Override position per toast

Full control without extra config.

---

## 🧩 Easy Customization

You can customize:

* Toast duration
* Toast position
* Modal button labels
* Modal type (info, warning, danger)

No need to build your own UI components.

---
