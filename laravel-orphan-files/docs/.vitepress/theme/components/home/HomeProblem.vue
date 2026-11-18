<script setup lang="ts">
const causes = [
  {
    title: 'A user replaces their avatar',
    text: 'The row now points to the new file. The old one stays on the disk.',
  },
  {
    title: 'A post is deleted',
    text: 'The row is gone, but its cover and gallery images are still in storage.',
  },
  {
    title: 'An image is removed from rich text',
    text: 'The editor drops the img tag. The uploaded file is never cleaned up.',
  },
  {
    title: 'An upload is never saved',
    text: 'The file is stored before the form is submitted, and the form is abandoned.',
  },
]

const files = [
  { path: 'avatars/jane-v2.jpg', orphan: false, note: 'users.avatar, row 12' },
  { path: 'avatars/jane-v1.jpg', orphan: true, note: 'replaced by a new avatar' },
  { path: 'posts/launch.jpg', orphan: false, note: 'img tag in posts.body, row 7' },
  { path: 'posts/old-banner.jpg', orphan: true, note: 'its post was deleted' },
  { path: 'comments/a1.jpg', orphan: false, note: 'comments.images, row 31' },
  { path: 'comments/tmp-4821.png', orphan: true, note: 'the form was never saved' },
]
</script>

<template>
  <section class="oh-section">
    <div class="oh-wrap oh-split">
      <div>
        <p class="oh-eyebrow">The problem</p>
        <h2 class="oh-h2">Every app with uploads leaks files</h2>
        <p class="oh-lead">
          Laravel stores the file and your table stores its path. When the row changes or goes away, nothing removes
          the file. Over months these orphans add up to gigabytes you pay for and back up.
        </p>

        <ul class="oh-causes">
          <li v-for="(cause, index) in causes" :key="cause.title">
            <span class="oh-cause-num">{{ index + 1 }}</span>
            <div>
              <h3>{{ cause.title }}</h3>
              <p>{{ cause.text }}</p>
            </div>
          </li>
        </ul>
      </div>

      <div class="oh-diagram" aria-label="Example: three of six files on the public disk have no row pointing at them">
        <div class="oh-diagram-head">
          <span>public disk</span>
          <span class="oh-tag">Example</span>
        </div>
        <ul class="oh-files">
          <li v-for="file in files" :key="file.path" :class="{ 'is-orphan': file.orphan }">
            <svg class="oh-file-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
            <div class="oh-file-text">
              <code>{{ file.path }}</code>
              <span>{{ file.note }}</span>
            </div>
            <span class="oh-status">{{ file.orphan ? 'orphan' : 'in use' }}</span>
          </li>
        </ul>
        <p class="oh-diagram-foot">
          <strong>3 of 6 files</strong> have no row pointing at them. In the recording above it was 160 of 320 images on a MinIO bucket, or 593.1 MB.
        </p>
      </div>
    </div>
  </section>
</template>
