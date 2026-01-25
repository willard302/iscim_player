<script setup lang="ts">
const playerStore = usePlayerStore();
const musicStore = useMusicStore();
const player = usePlayer();
const {throttle} = useCommon();

const closePlayer = () => {
  playerStore.setExpand(false);
};

const loopIcon = computed(() => {
  switch(playerStore.loop) {
    case 'repeatOne': return 'replay';
    case 'repeatAll': return 'exchange';
    default: return 'revoke';
  }
});

const throttleToggle = throttle(player.togglePlay, 1000);
const throttleNext = throttle(player.next, 1000);
const throttlePrev = throttle(player.prev, 1000);

const onClickIcon = () => showToast('點擊圖標');

onMounted(() => musicStore.isDragging = false);
</script>

<template>
  <div class="player-fullscreen fullscreen">
    <SubPageHeader
      title="正在播放"
      left-icon="arrow-down"
      @click-left="closePlayer"
    />

    <div class="player-content">
      <div class="cover-wrapper">
        <div class="disk" :class="{spinning: playerStore.isPlaying}">
          <van-icon name="music-o" size="80" color="#ccc" />
        </div>
      </div>
      <div class="song-info">
        <h2 class="text-ellipsis">{{ playerStore.currentSong?.name || '無曲目'}}</h2>
        <p>{{ playerStore.currentSong?.created_by || 'Unknown' }}</p>
      </div>
      <van-action-bar>
        <van-action-bar-icon icon="like-o" text="favorite" @click="onClickIcon" />
        <van-action-bar-icon icon="bookmark-o" text="store" @click="onClickIcon" />
      </van-action-bar>
    </div>

    <div class="player-controls-area">
      <div class="progress-wrapper">
        <span class="time-text">{{ playerStore.currentTime }}</span>
        <van-slider 
          v-model="musicStore.slidePercent"
          bar-height="4px"
          button-size="12px"
          active-color="#1989fa"
          @drag-start="player.onDragStart"
          @update:model-value="player.onSeeking"
          @change="player.onSeekEnd"
          class="slider"
        />
        <span class="time-text">{{ playerStore.duraTime }}</span>
      </div>

      <div class="buttons-wrapper">
        <van-icon :name="loopIcon" size="24" color="#666666" @click="musicStore.setLoop" />
        <van-icon name="arrow-left" size="32" @click="throttlePrev" />

        <div class="play-btn" @click="throttleToggle">
          <van-icon 
            :name="playerStore.isPlaying ? 'pause' : 'play'"
            size="40" color="#ffffff"
          />
        </div>
        <van-icon 
          name="arrow" 
          size="32" 
          @click="throttleNext" 
        />
        <van-icon 
          name="bars" 
          size="24" color="#666666" 
          @click="musicStore.setPlayerQueue(true)"  
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.player-fullscreen {
  background-color: var(--van-background-2);
  display: flex;
  flex-direction: column;
}
.player-content {
  @include flex-center(column);
  flex: 1;
  padding: 20px;
  overflow: hidden;

  .cover-wrapper {
    width: 260px;
    height: 260px;
    background: #f0f0f0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);

    .spinning {
      animation: rotate 20s linear infinite;
    }
  }
  .song-info {
    text-align: center;

    h2 {
      margin: 0 0 8px;
      font-size: $font-size-base;
    }

    p {
      margin: 0;
      color: #888888;
    }
  }
  .van-action-bar {
    position: unset;
    width: 100%;
    display: flex;
    justify-content: space-evenly;
  }
}
.player-controls-area {
  padding: 0 24px 40px;
  
  .progress-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    gap: 10px;
    .time-text { 
      font-size: $font-size-mini; 
      color: #999; 
      width: 40px; 
      text-align: center;
    }
    .slider { flex: 1; }
  }

  .buttons-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;

    .play-btn {
      width: 70px;
      height: 70px;
      background: var(--van-primary-color, #1989fa);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(25, 137, 250, 0.4);
    }
  }
}

:deep(.van-nav-bar) {
  background-color: transparent;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>