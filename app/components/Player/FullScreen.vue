<script setup lang="ts">
const playerStore = usePlayerStore();

// 點擊「向下箭頭」或「返回」時，只是收起 Popup，不是真的路由返回
const closePlayer = () => {
  playerStore.setExpand(false);
};
</script>

<template>
  <div class="player-fullscreen">
    <van-nav-bar
      title="正在播放"
      left-arrow
      @click-left="closePlayer"
      :border="false"
      class="player-nav"
    >
      <template #left>
        <van-icon name="arrow-down" size="24" color="#333"/>
      </template>
    </van-nav-bar>

    <div class="player-content">
        <h2>{{ playerStore.currentSong?.name }}</h2>
    </div>
  </div>
</template>

<style scoped>
.player-fullscreen {
  height: 100%;
  background-color: var(--van-background-2);
  display: flex;
  flex-direction: column;
}
.player-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}
/* 讓 NavBar 透明或與背景融合 */
:deep(.van-nav-bar) {
    background-color: transparent;
}
</style>