<script setup lang="ts">
import { useMusicStore } from '~/store/useMusicStore';
const musicStore = useMusicStore();
</script>

<template>
  <LayoutHeader class="safe-area-top" />
    <main :class="musicStore.isPro ? 'theme-1' : 'theme-2'">
      <slot />
    </main>
  <LayoutTabbar class="safr-area-bottom" />
</template>

<style scoped lang="scss"></style>
