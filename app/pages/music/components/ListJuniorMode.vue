<script setup lang="ts">
import ListJuniorBuildNewSet from './ListJuniorBuildNewSet.vue';
import ListJuniorLoadSet from './ListJuniorLoadSet.vue';
import { useMainStore } from '~/store/useMainStore';
import { useMenuStore } from '~/store/useMenuStore';
import { useMusicStore } from '~/store/useMusicStore';
import type { MusicMenu, Song } from '~/types/data.types';

const emit = defineEmits(['remove-all', 'hand-play', 'hand-save-set'])

const menuStore = useMenuStore();
const musicStore = useMusicStore();

const active = ref('Menu.build_new_set')
const isTab = ref("");
const musicListsLocal = ref<MusicMenu[]>([]);
const musicListsSelected = ref([]);
const musicOrder = ref(0);
const set = ref({
  name: "",
  type: "custom",
  value: "",
  chakra: {},
  content: []
});
const showMenu = ref("");

const items = reactive([
  { 
    name: "Menu.build_new_set", 
    comp: shallowRef(ListJuniorBuildNewSet), 
    props: {
      musicListsLocal: musicListsLocal
    }
  },
  { 
    name: "Menu.load_set", 
    comp: shallowRef(ListJuniorLoadSet), 
    props: {} 
  },
  { 
    name: "Menu.remove_all", 
    comp: null, 
    props: null,
    action: () => {
      showConfirmDialog({
        title: "警告",
        message: "確定要移除全部？"
      }).then(() => {
        onRemove()
      }).catch(() => console.log("cancel"))
    }
  }
]);

onMounted(() => {
  initMusicListsSelected()
})

const initMusicListsSelected = () => {
  musicListsSelected.value = [];
  musicOrder.value = 0;
  
  if (musicListsLocal.value && Array.isArray(musicListsLocal.value)) {
    musicListsLocal.value = musicStore.subMusicUpdated.map(category => {
      const newCategory = { ...category };
      if (newCategory.menu && Array.isArray(newCategory.menu)) {
        newCategory.menu = newCategory.menu.map((item: Song) => ({
          ...item,
          checked: false,
          order: 0
        }));
      }
      
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

const onRemove = () => {
  emit('remove-all')
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

const OnBeforeChange = (name: string) => {
  console.log(name)
  const targetItem = items.find(i => i.name === name);

  if (targetItem && targetItem.action) {
    targetItem.action();
    return false;
  };

  return true;
}

</script>

<template>
  <van-tabs 
    v-model:active="active"
    sticky
    type="card"
    :before-change="OnBeforeChange"
  >
    <van-tab
      v-for="(t, tIdx) in items"
      :key="tIdx"
      :title="$t(t.name)"
      :name="t.name"
    >
      <component :is="t.comp" v-bind="t.props" />
    </van-tab>
  </van-tabs>
</template>

<style lang="scss">
  .van-tabs__wrap {
    overflow: visible;
  }
  .van-tabs__nav--card {
    height: 48px;
    border: 0;
    margin: 0;
    background: transparent;
  }
  .van-tab--card {
    color: $color-font;
    line-height: 1;
    font-weight: 500;
    font-feature-settings: "palt" 1;
    text-align: center;
    border: 1px solid fade-out($color9, 0.85);
    box-shadow: 2px 2px 3px lighten($color8, 12);
    cursor: pointer;
    transition: 0.2s;

    &:hover,
    &:focus,
    &.van-tab--active {
      color: darken($color13, 20);
      box-shadow: unset;
      border: 2px solid $color13;
      background-image: linear-gradient(to right top, #f0e596, rgb(255, 249.2429906542, 199), #e6cca6);
    }
  }
</style>
