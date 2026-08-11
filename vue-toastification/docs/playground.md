---
layout: doc
title: Toast & Modal Playground
description: Test erag-vue-toastification alerts and interactive dialog boxes in a sandbox.
head:
    - - meta
      - name: keywords
        content: 'Vue Toastification playground, Vue 3 toast demo, confirmation modal demo, toast notification examples'
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

# Interactive Playground

Test dynamic toast notifications, confirmation modals, custom alert durations, and layout positions inside our real-time interactive sandbox environment.

<script setup>
import ToastPlayground from "./components/ToastPlayground.vue"
</script>

<div class="playground-sandbox">
  <ToastPlayground />
</div>

<style>
.playground-sandbox {
  margin-top: 2rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  padding: 12px;
}
</style>
