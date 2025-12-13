<script setup lang="ts">
import { useMenuStore } from '~/store/useMenuStore';

  const menuStore = useMenuStore();
</script>

<template>
  <van-cell-group>
    <van-cell title="點歌模式" center>
      <template #value>
        <van-button size="small" @click="menuStore.toggleMenu('listMode')">
          {{menuStore.isJuniorMode ? $t('basic_mode') : $t('advanced_mode')}}
        </van-button>
      </template>
    </van-cell>
  </van-cell-group>
</template>

<style scoped></style>
