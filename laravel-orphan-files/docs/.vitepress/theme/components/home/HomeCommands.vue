<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'

/**
 * Outputs are copied from runs on the demo app (see the command pages).
 * They are plain text, rendered with {{ }} so nothing is parsed as HTML.
 */
const commands = [
  {
    name: 'orphan:install',
    text: 'Create config/orphan-files.php and see the next steps.',
    run: 'php artisan orphan:install',
    output: `   INFO  Published config/orphan-files.php.

  Next steps
  1. In config/orphan-files.php, list your upload folders under 'disks' and the columns that store file paths under 'sources'.
  2. Run php artisan orphan:scan to see how many orphaned files you have.
  3. Run php artisan orphan:clean for a dry run, then php artisan orphan:clean --force to move the orphans to the trash.

  Docs: https://erag.in/laravel-orphan-files/`,
    link: '/commands/install.html',
  },
  {
    name: 'orphan:scan',
    text: 'Count orphans per disk. Read-only.',
    run: 'php artisan orphan:scan',
    output: `+--------+---------------------+-------+------------+---------+-----------+-----------+-------------+--------+
| Disk   | Directories         | Files | Referenced | Orphans | Protected | Cleanable | Reclaimable | Ratio  |
+--------+---------------------+-------+------------+---------+-----------+-----------+-------------+--------+
| public | avatars/, comments/ | 43    | 23         | 20      | 0         | 20        | 6.8 MB      | 46.51% |
+--------+---------------------+-------+------------+---------+-----------+-----------+-------------+--------+

   WARN  20 orphaned files (6.8 MB) can be cleaned. Preview with: php artisan orphan:clean.`,
    link: '/commands/scan.html',
  },
  {
    name: 'orphan:clean',
    text: 'Preview the files, then --force to trash them.',
    run: 'php artisan orphan:clean',
    output: `  public:avatars/maya-patel-old.jpg ................................ 444.7 KB
  public:avatars/sofia-rossi-old.jpg ............................... 543.9 KB
  ...
  public:comments/2026/09/IMG_9876.jpg ............................. 257.6 KB
  … and 5 more (use -v to list every file).

   INFO  Dry run: nothing was changed. Re-run with --force to trash 20 files.`,
    link: '/commands/clean.html',
  },
  {
    name: 'orphan:explain',
    text: 'Ask why one file is kept or cleaned.',
    run: 'php artisan orphan:explain avatars/maya-patel.jpg',
    output: `  File ............................... avatars/maya-patel.jpg on [public]
  Exists ............................ yes, 297.1 KB, modified 1 month ago
  Scanned directories ............................... avatars/, comments/
  Sources checked ..................................................... 2
+--------------+------+-----+------------------------+
| Source       | Type | Row | Value                  |
+--------------+------+-----+------------------------+
| users.avatar | path | 2   | avatars/maya-patel.jpg |
+--------------+------+-----+------------------------+

   INFO  Kept: referenced by 1 row.`,
    link: '/commands/explain.html',
  },
  {
    name: 'orphan:restore',
    text: 'List the trash or put files back.',
    run: 'php artisan orphan:restore --list',
    output: `+------------+-------------------------------+----------+
| Trashed on | Original path                 | Size     |
+------------+-------------------------------+----------+
| 2026-11-15 | comments/2026/09/IMG_8675.jpg | 615.1 KB |
| 2026-11-15 | comments/2026/09/IMG_3915.jpg | 268.1 KB |
| 2026-11-15 | comments/2026/09/IMG_2996.jpg | 210.2 KB |
+------------+-------------------------------+----------+`,
    link: '/commands/restore.html',
  },
  {
    name: 'orphan:purge-trash',
    text: 'Empty trash older than the retention period.',
    run: 'php artisan orphan:purge-trash --all --dry-run',
    output: '   INFO  Dry run: 19 trashed files (6.4 MB) would be purged.',
    link: '/commands/purge-trash.html',
  },
]

const activeName = ref(commands[0].name)
const active = computed(() => commands.find((command) => command.name === activeName.value) ?? commands[0])
</script>

<template>
  <section class="oh-section">
    <div class="oh-wrap">
      <div class="oh-head">
        <p class="oh-eyebrow">Six commands</p>
        <h2 class="oh-h2">Everything runs from Artisan</h2>
        <p class="oh-lead">No web UI, no migrations. Pick a command to see what it prints on the demo app.</p>
      </div>

      <div class="oh-cmds">
        <div class="oh-cmd-list" role="tablist" aria-label="Commands">
          <button
            v-for="command in commands"
            :key="command.name"
            type="button"
            role="tab"
            class="oh-cmd"
            :class="{ 'is-active': command.name === activeName }"
            :aria-selected="command.name === activeName"
            @click="activeName = command.name"
          >
            <code>{{ command.name }}</code>
            <span>{{ command.text }}</span>
          </button>
        </div>

        <div class="oh-term" role="tabpanel">
          <div class="oh-term-bar" aria-hidden="true">
            <span class="oh-dot" /><span class="oh-dot" /><span class="oh-dot" />
            <span class="oh-term-title">demo app</span>
          </div>
          <div class="oh-term-body">
            <p class="oh-term-run"><span>$</span> {{ active.run }}</p>
            <pre>{{ active.output }}</pre>
          </div>
          <a class="oh-term-link" :href="withBase(active.link)">All {{ active.name }} options</a>
        </div>
      </div>
    </div>
  </section>
</template>
