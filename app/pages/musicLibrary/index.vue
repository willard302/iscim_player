<script setup lang="ts">
definePageMeta({pageOrder: 2});

import type { FieldItem, MusicLocal } from '~/types/data.types';
const {throttle} = useCommon();

const emit = defineEmits(['remove-all', 'handle-play'])

const player = usePlayer();
const playerStore = usePlayerStore();
const musicStore = useMusicStore();
const { addMusic, removeMusic } = usePlaylist();
const router = useRouter();
const {target} = useSwipeChange(() => router.push('/playList'), () => router.push('/home'));

const activeMainTab = ref(0);
const activeSystemMusicTab = ref(0);
const activeCustomMusicTab = ref(0);

const showMusicOptions = ref(false);
const showMusicInfo = ref(false);
const currentMusic = ref<MusicLocal>();

const fieldItems = ref<FieldItem[]>([]);

const handleAction = (actionType: string) => {
  if (!currentMusic.value) return;

  if (actionType === 'next') {
    player.next();
  } else if (actionType === 'removeFromPlayerList') {
    removeMusic(currentMusic.value);
  };

  showMusicOptions.value = false;
};

const actionOptions = reactive([
  {title: 'add_to_play_list', id: 'next', icon: 'plus'},
  {title: 'remove_from_queue', id: 'removeFromPlayerList', icon: 'delete-o'}
]);

const handleCheck = (item: any) => {
  addMusic(item);
  player.playIndex(0);
};
const throttleHandleCheck = throttle(handleCheck, 400);

const openMusicOptions = (item: any) => {
  showMusicOptions.value = true;
  currentMusic.value = item;
};
const openMusicInfo = () => {
  const music = currentMusic.value;
  if (!music) return;

  fieldItems.value = [];
  fieldItems.value = transferToFields(music);
  
  showMusicInfo.value = true;
  showMusicOptions.value = false;
};

const transferToFields = (event: MusicLocal): FieldItem[] => {

  return Object.entries(event).map(([key, value]) => {
    let label = `Music.${key}`;
    if (['created_at', 'created_by'].includes(key)) {
      label = key;
    };

    return {
      label: label,
      value: String(value),
      name: key,
      type: 'text'
    }
  });
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
        <van-row justify="space-between">
          <van-col>
            <van-button icon="music-o">{{ playerStore.loop }}</van-button>
          </van-col>
          <van-col>
            <van-button icon="bars" @click.lazy="musicStore.setPlayerQueue(true)" />
          </van-col>
        </van-row>
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
                @click="throttleHandleCheck(i)"
                :icon="playerStore.currentSong?.name === i.name ? 'play' : ''"
                :class="[{current: playerStore.currentSong?.name === i.name}]"
              >
                <template #right-icon>
                  <van-icon name="ellipsis" size="20" @click.stop="openMusicOptions(i)" />
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
                @click="throttleHandleCheck(i)"
                :icon="playerStore.currentSong?.name === i.name ? 'play' : ''"
                :class="[{current: playerStore.currentSong?.name === i.name}]"
              >
                <template #right-icon>
                  <van-icon name="ellipsis" size="20" @click.stop="openMusicOptions(i)" />
                </template>
              </van-cell>
            </van-cell-group>
          </div>
        </van-tab>
      </van-tabs>
    </van-tab>

    <van-popup
      v-model:show="showMusicOptions"
      position="bottom"
      :duration="0.3"
    >
      <van-cell :title="currentMusic?.name" >
        <template #right-icon>
          <van-icon name="info-o" size="24" @click="openMusicInfo" />
        </template>
      </van-cell>
      <van-cell 
        v-for="item in actionOptions"
        :key="item.id"
        :title="$t(item.title)"
        :icon="item.icon"
        @click="handleAction(item.id)"
      />
    </van-popup>

    <van-popup
      v-model:show="showMusicInfo"
      position="bottom"
      :duration="0.3"
      destroy-on-close    
    >
      <van-cell title="詳細資料" size="large" align="center" />
      <FieldForm 
        :field-items="fieldItems"
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
  height: calc(100dvh - var(--van-tabs-card-height)*2 - var(--header-h) - var(--tabbar-h) - var(--sat) - var(--sab));

  .van-row {
    padding: 0 10px;
  }
}

.showMiniBar .scrollable-list {
  height: calc(100dvh - var(--van-tabs-card-height)*2 - var(--header-h) - var(--tabbar-h) - var(--minibar-h) - var(--sat) - var(--sab));
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
