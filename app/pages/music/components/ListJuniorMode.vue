<script setup lang="ts">
import ListJuniorBuildNewSet from './ListJuniorBuildNewSet.vue';
import ListJuniorLoadSet from './ListJuniorLoadSet.vue';
import { useMenuStore } from '~/store/useMenuStore';
import { useMusicStore } from '~/store/useMusicStore';
import type { MusicMenu, Song } from '~/types/data.types';

const emit = defineEmits(['remove-all', 'handle-play', 'handle-save-set'])

const menuStore = useMenuStore();
const musicStore = useMusicStore();

const active = ref('Menu.build_new_set')
const isTab = ref("");
const musicListsLocal = ref<MusicMenu[]>([]);
const musicListsSelected = ref([]);
const musicOrder = ref(0);
const showMenu = ref("");
interface TabItem {
  name: string,
  comp: any,
  action?: any,
  props?: Record<string, any>;
  events?: Record<string, (...args: any[]) => void>
}
const items = reactive<TabItem[]>([
  { 
    name: "Menu.build_new_set", 
    comp: shallowRef(ListJuniorBuildNewSet), 
    props: {
      musicListsLocal: musicListsLocal
    },
    events: {
      'submit': (e) => submitCustomSet(e)
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
});

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
  musicStore.newSet = {
    name: "",
    type: "custom",
    mode: "",
    chakra: {},
    content: []
  };
};

const submitCustomSet = (e: any) => {
  if (showMenu.value === "") {
    showNotify({message:"message.please_select_a_music_situation"})
    return;
  };
  const setToEmit = JSON.parse(JSON.stringify(musicStore.newSet));

  emit('handle-play', setToEmit);
  emit('handle-save-set', setToEmit);

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
    default:
      if (menuStore.step === 2) {
        musicStore.newSet = item;
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
    class="custom-tab"
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
      <component 
        :is="t.comp" 
        v-bind="t.props" 
        v-on="t.events"
      />
    </van-tab>
  </van-tabs>
</template>

<style lang="scss"></style>
