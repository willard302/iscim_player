<script setup lang="ts">
import { useMenuStore } from '~/store/useMenuStore'

interface menuItem {
  id: string
  chakra: any
  value: string
  intro: string
  name: string
}
interface listObj {
  name: string
  class?: string
  menu: menuItem[]
};

const props = defineProps<{
  list: listObj,
  type?: string,
  className?: string
}>();
const emit = defineEmits(['get-music', 'save-music', 'remove-music']);

const newSet = ref("");
const onEmitMusic = (item:any) => {
  console.log(item)
  emit('get-music', item);
};

const menuStore = useMenuStore();

const onEmitSave = () => {
  if (!newSet.value.trim()) return alert("Please input a name for the set");  
  emit('save-music', newSet.value);
  newSet.value = "";
};

const onEmitRemove = (setName:string, setIdx:number) => {
  const removeItem = {
    name: setName,
    index: setIdx
  };
  
  emit('remove-music', removeItem);
};
</script>

<template>
  <van-list :class="[list.class, className]">
    <van-field
      v-if="menuStore.openMenu === 'Set.custom' && type !== 'junior-mode'"
      v-model="newSet"
      placeholder="List Name"
    >
      <template #right-icon>
        <font-awesome icon="floppy-disk" @click="onEmitSave" />
      </template>
    </van-field>
    
    <!-- 音乐项列表 -->
    <van-cell
      v-for="(one, idx) of list.menu" 
      :key="idx"
      :value="one.value"
      :title="one.name"
      :label="one.intro"
      @click="onEmitMusic(one)"
    >
      <template v-if="list.name === 'Set.custom'"  #right-icon>
        <font-awesome 
          @click.stop="onEmitRemove(list.name, idx)" 
          icon="trash" 
        />
      </template>
    </van-cell>
  </van-list>
</template>

<style scoped>
.van-cell {
  align-items: center;
  svg {
    font-size: 1.4rem;
  }
}
</style>
