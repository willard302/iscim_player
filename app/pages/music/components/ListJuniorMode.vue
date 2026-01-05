<script setup lang="ts">
import type { MusicLocal, SubMusic } from '~/types/data.types';
import type { MusicRow } from '~/types/supabase';

const emit = defineEmits(['remove-all', 'handle-play'])

const menuStore = useMenuStore();
const musicStore = useMusicStore();
const { saveSet, loadMusicSet } = usePlaylist();

const activeMainTab = ref('Menu.build_new_set');
const activeBuildCategory = ref(0);
const subMusicLocal = ref<SubMusic[]>([]);
const musicListsSelected = ref<MusicLocal[]>([]);
const newLists = [
  { 
    name: "Music.working", 
    children: [
      {name:'Music.routine', id:'routine'}, 
      {name:'Music.major_meetings', id:'major_meetings'},
    ] 
  },
  { 
    name: "Music.reinforce_learning", 
    children: [
      {name:'Music.weekday_review', id:'weekday_review'}, 
      {name:'Music.review_before_exam', id:'review_before_exam'},
    ] 
  },
  { 
    name: "Music.take_a_nap", 
    children: [
      {name:'Music.full_charge', id:'full_charge'}, 
      {name:'Music.fast_charge', id:'fast_charge'},
    ] 
  },
];

// Load Set 相關狀態

const acitveLoadSetTab = ref(0);

const subTitle = computed((): string => {
  switch(menuStore.step) {
    case 1: return "Message.which_song_do_you_want_to_play";
    case 2: return "Message.what_you_want_now";
    default: return "";
  };
});

const initMusicListsSelected = () => {
  musicListsSelected.value = [];
  
  if (musicStore.subMusicUpdated && Array.isArray(musicStore.subMusicUpdated)) {
    subMusicLocal.value = musicStore.subMusicUpdated.map(category => {
      const newCategory = { ...category };
      if (newCategory.menu && Array.isArray(newCategory.menu)) {
        newCategory.menu = newCategory.menu.map((item: MusicRow) => ({
          ...item,
          checked: false,
        }));
      };
      return newCategory;
    });
  };
  
  musicStore.initNewSet();
};

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

const handleNext = () => {
  if (musicListsSelected.value.length === 0) {
    showFailToast($t("Message.please_select_a_music_at_least"));
    return;
  }; 
  if (!musicStore.newSet.name || musicStore.newSet.name.trim().length === 0) {
    showFailToast($t("Message.please_enter_a_name_for_the_set"));
    return;
  };
  musicStore.newSet.content = JSON.stringify([...musicListsSelected.value]);
  menuStore.step = 2;
};

const handleSubmit = async() => {
  const result = await saveSet();
  console.log("saved: ", result)
  
  emit("handle-play");

  menuStore.resetStep();
  initMusicListsSelected();
};

const handleSelectMode = (e: string) => {
  musicStore.newSet.mode = e;
};

const onBeforeMainTabChange = (name: string) => {
  if (name === "Menu.remove_all") {
    // 如果點擊的是 "移除全部"，不切換 Tab，直接觸發事件
    emit("remove-all");
    return false;
  }

  if (name === "Menu.build_new_set") {
    // 視需求決定是否每次切換回來都重置
    // initMusicListsSelected();
  }

  return true;
};

const handleLoadSet = (item: any) => {
  loadMusicSet(item);
};

onMounted(() => {
  if(!musicStore.isPro) return;
  initMusicListsSelected();
});

</script>

<template>
  <van-tabs
    class="custom-tab"
    v-model:active="activeMainTab"
    sticky
    type="card"
    :before-change="onBeforeMainTabChange"
  >
    <van-tab
      v-if="musicStore.isPro"
      name="Menu.build_new_set"
      :title="$t('Menu.build_new_set')"
    >
      <div class="tab-content-wrapper">
        <van-divider>{{ $t(subTitle) }}</van-divider>
      </div>

      <van-space class="content" direction="vertical" fill>
        <div class="musicList__body">
          <template v-if="menuStore.step === 1">
            <van-tabs v-model:active="activeBuildCategory" type="card" class="inner-tabs">
              <van-tab
                v-for="(m, mIdx) in subMusicLocal"
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
                    >
                      <template #right-icon>
                        <van-checkbox 
                          :model-value="!!i.checked"
                          @click.stop="handleCheck(i)"
                        >
                          <template #icon>
                            <div v-if="typeof i.sort_order === 'number' && i.sort_order > 0" class="sort-badge">
                              {{ i.sort_order }}
                            </div>
                          </template>
                        </van-checkbox>
                      </template>
                    </van-cell>
                  </van-cell-group>
                </div>
              </van-tab>
            </van-tabs>
          </template>

          <template v-if="menuStore.step === 2">
            <van-space direction="vertical" fill class="mode-selection">
              <div
                v-for="(item, idx) in newLists" 
                :key="idx" 
                class="custom-button"
              >
                <van-divider>{{ $t(item.name) }}</van-divider>
                <van-row gutter="10">
                  <van-col
                    v-for="(c, cIdx) in item.children"
                    :key="cIdx"
                    span="12"
                  >
                    <van-button 
                      :type="musicStore.newSet.mode === c.id ? 'primary' : 'default'"
                      @click="handleSelectMode(c.id)"
                      block
                    >
                      {{ $t(c.name) }}
                    </van-button>
                  </van-col>
                </van-row>
              </div>
            </van-space>
          </template>
        </div>
        
        <van-divider />

        <div class="musicList__footer custom-button">
          <template v-if="menuStore.step === 1">
            <van-field 
              v-model="musicStore.newSet.name"
              class="input-name"
              type="text"
              :placeholder="$t('Message.please_enter_a_name_for_the_set')" 
            />
            <van-button class="van-tab--card" block @click="handleNext()">
              {{ $t("Menu.next") }}
            </van-button>
          </template>
          <template v-if="menuStore.step === 2">
            <van-button class="van-tab--card" @click="handleSubmit()">
              {{ $t("Menu.save_and_play") }}
            </van-button>
          </template>
        </div>
      </van-space>
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

    <van-tab
      name="Menu.remove_all"
      :title="$t('Menu.remove_all')"
    />
  </van-tabs>
</template>

<style lang="scss" scoped>
@use 'sass:color';

.tab-content-wrapper {
  padding-top: 10px;
}

.scrollable-list {
  height: 40vh;
  overflow-y: auto;
  padding-bottom: 10px;
}

.van-checkbox__icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-size: 1.2rem;
}

.van-cell-group--inset {
  --van-cell-group-background: transparent;
  margin: 0;
}

.van-cell--clickable {
  --van-cell-background: transparent;
  align-items: center;
}

.van-divider {
  --van-divider-border-color: $color23;
  --van-divider-margin: 10px;
}

.sort-badge {
  width: 20px;
  height: 20px;
  background-color: #1989fa;
  color: $color1;
  border-radius: 50%;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
}

.input-name {
  margin-bottom: 10px;
  border: 1px solid #dddddd;
  border-radius: 4px;
  background: transparent;
}

.inner-tabs {
  margin-top: 10px;
}

.mode-selection {
  padding: 0 10px;
}

</style>
