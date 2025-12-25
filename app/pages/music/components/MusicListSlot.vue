<script setup lang="ts">
import { useMenuStore } from '~/store/useMenuStore'
import type { MusicMenu } from '~/types/data.types'

const props = defineProps<{
  list: MusicMenu,
  type?: string,
  className?: string
}>();
const emit = defineEmits(['get-music', 'save-music', 'remove-music']);

const newSet = ref("");
const onEmitMusic = (item:any) => {
  emit('get-music', item, item.chakra);
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
  <van-list>
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
