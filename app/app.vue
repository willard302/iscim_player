<script setup lang="ts">
import { useLoadingStore } from './store/useLoadingStore';

const loadingStore = useLoadingStore();
</script>
<template>
  <div class="wrap">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <van-overlay
      v-show="loadingStore.isLoading"
      z-index="9999"
      class="global-loading-overlay"
    >
      <div class="loading-wrapper">
        <van-loading type="spinner" color="#1989fa" vertical>
          Loading...
        </van-loading>
      </div>
    </van-overlay>
  </div>
</template>
<style scoped lang="scss">
  .global-loading-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    /* 如果不想完全變黑，可以調整背景透明度 */
    background-color: rgba(0, 0, 0, 0.3); 
  }

  .loading-wrapper {
    background: white;
    padding: 20px;
    border-radius: 12px;
  }
</style>