<script setup lang="ts">
import { Locale } from 'vant';
import vantUS from 'vant/es/locale/lang/en-US';
import vantTW from 'vant/es/locale/lang/zh-TW';
import { useMainStore } from '~/store/useMainStore';
import type { Message } from '~/types/data.types';
const { setLocale, t } = useI18n();
const mainStore = useMainStore();

const messages: Message[] = [
  { text: t('Locale.en'), value: 'en' },
  { text: t('Locale.tw'), value: 'tw' }
];

watch(
  () => mainStore.locale,
  (newLocale) => {
    switch(newLocale) {
      case 'tw':
        setLocale('tw');
        Locale.use('zh-TW', vantTW);
        break;
      default:
        setLocale('en');
        Locale.use('en-US', vantUS);
        break;
    }
  }
)

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
