<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import { data as posts } from '../posts.data.mts'
import { packages } from '../packages'
import { formatDate } from '../format'

const { frontmatter } = useData()
const route = useRoute()

const post = computed(() => posts.find((item) => withBase(item.url) === route.path))
const packageInfo = computed(() => packages[frontmatter.value.package])
</script>

<template>
  <div v-if="post" class="post-meta">
    <a class="post-meta-back" :href="withBase('/')">← All posts</a>
    <div class="post-meta-tags">
      <span class="post-chip">{{ post.category }}</span>
      <a
        v-if="packageInfo"
        class="post-chip post-chip-package"
        :style="{ '--chip-color': packageInfo.color }"
        :href="packageInfo.docs"
      >{{ packageInfo.name }}</a>
    </div>
    <h1 class="post-title">{{ post.headline }}</h1>
    <p class="post-lead">{{ post.description }}</p>
    <div class="post-byline">
      <img src="https://avatars.githubusercontent.com/u/72160684?v=4&size=64" alt="" width="36" height="36">
      <div>
        <strong>Amit Gupta</strong>
        <span>
          <time :datetime="post.date">{{ formatDate(post.date) }}</time>
          · {{ post.readingMinutes }} min read
        </span>
      </div>
    </div>
  </div>
</template>
