<script setup lang="ts">
definePageMeta({
  title: "home",
  showHeader: true,
  showTabbar: true,
  pageOrder: 1
});
import DisclaimerNotice from '~/components/DisclaimerNotice.vue';
</script>

<template>
  <div class="page__container">
    <van-space class="home__container" direction="vertical" :size="60">
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
  </div>
</template>

<style scoped>
@import url("~/assets/scss/_transitions.scss");

.home__container {
  height: 100%;
  justify-content: space-between;
}

.article__container {
  line-height: 24px;
}
</style>
