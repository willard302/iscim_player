<script setup lang="ts">
const { t } = useI18n();
const mainStore = useMainStore();

const messages = computed(() => [
  { text: t('Locale.en'), value: 'en' },
  { text: t('Locale.tw'), value: 'tw' }
])

</script>

<template>
  <van-dropdown-menu class="locale__select">
    <van-dropdown-item v-model="mainStore.locale" :options="messages" />
  </van-dropdown-menu>
</template>

<style scoped lang="scss">
:deep(.van-dropdown-menu) {
  z-index: 999999;
}
.locale__select {
  padding: 0px 12px;
  appearance: none;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  --van-dropdown-menu-shadow: none;
  --van-dropdown-menu-height: 46px;
}
</style>
