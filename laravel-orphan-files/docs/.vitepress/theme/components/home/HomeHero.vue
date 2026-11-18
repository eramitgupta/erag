<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { useCopy } from '../../composables/useCopy'

const steps = [
  { id: 'composer', label: 'Composer', cmd: 'composer require erag/laravel-orphan-files', note: 'install' },
  { id: 'install', label: 'Set up', cmd: 'php artisan orphan:install', note: 'config' },
  { id: 'scan', label: 'Scan', cmd: 'php artisan orphan:scan', note: 'read-only' },
]

const activeStep = ref(steps[0].id)
const current = computed(() => steps.find((step) => step.id === activeStep.value) ?? steps[0])
const { copied, copy } = useCopy()

/** Safety defaults shown under the terminal, taken from config/orphan-files.php. */
const safetyFacts = [
  { label: 'Dry run first', icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },
  { label: '24 h grace period', icon: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/>' },
  { label: 'Restorable trash', icon: '<polyline points="1 4 1 10 7 10"/><path d="M3.5 15a9 9 0 1 0 2.1-9.4L1 10"/>' },
]

/** Generic stroke icons, 24x24 grid. */
const worksWith = [
  { label: 'Laravel', version: '12 / 13', icon: '<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M12 22V12"/><path d="M21 7l-9 5-9-5"/>' },
  { label: 'PHP', version: '8.2+', icon: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>' },
  { label: 'Local disks', version: '', icon: '<rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 17h.01"/><path d="M2 13l3-8h14l3 8"/>' },
  { label: 'Amazon S3', version: '', icon: '<path d="M18 10h-1.3A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>' },
  { label: 'MinIO', version: '', icon: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/>' },
  { label: 'RustFS', version: '', icon: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/>' },
]
</script>

<template>
  <section class="oh-hero">
    <div class="oh-hero-dots" aria-hidden="true" />

    <div class="oh-wrap oh-hero-grid">
      <div class="oh-hero-copy">
        <a class="oh-news" :href="withBase('/commands/install.html')">
          <span class="oh-news-tag">New</span>
          <span>One-command setup with <code>orphan:install</code></span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </a>

        <h1 class="oh-h1">Laravel Orphan Files</h1>
        <p class="oh-hero-sub">Clean up the uploads your database forgot.</p>

        <p class="oh-hero-lead">
          Replaced avatars, images from deleted posts and abandoned uploads stay on your disk and keep costing money.
          This package finds every file no database row points to and moves it to a trash folder you can restore from.
        </p>

        <div class="oh-quick">
          <div class="oh-quick-tabs" role="tablist" aria-label="Setup steps">
            <button
              v-for="step in steps"
              :key="step.id"
              type="button"
              role="tab"
              :aria-selected="step.id === activeStep"
              :class="{ 'is-active': step.id === activeStep }"
              @click="activeStep = step.id"
            >
              {{ step.label }}
            </button>
          </div>
          <div class="oh-quick-cmd">
            <code><span class="oh-quick-prompt" aria-hidden="true">$ </span>{{ current.cmd }}</code>
            <span class="oh-quick-note">{{ current.note }}</span>
            <button type="button" class="oh-quick-copy" :aria-label="`Copy: ${current.cmd}`" @click="copy(current.cmd)">
              <svg v-if="!copied" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              <svg v-else viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
            </button>
          </div>
        </div>

        <div class="oh-actions">
          <a class="oh-btn oh-btn-primary" :href="withBase('/introduction.html')">
            Get started
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </a>
          <a class="oh-btn oh-btn-ghost" href="#demo">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12-7.5z" /></svg>
            See it run
          </a>
          <a class="oh-btn oh-btn-ghost" href="https://github.com/eramitgupta/laravel-orphan-files" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" /></svg>
            GitHub
          </a>
        </div>
      </div>

      <!-- Sample output on the MinIO bucket from the demo GIF; columns trimmed to fit -->
      <figure class="oh-hero-visual">
        <div class="oh-term oh-hero-term">
          <div class="oh-term-bar" aria-hidden="true">
            <span class="oh-dot" /><span class="oh-dot" /><span class="oh-dot" />
            <span class="oh-term-title">~/my-app</span>
          </div>
          <pre class="oh-hero-pre" tabindex="0" aria-label="Sample output of orphan:scan and orphan:clean --force"><code><span class="oh-t-line"><span class="oh-t-prompt">$</span> php artisan orphan:scan</span>
<span class="oh-t-dim">+------+-------+------------+---------+-------------+</span>
<span class="oh-t-dim">|</span> Disk <span class="oh-t-dim">|</span> Files <span class="oh-t-dim">|</span> Referenced <span class="oh-t-dim">|</span> Orphans <span class="oh-t-dim">|</span> Reclaimable <span class="oh-t-dim">|</span>
<span class="oh-t-dim">+------+-------+------------+---------+-------------+</span>
<span class="oh-t-dim">|</span> s3   <span class="oh-t-dim">|</span> 320   <span class="oh-t-dim">|</span> 160        <span class="oh-t-dim">|</span> <span class="oh-t-accent">160</span>     <span class="oh-t-dim">|</span> <span class="oh-t-accent">593.1 MB</span>    <span class="oh-t-dim">|</span>
<span class="oh-t-dim">+------+-------+------------+---------+-------------+</span>

<span class="oh-t-badge oh-t-warn">WARN</span> 160 orphaned files (593.1 MB) can be cleaned.

<span class="oh-t-line"><span class="oh-t-prompt">$</span> php artisan orphan:clean --force</span>

<span class="oh-t-badge oh-t-info">INFO</span> Moved to the trash: 160 files (593.1 MB).
     Restore them with php artisan orphan:restore.
<span class="oh-t-line"><span class="oh-t-prompt">$</span> <span class="oh-t-cursor" aria-hidden="true" /></span></code></pre>
          <ul class="oh-hero-facts">
            <li v-for="fact in safetyFacts" :key="fact.label">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="fact.icon" />
              {{ fact.label }}
            </li>
          </ul>
        </div>
      </figure>
    </div>

    <div class="oh-wrap">
      <div class="oh-works">
        <span class="oh-works-label">Works with</span>
        <ul>
          <li v-for="item in worksWith" :key="item.label">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="item.icon" />
            {{ item.label }}
            <strong v-if="item.version">{{ item.version }}</strong>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
