<script setup lang="ts">
import PlayListSelect from "~/pages/playList/index.vue";
import IntroduceView from "~/pages/introduce/index.vue";
import MusicLibraryView from "~/pages/musicLibrary/index.vue";
import type { SwipeInstance } from "vant";

const mainStore = useMainStore();
const swipeRef = ref<SwipeInstance | null>(null);

const onChange = (index: number) => {
  mainStore.setCurrentTab(index);
};

watch(
  () => mainStore.currentTab,
  (val) => swipeRef.value?.swipeTo(val)
);

onMounted(() => {
  mainStore.setCurrentTab(0);
});

</script>

<template>
  <div class="main__container">
    <van-swipe
      ref="swipeRef"
      class="full-height-swipe"
      :loop="true"
      :show-indicators="false"
      touchable
      stop-propagation
      @change="onChange"
    >
      <van-swipe-item>
        <div class="page__wrapper">
          <keep-alive>
            <IntroduceView />
          </keep-alive>
        </div>
      </van-swipe-item>
      <van-swipe-item>
        <div class="page__wrapper">
          <keep-alive>
            <MusicLibraryView />
          </keep-alive>
        </div>
      </van-swipe-item>
      <van-swipe-item>
        <div class="page__wrapper">
          <keep-alive>
            <PlayListSelect />
          </keep-alive>
        </div>
      </van-swipe-item>

    </van-swipe>
  </div>
</template>

<style scoped lang="scss">
.main-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f5f5;
}

.full-height-swipe {
  height: 100%; /* 讓 Swipe 撐滿父容器 */
}

/* 確保每一個 Slide 也是滿版 */
:deep(.van-swipe-item) {
  height: 100%;
  width: 100%;
}

/* 關鍵修正：
  內層容器處理垂直捲動 (overflow-y: auto)。
  這樣做可以避免 Vant 搶走垂直滑動的事件。
*/
.page-wrapper {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* iOS 滑動慣性 */
}
</style>
