<script setup lang="ts">
definePageMeta({pageOrder: 3});
const musicStore = useMusicStore();
const router = useRouter();
const { loadMusicSet } = usePlaylist();

const {target} = useSwipeChange(() => router.push('/home'), () => router.push('/musicLibrary'));

const acitveLoadSetTab = ref(0);
const showSetOption = ref(false);
const currentSet = ref("");

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
  <div ref="target">
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
      <van-cell title="播放下一首" icon="play-circle-o" />
      <van-cell title="加入播放清單" icon="plus" />
      <van-cell title="從佇列中移除" icon="minus" />
      <van-cell title="從本機中移除" icon="delete-o" />
    </van-popup>
  </div>
</template>

<style scoped lang="scss">
@import url("~/assets/scss/_transitions.scss");

  .van-cell-group--inset {
    --van-cell-group-background: transparent;
  }

  .van-cell--clickable {
    --van-cell-background: transparent;
    align-items: center;
  }
</style>
