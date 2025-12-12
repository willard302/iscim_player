<script setup lang="ts">
definePageMeta({title: "introduce"})
</script>

<template>
  <van-space direction="vertical" :size="60">
    <div class="article__container">
      <p>{{ $t('introduce_article') }}</p>
    </div>
    <van-space direction="vertical">
      <van-notice-bar
        class="thanks"
        background="transparent"
        wrapable
      >
        <div>{{$t("Introduce.thanks")}}</div>
        <div>{{$t("Introduce.artist")}}</div>
        <div>{{$t("Introduce.composition")}}</div>
      </van-notice-bar>

      <van-notice-bar 
        class="disclaimer" 
        background="transparent"
        color="red"
        wrapable
      >
        《 {{$t("Disclaimer.title")}} 》 {{$t("Disclaimer.content")}}
      </van-notice-bar>
    </van-space>
  </van-space>
</template>

<style scoped>

.van-notice-bar {
  border: 1.5px solid #000000;
  border-radius: 10px;
  --van-notice-bar-line-height: 20px;
  margin-top: 10px;
}

.article__container {
  line-height: 24px;
}

.disclaimer {
  align-items: flex-start;
}
</style>
