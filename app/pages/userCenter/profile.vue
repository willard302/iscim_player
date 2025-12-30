<script setup lang="ts">
definePageMeta({ 
  title: 'user_data',
  showHeader: true,
  showTabbar: false
});
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
  <div class="page__container">
    <DataForm
      :user-data="mainStore.userInfo"
      :editable="isEditable"
      @editable="onEdit"
      @submit="onSubmit"
    />
  </div>
</template>

<style scoped lang="scss">
@use "sass:color";

.van-form {
  position: fixed;
  top: $height_top;
  left: 0;
  width: 100%;
  height: calc(100vh - $height_bottom);
  margin-bottom: 0;
  background: $color1;
}
</style>
