<script setup lang="ts">
definePageMeta({ title: 'user_data' });
import { useMainStore } from '~/store/useMainStore';
import DataForm from './components/DataForm.vue';
import type { UserRow } from '~/types/supabase';

const mainStore = useMainStore();
const { updateUser } = useDataBase();
const isEditable = ref(false);

const onSubmit = async (val: Partial<UserRow>) => {
  if (!mainStore.userInfo || !mainStore.userInfo.id) throw new Error("There is no user data or user id.");

  showLoadingToast($t("Message.loading"));

  mainStore.setUser(val)
  await updateUser(mainStore.userInfo.id, mainStore.userInfo);
  
  showSuccessToast({
    message: $t("Message.save_successfully"),
    onClose: () => isEditable.value = false
  });
};

const onEdit = (val:boolean) => {
  isEditable.value = val;
};
</script>
<template>
  <DataForm
    :user-data="mainStore.userInfo"
    :editable="isEditable"
    @editable="onEdit"
    @submit="onSubmit"
  />
</template>

<style scoped lang="scss"></style>
