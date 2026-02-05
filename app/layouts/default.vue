<script setup lang="ts">
const musicStore = useMusicStore();
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
  @include flex-center(column);
}
main {
  margin: var(--header-h) auto var(--tabbar-h);
}
</style>
