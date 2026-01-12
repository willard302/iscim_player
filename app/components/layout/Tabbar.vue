<script setup lang="ts">
const home = { label: 'home', path: '/home', icon: ['fas', 'house'] };
const musicLibrary = { label: 'musicLibrary', path: '/musicLibrary', icon: ['fas', 'music'] };
const playList = { label: 'playList', path: '/playList', icon: ['fas', 'list'] }
const navItems = [home, musicLibrary, playList];

const handleToTab = () => {
  const menuStore = useMenuStore();
  menuStore.isMusicList = true;
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
.van-tabbar {
  max-width: 600px;
  position: absolute;
}
svg {
  font-size: 1.4rem;
}
</style>
