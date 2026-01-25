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
  const hashCurrentSong = musicStore.queue.length !== 0;

  const isNotExpanded = !playerStore.isExpanded;

  return hashCurrentSong && isNotExpanded;
});

watch(
  () => mainStore.locale,
  (newLocale) => {
    const isTw = newLocale === 'tw';
    setLocale(isTw ? 'tw' : 'en');
    Locale.use(isTw ? 'zh-TW' : 'en-US', isTw ? vantTW : vantUS);
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
  <div :class="[
      'wrap', 
      {showQueue: musicStore.openQueue && !musicStore.openQueueEditor},
      {showMiniBar: musicStore.queue.length > 0}
    ]">
    <NuxtLayout>
      <NuxtPage />
        <PlayerMiniBar v-show="showPlayerMiniBar" />

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
        <van-popup
          v-model:show="musicStore.openQueueEditor"
          position="bottom"
          :style="{ height: '100%', width: '100%'}"
          :duration="0.3"
        >
          <PlayerQueueEditor />
        </van-popup>
        <van-popup
          v-model:show="mainStore.openPreferences"
          position="bottom"
          :style="{ height: '100%', width: '100%'}"
          :duration="0.3"
        >
          <Preferences />
        </van-popup>
        <van-popup
          v-model:show="mainStore.openPolicyPrivacy"
          position="bottom"
          :style="{ height: '100%', width: '100%'}"
          :duration="0.3"
        >
          <PolicyPrivacy />
        </van-popup>
        <van-popup
          v-model:show="mainStore.openPolicyService"
          position="bottom"
          :style="{ height: '100%', width: '100%'}"
          :duration="0.3"
        >
          <PolicyService />
        </van-popup>
    </NuxtLayout>
  </div>
</template>
<style scoped lang="scss">
@use "sass:color";

.wrap {
  position: relative;
  background-color: $white;

  @include PadWidth {
    max-width: var(--layout-max-width);
    margin: 10px auto;
    box-shadow: 2px 2px 3px color.scale($gray-900, $lightness: 12%);
    border-radius: 10px;
  }
}
</style>