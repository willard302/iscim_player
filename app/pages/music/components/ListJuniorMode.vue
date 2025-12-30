<script setup lang="ts">
import ListJuniorBuildNewSet from './ListJuniorBuildNewSet.vue';
import ListJuniorLoadSet from './ListJuniorLoadSet.vue';
interface TabItem {
  name: string,
  comp: any,
  action?: any,
  props?: Record<string, any>;
  events?: Record<string, (...args: any[]) => void>
}

const emit = defineEmits(['remove-all', 'handle-play'])

const menuStore = useMenuStore();
const musicStore = useMusicStore();

const active = ref('Menu.build_new_set')

const build_new_set = ref<TabItem>({ 
  name: "Menu.build_new_set", 
  comp: shallowRef(ListJuniorBuildNewSet),
  events: {
    'submit': () => submitCustomSet()
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
  if(!musicStore.isPro) return;
  items.value = [build_new_set.value, ...items.value]
});



const submitCustomSet = () => {

  emit('handle-play');
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
