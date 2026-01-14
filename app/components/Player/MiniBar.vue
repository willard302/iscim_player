<script setup lang="ts">
const playerStore = usePlayerStore();
const musicStore = useMusicStore();
const player = usePlayer();
</script>

<template>
  <van-row
    align="center" 
    justify="space-between"
    class="mini-player"
  >
    <van-col span="20" class="info" @click="playerStore.setExpand(true)">
      <span>{{ playerStore.currentSong?.name || '未播放' }}</span>
    </van-col>
    <van-col span="4" class="controls" @click.stop>
      <van-icon 
        :name="playerStore.isPlaying ? 'pause' : 'play'"
        size="24"
        @click.lazy="player.togglePlay()"
      />
      <van-icon 
        name="bars"
        size="24"
        @click.lazy="musicStore.setPlayerQueue(true)"
      />
    </van-col>
  </van-row>
</template>

<style scoped lang="scss">
.mini-player {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--minibar-h);
  width: 100%;
  max-width: $layout-max-width;
  background-image: linear-gradient(to right top,
    #ffc4ee,
    #ead1fc,
    #dadcff,
    #d5e5fb,
    #dceaf3);
  backdrop-filter: blur(10px);
  border-top: 1px solid #eee;
  padding: 0 16px;
  z-index: 99; /* 確保蓋在內容上，但不要擋住 Popup */
  color: $white;
  transition: bottom 0.3s ease;
}

.showQueue .mini-player {
  bottom: 0px;
  z-index: 9999;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>