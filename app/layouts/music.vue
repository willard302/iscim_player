<script setup lang="ts">
import ListHeader from '~/pages/music/components/ListHeader.vue';
import { useMusicStore } from '~/store/useMusicStore';
const musicStore = useMusicStore();
</script>

<template>
  <ListHeader />
    <main :class="musicStore.isPro ? 'theme-1' : 'theme-2'">
      <slot />
    </main>
  <LayoutTabbar />
</template>

<style scoped lang="scss">
  * {
    --van-nav-bar-z-index: 9999;
  }
</style>
