<script setup lang="ts">
import { withBase } from 'vitepress';
</script>

<template>
    <a class="hero-badge" :href="withBase('/icons.html')">
        <span class="hero-badge-new">v1</span>
        <span>Zero UI libraries, 210 hand-drawn icons, ready for AI agents</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </a>
</template>

<style scoped>
.hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 28px;
    padding: 5px 14px 5px 5px;
    border: 1px solid #e4e4e7;
    border-radius: 999px;
    background: #ffffff;
    color: #3f3f46;
    font-size: 0.85rem;
    font-weight: 500;
    text-decoration: none;
    box-shadow: 0 1px 2px rgba(9, 9, 11, 0.05);
    transition:
        border-color 0.2s ease,
        transform 0.2s ease;
}

.hero-badge:hover {
    border-color: #bfdbfe;
    transform: translateY(-1px);
}

.hero-badge-new {
    padding: 2px 10px;
    border-radius: 999px;
    background: #2563eb;
    color: #ffffff;
    font-size: 0.75rem;
    font-weight: 700;
}

.hero-badge svg {
    width: 14px;
    height: 14px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}

:global(.dark .hero-badge) {
    border-color: #27272a;
    background: #18181b;
    color: #d4d4d8;
}

:global(.dark .hero-badge:hover) {
    border-color: #1e3a8a;
}

@media (max-width: 480px) {
    .hero-badge {
        font-size: 0.78rem;
    }
}
</style>
