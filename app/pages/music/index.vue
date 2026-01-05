<script setup lang="ts">
definePageMeta({
  title: "Music.player",
  pageOrder: 2,
  showHeader: true,
  showTabbar: true
});
import logo from "~/assets/img/iscim_player_logo.png";
import logo_pause from "~/assets/img/iscim_player_logo_pause.png";

const musicStore = useMusicStore();
const playerStore = usePlayerStore();
const router = useRouter();
const player = usePlayer();

const {target} = useSwipeChange(() => router.push('/music/musicList'), () => router.push('/home'))

onMounted(() => {
  player.initListeners();
});

const loopBadgeText = computed(() => {
  const map: Record<string, string> = {
    [LoopMode.NORMAL]: 'X',
    [LoopMode.ONE]: '1',
    [LoopMode.ALL]: 'A'
  };
  return map[playerStore.loop] || '';
});

const onDragStart = () => {
  musicStore.isDragging = true;
};
const onDragEnd = () => {
  musicStore.isDragging = false;
  handleProgress();
};
const handleProgress = () => {
  if (!playerStore.duration) return;
  player.seek(musicStore.slidePercent);
};

</script>

<template>
  <div class="page__container h-full" ref="target">
    <div class="player__container">
      <div 
        class="disk__container" 
        @click="player.togglePlay"
      >
        <van-image 
          :class="['disk__image', {'spinning': playerStore.isPlaying}]"
          fit="cover" round
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
              size="small" round class="loop-btn" 
              @click="musicStore.setLoop()"
            >
              <font-awesome class="fa-solid fa-repeat" icon="repeat"/>
              <span class="loop-badge">{{ loopBadgeText }}</span>
            </van-button>
          </van-space>
        </van-col>
        
        <van-col span="10" class="volume__container">
          <van-button 
            size="mini" plain style="border: none; margin-right: 5px;"
            @click="player.openVolume()"
          >
            <font-awesome :icon="playerStore.volume_on ? 'volume-high' : 'volume-off'" />
          </van-button>
          <van-slider 
            v-model="playerStore.volume"
            :min="0" :max="100" button-size="10px"
            @update:model-value="player.setVolume"
          />
        </van-col>
      </van-row>
  
      <disclaimer-notice />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "sass:color";
@import url("~/assets/scss/_transitions.scss");

.player__container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  @include PadHeight {
    padding-top: 42px;
  }
}

.music__title {
  width: 100%;
  text-align: center;
  color: $color-font;
  font-size: 18px;
  font-weight: 600;

  @include PadHeight {
    font-size: 24px;
  }
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

  @include PadHeight {
    font-size: 18px;
  }
}

.navigation__container {
  width: 100%;
  height: 60px;
}

.operation__container {
  display: flex;
  align-items: center;

  .van-button--small {
    @include PadHeight {
      --van-button-small-height: 40px;
      width: 40px;
    }
  }
}

.volume__container {
  display: flex;
  align-items: center;
  padding-left: 10px;

  .van-button--mini {

    @include PadHeight {
      --van-button-mini-height: 36px;
      width: 36px;
    }
  }
}

.loop-btn {
  position: relative;

  .loop-badge {
    position: absolute;
    bottom: 2px;
    right: 4px;
    font-size: 0.6rem;
    font-weight: bold;
  }
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
    height: 240px;
    width: 240px;
    z-index: 2;
    background-color: transparent;
    animation: spin 20s linear infinite;
    animation-play-state: paused;

    @include PadHeight {
      height: 300px;
      width: 300px;
    }

    &.spinning {
      animation-play-state: running;
    }
  }

  &::before, &::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    z-index: 1;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    transition: all 1.5s;
  }

  &::before {
    width: 95%; height: 95%;
    border: 3px solid #8d03a2;
    background-color: #c9adef94;
  }

  &::after {
    width: 90%; height: 90%;
    border: 3px solid #b604d1;
    opacity: 0.6;
  }
}

@keyframes spin {
  from { transform: rotate(0deg);}
  to { transform: rotate(360deg);}
}

</style>
