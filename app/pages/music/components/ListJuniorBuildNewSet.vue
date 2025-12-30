<script setup lang="ts">
import type { MusicLocal, SubMusic } from '~/types/data.types';
import type { MusicRow } from '~/types/supabase';

const active = reactive({
  music: 0
});

const menuStore = useMenuStore();
const musicStore = useMusicStore();

const { removeMusic, saveSet } = usePlaylist();

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

const subMusicLocal = ref<SubMusic[]>([]);
const musicListsSelected = ref<MusicLocal[]>([]);

const subTitle = computed((): string => {
  switch(menuStore.step) {
    case 1: return "Message.which_song_do_you_want_to_play";
    case 2: return "Message.what_you_want_now";
    default: return "";
  };
});

const handleCheck = (item: any) => {

  const index = musicListsSelected.value.findIndex(s => s === item);
  const isSelected = index > -1 ;

  if (isSelected) {

    removeMusic( item, item);
    musicListsSelected.value.splice(index, 1);

    item.checked = false;
    item.sort_order = 0;
  } else {
    musicListsSelected.value.push(item);
    item.checked = true;
  };

  musicListsSelected.value.forEach((selectedItem, idx) => {
    selectedItem.sort_order = idx + 1;
  })
};

const handleNext = () => {
  if (musicListsSelected.value.length === 0) {
    showFailToast($t("Message.please_select_a_music_at_least"));
    return;
  }; 
  if (musicStore.newSet.name.length === 0) {
    showFailToast($t("Message.please_enter_a_name_for_the_set"));
    return;
  };
  musicStore.newSet.content = JSON.stringify([...musicListsSelected.value]);
  menuStore.step = 2;
};

const handleSubmit = async() => {

  const result = await saveSet();
  console.log(result)
  // initMusicListsSelected();
  menuStore.resetStep()
};

const handleSelectMode = (e: string) => {
  musicStore.newSet.mode = e;
};

const initMusicListsSelected = () => {
  musicListsSelected.value = [];
  
  if (subMusicLocal.value && Array.isArray(subMusicLocal.value)) {
    subMusicLocal.value = musicStore.subMusicUpdated.map(category => {
      const newCategory = { ...category };
      if (newCategory.menu && Array.isArray(newCategory.menu)) {
        newCategory.menu = newCategory.menu.map((item: MusicRow) => ({
          ...item,
          checked: false,
        }));
      }
      
      return newCategory;
    });
  }
  
  // 重置set对象
  musicStore.initNewSet();
};

onMounted(() => {
  initMusicListsSelected();
});
</script>

<template>
  <div>
    <van-divider >{{$t(subTitle)}}</van-divider>

    <van-space class="content" direction="vertical" fill>
      <div class="musicList__body">

        <template v-if="menuStore.step === 1">
          <van-tabs v-model:active="active.music" type="card">
            <van-tab
              v-for="(m, mIdx) in subMusicLocal"
              :key="mIdx"
              :title="$t(m.name)"
            >
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
            </van-tab>
          </van-tabs>
        </template>

        <template v-if="menuStore.step === 2">
          <van-space direction="vertical" fill>
            <div
              v-for="(item, idx) in newLists" 
              :key="idx" 
              class="custom-button"
            >
              <van-divider>{{ $t(item.name) }}</van-divider>
              <van-row>
                <van-col
                  v-for="(c, cIdx) in item.children"
                  :key="cIdx"
                  span="12"
                >
                  <van-button @click="handleSelectMode(c.id)">{{ $t(c.name) }}</van-button>
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
            type="text"
            :placeholder="$t('Message.please_enter_a_name_for_the_set')" 
          />
          <van-button class="van-tab--card" @click="handleNext()">
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
  </div>
</template>

<style scoped lang="scss">
@use 'sass:color';

  .van-checkbox__icon {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-size: 1.2rem;
  }
  .van-cell-group--inset {
    --van-cell-group-background: transparent;
  }
  .van-cell--clickable {
    --van-cell-background: transparent;
  }
  .van-divider {
    --van-divider-border-color: $color23;
    --van-divider-margin: 10px;
  }

  :deep(.van-tabs__content) {
    height: 40vh;
    overflow-y: auto;
  }
  .sort-badge {
    width: 20px;
    height: 20px;
    background-color: #1989fa; /* Vant Blue */
    color: white;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    font-size: 12px;
  }

</style>

