<script setup lang="ts">
import logo from "/iscim_logo.png";
const route = useRoute();
const title = computed(() => {
  return route.meta.title ? route.meta.title : "iscim_music";
});
const isHome = computed(() => {
  return route.meta.title === 'home';
})
const routeBack = () => history.go(-1);
</script>

<template>
  <van-nav-bar fixed>
    <template #left>
      <van-icon v-if="!isHome" name="arrow-left" @click="routeBack" />
      <van-image v-else :src="logo" />
    </template>
    <template #title>
      <NuxtLink class="title">{{ $t(title) }}</NuxtLink>
    </template>
    <template #right>
      <LocaleBar />
    </template>
  </van-nav-bar>
</template>

<style scoped>
  .van-image {
    width: 60px;
  }
</style>
