<script setup lang="ts">
import { useMainStore } from '~/store/useMainStore';
import { useMenuStore } from '~/store/useMenuStore';
import { useMusicStore } from '~/store/useMusicStore';

const mainStore = useMainStore();
const menuStore = useMenuStore();
const musicStore = useMusicStore();

const openSubNav = computed(() => {
  return menuStore.openMenu === 'off';
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
      <font-awesome v-show="!openSubNav" icon="arrow-left" />
      <van-button v-show="openSubNav">
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
      <font-awesome :icon="openSubNav ? 'bars' : 'xmark'" />
    </template>
  </van-nav-bar>
</template>

<style scoped lang="scss">
:deep(.van-dropdown-menu__bar) {
  box-shadow: unset;
}
</style>
