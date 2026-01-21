<script setup lang="ts">
definePageMeta({pageOrder: 3});
const musicStore = useMusicStore();
const router = useRouter();
const player = usePlayer();
const { loadMusicSet } = usePlaylist();

const {target} = useSwipeChange(() => router.push('/home'), () => router.push('/musicLibrary'));

const acitveLoadSetTab = ref(0);
const showSetOption = ref(false);
const currentSet = ref("");

const actionOptions = reactive([
  {title: '播放', id: 'removeFromPlayerList', icon: 'play-circle-o', action: player.next },
  {title: '重新命名', id: 'removeFromPlayerList', icon: 'edit', action: player.next },
  {title: '刪除', id: 'removeCurrentSet', icon: 'delete-o', action: player.next }
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
  <div class="page__container" ref="target">
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
        :title="item.title"
        :icon="item.icon"
        @click="item.action"
      />
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
