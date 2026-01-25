<script setup lang="ts">
const musicStore = useMusicStore();
const player = usePlayer();
const { loadMusicSet } = usePlaylist();

const acitveLoadSetTab = ref(0);
const showSetOption = ref(false);
const currentSet = ref("");

const actionOptions = reactive([
  {title: 'play', id: 'removeFromPlayerList', icon: 'play-circle-o', action: player.next },
  {title: 'rename', id: 'removeFromPlayerList', icon: 'edit', action: player.next },
  {title: 'delete', id: 'removeCurrentSet', icon: 'delete-o', action: player.next }
]);

const handleLoadSet = (item: any) => {
  musicStore.resetMusic();
  loadMusicSet(item);
  musicStore.setPlayerQueue(true);
};

const openSetOption = (item: any) => {
  showSetOption.value = true;
  currentSet.value = item.name
};

</script>

<template>
  <div class="page__container">
    <van-tabs
      v-model:active="acitveLoadSetTab"
      type="card"
      class="custom-tab"
    >
      <van-tab
        v-for="(m, mIdx) in musicStore.subSet"
        :key="mIdx"
        :title="$t(m.name)"
      >
        <div class="scrollable-list">
          <van-cell-group inset>
            <van-cell
              v-for="(i, iIdx) in m.menu"
              :key="iIdx"
              :title="i.name"
              clickable
              @click="handleLoadSet(i)"
            >
              <template #right-icon>
                <van-icon name="ellipsis" size="20" @click.stop="openSetOption(i)" />
              </template>
            </van-cell>
          </van-cell-group>
        </div>
      </van-tab>
    </van-tabs>
    <van-popup
      v-model:show="showSetOption"
      position="bottom"
      :duration="0.3"
    >
      <van-cell :title="currentSet" >
        <template #right-icon>
          <van-icon name="info-o" size="24" />
        </template>
      </van-cell>
      <van-cell 
        v-for="item in actionOptions"
        :key="item.id"
        :title="$t(item.title)"
        :icon="item.icon"
        @click="item.action"
      />
    </van-popup>
  </div>
</template>

<style scoped lang="scss">
:deep(.van-popup) {
  position: absolute;
}

.van-cell-group--inset {
  --van-cell-group-background: transparent;
}

.van-cell--clickable {
  --van-cell-background: transparent;
  align-items: center;
}
</style>
