<script setup lang="ts">
import logo from "/iscim_logo.png";

const menuStore = useMenuStore();
const musicStore = useMusicStore();
const route = useRoute();

const title = computed(() => route.meta.title ? route.meta.title : "iscim_music");
const isMainPage = computed(() => route.meta.showTabbar);
const isMusicList = computed(() => route.meta.title === 'music_list');
const openSubNav = computed(() => menuStore.isAdvancedMenu);

const onClickLeft = () => {
  if (isMusicList && menuStore.openMenu !== '') {
    menuStore.backToMenu();
  } else {
    navigateTo('/home')
  }
};

const onClickRight = () => {
  const router = useRouter();
  router.push('/preferences')
};

</script>

<template>
  <van-nav-bar fixed
    @click-left="onClickLeft"
    @click-right="onClickRight"
  >
    <template #left>
      <van-icon v-if="route.meta.showHeaderArrow" name="arrow-left" />
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
      <van-icon name="setting" size="20" />
    </template>
  </van-nav-bar>
</template>

<style scoped>
  .van-nav-bar {
    max-width: 600px;
    position: absolute;
  }
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
