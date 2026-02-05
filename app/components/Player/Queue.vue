<script setup lang="ts">
import type { MusicLocal } from '~/types/supabase';

const player = usePlayer();
const musicStore = useMusicStore();
const playerStore = usePlayerStore();
const {removeAllFromQueue} = usePlaylist();
const {throttle} = useCommon();

const {uiState, currentItem, fieldItems, openOptions, openInfo} = useMusicDetail();

const actionOptions = [
  {title: 'remove_from_queue', id: 'removeFromQueue', icon: 'delete-o'}
];

const actionHandlers: Record<string, (music: MusicLocal) => void> = {
  next: () => player.next(),
  add_to_set: () => console.log("add to set"),
  removeFromQueue: () => removeList()
};

const handleAction = (actionId: string) => {
  if (!currentItem.value) return;
  const handler = actionHandlers[actionId];
  if (handler) handler(currentItem.value);
  uiState.showOptions = false;
};

const togglePlayAtIndex = (index: number) => {
  if (playerStore.index === index && playerStore.isPlaying) {
    player.pauseMusic();
  } else {
    player.playIndex(index);
  }
};
const throttleSpecified = throttle(togglePlayAtIndex, 600);

const removeList = () => {
  if (!currentItem.value) return;
  const indexToRemove = musicStore.queue.findIndex(m => m.id === currentItem.value?.id);
  
  if (indexToRemove === -1) return;

  const isRemovingCurrent = indexToRemove === playerStore.index;
  const isRemovingBefore = indexToRemove < playerStore.index;

  musicStore.queue.splice(indexToRemove, 1);

  if (musicStore.queue.length === 0) {
    player.pauseMusic();
    playerStore.resetPlayer();
    musicStore.resetMusic();
    return;
  };

  if (isRemovingCurrent) {
    if (playerStore.index >= musicStore.queue.length) {
      playerStore.index = 0;
    };

    player.playIndex(playerStore.index)
  } else if(isRemovingBefore) {
    playerStore.index--;
  };
};

const openQueueEditor = () => {
  musicStore.setPlayerQueueEditor(true)
};

</script>

<template>
  <div class="queue-fullscreen fullscreen">
    <SubPageHeader 
      :title="$t('player_queue')"
      left-icon="arrow-down"
      @click-left="musicStore.setPlayerQueue(false)"
    >
      <template #right>
        <van-button class="edit-btn" icon="records-o" size="small" @click="openQueueEditor" />
        <van-button class="edit-btn" icon="delete-o" size="small" @click="removeAllFromQueue()" />
      </template>
    </SubPageHeader>

    <div class="queue-container">

      <div class="queue-list-wrapper">
        <van-list>
          <van-cell 
            v-for="(list, idx) in musicStore.queue" 
            :key="list.id || idx" 
            :class="[{ playing: playerStore.index == idx }]"
            center
            :title="list.name"
            :value="(list.chakra as number)"
            icon="music-o"
            clickable
            @click="throttleSpecified(idx)"
          >
            <template #right-icon>
              <van-icon class="more-icon" name="weapp-nav" @click.stop="openOptions(list)" />
            </template>
          </van-cell>
        </van-list>
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
  </div>
</template>

<style scoped lang="scss">
@use "sass:color";

.queue-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.queue-list-wrapper {
  overflow-y: auto;
  padding-bottom: calc(20px + env(safe-area-inset-bottom));

  .van-cell {
    background: transparent;
    transition: background-color 0.2s;
  }

  :deep(.van-cell__title) {
    flex: 1 1 70%;
  }

  :deep(.van-cell__value) {
    text-align: center;
  }

  .playing {
    color: var(--van-primary-color);
    background-color: var(--van-background-2);
    font-weight: 500;
  }

  .more-icon {
    padding: 8px;
  }
}
</style>
