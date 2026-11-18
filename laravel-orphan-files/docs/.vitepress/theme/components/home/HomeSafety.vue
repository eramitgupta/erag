<script setup lang="ts">
import { withBase } from 'vitepress'

const guards = [
  {
    value: 'Dry run',
    title: 'Preview by default',
    text: 'orphan:clean without --force lists every file it would move and changes nothing.',
  },
  {
    value: 'Trash',
    title: 'Undo any clean',
    text: 'Files move to .orphan-trash/ on the same disk. orphan:restore puts them back at their old path.',
  },
  {
    value: '24 h',
    title: 'Grace period',
    text: 'Files changed in the 24 hours before the database was read are skipped, so fresh uploads are safe.',
  },
  {
    value: '90%',
    title: 'Safety limit',
    text: 'A clean stops if more than 90% of a disk would go. That almost always means a source is missing.',
  },
  {
    value: '30 days',
    title: 'Trash retention',
    text: 'orphan:purge-trash only deletes trashed files older than 30 days. You choose when it runs.',
  },
  {
    value: 'Read-only',
    title: 'Your tables stay as they are',
    text: 'Rows are only read, from the primary connection. Soft-deleted rows still keep their files.',
  },
  {
    value: 'Fails early',
    title: 'Config is checked first',
    text: 'A table or column that does not exist stops the run before a single file is touched.',
  },
  {
    value: 'Any host',
    title: 'Unlisted CDNs still protect',
    text: 'A URL on a host you never configured still keeps the file whose path it ends with.',
  },
]
</script>

<template>
  <section class="oh-section oh-band">
    <div class="oh-wrap">
      <div class="oh-head oh-head-split">
        <div>
          <p class="oh-eyebrow">Safe by default</p>
          <h2 class="oh-h2">Built so one wrong setting can't empty a bucket</h2>
        </div>
        <p class="oh-lead">
          Deleting files is the risky part, so every default leans towards keeping a file. And when a file does move,
          it can still come back.
        </p>
      </div>

      <ul class="oh-guards">
        <li v-for="guard in guards" :key="guard.title">
          <span class="oh-guard-value">{{ guard.value }}</span>
          <h3>{{ guard.title }}</h3>
          <p>{{ guard.text }}</p>
        </li>
      </ul>

      <p class="oh-more">
        <a :href="withBase('/guides/safety.html')">How to run it safely on production</a>
      </p>
    </div>
  </section>
</template>
