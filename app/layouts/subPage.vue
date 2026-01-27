<script setup lang="ts">
const router = useRouter();
const route = useRoute();

// 1. 處理返回邏輯
const onClickLeft = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
};

const title = computed(() => (route.meta.title as string) || '詳細內容');
</script>

<template>
  <div class="subpage-layout">
    <van-nav-bar
      :title="$t(title)"
      :left-text="$t('Button.back')"
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