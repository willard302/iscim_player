<script setup lang="ts">
definePageMeta({title: "introduce"})
</script>

<template>
  <div class="introduce__container">
    <div class="article__container">
      <p>{{ $t('introduce_article') }}</p>
    </div>
    <div class="notice__container">
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
    </div>
  </div>
</template>

<style scoped>

.van-notice-bar {
  border: 1.5px solid #000000;
  border-radius: 10px;
  --van-notice-bar-line-height: 20px;
  margin-top: 10px;
}

.introduce__container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  overflow-y: scroll;
}

.article__container {
  line-height: 24px;
}

.disclaimer {
  align-items: flex-start;
}
</style>
