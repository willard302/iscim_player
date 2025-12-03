<script setup lang="ts">
import { useMusicStore } from "~/store/useMusicStore";
import { usePlayerStore } from "~/store/usePlayerStore";
import logo from "../../assets/img/iscim-logo.png";

const musicStore = useMusicStore();
const playerStore = usePlayerStore();
const player = usePlayer();

onMounted(() => {
  player.initListeners();
});

// ============== 進度條控制 ==============

const handleProgress = () => {
  if (!playerStore.duration) return;
  const percent = Math.max(0, Math.min(100, musicStore.slidePercent));
  player.seek(percent);
};

</script>

<template>
  <div class="player__container">
    <!-- 唱片图像 -->
    <div :class="['audio__container--img', {'playing': playerStore.isPlaying}]" @click="player.togglePlay">
      <div class="audio__img__wrap" :style="'rotate: -' + musicStore.diskRotation + 'deg'">
        <img class="audio__img" :src="logo" alt="Logo" />
      </div>
    </div>
    
    <!-- 歌曲標題 -->
    <h3 class="audio__title">{{ musicStore.title }}</h3>
    
    <!-- 進度條 -->
    <div class="audio__container--progress">
      <van-slider 
        v-model="musicStore.slidePercent" 
        @update:model-value="handleProgress"
      />
      <div class="audio__text--progress">
        <span>{{ playerStore.currentTime }}</span>
        <span>{{ playerStore.duraTime }}</span>
      </div>
    </div>
    
    <!-- 控制按钮 -->
    <div class="audio__container--navigation">
      <!-- 播放控制 -->
      <div class="audio__navigation--play">
        <van-button size="small" @click="player.prev()">
           <font-awesome icon="backward" />
        </van-button>
        <van-button size="small" @click.lazy="player.togglePlay()">
           <font-awesome :icon="playerStore.isPlaying ? 'pause' : 'play'"/>
        </van-button>
        <van-button size="small" @click="player.next()">
           <font-awesome icon="forward" />
        </van-button>
        <van-button :class="playerStore.loop" size="small" @click="musicStore.setLoop()">
          <font-awesome class="fa-solid fa-repeat" icon="repeat"/>
        </van-button>
      </div>
      
      <!-- 音量控制 -->
      <div class="audio__navigation--volume">
        <van-button 
          size="small"
          @click="player.openVolume()"
        >
          <font-awesome :icon="playerStore.volume_on ? 'volume-high' : 'volume-off'" />
        </van-button>
        <van-slider 
          v-model="playerStore.volume"
          :min="0"
          :max="100"
          @update:model-value="player.setVolume"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.player__container {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 100%;
}
.audio__container--img {
  max-width: 280px;
  margin: 0 auto;
  border-radius: 50%;
  box-shadow: 0 8px 16px -6px rgba(16, 16, 16, 0.3);
  overflow: hidden;
  z-index: 99;
}
.audio__img__wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #c9adef94;
  border: 3px solid #8d03a2;
  border-radius: 50%;
  z-index: -1;
  transition: all 1.5s linear;

  .audio__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    max-width: 100%;
    opacity: 1;
  }

  @mixin audio-img {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    border-radius: 50%;
    z-index: -1;
    margin: auto;
    transition: all 1.5s;
  }

  &::before {
    @include audio-img;
    content: "";
    width: 95%;
    height: 95%;
    border: 3px solid #b604d1;
  }

  &::after {
    @include audio-img;
    content: "";
    width: 90%;
    height: 90%;
    border: 3px solid #8d03a2;
  }
}
.audio__title {
  color: $color-font;
}
.audio__container--progress {
  display: inline-block;
  margin: 0 auto;
  width: 100%;

  .audio__text--progress {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
.audio__container--navigation {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 10px;
}
.audio__navigation--play {
  width: 40%;

  .van-button {
    position: relative;
  }

  .van-button::after {
    position: absolute;
    bottom: 0;
    right: 3px;
    font-size: 10px;
    font-weight: 500;
  }

  .normal::after {
    content: "X"
  }

  .repeatOne::after {
    content: "1"
  }

  .repeatAll::after {
    content: "A"
  }
}

.audio__navigation--volume {
  width: 120px;
  display: flex;
  align-items: center;
}



</style>
