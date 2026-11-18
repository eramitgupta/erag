<script setup lang="ts">
import { withBase } from 'vitepress'
import InstallBox from '../InstallBox.vue'

const steps = [
  'Install the package, then run orphan:install to create the config.',
  'List your upload folders and the columns that store paths.',
  'Run a scan. Nothing changes until you add --force.',
]
</script>

<template>
  <section class="oh-final-section">
    <div class="oh-wrap">
      <div class="oh-final">
        <div class="oh-final-grid">
          <div>
            <p class="oh-eyebrow">Get started</p>
            <h2 class="oh-h2">See what your app is storing for nothing</h2>
            <ol class="oh-final-steps">
              <li v-for="step in steps" :key="step">{{ step }}</li>
            </ol>
            <div class="oh-actions">
              <a class="oh-btn oh-btn-primary" :href="withBase('/quick-start.html')">
                Quick start
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </a>
              <a class="oh-btn oh-btn-ghost" href="https://github.com/eramitgupta/laravel-orphan-files" target="_blank" rel="noreferrer">Star on GitHub</a>
            </div>
          </div>
          <div>
            <InstallBox />
            <p class="oh-final-req">Laravel 12 on PHP 8.2+, or Laravel 13 on PHP 8.3+. S3, MinIO and RustFS also need league/flysystem-aws-s3-v3.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
