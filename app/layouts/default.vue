<script setup lang="ts"></script>

<template>
  <LayoutHeader class="safe-area-top" />
    <main class="bg-1">
      <slot />
    </main>
  <LayoutTabbar class="safr-area-bottom" />
</template>

<style scoped lang="scss">
  .safe-area-top {
    padding-top: env(safe-area-inset-top);
  }
  .safe-area-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
</style>
