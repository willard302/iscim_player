<script setup lang="ts">
const player = usePlayer();
const musicStore = useMusicStore();
const playerStore = usePlayerStore();
const {throttle} = useCommon();

const showMusicOption = ref(false);
const currentMusic = ref("");

const specified = (index: number) => {
  if (!playerStore.isPlaying) {
    playerStore.index = index;
    player.playIndex(index);
  } else if (playerStore.index === index) {
    player.pauseMusic()
  } else {
    player.pauseMusic();
    playerStore.index = index;
    player.playIndex(index);
  }
};
const throttleSpecified = throttle(specified, 600);
const removeList = (index: number) => {
  // 特殊情况：最后一个歌曲
  if (musicStore.queue.length <= 1) {
    player.pauseMusic();
    musicStore.queue.splice(index, 1);

    playerStore.index = 0;
    playerStore.src = "";
    musicStore.name = "Hints.select_music";
    return;
  };
  
  // 删除当前播放之后的歌曲
  if (index > playerStore.index) return musicStore.queue.splice(index, 1);
  
  // 删除正在播放的歌曲或之前的歌曲
  player.pauseMusic();
  if (index < playerStore.index) {
    // 删除之前的歌曲，调整当前索引
    playerStore.index--;
    musicStore.queue.splice(index, 1);
  } else if (index === playerStore.index) {
    // 删除当前歌曲，调整索引
    musicStore.queue.splice(index, 1);
    playerStore.index = playerStore.index !== 0 ? playerStore.index - 1 : 0;
  };
  player.playMusic();
};

const openMusicOption = (item: any) => {
  showMusicOption.value = true;
  currentMusic.value = item.name
};

const openQueueEditor = () => {
  musicStore.setPlayerQueueEditor(true)
};

const closeQueue = () => {
  musicStore.setPlayerQueue(false)
};

</script>

<template>
  <div class="queue-fullscreen fullscreen">
    <SubPageHeader 
      :title="$t('player_queue')"
      left-icon="arrow-down"
      @click-left="closeQueue"
    />

    <div class="queue-container">
      <van-row 
        align="center"
        justify="space-between"
        class="queue-header"
      >
        <van-col span="12"></van-col>
        <van-col span="12" align="right">
          <van-button icon="records-o" size="small" @click="openQueueEditor" />
        </van-col>
      </van-row>

      <van-list class="queue-content">
        <van-cell 
          v-for="(list, idx) in musicStore.queue" 
          :key="idx" 
          :class="[{ playing: playerStore.index == idx }]"
          center
          :id="list.id"
          :title="list.name"
          :value="(list.chakra as number)"
          icon="music-o"
          @click="throttleSpecified(idx)"
        >
          <template #right-icon>
            <van-icon name="weapp-nav" @click="openMusicOption(list)" />
          </template>
        </van-cell>
      </van-list>
      <van-popup
        v-model:show="showMusicOption"
        position="bottom"
        :duration="0.3"
      >
        <van-cell :title="currentMusic" >
          <template #right-icon>
            <van-icon name="info-o" size="24" />
          </template>
        </van-cell>
        <van-cell :title="$t('Music.next')" icon="play-circle-o" />
        <van-cell :title="$t('add_to_play_list')" icon="plus" />
        <van-cell title="從佇列中移除" icon="minus" @click="removeList" />
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
}


.queue-header {
  background: rgba(0, 0, 0, 0.3);
  height: 36px;

  .van-button {
    background: transparent;
    margin-right: 12px;
  }
}

.queue-content {
  flex: 1 1 80vh;
  overflow-y: auto;
  padding-bottom: calc(100px + env(safe-area-inset-bottom));

  .van-cell {
    background: transparent;
  }

  :deep(.van-cell__value) {
    max-width: 24px;
    text-align: center;
  }

  .playing {
    background-color: $color-primary;
  }
}

.music__list__menu {

  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
  width: 100%;

  .van-cell {
    background: color.adjust($color: #ffffff, $alpha: -0.1);
  }
}
</style>
