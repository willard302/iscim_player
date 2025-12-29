<script setup lang="ts">
definePageMeta({
  title: "home",
  showHeader: true,
  showTabbar: true,
  pageOrder: 1
});
import DisclaimerNotice from '~/components/DisclaimerNotice.vue';
const router = useRouter();
const {target} = useSwipeChange(() => router.push('/music'), () => router.push('/userCenter'))
</script>

<template>
  <div class="page__container" ref="target">
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

.page__container {
  width: 100%;
  height: 100%;       /* 確保填滿父層 */
  overflow-x: hidden; /* 禁止水平捲軸 */
  
  /* 關鍵：告訴瀏覽器「水平滑動」由 JS 接管，不要觸發原生上一頁或捲動 */
  touch-action: pan-y;
}
</style>
