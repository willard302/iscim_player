<script setup lang="ts">
import ListJuniorBuildNewSet from './ListJuniorBuildNewSet.vue';
import ListJuniorLoadSet from './ListJuniorLoadSet.vue';
import { useMenuStore } from '~/store/useMenuStore';
import { useMusicStore } from '~/store/useMusicStore';
import type { SubMusic } from '~/types/data.types';
import type { MusicRow } from '~/types/supabase';
interface TabItem {
  name: string,
  comp: any,
  action?: any,
  props?: Record<string, any>;
  events?: Record<string, (...args: any[]) => void>
}

const emit = defineEmits(['remove-all', 'handle-play', 'handle-save-set'])

const menuStore = useMenuStore();
const musicStore = useMusicStore();

const active = ref('Menu.build_new_set')
const subMusicLocal = ref<SubMusic[]>([]);
const musicListsSelected = ref([]);
const musicOrder = ref(0);
const showMenu = ref("");

const build_new_set = ref<TabItem>({ 
  name: "Menu.build_new_set", 
  comp: shallowRef(ListJuniorBuildNewSet), 
  props: {
    subMusicLocal: subMusicLocal
  },
  events: {
    'submit': (e:any) => submitCustomSet(e)
  }
})

const items = ref<TabItem[]>([
  { 
    name: "Menu.load_set", 
    comp: shallowRef(ListJuniorLoadSet)
  },
  { 
    name: "Menu.remove_all", 
    comp: null,
    action: () => emit('remove-all')
  }
]);

onMounted(() => {
  initMusicListsSelected();
  if(!musicStore.isPro) return;
  items.value = [build_new_set.value, ...items.value]
});

const initMusicListsSelected = () => {
  musicListsSelected.value = [];
  musicOrder.value = 0;
  
  if (subMusicLocal.value && Array.isArray(subMusicLocal.value)) {
    subMusicLocal.value = musicStore.subMusicUpdated.map(category => {
      const newCategory = { ...category };
      if (newCategory.menu && Array.isArray(newCategory.menu)) {
        newCategory.menu = newCategory.menu.map((item: MusicRow) => ({
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
    mode: "",
    category: "custom",
    chakras: [],
    content: []
  };
};

const submitCustomSet = (e: any) => {
  console.log(e)
  if (showMenu.value === "") {
    showNotify({message:"message.please_select_a_music_situation"})
    return;
  };
  const setToEmit = JSON.parse(JSON.stringify(musicStore.newSet));

  emit('handle-play', setToEmit);
  emit('handle-save-set', setToEmit);

  // 重置状态
  menuStore.resetStep();
  initMusicListsSelected();
};

const OnBeforeChange = (name: string) => {
  const targetItem = items.value.find(i => i.name === name);

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
        v-on="t.events || {}"
      />
    </van-tab>
  </van-tabs>
</template>

<style lang="scss"></style>
