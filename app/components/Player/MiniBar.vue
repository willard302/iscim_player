<script setup lang="ts">
const playerStore = usePlayerStore();
const musicStore = useMusicStore();
const player = usePlayer();

const progressPercentage = computed(() => {
  if (playerStore.duration === 0) return 0;
  return musicStore.slidePercent;
});

const currentCircleColor = computed(() => {
  if (progressPercentage.value > 0) return 'var(--van-gray-6)';
  return '#ffffff'
});
</script>

<template>
  <van-row
    align="center" 
    justify="space-between"
    class="mini-player"
  >
    <van-col span="19" class="info" @click="playerStore.setExpand(true)">
      <span>{{ playerStore.currentSong?.name || $t('unplayed') }}</span>
    </van-col>
    <van-col span="5" class="controls" @click.stop>
      <van-circle
        :current-rate="progressPercentage"
        stroke-width="100"
        :clockwise="false"
        :rate="100"
        size="28"
        layer-color="#ffffff"
        :color="currentCircleColor"
      >
        <van-icon 
          :name="playerStore.isPlaying ? 'pause' : 'play'"
          size="20"
          class="control-icon"
          @click.lazy.stop="player.togglePlay()"
        />
      </van-circle>
      
      <van-icon 
        name="arrow-double-right"
        size="28"
        @click.lazy="player.next()"
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
  max-width: var(--layout-max-width);
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

  .control-icon {
    padding: 4px;
  }
}
</style>