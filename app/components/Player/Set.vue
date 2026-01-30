<script setup lang="ts">
import player_logo from '~/assets/img/iscim_player_logo.png';
import type { FieldItem, MusicLocal } from '~/types/data.types';

const musicStore = useMusicStore();

const player = usePlayer();
const {removeMusic} = usePlaylist();

type ActionType = 'next' | 'removeFromSet';

interface ActionOption {
  title: string
  id: ActionType
  icon: string
};

const { loadMusicSet } = usePlaylist();

const uiState = reactive({
  showOptions: false,
  showInfo: false
});

const currentMusic = ref<MusicLocal>();
const fieldItems = ref<FieldItem[]>([]);

const actionOptions: ActionOption[] = [
  {title: 'add_to_play_list', id: 'next', icon: 'plus'},
  {title: 'remove_from_set', id: 'removeFromSet', icon: 'delete-o'}
];

const handleLoadSet = (item: any) => {
  musicStore.resetMusic();
  loadMusicSet(item);
  musicStore.setPlayerQueue(true);
};

const actionHandlers: Record<ActionType, (music: MusicLocal) => void> = {
  next: () => player.next(),
  removeFromSet: (music) => removeMusic(music)
};

const handleAction = (actionType: ActionType) => {
  if (!currentMusic.value) return;

  const handler = actionHandlers[actionType];
  if (handler) {
    handler(currentMusic.value)
  };

  uiState.showOptions = false;
};

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

const formatIndex = (index: number) => {
  return String(index + 1).padStart(2, '0');
};
</script>

<template>
  <div>
    <SubPageHeader 
      :title="musicStore.currentSet.name"
      left-icon="arrow-down"
      @click-left="musicStore.setPlayerSet(false)"
    />
    <div class="set-container">
      <div class="cover-wrapper">
        <van-image :src="player_logo" />
      </div>

      <div class="tab-controls">
        <van-row justify="space-between" class="control-bar">
          <van-col>
            <van-button icon="fire-o">{{ $t(musicStore.chakra.name ?? 'Chakra.balance') }}</van-button>
          </van-col>
          <van-col>
            <van-button icon="add-square" />
          </van-col>
        </van-row>
      </div>

      <div class="set-wrapper">
        <van-list>
          <van-cell
            v-for="(item, index) in musicStore.currentSet.content"
            :key="index"
            @click="handleLoadSet(index)"
          >
            <template #title>
              <span class="index-number">{{ formatIndex(Number(index)) }}</span>
              <span class="item-name">{{ `${item.name} - ${item.chakra}` }}</span>
            </template>
            <template #label>
              <van-text-ellipsis
                :rows="2"
                :content="String(item.intro)"
                expand-text="show"
                collapse-text="hide"
              />
            </template>
            <template #right-icon>
              <van-icon 
                name="ellipsis" 
                size="20" 
                @click.stop="openMusicOptions(item)" 
              />
            </template>
          </van-cell>
        </van-list>
      </div>
    </div>
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
  </div>

</template>

<style scoped lang="scss">
.cover-wrapper {
  display: flex;
  justify-content: center;

  .van-image {
    width: 300px;
    height: 300px;
  }
}

.index-number {
  margin-right: 10px;
  font-variant-numeric: tabular-nums;
}
</style>
