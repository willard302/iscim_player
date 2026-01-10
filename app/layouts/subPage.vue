<script setup lang="ts">
const router = useRouter();
const route = useRoute();

// 1. 處理返回邏輯
const onClickLeft = () => {
  // 如果有上一頁歷史紀錄，則返回；否則回到首頁 (避免使用者直接進入內頁時卡死)
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
};

// 2. 動態標題 (可從頁面的 definePageMeta 或 useHead 獲取，這裡示範簡單讀取 meta)
// 實務上通常搭配 Pinia 或 useState ('page-title') 來動態改變
const title = computed(() => (route.meta.title as string) || '詳細內容');

// 3. 針對 Editor 頁面，可能需要右側按鈕 (如：儲存)，可透過 Slot 或 Pinia 控制
</script>

<template>
  <div class="subpage-layout">
    <van-nav-bar
      :title="title"
      left-text="返回"
      left-arrow
      fixed
      placeholder
      safe-area-inset-top
      @click-left="onClickLeft"
      class="header-nav"
    >
      <template #right>
        <slot name="header-right"></slot>
      </template>
    </van-nav-bar>

    <main class="content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.subpage-layout {
  min-height: 100vh;
  background-color: var(--van-background-2);
  padding-bottom: env(safe-area-inset-bottom); 
}
</style>