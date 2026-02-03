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

const isCurrentSong = (name: string):boolean => {
  if (musicStore.queue.length === 0) return false;
  return playerStore.currentSong?.name === name;
};

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
          <!-- <div class="tab-controls">
            <van-row align="center" justify="space-between" class="control-bar">
              <van-col>
                <van-button icon="fire-o" size="small" plain>
                  {{ $t(musicStore.chakra.name ?? 'Chakra.balance') }}
                </van-button>
              </van-col>
            </van-row>
          </div> -->
          <van-tab
            v-for="(subMusic, subIdx) in tab.data"
            :key="subIdx"
            :title="$t(subMusic.name)"
          >
            <div class="scrollable-list">
              <van-cell-group inset>
                <van-cell
                  v-for="(item, itemIdx) in subMusic.menu"
                  :key="itemIdx"
                  :title="item.name"
                  clickable
                  @click="throttleHandleCheck(item)"
                  :icon="isCurrentSong(item.name) ? 'play' : ''"
                  :class="{'current-song': isCurrentSong(item.name)}"
                >
                  <template #label>
                    <van-text-ellipsis
                      rows="1"
                      :content="String(item.intro)"
                      expand-text=""
                      collapse-text=""
                    />
                  </template>
                  <template #right-icon>
                    <div class="action-area" @click.stop="openOptions(item)">
                      <van-icon name="ellipsis" size="20" />
                    </div>
                  </template>
                </van-cell>
              </van-cell-group>
            </div>
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

.current {
  color: var(--van-primary-color);
  font-weight: bold;
}

.action-area {
  @include flex-center;
  padding: 6px 3px;
}

.scrollable-list {
  overflow-y: auto;
  padding-bottom: 10px;
  height: calc(100dvh - var(--van-tabs-card-height)*2 - var(--control-bar-h) - var(--header-h) - var(--tabbar-h) - var(--sat) - var(--sab));

  .van-cell-group--inset {
    --van-cell-group-inset-padding: 0;
  }
}

.showMiniBar .scrollable-list {
  height: calc(100dvh - var(--van-tabs-card-height)*2 - var(--control-bar-h) - var(--header-h) - var(--tabbar-h) - var(--minibar-h) - var(--sat) - var(--sab));
}

.van-cell-group--inset {
  --van-cell-group-background: transparent;
}

.van-cell--clickable {
  --van-cell-background: transparent;
  align-items: start;

  &.current {
    color: $pink-main;
    font-weight: bold;
  }
}

.van-cell--clickable:active {
  background-color: transparent;
}

</style>
