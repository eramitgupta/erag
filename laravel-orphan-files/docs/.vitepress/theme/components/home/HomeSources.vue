<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'

/**
 * Each example is static, author-written HTML with a few highlight spans.
 * s = string, k = keyword or key, c = class name, m = comment, p = punctuation.
 */
interface SourceExample {
  id: string
  label: string
  hint: string
  title: string
  summary: string
  goodFor: string[]
  icon: string
  columnLabel: string
  column: string
  config: string
  keeps: string[]
  link: string
}

const examples: SourceExample[] = [
  {
    id: 'path',
    label: 'Path',
    hint: 'one file per row',
    title: 'Path columns',
    summary: 'A column that holds one disk-relative path. The most common case.',
    goodFor: ['Avatars and logos', 'Cover images', 'Uploaded documents'],
    icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
    columnLabel: 'users.avatar',
    column: 'avatars/jane-v2.jpg',
    config: `[<span class="t-s">'table'</span> <span class="t-p">=></span> <span class="t-s">'users'</span>, <span class="t-s">'column'</span> <span class="t-p">=></span> <span class="t-s">'avatar'</span>, <span class="t-s">'type'</span> <span class="t-p">=></span> <span class="t-s">'path'</span>, <span class="t-s">'disk'</span> <span class="t-p">=></span> <span class="t-s">'public'</span>]`,
    keeps: ['avatars/jane-v2.jpg'],
    link: '/configuration/sources.html',
  },
  {
    id: 'json',
    label: 'JSON',
    hint: 'lists of files',
    title: 'JSON columns',
    summary: 'A JSON column with several files. A key like *.path picks the values, or leave it out to collect every string.',
    goodFor: ['Galleries', 'Attachment lists', 'Media stored as arrays'],
    icon: '<path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/>',
    columnLabel: 'comments.images',
    column: `[{"path": "comments/a1.jpg"}, {"path": "comments/a2.jpg"}]`,
    config: `[<span class="t-s">'model'</span> <span class="t-p">=></span> <span class="t-c">Comment</span>::<span class="t-k">class</span>, <span class="t-s">'column'</span> <span class="t-p">=></span> <span class="t-s">'images'</span>, <span class="t-s">'type'</span> <span class="t-p">=></span> <span class="t-s">'json'</span>, <span class="t-s">'key'</span> <span class="t-p">=></span> <span class="t-s">'*.path'</span>]`,
    keeps: ['comments/a1.jpg', 'comments/a2.jpg'],
    link: '/configuration/sources.html',
  },
  {
    id: 'html',
    label: 'HTML',
    hint: 'rich text',
    title: 'HTML columns',
    summary: 'Rich text from an editor. Paths are read from src, href, srcset, poster, inline CSS url() and plain links.',
    goodFor: ['Blog posts', 'CMS pages', 'Product descriptions'],
    icon: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    columnLabel: 'posts.body',
    column: `&lt;p&gt;Launch day&lt;/p&gt;
&lt;img src="/storage/posts/launch.jpg" srcset="/storage/posts/launch@2x.jpg 2x"&gt;`,
    config: `[<span class="t-s">'table'</span> <span class="t-p">=></span> <span class="t-s">'posts'</span>, <span class="t-s">'column'</span> <span class="t-p">=></span> <span class="t-s">'body'</span>, <span class="t-s">'type'</span> <span class="t-p">=></span> <span class="t-s">'html'</span>]`,
    keeps: ['posts/launch.jpg', 'posts/launch@2x.jpg'],
    link: '/configuration/sources.html',
  },
  {
    id: 'url',
    label: 'URL',
    hint: 'CDN and full links',
    title: 'URL columns',
    summary: 'A full URL from Storage::url(), a CDN or a signed link. The disk URL and S3 endpoints are known already; add a CDN once.',
    goodFor: ['CDN links', 'Imported product data', 'Signed S3 URLs'],
    icon: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    columnLabel: 'products.image_url',
    column: 'https://cdn.example.com/products/42/front.jpg',
    config: `[<span class="t-s">'table'</span> <span class="t-p">=></span> <span class="t-s">'products'</span>, <span class="t-s">'column'</span> <span class="t-p">=></span> <span class="t-s">'image_url'</span>, <span class="t-s">'type'</span> <span class="t-p">=></span> <span class="t-s">'url'</span>, <span class="t-s">'disk'</span> <span class="t-p">=></span> <span class="t-s">'s3'</span>]

<span class="t-m">// once, for the CDN in front of the bucket</span>
<span class="t-s">'url_prefixes'</span> <span class="t-p">=></span> [<span class="t-s">'s3'</span> <span class="t-p">=></span> [<span class="t-s">'https://cdn.example.com/'</span>]]`,
    keeps: ['products/42/front.jpg on s3'],
    link: '/configuration/urls.html',
  },
  {
    id: 'model',
    label: 'On the model',
    hint: 'no config needed',
    title: 'The HasStorageFiles trait',
    summary: 'Prefer to keep it next to the model? Add the trait. Models in app/Models are picked up without any config.',
    goodFor: ['Keeping file columns with the model', 'Mixing path, JSON and HTML columns', 'Teams that avoid big config files'],
    icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>',
    columnLabel: 'app/Models/Post.php',
    column: `<span class="t-k">use</span> <span class="t-c">HasStorageFiles</span>;

<span class="t-k">protected array</span> $storageFiles = [
    <span class="t-s">'cover'</span>   <span class="t-p">=></span> <span class="t-s">'path'</span>,
    <span class="t-s">'gallery'</span> <span class="t-p">=></span> [<span class="t-s">'type'</span> <span class="t-p">=></span> <span class="t-s">'json'</span>, <span class="t-s">'key'</span> <span class="t-p">=></span> <span class="t-s">'*.path'</span>],
    <span class="t-s">'body'</span>    <span class="t-p">=></span> <span class="t-s">'html'</span>,
];`,
    config: '<span class="t-m">// nothing to add: models in app/Models are found on their own</span>',
    keeps: ['every path in posts.cover', 'every gallery[*].path', 'every file linked in posts.body'],
    link: '/configuration/models.html',
  },
]

