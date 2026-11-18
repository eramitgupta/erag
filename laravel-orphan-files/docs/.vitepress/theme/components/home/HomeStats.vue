<script setup lang="ts">
const stats = [
  { value: '4', label: 'Column types', detail: 'path, JSON, HTML and URL' },
  { value: '6', label: 'Artisan commands', detail: 'install, scan, clean, restore, purge-trash, explain' },
  { value: '0', label: 'Migrations', detail: 'nothing added to your database' },
  { value: '30 days', label: 'In the trash', detail: 'before purge-trash deletes it' },
]
</script>

<template>
  <section class="oh-stats-strip" aria-label="Package at a glance">
    <div v-for="stat in stats" :key="stat.label" class="oh-stat">
      <strong>{{ stat.value }}</strong>
      <span class="oh-stat-label">{{ stat.label }}</span>
      <span class="oh-stat-detail">{{ stat.detail }}</span>
    </div>
  </section>
</template>
