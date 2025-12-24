<script setup lang="ts">
import { useMainStore } from '~/store/useMainStore';
import { useMenuStore } from '~/store/useMenuStore';
import { useMusicStore } from '~/store/useMusicStore';

const mainStore = useMainStore();
const menuStore = useMenuStore();
const musicStore = useMusicStore();

const openSubNav = computed(() => {
  return menuStore.active.advanceMenu || menuStore.active.juniorMenu;
});
const handleClickLeft = () => {
  menuStore.backToMenu();
};
const handleClickRight = () => {
  if (menuStore.isJuniorMode) {
    menuStore.toggleMusicList();
    menuStore.toggleJuniorMenu();
  } else {
    menuStore.toggleAdvanceMenu();
    menuStore.openMenu = "navMenu";
  }
};
</script>

<template>
  <van-nav-bar
    fixed
    @click-left="handleClickLeft"
    @click-right="handleClickRight"
  >
    <template #left v-if="!menuStore.isJuniorMode && menuStore.active.advanceMenu && menuStore.openMenu !== 'navMenu'">
      <font-awesome icon="arrow-left" />
    </template>
    <template #title>
      <h3 class="audio__list__heading">
        <template v-if="mainStore.userInfo">
          {{ (!musicStore.chakra.name || musicStore.chakra.name === 'Enhance') ? $t("album_list") : $t(musicStore.chakra.name) }}
        </template>
        <template v-else>
          {{ $t("album_list") }}
        </template>
      </h3>
    </template>
    <template #right>
      <font-awesome :icon="openSubNav ? 'xmark' : 'bars'" />
    </template>
  </van-nav-bar>
</template>

<style scoped lang="scss">
:deep(.van-dropdown-menu__bar) {
  box-shadow: unset;
}
</style>
