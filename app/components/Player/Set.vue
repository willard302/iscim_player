<script setup lang="ts">
import player_logo from '~/assets/img/iscim_player_logo.png';
import type { MusicLocal } from '~/types/data.types';

const musicStore = useMusicStore();
const player = usePlayer();
const {removeMusic, loadMusicSet} = usePlaylist();

const {uiState, currentItem, fieldItems, openOptions, openInfo} = useMusicDetail();

const openBuildSetBar = ref(false);

const actionOptions = [
  {title: 'add_to_play_list', id: 'next', icon: 'plus'},
  {title: 'remove_from_set', id: 'removeFromSet', icon: 'delete-o'}
];

const actionHandlers: Record<string, (music: MusicLocal) => void> = {
  next: () => player.next(),
  add_to_set: () => console.log("add to set"),
  removeFromSet: (music) => removeMusic(music)
};

const handleAction = (actionType: string) => {
  if (!currentItem.value) return;
  const handler = actionHandlers[actionType];
  if (handler) handler(currentItem.value);
  uiState.showOptions = false;
};

const buildNewSet = () => {
  openBuildSetBar.value = true;
}

const handleLoadSet = (item: any) => {
  musicStore.resetMusic();
  loadMusicSet(item);
  musicStore.setPlayerQueue(true);
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
        <van-row class="control-bar">
          <van-col>
            <van-button icon="play" text="播放清單" />
          </van-col>
          <van-col>
            <van-button icon="add-square" text="建立清單" @click="buildNewSet" />
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
                @click.stop="openOptions(item)" 
              />
            </template>
          </van-cell>
        </van-list>
      </div>
    </div>
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

<style scoped lang="scss">
.cover-wrapper {
  display: flex;
  justify-content: center;

  .van-image {
    width: 300px;
    height: 300px;
  }
}

.control-bar {
  justify-content: space-evenly;
}

.set-wrapper {
  overflow-y: auto;
  height: 40vh;
}

.index-number {
  margin-right: 10px;
  font-variant-numeric: tabular-nums;
}

.van-popup {
  overflow-y: hidden;
}
</style>
