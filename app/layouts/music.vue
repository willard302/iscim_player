<script setup lang="ts">
import ListHeader from '~/pages/music/components/ListHeader.vue';
</script>

<template>
  <ListHeader />
    <main>
      <slot />
    </main>
  <LayoutTabbar />
</template>

<style scoped lang="scss"></style>
