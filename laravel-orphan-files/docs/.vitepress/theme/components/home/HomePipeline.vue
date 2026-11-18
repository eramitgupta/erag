<script setup lang="ts">
import { withBase } from 'vitepress'

const stages = [
  {
    title: 'Read references',
    text: 'Reads every column you list as a source, 1,000 rows at a time, and keeps each file path as a hash.',
    meta: 'path, JSON, HTML and URL columns',
  },
  {
    title: 'List storage',
    text: 'Streams the file listing of each configured disk and folder, so a bucket with millions of objects is fine.',
    meta: 'local, public, S3, MinIO, RustFS',
  },
  {
    title: 'Compare',
    text: 'A file that no reference matches is an orphan, unless an exclusion, the grace period or a file rule keeps it.',
    meta: 'exclusions, grace period, size and type rules',
  },
  {
    title: 'Report or trash',
    text: 'A scan only reports. A clean previews the list, and with --force moves the files to .orphan-trash/.',
    meta: 'restore any file later',
  },
]
</script>

<template>
  <section class="oh-section oh-band">
    <div class="oh-wrap">
      <div class="oh-head oh-head-center">
        <p class="oh-eyebrow">How it works</p>
        <h2 class="oh-h2">Storage on one side, your database on the other</h2>
        <p class="oh-lead">
          Each run compares the two from scratch. No table of its own, no listeners on your models, nothing stored
          between runs.
        </p>
      </div>

      <ol class="oh-pipeline">
        <li v-for="(stage, index) in stages" :key="stage.title">
          <span class="oh-stage-num">{{ String(index + 1).padStart(2, '0') }}</span>
          <h3>{{ stage.title }}</h3>
          <p>{{ stage.text }}</p>
          <span class="oh-stage-meta">{{ stage.meta }}</span>
        </li>
      </ol>

      <p class="oh-more">
        <a :href="withBase('/introduction.html')">Read the full introduction</a>
      </p>
    </div>
  </section>
</template>
