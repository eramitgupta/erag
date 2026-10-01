<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { data as posts, type Post } from '../posts.data.mts'
import { packages } from '../packages'
import { formatDate } from '../format'

type FilterKind = 'all' | 'stack' | 'category' | 'package'
type Filter = { kind: FilterKind, value: string }

const activeFilter = ref<Filter>({ kind: 'all', value: '' })
const query = ref('')

const matchesStack = (post: Post, stack: string): boolean => packages[post.package]?.stack === stack
  || post.tags.includes(stack.toLowerCase())

const matchesFilter = (post: Post, filter: Filter): boolean => {
  switch (filter.kind) {
    case 'stack':
      return matchesStack(post, filter.value)
    case 'category':
      return post.category === filter.value
    case 'package':
      return post.package === filter.value
    default:
      return true
  }
}

const countFor = (filter: Filter): number => posts.filter((post) => matchesFilter(post, filter)).length

const groups = computed(() => [
  {
    title: 'Stack',
    options: ['Laravel', 'Inertia', 'Vue', 'React'].map((value) => ({ kind: 'stack' as const, value, label: value })),
  },
  {
    title: 'Type',
    options: ['Tutorial', 'Guide', 'Use case', 'Comparison', 'Best practices']
      .map((value) => ({ kind: 'category' as const, value, label: value })),
  },
  {
    title: 'Packages',
    options: Object.entries(packages).map(([value, info]) => ({ kind: 'package' as const, value, label: info.name })),
  },
].map((group) => ({
  ...group,
  options: group.options
    .map((option) => ({ ...option, count: countFor(option) }))
    .filter((option) => option.count > 0),
})))

const isActive = (filter: Filter): boolean => activeFilter.value.kind === filter.kind
  && activeFilter.value.value === filter.value

const selectFilter = (filter: Filter): void => {
  activeFilter.value = isActive(filter) ? { kind: 'all', value: '' } : { kind: filter.kind, value: filter.value }
}

const visiblePosts = computed(() => {
  const search = query.value.trim().toLowerCase()

  return posts.filter((post) => matchesFilter(post, activeFilter.value)
    && (!search || `${post.headline} ${post.description} ${post.tags.join(' ')}`.toLowerCase().includes(search)))
})

const packageName = (slug: string): string => packages[slug]?.name ?? ''
const packageColor = (slug: string): string => packages[slug]?.color ?? '#a996ff'
</script>

<template>
  <div class="blog-index">
    <header class="blog-hero">
      <span class="blog-kicker">The ERAG Blog</span>
      <h1>Build better Laravel apps, <span class="blog-hero-accent">one real problem at a time.</span></h1>
      <p>
        Hands-on guides for Laravel, Inertia, Vue and React. Every post starts with a problem you will actually run
        into, like fake sign-ups, messy phone numbers or untranslated error messages, and ends with working code you
        can drop into your app today.
      </p>
      <div class="blog-byline">
        <img src="https://avatars.githubusercontent.com/u/72160684?v=4&size=64" alt="" width="32" height="32">
        <span>by <strong>Amit Gupta</strong> · {{ posts.length }} articles</span>
      </div>
    </header>

    <div class="blog-layout">
      <aside class="blog-sidebar" aria-label="Filter articles">
        <input
          v-model="query"
          class="blog-search"
          type="search"
          placeholder="Search articles…"
          aria-label="Search articles"
        >

        <button
          type="button"
          class="blog-topic blog-topic-all"
          :aria-pressed="activeFilter.kind === 'all'"
          @click="activeFilter = { kind: 'all', value: '' }"
        >
          <span>All articles</span>
          <span class="blog-topic-count">{{ posts.length }}</span>
        </button>

        <nav v-for="group in groups" :key="group.title" class="blog-topic-group" :aria-label="group.title">
          <h2>{{ group.title }}</h2>
          <button
            v-for="option in group.options"
            :key="option.value"
            type="button"
            class="blog-topic"
            :aria-pressed="isActive(option)"
            @click="selectFilter(option)"
          >
            <span>{{ option.label }}</span>
            <span class="blog-topic-count">{{ option.count }}</span>
          </button>
        </nav>
      </aside>

      <section class="blog-list" aria-label="Articles">
        <p class="blog-list-summary">
          {{ visiblePosts.length }} {{ visiblePosts.length === 1 ? 'article' : 'articles' }}
        </p>

        <a v-for="post in visiblePosts" :key="post.url" class="blog-row" :href="withBase(post.url)">
          <div class="blog-row-tags">
            <span class="post-chip">{{ post.category }}</span>
            <span
              v-if="post.package"
              class="blog-card-package"
              :style="{ '--chip-color': packageColor(post.package) }"
            >{{ packageName(post.package) }}</span>
          </div>
          <h2>{{ post.headline }}</h2>
          <p>{{ post.description }}</p>
          <span class="blog-row-meta">
            <time :datetime="post.date">{{ formatDate(post.date) }}</time> · {{ post.readingMinutes }} min read
          </span>
        </a>

        <p v-if="!visiblePosts.length" class="blog-empty">No articles match your search.</p>
      </section>
    </div>
  </div>
</template>
