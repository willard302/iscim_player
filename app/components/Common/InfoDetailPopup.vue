<script setup lang="ts">
import type { FieldItem } from '~/types/data.types';

defineProps<{
  show: boolean
  title?: string
  fieldItems: FieldItem[]
}>();

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
}>();
</script>

<template>
  <van-popup
    :show="show"
    position="bottom"
    :duration="0.3"
    destroy-on-close
    round
    @update:show="emit('update:show', false)"
  >
    <van-cell 
      :title="$t('details')" 
      size="large" 
      align="center" 
      class="popup-title"
    />
    <FieldForm :field-items="fieldItems"/>
  </van-popup>
</template>

<style scoped></style>
