---
title: Application Setup
description: 'Register the @erag/vue-toastification plugin in your application entry file.'
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

# Application Setup

Register the `@erag/vue-toastification` plugin in your application entry file.

## Registering the Plugin

Import the plugin and its styles inside your `main.ts` or `main.js` file:

```typescript
import { createApp } from 'vue'
import App from './App.vue'

// 1. Import the plugin and its stylesheet
import ToastPlugin from '@erag/vue-toastification'
import '@erag/vue-toastification/dist/style.css'

const app = createApp(App)

// 2. Use the plugin with optional options
app.use(ToastPlugin, {
  position: 'bottom-right' // Default position for all toasts
})

app.mount('#app')
```

## Configuration Options

When calling `app.use(ToastPlugin, options)`, you can pass the following settings:

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `position` | `ToastPosition` | `'bottom-right'` | Global default layout location for toasts. |

### Available Positions

The following positions are supported globally:
- `top-left`
- `top-center`
- `top-right`
- `bottom-left`
- `bottom-center`
- `bottom-right`