<script setup lang="ts">
const home = { label: 'home', path: '/home', icon: 'wap-home-o' };
const musicLibrary = { label: 'music_library', path: '/musicLibrary', icon: 'music-o' };
const playList = { label: 'play_list', path: '/playList', icon: 'orders-o' }
const navItems = [home, musicLibrary, playList];
</script>

<template>
  <van-tabbar route :border="false">
    <van-tabbar-item
      v-for="(navItem, navIdx) in navItems"
      :key="navIdx"
      :icon="navItem.icon"
      :to="navItem.path" replace
    >
      {{ $t(navItem.label) }}
    </van-tabbar-item>
  </van-tabbar>
</template>

<style scoped lang="scss">
.van-tabbar {
  max-width: $layout-max-width;
  position: absolute;
}
</style>
