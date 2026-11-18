<script setup lang="ts">
import DemoGif from '../DemoGif.vue'
import HomeAgents from './HomeAgents.vue'
import HomeCommands from './HomeCommands.vue'
import HomeCompare from './HomeCompare.vue'
import HomeFaq from './HomeFaq.vue'
import HomeFinal from './HomeFinal.vue'
import HomeHero from './HomeHero.vue'
import HomeMore from './HomeMore.vue'
import HomePipeline from './HomePipeline.vue'
import HomeProblem from './HomeProblem.vue'
import HomeSafety from './HomeSafety.vue'
import HomeScale from './HomeScale.vue'
import HomeSources from './HomeSources.vue'
import HomeStats from './HomeStats.vue'
</script>

<template>
  <div class="oh">
    <HomeHero />
    <!-- Framed column with rails and corner marks, like the other erag docs -->
    <div class="oh-frame">
      <DemoGif />
      <HomeStats />
      <HomeProblem />
      <HomePipeline />
      <HomeSources />
      <HomeSafety />
      <HomeCompare />
      <HomeMore />
      <HomeCommands />
      <HomeScale />
      <HomeAgents />
      <HomeFaq />
    </div>
    <HomeFinal />
  </div>
</template>
