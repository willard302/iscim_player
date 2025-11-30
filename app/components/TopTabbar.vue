<script setup lang="ts">
const props = defineProps<{
  items: any[],
  activeTab?: string,
  className?: string
}>();

const emit = defineEmits(["tab-change"])
const listClass = ref("");
const activeTab = ref("");

const handleTabChange = (item:any) => {
  activeTab.value = item.id;
  emit("tab-change", item.id)
};
</script>

<template>
  <ul :class="['tab__wrap', listClass, className]">
    <li
      v-for="(item, idx) in items"
      :key="idx" 
      :class="['tab__item']" 
      @click="handleTabChange(item)"
    >
      <div :class="['c-button-2', {'current': activeTab === item.id}]">
        {{$t(item.name)}}
        <span style="display: none;">{{activeTab}} - {{item.id}}</span>
      </div>
    </li>
  </ul>
</template>

<style scoped></style>
