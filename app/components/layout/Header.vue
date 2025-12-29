<script setup lang="ts">
import { useMenuStore } from "~/store/useMenuStore";
import logo from "/iscim_logo.png";
import { useMusicStore } from "~/store/useMusicStore";

const menuStore = useMenuStore();
const musicStore = useMusicStore();
const route = useRoute();

const title = computed(() => route.meta.title ? route.meta.title : "iscim_music");
const isMainPage = computed(() => route.meta.showTabbar);
const isMusicList = computed(() => route.meta.title === 'music_list');
const openSubNav = computed(() => menuStore.isAdvancedMenu || menuStore.isJuniorMenu);

const onClickLeft = () => {
  if (isMusicList && menuStore.openMenu !== '') {
    menuStore.backToMenu();
  } else if(isMainPage) {
    history.go(-1);
  } else {
    navigateTo('/home')
  }
};

const onClickRight = () => {
  if (!isMusicList) return;

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
  <van-nav-bar fixed
    @click-left="onClickLeft"
    @click-right="onClickRight"
  >
    <template #left>
      <van-icon v-if="!isMainPage" name="arrow-left" />
      <van-image v-else :src="logo" />
    </template>
    <template #title>
      <h3 v-if="isMusicList" class="audio__list__heading">
        <template v-if="musicStore.isPro">
          {{ (!musicStore.chakra.name || musicStore.chakra.name === 'Enhance') ? $t("music_list") : $t(musicStore.chakra.name) }}
        </template>
        <template v-else>
          {{ $t("music_list") }}
        </template>
      </h3>
      <NuxtLink v-else class="title">{{ $t(title) }}</NuxtLink>
    </template>
    <template #right>
      <font-awesome v-if="isMusicList" :icon="openSubNav ? 'xmark' : 'bars'" />
      <LocaleBar v-else />
    </template>
  </van-nav-bar>
</template>

<style scoped>
  :deep(.van-dropdown-menu__bar) {
    box-shadow: unset;
  }
  .audio__list__heading {
    font-size: 16px;
  }
  .van-image {
    width: 60px;
  }
</style>
