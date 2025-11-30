<script setup lang="ts">
const route = useRoute();
const title = computed(() => {
  return route.meta.title ? route.meta.title : "iscim_music";
})
const routeBack = () => history.go(-1);
</script>

<template>
  <van-nav-bar fixed>
    <template #left>
      <van-icon name="arrow-left" @click="routeBack" />
    </template>
    <template #title>
      <NuxtLink class="title">{{ $t(title) }}</NuxtLink>
    </template>
    <template #right>
      <LocaleBar />
    </template>
  </van-nav-bar>
</template>

<style scoped></style>
