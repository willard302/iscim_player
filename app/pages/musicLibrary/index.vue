<script setup lang="ts">
import type { MusicLocal } from '~/types/data.types';

const emit = defineEmits(['handle-play'])

const player = usePlayer();
const playerStore = usePlayerStore();
const musicStore = useMusicStore();
const { addMusic, removeMusicFromQueue } = usePlaylist();
const { throttle } = useCommon();
const { uiState, currentItem, fieldItems, openOptions, openInfo } = useMusicDetail();

const activeTab = ref('system');
const subTabActive = reactive<Record<string, number>>({
  system: 0,
  custom: 0
});

const musicTabs = computed(() => [
  {
    key: 'system',
    name: 'Menu.system_music',
    data: musicStore.subMusic
  },
  {
    key: 'custom',
    name: 'Menu.custom_music',
    data: musicStore.subMusicUpdated
  }
]);

const actionOptions = [
  {title: 'add_to_play_list', id: 'next', icon: 'plus'},
  {title: 'remove_from_queue', id: 'removeFromQueue', icon: 'delete-o'}
];

const handleAction = (actionId: string) => {
  const targetMusic = currentItem.value;
  if (!targetMusic) return;

  switch (actionId) {
    case "next":
      player.next();
      break;
    case "removeFromQueue":
      removeMusicFromQueue(targetMusic);
      break;
  };
  uiState.showOptions = false;
};

const handleCheck = (item: MusicLocal) => {
  addMusic(item);
  player.playIndex(0);
  playerStore.setExpand(true);
};

const throttleHandleCheck = throttle(handleCheck, 400);

onMounted(() => {
  if(!musicStore.isPro) return;
  musicStore.initMusicData();
});

</script>

<template>
  <div class="page__container">
    <van-tabs
      v-model:active="activeTab"
      class="custom-tab"
      sticky
      type="card"
      animated
      swipeable
    >
      <van-tab
        v-for="(tab, tabIdx) in musicTabs"
        :key="tabIdx"
        :name="tab.key"
        :title="$t(tab.name)"
      >
        <van-tabs
          v-model:active="subTabActive[tab.key]"
          type="card"
          class="inner-tabs"
        >
          <CommonControlBar />
          <van-tab
            v-for="(subMusic, subIdx) in tab.data"
            :key="subIdx"
            :title="$t(subMusic.name)"
          >
            <CommonMusicList 
              :items="subMusic.menu" 
              @click-item="throttleHandleCheck"
              @click-option="openOptions"
            />
          </van-tab>
        </van-tabs>
      </van-tab>
    </van-tabs>
    <CommonActionMenuPopup 
      v-model:show="uiState.showOptions"
      :title="currentItem?.name"
      :actions="actionOptions"
      @select="handleAction"
      @info="openInfo()"
    />

    <CommonInfoDetailPopup 
      v-model:show="uiState.showInfo"
      :field-items="fieldItems"
    />
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';

:deep(.van-popup) {
  position: absolute;
}
</style>
