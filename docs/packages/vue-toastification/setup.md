---
title: Setup · Vue Toast & Modal Plugin
description: Learn how to set up @erag/vue-toastification in a Vue 3 project. Simple plugin setup with toast positions and required CSS import.
keywords:
  - vue toast setup
  - vue modal setup
  - vue 3 toast plugin
  - vue notification plugin setup
  - vue confirmation modal setup
---

# Setup

Setting up **@erag/vue-toastification** is very quick and straightforward.  
You only need to register the plugin once in your Vue app and import the provided CSS.

This setup enables **toast notifications** and **confirmation modals** everywhere in your application.

---

## ⚙️ Register the Plugin

Open your main application file (`app.ts` or `app.js`) and register the plugin.

### Example (`app.ts`)

```ts
import { createApp } from 'vue';
import App from './App.vue';

// Import the plugin
import ToastPlugin from '@erag/vue-toastification';

// ⚠️ Important: Import the CSS
import '@erag/vue-toastification/dist/style.css';

const app = createApp(App);

// Register the plugin
app.use(ToastPlugin, {
  position: 'bottom-right' // Default toast position
});

app.mount('#app');
````

---

## 📍 Toast Position Options

You can control where toast notifications appear on the screen.

Available positions:

* `top-left`
* `top-center`
* `top-right`
* `bottom-left`
* `bottom-center`
* `bottom-right`

Example:

```ts
app.use(ToastPlugin, {
  position: 'top-center'
});
```

This sets the **default position** for all toast notifications.