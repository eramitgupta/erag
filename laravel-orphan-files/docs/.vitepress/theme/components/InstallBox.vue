<script setup lang="ts">
import { useCopy } from '../composables/useCopy'

const commands = [
  { cmd: 'composer require erag/laravel-orphan-files' },
  { cmd: 'php artisan orphan:install', note: 'creates config/orphan-files.php' },
  { cmd: 'php artisan orphan:scan', note: 'read-only, changes nothing' },
]

const { copied, copy } = useCopy()

function copyAll(): void {
  copy(commands.map((line) => line.cmd).join('\n'))
}
</script>

<template>
  <div class="oh-term oh-install">
    <div class="oh-term-bar">
      <span class="oh-dot" aria-hidden="true" /><span class="oh-dot" aria-hidden="true" /><span class="oh-dot" aria-hidden="true" />
      <span class="oh-term-title">terminal</span>
      <button type="button" class="oh-copy" @click="copyAll">
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
    </div>
    <pre class="oh-install-pre"><code><span v-for="line in commands" :key="line.cmd" class="oh-line"><span class="oh-prompt">$ </span>{{ line.cmd }}<span v-if="line.note" class="oh-comment">  # {{ line.note }}</span></span></code></pre>
  </div>
</template>
