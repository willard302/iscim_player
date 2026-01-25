<script setup lang="ts">
import type { FieldItem, MusicLocal } from '~/types/data.types';

const {throttle} = useCommon();
const emit = defineEmits(['remove-all', 'handle-play'])

const player = usePlayer();
const playerStore = usePlayerStore();
const musicStore = useMusicStore();
const { addMusic, removeMusic } = usePlaylist();

type ActionType = 'next' | 'removeFromPlayerList';

interface ActionOption {
  title: string
  id: ActionType
  icon: string
};

const activeTab = ref(0);
const subTabActive = reactive<Record<string, number>>({
  system: 0,
  custom: 0
});

const uiState = reactive({
  showOptions: false,
  showInfo: false
});

const currentMusic = ref<MusicLocal>();
const fieldItems = ref<FieldItem[]>([]);

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

const actionOptions: ActionOption[] = [
  {title: 'add_to_play_list', id: 'next', icon: 'plus'},
  {title: 'remove_from_queue', id: 'removeFromPlayerList', icon: 'delete-o'}
];

const actionHandlers: Record<ActionType, (music: MusicLocal) => void> = {
  next: () => player.next(),
  removeFromPlayerList: (music) => removeMusic(music)
};

const handleAction = (actionType: ActionType) => {
  if (!currentMusic.value) return;

  const handler = actionHandlers[actionType];
  if (handler) {
    handler(currentMusic.value)
  };

  uiState.showOptions = false;
};

const handleCheck = (item: any) => {
  addMusic(item);
  player.playIndex(0);
};
const throttleHandleCheck = throttle(handleCheck, 400);

const openMusicOptions = (item: any) => {
  uiState.showOptions = true;
  currentMusic.value = item;
};
const openMusicInfo = () => {
  const music = currentMusic.value;
  if (!music) return;

  fieldItems.value = transferToFields(music);  
  uiState.showInfo = true;
  uiState.showOptions = false;
};

const transferToFields = (music: MusicLocal): FieldItem[] => {
  const specializeKeys = new Set(['created_at', 'created_by']);

  return Object.entries(music).map(([key, value]) => ({
    label: specializeKeys.has(key) ? key : `Music.${key}`,
    value: String(value ?? ''),
    name: key,
    type: 'text'
  }));
};

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
                      rows="2"
                      :content="String(item.intro)"
                      expand-text="show"
                      collapse-text="hide"
                    />

                  </template>
                  <template #right-icon>
                    <van-icon 
                      name="ellipsis"
                      size="20"
                      class="padding-icon"
                      @click.stop="openMusicOptions(item)"
                    />
                  </template>
                </van-cell>
              </van-cell-group>
            </div>
          </van-tab>
        </van-tabs>
      </van-tab>
  
      <van-popup
        v-model:show="uiState.showOptions"
        position="bottom"
        :duration="0.3"
        round
      >
        <van-cell :title="currentMusic?.name"  class="popup-header">
          <template #right-icon>
            <van-icon name="info-o" size="24" @click="openMusicInfo" />
          </template>
        </van-cell>
        <van-cell 
          v-for="action in actionOptions"
          :key="action.id"
          :title="$t(action.title)"
          :icon="action.icon"
          clickable
          @click="handleAction(action.id)"
        />
      </van-popup>
  
      <van-popup
        v-model:show="uiState.showInfo"
        position="bottom"
        :duration="0.3"
        destroy-on-close
        round
      >
        <van-cell 
          :title="$t('details')" 
          size="large" 
          align="center" 
          class="popup-title"
        />
        <FieldForm :field-items="fieldItems"/>
      </van-popup>
  
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

</style>
