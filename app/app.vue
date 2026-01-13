<script setup lang="ts">
import { Locale } from 'vant';
import vantUS from 'vant/es/locale/lang/en-US';
import vantTW from 'vant/es/locale/lang/zh-TW';

const mainStore = useMainStore();
const playerStore = usePlayerStore();
const musicStore = useMusicStore();

const player = usePlayer();
const { setLocale } = useI18n();

const showPlayerMiniBar = computed(() => {
  return (playerStore.currentSong?.id!!)
});

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

onMounted(() => {
  player.initListeners();

  if (playerStore.src) {
    player.setSourceByIndex(playerStore.index);
  };
});
</script>
<template>
  <div :class="['wrap', {playing: showPlayerMiniBar}]">
    <NuxtLayout>
      <NuxtPage />
        <PlayerMiniBar v-if="showPlayerMiniBar" />

        <van-popup
          v-model:show="playerStore.isExpanded"
          position="bottom"
          :style="{ height: '100%', width: '100%' }"
          :duration="0.3"
        >
          <PlayerFullScreen />
        </van-popup>

        <van-popup
          v-model:show="musicStore.openQueue"
          position="bottom"
          :style="{ height: '100%', width: '100%'}"
          :duration="0.3"
        >
          <PlayerQueue />
        </van-popup>
    </NuxtLayout>
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