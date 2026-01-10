<script setup lang="ts">
import type { MusicLocal } from '~/types/data.types';

const emit = defineEmits(['remove-all', 'handle-play'])

const musicStore = useMusicStore();
const { loadMusicSet } = usePlaylist();

const activeMainTab = ref('');
const activeBuildCategory = ref(0);
const musicListsSelected = ref<MusicLocal[]>([]);
const acitveLoadSetTab = ref(0);

const handleCheck = (item: any) => {
  const index = musicListsSelected.value.findIndex(s => s.id === item.id);
  const isSelected = index > -1 ;

  if (isSelected) {
    musicListsSelected.value.splice(index, 1);
    item.checked = false;
    item.sort_order = 0;
  } else {
    musicListsSelected.value.push(item);
    item.checked = true;
  };

  musicListsSelected.value.forEach((selecteditem, idx) => {
    selecteditem.sort_order = idx + 1;
  });
};

const handleLoadSet = (item: any) => {
  loadMusicSet(item);
};

onMounted(() => {
  if(!musicStore.isPro) return;
  musicStore.initMusicData();
});

</script>

<template>
  <van-tabs
    class="custom-tab"
    v-model:active="activeMainTab"
    sticky
    type="card"
  >
    <van-tab name="Menu.system_music" :title="$t('Menu.system_music')">
      <van-tabs v-model:active="activeBuildCategory" type="card" class="inner-tabs">
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
              />
            </van-cell-group>
          </div>
        </van-tab>
      </van-tabs>
    </van-tab>
    <van-tab name="Menu.custom_music" :title="$t('Menu.custom_music')">
      <van-tabs v-model:active="activeBuildCategory" type="card" class="inner-tabs">
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
              />
            </van-cell-group>
          </div>
        </van-tab>
      </van-tabs>
    </van-tab>

    <van-tab
      name="Menu.load_set"
      :title="$t('Menu.load_set')"
    >
      <div class="tab-content-wrapper">
        <van-tabs
          v-model:active="acitveLoadSetTab"
          type="card"
          class="inner-tabs"
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
                />
              </van-cell-group>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </van-tab>
  </van-tabs>
</template>

<style lang="scss" scoped>
@use 'sass:color';

.scrollable-list {
  overflow-y: auto;
  padding-bottom: 10px;
}

.van-cell-group--inset {
  --van-cell-group-background: transparent;
  margin: 0;
}

.van-cell--clickable {
  --van-cell-background: transparent;
  align-items: center;
}

</style>
