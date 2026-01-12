<script setup lang="ts">
import { Locale } from 'vant';
import vantUS from 'vant/es/locale/lang/en-US';
import vantTW from 'vant/es/locale/lang/zh-TW';

const mainStore = useMainStore();
const playerStore = usePlayerStore();
const { setLocale } = useI18n();

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
  },
  {immediate: true}
);
</script>
<template>
  <div class="wrap">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- <PlayerMiniBar v-if="playerStore.currentSong" /> -->
     <PlayerMiniBar />

    <van-popup
      v-model:show="playerStore.isExpanded"
      position="bottom"
      :style="{ height: '100%', width: '100%' }"
      :duration="0.3"
    >
      <PlayerFullScreen />
    </van-popup>
  </div>
</template>
<style scoped lang="scss">
@use "sass:color";

.wrap {
  position: relative;
  background-color: $color1;

  @include PadWidth {
    max-width: 576px;
    margin: 10px auto;
    box-shadow: 2px 2px 3px color.scale($color8, $lightness: 12%);
    border-radius: 10px;
  }
}
</style>