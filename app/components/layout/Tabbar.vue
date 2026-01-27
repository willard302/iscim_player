<script setup lang="ts">
const introduce = { label: 'introduce', icon: 'description-o' };
const musicLibrary = { label: 'music_library', icon: 'music-o' };
const playList = { label: 'play_list', icon: 'orders-o' }
const navItems = [introduce, musicLibrary, playList];

const mainStore = useMainStore();
const onChange = (page: number) => {
  mainStore.setCurrentTab(page)
};
</script>

<template>
  <van-tabbar v-model="mainStore.currentTab" :border="false" @change="onChange">
    <van-tabbar-item
      v-for="(navItem, navIdx) in navItems"
      :key="navIdx"
      :icon="navItem.icon"
      :name="navIdx"
    >
      {{ $t(navItem.label) }}
    </van-tabbar-item>
  </van-tabbar>
</template>

<style scoped lang="scss">
.van-tabbar {
  max-width: var(--layout-max-width);
  position: absolute;
}
</style>
