<script setup lang="ts">

interface Props {
  title?: string
  leftIcon?: string
  onBack?: () => void
};

const props = withDefaults(defineProps<Props>(), {
  title: '',
  leftIcon: 'arrow-down',
  onBack: undefined
});

const emit = defineEmits(['click-left']);

const handleClickLeft = () => {
  if (props.onBack) {
    props.onBack();
  } else {
    emit('click-left')
  };
};

</script>

<template>
  <div>
    <van-nav-bar
      class="page__header"
      :border="false"
      @click-left="handleClickLeft"
    >
      <template #left>
        <van-icon :name="leftIcon" size="24" color="#333" />
      </template>
      <template #title>
        <slot name="title">
          <span class="nav-title">{{ title }}</span>
        </slot>
      </template>
      <template #right>
        <slot name="right"></slot>
      </template>
    </van-nav-bar>
  </div>
</template>

<style scoped lang="scss">
  .page__header {
    background-color: transparent;
    flex-shrink: 0;

    :deep(.van-nav-bar__title) {
      font-weight: 600;
    }
    
    :deep(.van-nav-bar__right) {
      right: 18px;
    }
  }

  .nav-title {
    font-size: 16px;
    color: #333;
  }

</style>
