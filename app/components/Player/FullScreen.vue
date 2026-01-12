<script setup lang="ts">
const playerStore = usePlayerStore();
const musicStore = useMusicStore();
const player = usePlayer();

const closePlayer = () => {
  playerStore.setExpand(false);
};

const loopIcon = computed(() => {
  switch(playerStore.loop) {
    case 'repeatOne': return 'replay';
    case 'repeatAll': return 'exchange';
    default: return 'revoke';
  }
})
</script>

<template>
  <div class="player-fullscreen">
    <van-nav-bar
      :border="false"
      class="player-nav"
      @click-left="closePlayer"
    >
      <template #left>
        <van-icon name="arrow-down" size="24" color="#333"/>
      </template>
      <template #title>
        <span class="nav-title">正在播放</span>
      </template>
    </van-nav-bar>

    <div class="player-content">
      <div class="cover-wrapper">
        <div class="disk" :class="{spinning: playerStore.isPlaying}">
          <van-icon name="music-o" size="80" color="#ccc" />
        </div>
      </div>
      <div class="song-info">
        <h2>{{ playerStore.currentSong?.name || '無曲目'}}</h2>
        <p>{{ playerStore.currentSong?.created_by || 'Unknown' }}</p>
      </div>
    </div>

    <div class="player-controls-area">
      <div class="progress-wrapper">
        <span class="time-text">{{ playerStore.currentTime }}</span>
        <van-slider 
          v-model="musicStore.slidePercent"
          bar-height="4px"
          button-size="12px"
          active-color="#1989fa"
          @update:model-value="player.onSeeking"
          @change="player.onSeekEnd"
          class="slider"
        />
        <span class="time-text">{{ playerStore.duraTime }}</span>
      </div>

      <div class="buttons-wrapper">
        <van-icon 
          :name="loopIcon" 
          size="24" color="#666666"
          @click="musicStore.setLoop"
        />
        <van-icon 
          name="arrow-left"
          size="32"
          @click="player.prev"
        />
        <div class="play-btn" @click="player.togglePlay">
          <van-icon 
            :name="playerStore.isPlaying ? 'pause' : 'play'"
            size="40" color="#ffffff"
          />
        </div>
        <van-icon name="arrow" size="32" @click="player.next" />
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
  height: 100%;
  background-color: var(--van-background-2);
  display: flex;
  flex-direction: column;
}
.player-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;

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
      font-size: 20px;
    }

    p {
      margin: 0;
      color: #888888;
    }
  }
}
.player-controls-area {
  padding: 0 24px 40px;
  
  .progress-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    gap: 10px;
    .time-text { font-size: 12px; color: #999; width: 40px; text-align: center;}
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