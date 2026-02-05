---
title: Vue Toast Notification & Confirmation Modal for Vue 3
description: Lightweight and fast toast notification and confirmation modal library for Vue 3. Built with TypeScript and Composition API. Includes success, error, warning, info toasts and promise-based modals.
keywords:
  - vue toast notification
  - vue 3 toast
  - vue confirmation modal
  - vue notification library
  - vue 3 composition api toast
  - typescript vue toast
  - vue alert modal
  - vue popup notification
  - erag vue toastification
---

## Introduction

**@erag/vue-toastification** is a lightweight and developer-friendly **toast notification** and **confirmation modal** library built specifically for **Vue 3**.

Showing success messages, errors, warnings, or asking users for confirmation is a very common requirement in modern web applications. But managing UI state, animations, callbacks, and consistent styling often makes this harder than it should be. This library simplifies all of that.

It is built using the **Vue 3 Composition API** and **TypeScript**, so it fits naturally into modern Vue projects. You can show toast notifications with a single line of code, and open confirmation dialogs using a **Promise-based API**, allowing you to `await` user actions instead of writing complex callback logic.

The library is **fast, lightweight, and dependency-free**, making it suitable for both small projects and large-scale applications. All styles use an `erag-` prefix, ensuring there are **no CSS conflicts** with frameworks like Tailwind, Bootstrap, or custom UI systems.

Whether you are building an **admin dashboard**, **SaaS platform**, **management panel**, or any interactive Vue application, **@erag/vue-toastification** helps you provide clear, smooth user feedback while keeping your code clean and easy to maintain.

<div style="display:flex; gap:8px; flex-wrap:wrap;">
  <img src="https://img.shields.io/badge/version-1.1.0-blue.svg" />
  <img src="https://img.shields.io/badge/Vue-3.x-green.svg" />
  <img src="https://img.shields.io/badge/language-TypeScript-blue.svg" />
  <img src="https://img.shields.io/badge/license-MIT-green.svg" />
</div>

---

## 🎮 Live Toast Playground

Want to see the library in action?  
This interactive playground lets you **try toast notifications and confirmation modals live** without writing any code.

You can:
- Trigger **success, error, warning, and info** toasts
- See **animations, positions, and styling** in real time
- Test how **confirmation modals** behave before integrating them
- Understand how the library feels in a real UI

This is the easiest way to get familiar with **@erag/vue-toastification** before using it in your project.

---

## Live Demo
<script setup>
import ToastPlayground from "../../components/ToastPlayground.vue"
</script>

<ToastPlayground />
---