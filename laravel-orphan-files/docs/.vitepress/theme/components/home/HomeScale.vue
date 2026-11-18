<script setup lang="ts">
import { withBase } from 'vitepress'

const stats = [
  { value: '1,000', label: 'rows per database chunk, read by primary key' },
  { value: '~25 MB', label: 'of memory for 250,000 referenced paths, measured on PHP 8.4' },
  { value: 'Temp table', label: 'takes over past 250,000 references, and is dropped after the run' },
  { value: '1,000', label: 'keys per S3 delete request. Trash mode moves files inside the bucket' },
]

const extras = [
  { flag: '--queue', text: 'run a scan or clean as a queued job' },
  { flag: '--json', text: 'print the scan summary for scripts and alerts' },
  { flag: '--export=csv', text: 'write every orphan to a CSV file' },
  { flag: '--older-than=7d', text: 'replace the grace period for one run' },
]
</script>

<template>
  <section class="oh-section oh-band">
    <div class="oh-wrap oh-split oh-split-even">
      <div>
        <p class="oh-eyebrow">Large buckets</p>
        <h2 class="oh-h2">Made for millions of files</h2>
        <p class="oh-lead">
          Tables are read in chunks and storage listings are streamed, so memory stays flat as your storage grows.
        </p>

        <dl class="oh-stats">
          <div v-for="stat in stats" :key="stat.label">
            <dt>{{ stat.value }}</dt>
            <dd>{{ stat.label }}</dd>
          </div>
        </dl>

        <p class="oh-more">
          <a :href="withBase('/configuration/performance.html')">Performance, queue and export</a>
        </p>
      </div>

      <div>
        <p class="oh-eyebrow">Automate it</p>
        <h2 class="oh-h2">Put it on the scheduler</h2>
        <p class="oh-lead">Scan weekly, clean on a quiet night, and empty old trash every day.</p>

        <div class="oh-code oh-code-lg">
          <span class="oh-code-title">routes/console.php</span>
          <pre><span class="t-c">Schedule</span>::<span class="t-k">command</span>(<span class="t-s">'orphan:scan --json'</span>)-><span class="t-k">weekly</span>();

<span class="t-c">Schedule</span>::<span class="t-k">command</span>(<span class="t-s">'orphan:clean --force'</span>)
    -><span class="t-k">weekly</span>()-><span class="t-k">sundays</span>()-><span class="t-k">at</span>(<span class="t-s">'03:00'</span>)
    -><span class="t-k">withoutOverlapping</span>();

<span class="t-c">Schedule</span>::<span class="t-k">command</span>(<span class="t-s">'orphan:purge-trash'</span>)-><span class="t-k">daily</span>();</pre>
        </div>

        <ul class="oh-flags">
          <li v-for="extra in extras" :key="extra.flag">
            <code>{{ extra.flag }}</code>
            <span>{{ extra.text }}</span>
          </li>
        </ul>

        <p class="oh-small">
          Events for alerts: <code>OrphanScanCompleted</code>, <code>OrphanFilesTrashed</code> and
          <code>OrphanFilesDeleted</code>. Prefer PHP? <a :href="withBase('/guides/code.html')">Call it from code</a>.
        </p>
      </div>
    </div>
  </section>
</template>
