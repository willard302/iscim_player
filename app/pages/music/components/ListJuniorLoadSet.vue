<script setup lang="ts">
const musicStore = useMusicStore();
const {loadMusicSet} = usePlaylist();

const active = reactive({
  set: 0
});
</script>

<template>
  <van-tabs
    v-model:active="active.set"
    type="card"
  >
    <van-tab
      v-for="(m, mIdx) in musicStore.subSet"
      :key="mIdx"
      :title="$t(m.name)"
    >
      <van-cell-group inset>
        <van-cell
          v-for="(i, iIdx) in m.menu"
          :key="iIdx"
          :title="i.name"
          clickable
          @click="loadMusicSet(i)"
        />
      </van-cell-group>
    </van-tab>
  </van-tabs>
</template>

<style scoped>
  .van-cell-group--inset {
    --van-cell-group-background: transparent;
  }
  .van-cell--clickable {
    --van-cell-background: transparent;
  }
</style>
