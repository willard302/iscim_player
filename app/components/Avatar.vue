<script setup lang="ts">
import avatar_default from '~/assets/img/avatar.png';
import type { UploaderFileListItem } from 'vant';
import type { UploaderAfterRead } from 'vant/es';

const { uploadFile, deleteFile } = useStorage();
const { updateUser } = useDataBase();
const mainStore = useMainStore();

const getAvatarUrl = () => mainStore.userInfo.avatar_url || avatar_default;

const fileList = ref<UploaderFileListItem[]>([
  { url: getAvatarUrl(), isImage: true }
]);

watch(
  () => mainStore.userInfo?.avatar_url,
  (newVal) => {
    fileList.value = [{url: newVal || avatar_default, isImage: true}]
  }
)

const onAfterRead: UploaderAfterRead = async (item) => {

  const fileItem = Array.isArray(item) ? item[0] : item;
  if (!fileItem || !fileItem.file) return;

  if (!mainStore.userInfo || !mainStore.userInfo.id) {
    showFailToast(`There is no user or userId.`);
    return;
  };

  const user_id = mainStore.userInfo.id;
  const oldUrl = mainStore.userInfo.avatar_url;

  const loading = showLoadingToast($t("Toast.loading"));

  try {
    const uploadResult = await uploadFile(fileItem, "iscim_avatar");

    if (!uploadResult || uploadResult.length === 0) {
      throw new Error("Upload failed, no URL returned.");
    };
    const newUrl = uploadResult[0];

    const updateResult = await updateUser(user_id, { avatar_url: newUrl });
    if (!updateResult) throw new Error("Update user database failed.");

    mainStore.userInfo.avatar_url = newUrl;
    fileList.value = [{url: newUrl, isImage: true}];

    if (oldUrl && oldUrl !== newUrl && !oldUrl.includes('assets/image')) {
      try {
        await deleteFile([oldUrl], 'iscim_avatar');
      } catch (delErr) {
        console.warn(`process successfully, but old avatar deleted failed, ${delErr}`)
      }
    };

    loading.close();
    showToast('update avatar successfully');
    
  } catch (error) {
    console.error(error);
    loading.close();
    showFailToast("update failed, try it again later please.");

    fileList.value = [{url: getAvatarUrl(), isImage: true}]

  };

};

</script>

<template>
  <van-field name="uploader" :border="false">
    <template #input>
      <van-uploader 
        v-model="fileList"
        :after-read="onAfterRead"
        preview-size="160px"
        :deletable="false"
        :show-upload="false"
        reupload
      />
    </template>
  </van-field>
</template>

<style scoped lang="scss">
:deep(.van-field__control) {
  justify-content: center;
}
:deep(.van-uploader__preview-image),
:deep(.van-uploader__upload) {
  border-radius: 50%;
  border: 4px solid rgb(192, 241, 255); // 稍微加粗邊框讓效果更明顯
  object-fit: cover; // 確保圖片在圓形中不會變形
  width: 160px;
  height: 160px;
}
:deep(.van-uploader__preview-delete) {
  display: none;
}
</style>
