<script setup lang="ts">
const musicStore = useMusicStore();
const route = useRoute();
const showHeader = computed(() => route.meta.showHeader ?? true);
const showTabbar = computed(() => route.meta.showTabbar ?? true);
</script>

<template>
  <div class="layout">
    <LayoutHeader v-if="showHeader" class="safe-area-top" />
    <main :class="musicStore.isPro ? 'theme-1' : 'theme-2'">
      <slot />
    </main>
    <LayoutTabbar v-if="showTabbar" class="safr-area-bottom" />
  </div>
</template>

<style scoped lang="scss">
  .layout {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  main {
    margin: 46px auto 50px;
  }
</style>
