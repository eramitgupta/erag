<script setup lang="ts">
import { withBase } from 'vitepress'

const alt = 'On a MinIO bucket with 320 images, orphan:scan finds 160 orphans taking 593.1 MB. orphan:clean previews them, clean --force moves them to the trash, purge-trash --all deletes them, and a second scan shows 0 orphans'
</script>

<template>
  <section id="demo" class="oh-demo">
    <div class="oh-wrap">
      <figure>
        <div class="oh-term oh-term-demo">
          <div class="oh-term-bar" aria-hidden="true">
            <span class="oh-dot" /><span class="oh-dot" /><span class="oh-dot" />
            <span class="oh-term-title">MinIO bucket: scan, preview, clean, purge, scan again</span>
          </div>
          <!-- One recording per colour mode; CSS shows the one that matches the docs theme. -->
          <img
            class="oh-demo-gif oh-demo-gif-dark"
            :src="withBase('/demo.gif')"
            width="1320"
            height="600"
            loading="lazy"
            :alt="alt"
          >
          <img
            class="oh-demo-gif oh-demo-gif-light"
            :src="withBase('/demo-light.gif')"
            width="1320"
            height="600"
            loading="lazy"
            :alt="alt"
          >
        </div>
        <figcaption>
          A real run on a MinIO bucket: 320 images (1.27 GB), 160 still referenced, 160 orphans taking 593.1 MB.
          <code>orphan:clean --force</code> moves them to the trash, <code>orphan:purge-trash --all</code> deletes them,
          and the second scan finds nothing left.
        </figcaption>
      </figure>
    </div>
  </section>
</template>
