<script setup lang="ts">
import type { UploaderFileListItem } from 'vant';
import { useMainStore } from '~/store/useMainStore';
const mainStore = useMainStore();

const avatar_url = ref<UploaderFileListItem[]>([
  { url: mainStore.user.avatar }
]);

const onAfterRead = async (
  fileItem: UploaderFileListItem | UploaderFileListItem[]
) => {
  console.log(fileItem)
};

</script>

<template>
  <van-uploader 
    v-model="avatar_url"
    :after-read="onAfterRead"
    preview-size="160px"
    :deletable="false"
    :show-upload="false"
    reupload
  />
</template>

<style scoped lang="scss">
:deep(.van-image__img) {
  border-radius: 50%;
  overflow: hidden;
}
</style>
