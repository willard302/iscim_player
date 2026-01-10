<script setup lang="ts">
import type { PolicyPart } from '~/types/data.types';
  const Props = defineProps<{
    title: string
    titleClass?: string
    article: PolicyPart[]
  }>()
</script>

<template>
  <div class="custom-button">
    <div :class="titleClass">{{ $t(title) }}</div>

    <div v-for="(t, tIdx) in article" :key="tIdx">
      <van-divider>{{ $t(t.title) }}</van-divider>
      <p v-if="t.content">{{ $t(t.content) }}</p>
      <p v-if="t.contents" v-for="(c, cIdx) in t.contents" :key="cIdx">{{ $t(c) }}</p>
      <ul v-if="t.lists">
        <li v-for="(l, lIdx) in t.lists" :key="lIdx">{{ $t(l) }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
* {
  --van-divider-text-color: $color9;
  --van-divider-border-color: $color9;
  --van-divider-font-size: 1rem;
}
.van-button {
  margin-top: 20px;
}

.title {
  text-align: center;
}
</style>