const activeId = ref(examples[0].id)
const active = computed(() => examples.find((example) => example.id === activeId.value) ?? examples[0])
const isModel = computed(() => active.value.id === 'model')
</script>

<template>
  <section class="oh-section">
    <div class="oh-wrap">
      <div class="oh-head oh-head-split">
        <div>
          <p class="oh-eyebrow">Where paths live</p>
          <h2 class="oh-h2">It reads file paths the way your app stores them</h2>
        </div>
        <p class="oh-lead">
          Plain paths, JSON arrays, rich text and full URLs. Pick a column type to see what goes in the config and
          which files it keeps.
        </p>
      </div>

      <div class="oh-src-tabs" role="tablist" aria-label="Source types">
        <button
          v-for="example in examples"
          :id="`src-tab-${example.id}`"
          :key="example.id"
          type="button"
          role="tab"
          class="oh-src-tab"
          :class="{ 'is-active': example.id === activeId }"
          :aria-selected="example.id === activeId"
          :aria-controls="`src-panel-${example.id}`"
          @click="activeId = example.id"
        >
          <span class="oh-src-tab-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" v-html="example.icon" />
          </span>
          <span class="oh-src-tab-text">
            <strong>{{ example.label }}</strong>
            <span>{{ example.hint }}</span>
          </span>
        </button>
      </div>

      <div
        :id="`src-panel-${active.id}`"
        class="oh-src-panel"
        role="tabpanel"
        :aria-labelledby="`src-tab-${active.id}`"
      >
        <aside class="oh-src-info">
          <span class="oh-src-info-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" v-html="active.icon" />
          </span>
          <h3>{{ active.title }}</h3>
          <p>{{ active.summary }}</p>
          <span class="oh-src-good">Good for</span>
          <ul>
            <li v-for="item in active.goodFor" :key="item">{{ item }}</li>
          </ul>
          <a class="oh-source-link" :href="withBase(active.link)">How this type works</a>
        </aside>

        <ol class="oh-src-steps">
          <li>
            <span class="oh-src-step-label">{{ isModel ? 'On the model' : 'In your database' }}</span>
            <div class="oh-code">
              <span class="oh-code-title">{{ active.columnLabel }}</span>
              <pre v-html="active.column" />
            </div>
          </li>
          <li>
            <span class="oh-src-step-label">In the config</span>
            <div class="oh-code">
              <span class="oh-code-title">config/orphan-files.php</span>
              <pre v-html="active.config" />
            </div>
          </li>
          <li>
            <span class="oh-src-step-label">Files it keeps</span>
            <ul class="oh-keeps">
              <li v-for="file in active.keeps" :key="file">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                <code>{{ file }}</code>
              </li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>
