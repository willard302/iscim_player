<script setup lang="ts">
import { useMenuStore } from '~/store/useMenuStore';
import type { MusicMenu } from '~/types/data.types';

  const props = defineProps<{
    lists: MusicMenu[] 
  }>();

  const emit = defineEmits(["remove-all"]);

  const menuStore = useMenuStore();

  const handleRemoveALl = () => {
    emit("remove-all")
  };
</script>

<template>
  <van-list>
    <van-cell 
      v-for="(item, idx) in props.lists" 
      :key="idx"
      :title="$t(item.name)"
      @click="menuStore.toggleMenu(item.id)"
    />
    <van-cell 
      :title="$t('clean_all')"
      @click="handleRemoveALl()"
    />
  </van-list>
</template>

<style scoped></style>
