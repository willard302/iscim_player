<script setup lang="ts">
import { useMenuStore } from '~/store/useMenuStore';

const home = { label: 'home', path: '/home', icon: ['fas', 'house'] };
const musicPlayer = { label: 'music', path: '/music', icon: ['fas', 'music'] };
const musicList = { label: 'musicList', path: '/music/musicList', icon: ['fas', 'compact-disc'] };
const userCenter = { label: 'userCenter', path: '/userCenter', icon: ['fas', 'user'] };
const navItems = [home, musicPlayer, musicList, userCenter];

const handleToTab = () => {
  const menuStore = useMenuStore();
  menuStore.active.musicList = true;
  menuStore.active.juniorMenu = false;
};

</script>

<template>
  <van-tabbar route :border="false">
    <van-tabbar-item
      v-for="(navItem, navIdx) in navItems"
      :key="navIdx"
      :name="navItem.label"
      :to="navItem.path"
      @click="handleToTab"
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
