<script setup lang="ts">
const musicStore = useMusicStore();
const route = useRoute();
</script>

<template>
  <div class="layout">
    <LayoutHeader />
    <main :class="musicStore.isPro ? 'theme-1' : 'theme-2'">
      <slot />
    </main>
    <LayoutTabbar />
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
  .playing main {
    margin: 46px auto 100px;
  }
</style>
