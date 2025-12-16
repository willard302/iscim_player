<script setup lang="ts">
import DisclaimerNotice from '~/components/DisclaimerNotice.vue';

definePageMeta({title: "introduce"})
</script>

<template>
  <van-space class="main__content" direction="vertical" :size="60">
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
      <disclaimer-notice />
    </div>
  </van-space>
</template>

<style scoped>

.main__content {
  height: 100%;
  justify-content: space-between;
}

.article__container {
  line-height: 24px;
}
</style>
