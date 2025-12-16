<script setup lang="ts"></script>

<template>
  <van-notice-bar 
    class="disclaimer" 
    background="transparent"
    color="red"
    wrapable
  >
    《 {{$t("Disclaimer.title")}} 》 {{$t("Disclaimer.content")}}
  </van-notice-bar>
</template>

<style scoped lang="scss">
  .disclaimer {
    align-items: flex-start;
  }
</style>
