<script setup lang="ts">
import ListJuniorBuildNewSet from './ListJuniorBuildNewSet.vue';
import MusicListSlot from './MusicListSlot.vue';
import { useMainStore } from '~/store/useMainStore';
import { useMenuStore } from '~/store/useMenuStore';
import { useMusicStore } from '~/store/useMusicStore';
import type { Song } from '~/types/data.types';

const { removeSet, loadSongSets } = usePlaylist();

const emit = defineEmits(['remove-all', 'hand-play', 'hand-save-set'])

const mainStore = useMainStore();
const menuStore = useMenuStore();
const musicStore = useMusicStore();

const isTab = ref("");

const musicListsLocal = ref<Song[]>([]);
const musicListsSelected = ref([]);
const musicOrder = ref(0);
const newLists = [
  { 
    name: "working", 
    children: [
      {name:'routine', id:'routine'}, 
      {name:'major_meetings', id:'major_meetings'},
    ] 
  },
  { 
    name: "reinforce_learning", 
    children: [
      {name:'weekday_review', id:'weekday_review'}, 
      {name:'review_before_exam', id:'review_before_exam'},
    ] 
  },
  { 
    name: "take_a_nap", 
    children: [
      {name:'full_charge', id:'full_charge'}, 
      {name:'fast_charge', id:'fast_charge'},
    ] 
  },
];
const set = ref({
  name: "",
  type: "custom",
  value: "",
  chakra: {},
  content: []
});
const sets = reactive([]);
const customSets = reactive([]);
const showMenu = ref("");
const items = computed(() => {
  const build_set = { name: "build_new_set", id: "build_new_set" };
  const load_set = { name: "load_set", id: "load_set" };
  const remove_all = { name: "remove_all", id: "remove_all" };
  return mainStore.userInfo ? [build_set, load_set, remove_all] : [load_set, remove_all];
});

const initMusicListsSelected = () => {
  musicListsSelected.value = [];
  musicOrder.value = 0;
  
  if (musicListsLocal.value && Array.isArray(musicListsLocal.value)) {
    musicListsLocal.value = musicStore.subMusicUpdated.map(category => {
      const newCategory = { ...category };
      console.log(newCategory)
      // if (newCategory.menu && Array.isArray(newCategory.menu)) {
      //   newCategory.menu = newCategory.menu.map(item => ({
      //     ...item,
      //     checked: false,
      //     order: null
      //   }));
      // }
      
      return newCategory;
    });
  }
  
  // 重置set对象
  set.value = {
    name: "",
    type: "custom",
    value: "",
    chakra: {},
    content: []
  };
};

const submitCustomSet = () => {
  if (showMenu.value === "") {
    showNotify({message:"message.please_select_a_music_situation"})
    return;
  };
  const setToEmit = JSON.parse(JSON.stringify(set));

  emit('hand-play', setToEmit);
  emit('hand-save-set', setToEmit);

  // 重置状态
  menuStore.step = 0;
  isTab.value = "";
  initMusicListsSelected();
};

const onClickAction = (item:any) => {
  switch(item) {
    case "load_set":
      isTab.value = (isTab.value === item) ? "" : item;
      showMenu.value = 'numbers_set';
      break;
    case "build_new_set":
      isTab.value = (isTab.value === item) ? "" : item;
      menuStore.step = 1;
      showMenu.value = 'numbers_music'
      break;
    case "remove_all":
      isTab.value = item;
      emit('remove-all')
      break;
    case "select_option":
      showMenu.value = '';
      if (musicListsSelected.value.length === 0) {
        showNotify({message: "message.please_select_a_music_at_least"});
        return;
      }; 
      if (set.value.name.length === 0) {
        showNotify({message: "message.please_enter_a_name_for_the_set"});
        return;
      };
      // set.content = musicListsSelected;
      menuStore.step = 2;
      break;
    case "submit":
      submitCustomSet();
      break;
    default:
      if (menuStore.step === 2) {
        set.value = item;
        showMenu.value = item;
      } else {
        // 切换菜单显示
        showMenu.value = item;
      }
      break;
  }
};

</script>

<template>
  <div class="audio__list music-list-junior">
    <TopTabbar
      :items="items" 
      :activeTab="isTab"
      @tab-change="onClickAction"
    ></TopTabbar>
    
    <ListJuniorBuildNewSet />

    <template v-if="isTab === 'load_set'">
      <TopTabbar
        :items="musicStore.subSet"
        :activeTab="showMenu"
        @tab-change="onClickAction"
      ></TopTabbar>

      <music-list-slot 
        v-show="showMenu === item.name"
        v-for="(item, idx) in musicStore.subSet"
        :key="idx"
        :list="item"
        type="junior-mode"
        className="customSet set__container scroll__container"
        @get-music="loadSongSets"
        @remove-music="removeSet"
      />
    </template>
  </div>
</template>

<style scoped></style>
