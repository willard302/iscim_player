<script setup lang="ts">
definePageMeta({pageOrder: 2});
const emit = defineEmits(['remove-all', 'handle-play'])

const playerStore = usePlayerStore();
const musicStore = useMusicStore();
const player = usePlayer();
const router = useRouter();
const { addMusic } = usePlaylist();

const {target} = useSwipeChange(() => router.push('/playList'), () => router.push('/home'));

const activeMainTab = ref(0);
const activeSystemMusicTab = ref(0);
const activeCustomMusicTab = ref(0);
const showMusicOption = ref(false);
const currentMusic = ref("");

const actionOptions = reactive([
  {title: '加入播放清單', id: 'next', icon: 'plus', action: player.next },
  {title: '從佇列中移除', id: 'removeFromPlayerList', icon: 'minus', action: player.next },
  {title: '從本機中移除', id: 'removeFromLocalDevice', icon: 'delete-o', action: player.next }
]);

const handleCheck = (item: any) => {
  
  player.togglePlay();
  addMusic(item);
  player.playIndex(0);
};

const openMusicOption = (item: any) => {
  showMusicOption.value = true;
  currentMusic.value = item.name
};

onMounted(() => {
  if(!musicStore.isPro) return;
  musicStore.initMusicData();
});

</script>

<template>
  <van-tabs
    ref="target"
    class="custom-tab"
    v-model:active="activeMainTab"
    sticky
    type="card"
  >
    <van-tab name="Menu.system_music" :title="$t('Menu.system_music')">
      <van-tabs v-model:active="activeSystemMusicTab" type="card" class="inner-tabs">
        <van-tab
          v-for="(m, mIdx) in musicStore.subMusic"
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
                @click="handleCheck(i)"
                :icon="playerStore.currentSong?.name === i.name ? 'play' : ''"
                :class="[{current: playerStore.currentSong?.name === i.name}]"
              >
                <template #right-icon>
                  <van-icon name="ellipsis" size="20" @click.stop="openMusicOption(i)" />
                </template>
              </van-cell>
            </van-cell-group>
          </div>
        </van-tab>
      </van-tabs>
    </van-tab>
    <van-tab name="Menu.custom_music" :title="$t('Menu.custom_music')">
      <van-tabs v-model:active="activeCustomMusicTab" type="card" class="inner-tabs">
        <van-tab
          v-for="(m, mIdx) in musicStore.subMusicUpdated"
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
                @click="handleCheck(i)"
                :icon="playerStore.currentSong?.name === i.name ? 'play' : ''"
                :class="[{current: playerStore.currentSong?.name === i.name}]"
              >
                <template #right-icon>
                  <van-icon name="ellipsis" size="20" @click.stop="openMusicOption(i)" />
                </template>
              </van-cell>
            </van-cell-group>
          </div>
        </van-tab>
      </van-tabs>
    </van-tab>

    <van-popup
      v-model:show="showMusicOption"
      position="bottom"
      :duration="0.3"
    >
      <van-cell :title="currentMusic" >
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

  </van-tabs>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@import url("~/assets/scss/_transitions.scss");

.scrollable-list {
  overflow-y: auto;
  padding-bottom: 10px;
  height: 60vh;
}

.van-cell-group--inset {
  --van-cell-group-background: transparent;
}

.van-cell--clickable {
  --van-cell-background: transparent;
  align-items: center;

  &.current {
    color: $pink-main;
    font-weight: bold;
  }
}

</style>
