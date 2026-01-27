<script setup lang="ts">
import PlayerFullScreen from '~/components/Player/FullScreen.vue';
import PlayerQueue from '~/components/Player/Queue.vue';
import PlayerQueueEditor from '~/components/Player/QueueEditor.vue';
import Preferences from '~/components/Preferences.vue';
import PolicyPrivacy from '~/components/Policy/Privacy.vue';
import PolicyService from '~/components/Policy/Service.vue';

const mainStore = useMainStore();
const playerStore = usePlayerStore();
const musicStore = useMusicStore();

const player = usePlayer();
const {initLocale} = useAppLocale();

const hasQueue = computed(() => musicStore.queue.length > 0);
const showPlayerMiniBar = computed(() => hasQueue.value && !playerStore.isExpanded);

type PopupItem = 
  | {store: typeof playerStore; model: keyof typeof playerStore; component: any}
  | {store: typeof musicStore; model: keyof typeof musicStore; component: any}
  | {store: typeof mainStore; model: keyof typeof mainStore; component: any};

const popups: PopupItem[] = [
  { store: playerStore, model: 'isExpanded', component: markRaw(PlayerFullScreen) },
  { store: musicStore, model: 'openQueue', component: markRaw(PlayerQueue) },
  { store: musicStore, model: 'openQueueEditor', component: markRaw(PlayerQueueEditor) },
  { store: mainStore, model: 'openPreferences', component: markRaw(Preferences) },
  { store: mainStore, model: 'openPolicyPrivacy', component: markRaw(PolicyPrivacy) },
  { store: mainStore, model: 'openPolicyService', component: markRaw(PolicyService) },
];

initLocale();

onMounted(() => {
  player.initListeners();
  if (playerStore.src) {
    player.setSourceByIndex(playerStore.index);
  };
});
</script>
<template>
  <div 
    class="wrap"
    :class="[
      {showQueue: musicStore.openQueue && !musicStore.openQueueEditor},
      {showMiniBar: musicStore.queue.length > 0}
    ]"
  >
    <NuxtLayout>
      <NuxtPage />
        <PlayerMiniBar v-show="showPlayerMiniBar" />

        <van-popup
          v-for="popup in popups"
          :key="popup.model"
          v-model:show="(popup.store as any)[popup.model]"
          position="bottom"
          class="full-screen-popup"
          :duration="0.3"
        >
          <component :is="popup.component" />
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

.full-screen-popup {
  height: 100%;
  width: 100%;
}
</style>