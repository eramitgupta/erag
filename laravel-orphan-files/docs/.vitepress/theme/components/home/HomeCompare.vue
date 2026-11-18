<script setup lang="ts">
const rows = [
  { need: 'Plain path columns like users.avatar', script: 'yes' },
  { need: 'Paths inside JSON columns', script: 'write' },
  { need: 'Images inside rich text (src, srcset, CSS url())', script: 'write' },
  { need: 'Full URLs from Storage::url(), a CDN or a signed link', script: 'write' },
  { need: 'Skip uploads whose row is not saved yet', script: 'write' },
  { need: 'Stop when a missing source would empty a disk', script: 'write' },
  { need: 'Undo: restore a file to its old path', script: 'write' },
  { need: 'Stream an S3 bucket with millions of objects', script: 'write' },
  { need: 'Explain why one file is kept or removed', script: 'write' },
]
</script>

<template>
  <section class="oh-section">
    <div class="oh-wrap">
      <div class="oh-head oh-head-center">
        <p class="oh-eyebrow">Why a package</p>
        <h2 class="oh-h2">A quick script finds the easy cases</h2>
        <p class="oh-lead">
          Comparing one column with one folder takes ten lines. The cases that delete live files are the ones you only
          find later.
        </p>
      </div>

      <div class="oh-compare" role="table" aria-label="A cleanup script compared with Laravel Orphan Files">
        <div class="oh-compare-row oh-compare-head" role="row">
          <span role="columnheader">What it has to handle</span>
          <span role="columnheader">Your own script</span>
          <span role="columnheader" class="oh-compare-us">Laravel Orphan Files</span>
        </div>
        <div v-for="row in rows" :key="row.need" class="oh-compare-row" role="row">
          <span role="cell">{{ row.need }}</span>
          <span role="cell" class="oh-compare-them">
            <template v-if="row.script === 'yes'">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
              <span class="oh-sr">Yes</span>
            </template>
            <template v-else>You write it</template>
          </span>
          <span role="cell" class="oh-compare-us">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
            <span class="oh-sr">Included</span>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
