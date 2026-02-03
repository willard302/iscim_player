<script setup lang="ts">
import type { MusicLocal } from '~/types/data.types';
const emit = defineEmits(['handle-play'])

const player = usePlayer();
const playerStore = usePlayerStore();
const musicStore = useMusicStore();
const { addMusic, removeMusicFromQueue } = usePlaylist();
const { throttle } = useCommon();

const {uiState, currentItem, fieldItems, openOptions, openInfo} = useMusicDetail();

const activeTab = ref(0);
const subTabActive = reactive<Record<string, number>>({
  system: 0,
  custom: 0
});

const currentMusic = ref<MusicLocal>();

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

const actionHandlers: Record<string, (music: MusicLocal) => void> = {
  next: () => player.next(),
  removeFromQueue: (music) => removeMusicFromQueue(music)
};

const handleAction = (actionId: string) => {
  if (!currentMusic.value) return;
  const handler = actionHandlers[actionId];
  if (handler) handler(currentMusic.value);
  uiState.showOptions = false;
};

const handleCheck = (item: any) => {
  addMusic(item);
  player.playIndex(0);
  playerStore.setExpand(true);
};
const throttleHandleCheck = throttle(handleCheck, 400);

const isCurrentSong = (name: string) => {
  const noMusic = musicStore.queue.length === 0;
  const someMusicPlaying = playerStore.currentSong?.name === name;
  if (noMusic) return false;
  if (someMusicPlaying) return true;
}

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
    >
      <van-tab
        v-for="tab in musicTabs"
        :key="tab.key"
        :name="tab.name"
        :title="$t(tab.name)"
      >
        <van-tabs
          v-model:active="subTabActive[tab.key]"
          type="card"
          class="inner-tabs"
        >
          <div class="tab-controls">
            <van-row justify="space-between" class="control-bar">
              <van-col>
                <van-button icon="fire-o">{{ $t(musicStore.chakra.name ?? 'Chakra.balance') }}</van-button>
              </van-col>
            </van-row>
          </div>
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
                  :class="[{current: isCurrentSong(item.name)}, 'ellipsis']"
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
                    <van-icon 
                      name="ellipsis"
                      size="20"
                      class="padding-icon"
                      @click.stop="openOptions(item)"
                    />
                  </template>
                </van-cell>
              </van-cell-group>
            </div>
          </van-tab>
        </van-tabs>
      </van-tab>

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
      
    </van-tabs>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';

* {
  --control-bar-height: 44px;
}

:deep(.van-popup) {
  position: absolute;
}

.tab-controls {
  padding: 0px 10px;

  :deep(.van-icon-fire-o) {
    color: red;
  }
}

.control-bar {
  height: var(--control-bar-height);
}

.current {
  color: var(--van-primary-color);
  font-weight: bold;
}

.scrollable-list {
  overflow-y: auto;
  padding-bottom: 10px;
  height: calc(100dvh - var(--van-tabs-card-height)*2 - var(--control-bar-height) - var(--header-h) - var(--tabbar-h) - var(--sat) - var(--sab));

  .van-cell-group--inset {
    --van-cell-group-inset-padding: 0;
  }
}

.showMiniBar .scrollable-list {
  height: calc(100dvh - var(--van-tabs-card-height)*2 - var(--control-bar-height) - var(--header-h) - var(--tabbar-h) - var(--minibar-h) - var(--sat) - var(--sab));
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
