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
    <div :class="['audio__container--img', {'playing': playerStore.isPlaying}]" @click="player.togglePlay">
      <van-image 
        class="audio__img__wrap"
        height="240"
        width="240"
        fit="cover"
        :style="`rotate: -${musicStore.diskRotation}deg`"
        :src="logo"
      /> 
    </div>
    
    <h3 class="audio__title">{{ musicStore.title }}</h3>
    
    <!-- 進度條 -->
    <van-space direction="vertical" class="progress__container">
      <van-slider 
        v-model="musicStore.slidePercent" 
        @update:model-value="handleProgress"
      />
      <van-row justify="space-between">
        <van-col>{{ playerStore.currentTime }}</van-col>
        <van-col>{{ playerStore.duraTime }}</van-col>
      </van-row>
    </van-space>
    
    <!-- 控制按钮 -->
    <van-row class="navigation__container">
      <van-col span="14" class="operation__container">
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
      </van-col>
      
      <!-- 音量控制 -->
      <van-col span="10" class="volume__container">
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
      </van-col>
    </van-row>
  </div>
</template>

<style scoped lang="scss">

.van-button--small {
  --van-button-small-height: 28px;
  --van-button-small-padding: 0 6px;
  margin-right: 1px;
}

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
.progress__container {
  width: 100%;
}
.navigation__container {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 10px;
}
.operation__container {

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

.volume__container {
  display: flex;
  align-items: center;
}



</style>
