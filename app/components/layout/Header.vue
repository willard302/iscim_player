<script setup lang="ts">
import logo from "/iscim_logo.png";

const musicStore = useMusicStore();
const route = useRoute();

const title = computed(() => route.meta.title ? route.meta.title : "iscim_music");

const onClickLeft = () => {
  navigateTo('/home')
};

const onClickRight = () => {
  const router = useRouter();
  router.push('/preferences')
};

</script>

<template>
  <van-nav-bar 
    fixed
    :title="$t(title)"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  >
    <template #left>
      <van-icon v-if="route.meta.showHeaderArrow" name="arrow-left" />
      <van-image v-else :src="logo" />
    </template>
    <template #right>
      <van-icon name="setting-o" size="20" />
    </template>
  </van-nav-bar>
</template>

<style scoped lang="scss">
  .van-nav-bar {
    max-width: $layout-max-width;
    position: absolute;
  }
  :deep(.van-dropdown-menu__bar) {
    box-shadow: unset;
  }
  .audio__list__heading {
    font-size: $font-size-base;
  }
  .van-image {
    width: 60px;
  }
</style>
