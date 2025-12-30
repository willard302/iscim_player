<script setup lang="ts">
import type { Picker } from '~/types/data.types';
import { Locale } from 'vant';
import vantUS from 'vant/es/locale/lang/en-US';
import vantTW from 'vant/es/locale/lang/zh-TW';

const mainStore = useMainStore();
const { setLocale, t } = useI18n();

const columns = [
  { text: '繁體中文', value: 'tw' },
  { text: 'English', value: 'en' }
];

const onConfirm = (selected: Picker) => {
  const lan = String(selected.selectedValues[0]);
  if (lan === 'en') {
    setLocale('en');
    Locale.use('en-US', vantUS);
    mainStore.locale = 'en';
  } else {
    setLocale('tw');
    Locale.use('zh-TW', vantTW);
    mainStore.locale = 'tw'
  };

  const router = useRouter();
  router.push('/auth')
};

</script>

<template>
  <van-picker
    title="語言"
    :columns="columns"
    :cancel-button-text="' '"
    @confirm="onConfirm"
  />
</template>

<style scoped></style>
