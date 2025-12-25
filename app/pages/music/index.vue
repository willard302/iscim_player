<script setup lang="ts">
import { useMusicStore } from "~/store/useMusicStore";
import { usePlayerStore } from "~/store/usePlayerStore";
import logo from "~/assets/img/iscim_player_logo.png";
import logo_pause from "~/assets/img/iscim_player_logo_pause.png";

const musicStore = useMusicStore();
const playerStore = usePlayerStore();
const player = usePlayer();

onMounted(() => {
  player.initListeners();
});

// ============== 進度條控制 ==============

const onDragStart = () => {
  musicStore.isDragging = true;
};

const onDragEnd = () => {
  musicStore.isDragging = false;
  handleProgress();
};

const handleProgress = () => {
  if (!playerStore.duration) return;
  const percent = Math.max(0, Math.min(100, musicStore.slidePercent));
  player.seek(percent);
};

</script>

<template>
  <div class="player__container">
    <div 
      :class="[
        'disk__container', 
        {'playing': playerStore.isPlaying}
      ]" 
      @click="player.togglePlay"
    >
      <van-image 
        :class="['disk__image', {'spinning': playerStore.isPlaying}]"
        height="240"
        width="240"
        fit="cover"
        round
        :src="playerStore.isPlaying ? logo_pause : logo"
      /> 
    </div>
    
    <h3 class="music__title van-ellipsis">{{ musicStore.queue.length === 0 ? $t(musicStore.name) : musicStore.name }}</h3>
    
    <div class="progress__container">
      <van-slider 
        v-model="musicStore.slidePercent" 
        button-size="12px"
        @drag-start="onDragStart"
        @drag-end="onDragEnd"
        @update:model-value="handleProgress"
      />
      <div class="time__labels">
        <span class="time__text">{{ playerStore.currentTime }}</span>
        <span class="time__text">{{ playerStore.duraTime }}</span>
      </div>
    </div>
    
    <van-row class="navigation__container" align="center" justify="space-between">
      <van-col span="14" class="operation__container">
        <van-space :size="8">
          <van-button size="small" round @click="player.prev()">
            <font-awesome icon="backward" />
          </van-button>
          <van-button size="small" round @click.lazy="player.togglePlay()">
            <font-awesome :icon="playerStore.isPlaying ? 'pause' : 'play'"/>
          </van-button>
          <van-button size="small" round @click="player.next()">
            <font-awesome icon="forward" />
          </van-button>
          <van-button 
            size="small" 
            round 
            :class="['loop-btn', playerStore.loop]" 
            @click="musicStore.setLoop()"
          >
            <font-awesome class="fa-solid fa-repeat" icon="repeat"/>
          </van-button>
        </van-space>
      </van-col>
      
      <!-- 音量控制 -->
      <van-col span="10" class="volume__container">
        <van-button 
          size="mini"
          plain
          style="border: none; margin-right: 5px;"
          @click="player.openVolume()"
        >
          <font-awesome :icon="playerStore.volume_on ? 'volume-high' : 'volume-off'" />
        </van-button>
        <van-slider 
          v-model="playerStore.volume"
          :min="0"
          :max="100"
          button-size="10px"
          @update:model-value="player.setVolume"
        />
      </van-col>
    </van-row>

    <disclaimer-notice />
  </div>
</template>

<style scoped lang="scss">
@use "sass:color";

.player__container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.music__title {
  width: 100%;
  text-align: center;
  color: $color-font;
  font-size: 18px;
  font-weight: 600;
}

.progress__container {
  width: 100%;
  padding: 0 5px;

  .van-slider {
    margin-bottom: 8px;
  }
}

.time__labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--van-text-color-2);
}

.navigation__container {
  width: 100%;
  height: 60px;
}

.operation__container {
  display: flex;
  align-items: center;
}

.volume__container {
  display: flex;
  align-items: center;
  padding-left: 10px;
}

.loop-btn {
  position: relative;

  &::after {
    position: absolute;
    bottom: -2px;
    right: 2px;
    font-size: 9px;
    font-weight: bold;
    color: inherit;
  }

  &.normal::after { content: "X" }
  &.repeatOne::after { content: "1" }
  &.repeatAll::after { content: "A" }
}

@keyframes spin {
  from { transform: rotate(0deg);}
  to { transform: rotate(360deg);}
}

.disk__container {
  position: relative;
  border-radius: 50%;
  box-shadow: 0 8px 16px -6px rgba(16, 16, 16, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    box-shadow: unset;
  }

  .disk__image {
    z-index: 2;
    background-color: transparent;
    animation: spin 20s linear infinite;
    animation-play-state: paused;

    &.spinning {
      animation-play-state: running;
    }
  }

  &::before, &::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 1.5s;
  }

  &::before {
    width: 95%;
    height: 95%;
    border: 3px solid #8d03a2;
    background-color: #c9adef94;
  }

  &::after {
    width: 90% ;
    height: 90% ;
    border: 3px solid #b604d1;
    opacity: 0.6;
  }
}

</style>
