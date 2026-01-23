<script setup lang="ts">
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

<style scoped lang="scss">
.home__container {
  height: 100%;
  justify-content: space-between;
}

.article__container {
  line-height: 24px;

  @include PadHeight {
    line-height: 36px;
    font-size: 18px;
  }
}

.page__container {
  padding: 10px 20px;
  width: 100%;
  overflow-x: hidden; /* 禁止水平捲軸 */
}
</style>
