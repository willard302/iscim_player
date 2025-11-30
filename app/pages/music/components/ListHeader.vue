<script setup lang="ts">
import { useMainStore } from '~/store/useMain';
import { useMenuStore } from '~/store/useMenu';
import { useMusicStore } from '~/store/useMusic';

const mainStore = useMainStore();
const menuStore = useMenuStore();
const musicStore = useMusicStore();

const menu_1th = computed(() => {
  const chakra = { text: musicStore.chakra.name, value: "chakra" };
  const set = { text: "Menu.set", value: "set" };
  const music = { text: "Menu.music", value: "music" };
  const myMusic = { text: "Menu.custom_music", value: "mymusic" };
  const pro = [chakra, set, music, myMusic];
  const pub = [set, music];
  return mainStore.user && mainStore.user.musicTherapy ? pro : pub;
});
const handleClickLeft = () => {
  menuStore.toggleMenu(menuStore.openMenu === 'off' ? 'listMode' : 'back');
};
const handleClickRight = () => {
  menuStore.toggleMenu(menuStore.openMenu === 'off' ? 'navMenu' : 'off');
};
</script>

<template>
   <van-nav-bar
    fixed
    left-arrow
    @click-left="handleClickLeft"
    @click-right="handleClickRight"
  >
    <template #left>
      <font-awesome v-show="menuStore.openMenu !== 'off'" icon="arrow-left" />
      <van-button v-show="menuStore.openMenu === 'off'">
        {{menuStore.isJuniorMode ? $t('basic_mode') : $t('advanced_mode')}}
      </van-button>
    </template>
    <template #title>
      <h3 class="audio__list__heading">
        <template v-if="mainStore.user">
          {{ (!musicStore.chakra.name || musicStore.chakra.name === 'Enhance') ? $t("album_list") : $t(musicStore.chakra.name) }}
        </template>
        <template v-else>
          {{ $t("album_list") }}
        </template>
      </h3>
    </template>
    <template #right>
      <font-awesome :icon="menuStore.openMenu === 'off' ? 'bars' : 'xmark'" />
    </template>
  </van-nav-bar>
</template>

<style scoped lang="scss">
:deep(.van-dropdown-menu__bar) {
  box-shadow: unset;
}
</style>
