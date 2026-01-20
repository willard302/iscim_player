<script setup lang="ts">
interface MusicItem {
  id: string | number
  name: string
  chakra?: number
  [key: string]: any
};

const musicStore = useMusicStore();

const checked = ref<MusicItem[]>([]);
const showSets = ref(false);

const isAllChecked = computed({
  get: () => {
    return musicStore.queue.length > 0 && checked.value.length === musicStore.queue.length;
  },
  set: (val: boolean) => {
    if (val) {
      checked.value = [...musicStore.queue];
    } else {
      checked.value = [];
    }
  }
});
const currentCount = computed(() => checked.value.length);

const toggle = (item: MusicItem) => {
  const index = checked.value.indexOf(item);
  if (index !== -1) {
    checked.value.splice(index, 1)
  } else {
    checked.value.push(item)
  }
};
const closeQueueEditor = () => {
  musicStore.setPlayerQueueEditor(false);
};
const handleDelete = () => {
  // musicStore.queue.filter(music => )
};
const handleAddInto = () => {
  showSets.value = true;
};
</script>

<template>
  <div class="queue-editor-fullscreen">
    <van-nav-bar
      :border="false"
      class="player-nav"
      @click-left="closeQueueEditor"
    >
      <template #left>
        <van-icon name="arrow-left" size="24" color="#333"/>
      </template>
      <template #title>
        <span class="nav-title">{{ $t('already_selected') + currentCount + $t('song') }}</span>
      </template>
      <template #right>
        <van-checkbox v-model="isAllChecked" @click.stop />
      </template>
    </van-nav-bar>

    <van-checkbox-group class="queue-container" v-model="checked">
      <van-cell-group class="queue-content" inset>
        <van-cell 
          v-for="(list, idx) in musicStore.queue" 
          :key="idx" 
          center clickable
          :id="list.id"
          :title="list.name"
          :value="(list.chakra as number)"
          icon="music-o"
          @click="toggle(list)"
        >
            <template #right-icon>
              <van-checkbox 
                :name="list"
                @click.stop
              />
            </template>
        </van-cell>
      </van-cell-group>
    </van-checkbox-group>

    <van-action-bar>
      <van-action-bar-icon icon="delete-o" text="刪除" @click="handleDelete" />
      <van-action-bar-icon icon="add-o" text="新增" @click="handleAddInto" />
    </van-action-bar>

    <van-popup 
      v-model:show="showSets"
      position="bottom"
      :duration="0.3"
    >
      <van-cell 
        v-for="item in musicStore.subSet[2]?.menu" 
        :key="item.id"
        :title="item.name"
      />

    </van-popup>
  </div>
</template>

<style scoped lang="scss">
@use "sass:color";

:deep(.van-nav-bar__right) {
  right: 18px;
}

.van-action-bar-icon {
  flex: 1;
}

.queue-fullscreen {
  height: 100%;
  padding-top: env(safe-area-inset-top);
}

.queue-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}


.queue-header {
  background: rgba(0, 0, 0, 0.3);
  height: 36px;

  .van-button {
    background: transparent;
    margin-right: 12px;
  }
}

.queue-content {
  flex: 1 1 80vh;
  overflow-y: auto;
  padding-bottom: calc(100px + env(safe-area-inset-bottom));

  .van-cell {
    background: transparent;
  }

  :deep(.van-cell__value) {
    max-width: 24px;
    text-align: center;
  }
}

.music__list__menu {

  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
  width: 100%;

  .van-cell {
    background: color.adjust($color: #ffffff, $alpha: -0.1);
  }
}
</style>
