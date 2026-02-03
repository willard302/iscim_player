<script setup lang="ts">
const musicStore = useMusicStore();
const { saveSet, removeSet } = usePlaylist();
const { updateSetToDb } = useDataBase();

const {uiState, fieldItems, currentItem, openOptions, openInfo} = useMusicDetail();

const acitveLoadSetTab = ref(0);

const actionOptions = reactive([
  {title: 'play', id: 'playCurrentSet', icon: 'play-circle-o' },
  {title: 'rename', id: 'renameCurrentSet', icon: 'edit', },
  {title: 'delete', id: 'removeCurrentSet', icon: 'delete-o', }
]);

const handleAction = (id: string) => {
  if (!currentItem.value) return;

  switch(id) {
    case 'playCurrentSet':
      openCurrentSet(currentItem.value);
      break;
    case 'renameCurrentSet':
      musicStore.currentSet = {...currentItem.value};
      uiState.showRenameSet = true;
      break;
    case 'removeCurrentSet':
      showConfirmDialog({
        title: 'Delete Playlist',
        message: `Are you sure you want to delete "${currentItem.value.name}"?`
      }).then(() => {
        removeSet(currentItem.value.id);
      }).catch(() => {
        console.log('cancel');
      });
      break;
  };
  uiState.showOptions = false;
};

const openCurrentSet = (item: any) => {
  musicStore.currentSet = item;
  musicStore.setPlayerSet(true);
};

const buildNewSet = () => {
  musicStore.initNewSet()
  uiState.showBuildNewSet = true;
};

const renameSet = async() => {
  if (!currentItem.value || !musicStore.currentSet.name) return;

  try {
    const newName = musicStore.currentSet.name;
    currentItem.value.name = newName;
    await updateSetToDb(currentItem.value.id, {name: newName});
  } catch (error) {
    showFailToast('Rename failed');
  };
};

const specificFields = ['category', 'name', 'intro', 'created_by', 'created_at'];
</script>

<template>
  <div class="page__container">
    <van-tabs
      v-model:active="acitveLoadSetTab"
      type="card"
      class="custom-tab"
    >
      <div class="tab-controls">
        <van-row justify="space-between" class="control-bar">
          <van-col>
            <van-button icon="fire-o">{{ $t(musicStore.chakra.name ?? 'Chakra.balance') }}</van-button>
          </van-col>
          <van-col>
            <van-button icon="add-square" @click="buildNewSet" />
          </van-col>
        </van-row>
      </div>
      <van-tab
        v-for="(m, mIdx) in musicStore.subSet"
        :key="mIdx"
        :title="$t(m.name)"
      >
        <div class="scrollable-list">
          <van-cell-group inset>
            <van-cell
              v-for="(item, index) in m.menu"
              :key="index"
              :title="item.name"
              clickable
              @click="openCurrentSet(item)"
            >
              <template #label>
                <van-text-ellipsis
                  :content="String(item.intro)"
                  expand-text=""
                  collapse-text=""
                />
              </template>
              <template #right-icon>
                <van-icon name="ellipsis" size="20" @click.stop="openOptions(item)" />
              </template>
            </van-cell>
          </van-cell-group>
        </div>
      </van-tab>
    </van-tabs>

    <CommonActionMenuPopup 
      v-model:show="uiState.showOptions"
      :title="currentItem?.name"
      :actions="actionOptions"
      @select="handleAction"
      @info="openInfo(specificFields)"
    />
    <CommonInfoDetailPopup 
      v-model:show="uiState.showInfo"
      :field-items="fieldItems"
    />
    <van-dialog
      v-model:show="uiState.showBuildNewSet"
      show-cancel-button
      @confirm="saveSet"
    >
      <van-cell-group inset>
        <van-field v-model="musicStore.newSet.name" label="歌單名稱" placeholder="請輸入歌單名稱" />
        <van-field v-model="musicStore.newSet.intro" label="歌單簡介" placeholder="請輸入歌單簡介" />
      </van-cell-group>
    </van-dialog>

    <van-dialog
      v-model:show="uiState.showRenameSet"
      show-cancel-button
      @confirm="renameSet"
    >
      <van-cell-group inset>
        <van-field v-model="musicStore.currentSet.name" label="歌單名稱" placeholder="請輸入歌單名稱" />
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<style scoped lang="scss">
:deep(.van-popup) {
  position: absolute;
}

:deep(.van-dialog) {
  padding-top: 10px;
}

.tab-controls {
  padding: 0px 10px;

  :deep(.van-icon-fire-o) {
    color: red;
  }
}

.van-cell-group--inset {
  --van-cell-group-background: transparent;
}

.van-cell--clickable {
  --van-cell-background: transparent;
  align-items: center;
}

.van-cell--clickable:active {
  background-color: transparent;
}
</style>
