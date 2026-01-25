<script setup lang="ts">
import type { MusicLocal } from '~/types/data.types';

const player = usePlayer();
const musicStore = useMusicStore();
const playerStore = usePlayerStore();
const {throttle} = useCommon();

const showMusicOption = ref(false);
const currentMusicName = ref("");
const currentMusicItem = ref<MusicLocal | null>(null);

const togglePlayAtIndex = (index: number) => {
  if (playerStore.index === index && playerStore.isPlaying) {
    player.pauseMusic();
  } else {
    player.playIndex(index);
  }
};
const throttleSpecified = throttle(togglePlayAtIndex, 600);

const removeList = () => {
  if (!currentMusicItem.value) return;

  const indexToRemove = musicStore.queue.findIndex(m => m.id === currentMusicItem.value?.id);
  if (indexToRemove === -1) return;

  showMusicOption.value = false;

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

const openMusicOption = (item: any) => {
  currentMusicItem.value = item;
  currentMusicName.value = item.name
  showMusicOption.value = true;
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
              <van-icon class="more-icon" name="weapp-nav" @click.stop="openMusicOption(list)" />
            </template>
          </van-cell>
        </van-list>
      </div>

      <van-popup
        class="sub-options"
        v-model:show="showMusicOption"
        position="bottom"
        round
      >
        <van-cell class="popup-title" :title="currentMusicName" >
          <template #right-icon>
            <van-icon name="info-o" size="24" />
          </template>
        </van-cell>
        <van-cell :title="$t('Music.next')" icon="play-circle-o" clickable />
        <van-cell :title="$t('add_to_play_list')" icon="plus" clickable />
        <van-cell :title="$t('remove_from_queue')" icon="minus" @click="removeList" clickable />
      </van-popup>
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
  flex: 1;
  overflow-y: auto;
  padding-bottom: calc(20px + env(safe-area-inset-bottom));

  .van-cell {
    background: transparent;
    transition: background-color 0.2s;
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
