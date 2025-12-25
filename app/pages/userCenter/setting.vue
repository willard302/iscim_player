<script setup lang="ts">
import { useMenuStore } from '~/store/useMenuStore';
import { useMusicStore } from '~/store/useMusicStore';

const menuStore = useMenuStore();
const musicStore = useMusicStore();

</script>

<template>
  <van-cell-group>
    <van-cell title="音樂模式" center>
      <template #value>
        <van-button size="small" @click="musicStore.handleToggleType()">
          {{musicStore.isPro ? $t("Music.pro") : $t("Music.pub")}}
        </van-button>
      </template>
    </van-cell>
    <van-cell title="點歌模式" center>
      <template #value>
        <van-button size="small" @click="menuStore.toggleJuniorMode()">
          {{menuStore.isJuniorMode ? $t('basic_mode') : $t('advanced_mode')}}
        </van-button>
      </template>
    </van-cell>
  </van-cell-group>
</template>

<style scoped></style>
