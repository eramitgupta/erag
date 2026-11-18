<script setup lang="ts">
import { withBase } from 'vitepress'

/** Icon paths are drawn on a 24x24 stroke grid. */
const items = [
  {
    title: 'Exclusions and globs',
    tag: 'exclude_patterns',
    text: 'Paths and patterns like defaults/* or *.pdf are never cleaned.',
    link: '/configuration/filters.html',
    icon: '<circle cx="12" cy="12" r="9"/><line x1="5.6" y1="5.6" x2="18.4" y2="18.4"/>',
  },
  {
    title: 'Size and type rules',
    tag: 'only_extensions',
    text: 'Only clean files within a size range, or with the extensions you pick.',
    link: '/configuration/filters.html',
    icon: '<line x1="4" y1="6" x2="20" y2="6"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/>',
  },
  {
    title: 'Custom filters',
    tag: 'FileFilter',
    text: 'Your own FileFilter class can return a reason to keep any file.',
    link: '/extending/filters.html',
    icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  },
  {
    title: 'Custom source types',
    tag: 'extractors',
    text: 'Add an extractor for a format your app invented, next to path, json, html and url.',
    link: '/extending/extractors.html',
    icon: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  },
  {
    title: 'Normalizers',
    tag: 'normalizers',
    text: 'Teach it another way your app writes paths. They can only add files to keep.',
    link: '/extending/normalizers.html',
    icon: '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
  },
  {
    title: 'Scoped and prefixed disks',
    tag: 'prefix',
    text: "A disk's root and a scoped disk's prefix are used when matching URLs and deleting.",
    link: '/faq.html',
    icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><rect x="8" y="8" width="8" height="8" rx="1"/>',
  },
  {
    title: 'Case-insensitive storage',
    tag: 'case_sensitive',
    text: 'Set case_sensitive to false for macOS volumes or a case-insensitive MySQL collation.',
    link: '/configuration/urls.html',
    icon: '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>',
  },
  {
    title: 'Trash on another disk',
    tag: 'trash.disk',
    text: 'Point trash.disk at a separate disk, and set how many days the trash is kept.',
    link: '/configuration/cleanup.html',
    icon: '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>',
  },
  {
    title: 'Restore by path or date',
    tag: '--date',
    text: 'Bring back one file, a whole folder, or only the copy trashed on a given day.',
    link: '/commands/restore.html',
    icon: '<polyline points="1 4 1 10 7 10"/><path d="M3.5 15a9 9 0 1 0 2.1-9.4L1 10"/>',
  },
  {
    title: 'Delete mode',
    tag: '--mode=delete',
    text: 'Skip the trash with --mode=delete. S3 objects are removed 1,000 keys per request.',
    link: '/commands/clean.html',
    icon: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  },
  {
    title: 'Facade and events',
    tag: 'OrphanFiles::',
    text: 'Call scan, clean and explain from PHP, and listen for trashed or deleted files.',
    link: '/guides/code.html',
    icon: '<path d="M4 4h16v16H4z"/><polyline points="9 9 12 12 9 15"/><line x1="13" y1="15" x2="16" y2="15"/>',
  },
  {
    title: 'Spot broken references',
    tag: 'explain',
    text: 'orphan:explain also tells you when a row points to a file that is missing from the disk.',
    link: '/commands/explain.html',
    icon: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/><line x1="3" y1="3" x2="21" y2="21"/>',
  },
]
</script>

<template>
  <section class="oh-section oh-band">
    <div class="oh-wrap">
      <div class="oh-head oh-head-split">
        <div>
          <p class="oh-eyebrow">Also included</p>
          <h2 class="oh-h2">The details real apps need</h2>
        </div>
        <p class="oh-lead">
          Every app stores files a little differently. These cover the setups that usually break a simple cleanup.
        </p>
      </div>

      <ul class="oh-more-grid">
        <li v-for="item in items" :key="item.title">
          <a :href="withBase(item.link)">
            <span class="oh-more-top">
              <span class="oh-more-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" v-html="item.icon" />
              </span>
              <code class="oh-more-tag">{{ item.tag }}</code>
            </span>
            <strong>{{ item.title }}</strong>
            <span class="oh-more-text">{{ item.text }}</span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>
