<script setup lang="ts">
import { useMainStore } from '~/store/useMainStore';

const mainStore = useMainStore();
const home = { label: 'home', path: '/', icon: ['fas', 'house'] };
const musicPlayer = { label: 'music', path: '/music', icon: ['fas', 'music'] };
const musicList = { label: 'musicList', path: '/music/musicList', icon: ['fas', 'compact-disc'] };
const userCenter = { label: 'userCenter', path: '/userCenter', icon: ['fas', 'user'] };

const navItems = [home, musicPlayer, musicList, userCenter];

</script>

<template>
  <van-tabbar v-model="mainStore.tabBarActive">
    <van-tabbar-item
      v-for="(navItem, navIdx) in navItems"
      :key="navIdx"
      :name="navItem.label"
      :to="navItem.path"
    >
      <font-awesome :icon="navItem.icon" />
    </van-tabbar-item>
  </van-tabbar>
</template>

<style scoped lang="scss">
svg {
  font-size: 1.4rem;
}
</style>
