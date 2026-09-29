<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, withBase } from 'vitepress'
import { data as posts } from '../posts.data.mts'
import { packages } from '../packages'

const route = useRoute()

const post = computed(() => posts.find((item) => withBase(item.url) === route.path))
const packageInfo = computed(() => (post.value ? packages[post.value.package] : undefined))

/**
 * Posts about the same package come first, then posts that share a tag, then the newest ones.
 */
const relatedPosts = computed(() => {
  const current = post.value

  if (!current) {
    return []
  }

  const score = (candidate: (typeof posts)[number]): number => {
    const sharedTags = candidate.tags.filter((tag) => current.tags.includes(tag)).length

    return (candidate.package === current.package ? 10 : 0) + sharedTags
  }

  return posts
    .filter((candidate) => candidate.url !== current.url)
    .map((candidate) => ({ candidate, score: score(candidate) }))
    .sort((first, second) => second.score - first.score)
    .slice(0, 3)
    .map(({ candidate }) => candidate)
})
</script>

<template>
  <div v-if="post" class="post-footer">
    <div v-if="packageInfo" class="post-package-card" :style="{ '--chip-color': packageInfo.color }">
      <div>
        <span class="post-package-label">Package used in this post</span>
        <strong>{{ packageInfo.name }}</strong>
      </div>
      <div class="post-package-actions">
        <a class="post-button post-button-primary" :href="packageInfo.docs">Read the docs</a>
        <a class="post-button" :href="packageInfo.repo" target="_blank" rel="noopener">GitHub</a>
      </div>
    </div>

    <div class="post-author">
      <img src="https://avatars.githubusercontent.com/u/72160684?v=4&size=128" alt="Amit Gupta" width="56" height="56">
      <div>
        <strong>Written by Amit Gupta</strong>
        <p>
          Full stack engineer and the maintainer of the Erag open source packages for Laravel, Inertia.js, Vue and
          React. He writes about the problems these packages were built to solve.
        </p>
      </div>
    </div>

    <section v-if="relatedPosts.length" class="post-related" aria-labelledby="related-heading">
      <h2 id="related-heading">Keep reading</h2>
      <div class="post-related-grid">
        <a v-for="item in relatedPosts" :key="item.url" class="post-related-card" :href="withBase(item.url)">
          <span>{{ item.category }} · {{ item.readingMinutes }} min read</span>
          <strong>{{ item.headline }}</strong>
        </a>
      </div>
    </section>
  </div>
</template>
