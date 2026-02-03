<script setup lang="ts">
const musicStore = useMusicStore();
</script>

<template>
  <div class="tab-controls">
    <van-row align="center" justify="space-between" class="control-bar">
      <van-col>
        <van-button icon="fire-o" size="small" plain>
          {{ $t(musicStore.chakra.name ?? 'Chakra.balance') }}
        </van-button>
      </van-col>
      <slot name="right" />
    </van-row>
  </div>
</template>

<style scoped lang="scss">
.tab-controls {
  padding: 0px 10px;
}

.control-bar {
  height: var(--control-bar-h);
}

.van-button--plain {
  background: #ead1fc;
}

:deep(.van-icon-fire-o) {
  color: red;
}
</style>
