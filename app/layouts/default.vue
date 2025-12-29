<script setup lang="ts">
import { useMusicStore } from '~/store/useMusicStore';
const musicStore = useMusicStore();
const route = useRoute();
const showHeader = computed(() => route.meta.showHeader ?? true);
const showTabbar = computed(() => route.meta.showTabbar ?? true);
</script>

<template>
  <LayoutHeader v-if="showHeader" class="safe-area-top" />
    <main :class="musicStore.isPro ? 'theme-1' : 'theme-2'">
      <slot />
    </main>
  <LayoutTabbar v-if="showTabbar" class="safr-area-bottom" />
</template>

<style scoped lang="scss">
  * {
    --van-nav-bar-z-index: 9999;
  }
</style>
