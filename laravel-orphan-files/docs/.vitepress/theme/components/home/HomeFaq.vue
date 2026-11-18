<script setup lang="ts">
import { withBase } from 'vitepress'

const questions = [
  {
    q: 'Is it safe to run on production?',
    a: 'By default it only reports. A clean needs --force and moves files to a trash folder you can restore from. Files changed in the last 24 hours are skipped, and a run stops if more than 90% of a disk would go. Start with a scan and check a few files with orphan:explain.',
  },
  {
    q: 'Does it change my database?',
    a: 'No. It only reads your tables. Very large runs create one temporary table, which is dropped at the end. Set diff.driver to memory if you would rather avoid it.',
  },
  {
    q: 'Does it load the whole table or bucket into memory?',
    a: 'No. Tables are read 1,000 rows at a time and storage listings are streamed. Referenced paths are kept as hashes, about 25 MB for 250,000 of them, and move to a temporary table past diff.memory_limit.',
  },
  {
    q: 'Does saving or deleting a model remove files?',
    a: 'No. The HasStorageFiles trait only declares which columns hold files. Files are only removed when you run orphan:clean --force.',
  },
  {
    q: 'Do soft-deleted rows keep their files?',
    a: 'Yes. Global scopes are ignored, so a soft-deleted row still counts as a reference. Restoring the row should bring its file back too.',
  },
  {
    q: 'How are S3 files removed?',
    a: 'Trash mode moves them inside the bucket, so they never leave S3. Delete mode uses DeleteObjects with up to 1,000 keys per request.',
  },
  {
    q: 'Where does the trash live?',
    a: 'In .orphan-trash/{disk}/{date}/{original path}, on the same disk or on the disk you set as trash.disk. Scans never look inside it, and orphan:purge-trash empties it after 30 days.',
  },
  {
    q: 'Which Laravel and PHP versions are supported?',
    a: 'Laravel 12 on PHP 8.2 or newer, and Laravel 13 on PHP 8.3 or newer. S3, MinIO and RustFS disks also need league/flysystem-aws-s3-v3.',
  },
]
</script>

<template>
  <section class="oh-section">
    <div class="oh-wrap">
      <div class="oh-head oh-head-center">
        <p class="oh-eyebrow">Questions</p>
        <h2 class="oh-h2">What people ask before the first clean</h2>
      </div>

      <div class="oh-faq">
        <details v-for="(item, index) in questions" :key="item.q" :open="index === 0">
          <summary>
            <span>{{ item.q }}</span>
            <span class="oh-faq-icon" aria-hidden="true" />
          </summary>
          <p>{{ item.a }}</p>
        </details>
      </div>

      <p class="oh-faq-more">
        Something else? Read the <a :href="withBase('/faq.html')">full FAQ</a>, the
        <a :href="withBase('/troubleshooting.html')">troubleshooting guide</a>, or
        <a href="https://github.com/eramitgupta/laravel-orphan-files/issues" target="_blank" rel="noreferrer">open an issue</a>.
      </p>
    </div>
  </section>
</template>
