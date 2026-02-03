<script setup lang="ts">
import type { MusicLocal } from '~/types/data.types';
import type { SetInsert } from '~/types/supabase';

interface Props {
  items?: MusicLocal[] | SetInsert[]
};

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  activeId: '',
  showActiveIcon: false
});

const emit = defineEmits(['click-item', 'click-option']);

const musicStore = useMusicStore();
const playerStore = usePlayerStore();

const isCurrent = (name: string):boolean => {
  if (musicStore.queue.length === 0) return false;
  return playerStore.currentSong?.name === name;
};
</script>

<template>
  <div class="scrollable-list">
    <van-cell-group inset>
      <van-cell
        v-for="(item, itemIdx) in items"
        :key="itemIdx"
        :title="item.name"
        clickable
        @click="emit('click-item', item)"
        :icon="isCurrent(item.name) ? 'play' : ''"
        :class="{'current-song': isCurrent(item.name)}"
      >
        <template #label>
          <van-text-ellipsis
            :content="String(item.intro || '')"
            expand-text=""
            collapse-text=""
          />
        </template>
        <template #right-icon>
          <div class="action-area" @click.stop="emit('click-option', item)">
            <van-icon name="ellipsis" size="20" />
          </div>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<style scoped lang="scss">
.scrollable-list {
  overflow-y: auto;
  padding-bottom: 10px;
  height: calc(100dvh - var(--van-tabs-card-height)*2 - var(--control-bar-h) - var(--header-h) - var(--tabbar-h) - var(--sat) - var(--sab));


  .van-cell-group--inset {
    --van-cell-group-background: transparent;
    --van-cell-group-inset-padding: 0;
  }

  .van-cell--clickable {
    --van-cell-background: transparent;
    align-items: start;
  }

  .van-cell-clickable:active {
    background-color: transparent;
    &.current {
      color: $pink-main;
      font-weight: bold;
    }
  }
}

.showMiniBar .scrollable-list {
  height: calc(100dvh - var(--van-tabs-card-height)*2 - var(--control-bar-h) - var(--header-h) - var(--tabbar-h) - var(--minibar-h) - var(--sat) - var(--sab));
}

.current {
  color: var(--van-primary-color);
  font-weight: bold;
}

.action-area {
  @include flex-center;
  padding: 6px 3px;
}
</style>
