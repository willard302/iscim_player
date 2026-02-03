<script setup lang="ts">
interface ActionOption {
  title: string
  id: string
  icon: string
};

defineProps<{
  show: boolean
  title?: string
  actions: ActionOption[]
}>();

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void,
  (e: 'select', actionId: string): void,
  (e: 'info'): void,
}>();

const close = () => emit('update:show', false);
</script>

<template>
  <van-popup
    :show="show"
    class="sub-options"
    position="bottom"
    :duration="0.3"
    round
    @update:show="emit('update:show', $event)"
  >
    <van-cell :title="title" class="popup-header">
      <template #right-icon>
        <van-icon name="info-o" size="24" @click="emit('info')" />
      </template>
    </van-cell>
    <van-cell 
      v-for="action in actions"
      :key="action.id"
      :title="$t(action.title)"
      :icon="action.icon"
      clickable
      @click="emit('select', action.id)"
    />
  </van-popup>
</template>

<style scoped></style>
