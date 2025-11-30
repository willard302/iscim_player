<script setup lang="ts">
interface menuItem {
  id: string
  chakra: any
  value: string
  intro: string
  name: string
}
interface listObj {
  name: string
  class: string
  menu: menuItem[]
}
const props = defineProps<{
  list: listObj,
  type?: string,
  className?: string
}>();
const emit = defineEmits(['get-music', 'save-music', 'remove-music'])

const newSet = ref("");
const onEmitMusic = (item:any) => {
  emit('get-music', item);
};
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
    <template >
      <van-cell
        v-if="list.name === 'Set.custom' && type !== 'junior-mode'"
        class="medicalList"
      >
        <input 
          class="medical-info" 
          type="text" 
          placeholder="List Name" 
          v-model="newSet"
        >
        <div class="button__container" @click="onEmitSave">
          <button type="button">
            <font-awesome icon="floppy-disk" />
          </button>
        </div>
      </van-cell>
    </template>
    
    <!-- 音乐项列表 -->
    <van-list 
      v-for="(one, idx) of list.menu" 
      :key="idx" 
      class="medicalList"
      :value="one.value"
      @click="onEmitMusic(one)"
    >
      <van-cell 
        :title="one.name"
        :label="one.intro"
        :name="one.id"
      />

      <div class="button__container">
        <button v-if="list.name === 'Set.custom'" @click.stop="onEmitRemove(list.name, idx)">
          <font-awesome icon="trash" />
        </button>
      </div>
    </van-list>
  </van-list>
</template>

<style scoped></style>
