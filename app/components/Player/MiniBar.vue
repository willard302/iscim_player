<script setup lang="ts">
const playerStore = usePlayerStore();
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
      />
    </van-col>
  </van-row>
</template>

<style scoped lang="scss">
.mini-player {
  position: fixed;
  bottom: calc(50px + env(safe-area-inset-bottom)); /* 關鍵：要在 TabBar 上方 */
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-top: 1px solid #eee;
  padding: 0 16px;
  z-index: 99; /* 確保蓋在內容上，但不要擋住 Popup */
  color: $color1;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>