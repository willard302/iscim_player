<script setup lang="ts"></script>
<template>
  <div class="wrap">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<style scoped lang="scss">
@use "sass:color";

.wrap {
  position: relative;
  background-color: $color1;

  @include Pad {
    max-width: 576px;
    margin: 10px auto;
    box-shadow: 2px 2px 3px color.scale($color8, $lightness: 12%);
    border-radius: 10px;
  }
}
</style>