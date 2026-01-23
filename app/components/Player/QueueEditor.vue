<script setup lang="ts">
interface QueueItem {
  id: string | number
  name: string
  chakra?: number
  [key: string]: any
};

const musicStore = useMusicStore();
const playerStore = usePlayerStore();

const checked = ref<number[]>([]);
const showSets = ref(false);

const isAllChecked = computed({
  get: () => {
    return musicStore.queue.length > 0 && checked.value.length === musicStore.queue.length;
  },
  set: (val: boolean) => {
    if (val) {
      checked.value = musicStore.queue.map((_, index) => index);
    } else {
      checked.value = [];
    }
  }
});
const currentCount = computed(() => checked.value.length);

const toggle = (index: number) => {
  const existingIndex = checked.value.indexOf(index);
  if (existingIndex !== -1) {
    checked.value.splice(existingIndex, 1)
  } else {
    checked.value.push(index)
  }
};

const closeQueueEditor = () => {
  checked.value = [];
  musicStore.setPlayerQueueEditor(false);
};

const handleDelete = () => {
  if (checked.value.length === 0) return;

  const sortedIndices = [...checked.value].sort((a, b) => b - a);

  let currentPlayerIndex = playerStore.index;
  let isCurrentPlayingRemoved = false;
  
  sortedIndices.forEach(index => {
    musicStore.queue.splice(index, 1);
    if (index < currentPlayerIndex) {
      currentPlayerIndex--;
    } else if (index === currentPlayerIndex) {
      isCurrentPlayingRemoved = true;
    };
  });

  if (musicStore.queue.length === 0) {
    playerStore.index = -1;
    playerStore.isPlaying = false;
  } else {
    playerStore.index = Math.max(0, Math.min(currentPlayerIndex, musicStore.queue.length - 1));
  };

  checked.value = [];
};

const handleAddInto = () => {
  if (checked.value.length === 0) return;
  showSets.value = true;
};
</script>

<template>
  <div class="queue-editor-fullscreen fullscreen">
    <SubPageHeader
      left-icon="arrow-down"
      @click-left="closeQueueEditor"
    >
      <template #title>
        <span class="nav-title">
          {{ $t('already_selected') + currentCount + $t('song') }}
        </span>
      </template>
      <template #right>
        <van-checkbox v-model="isAllChecked" />
      </template>
    </SubPageHeader>
    

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
          @click="toggle(idx)"
        >
            <template #right-icon>
              <van-checkbox :name="idx" @click.stop />
            </template>
        </van-cell>
      </van-cell-group>
    </van-checkbox-group>

    <van-action-bar>
      <van-action-bar-icon 
        icon="delete-o" text="刪除" 
        @click="handleDelete" 
      />
      <van-action-bar-icon 
        icon="add-o" text="新增" 
        @click="handleAddInto" 
      />
    </van-action-bar>

    <van-popup 
      v-model:show="showSets"
      position="bottom"
      round
      :style="{height: '40%'}"
    >
      <van-cell-group title="收藏歌單">
        <van-cell title="新建播放清單" icon="plus" is-link/>
        <van-cell 
          v-for="item in musicStore.subSet[2]?.menu" 
          :key="item.id"
          :title="item.name"
          clickable
        />
      </van-cell-group>
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

.queue-editor-fullscreen {
  display: flex;
  flex-direction: column;
  background-color: var(--van-background-2);
}

.queue-container {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 60px;
}

.queue-content {
  margin-top: 10px;

  :deep(.van-cell__value) {
    max-width: 24px;
    text-align: center;
  }
}
</style>
