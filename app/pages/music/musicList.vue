<script setup lang="ts">
definePageMeta({
  title:"music_list",
  showHeader: true,
  showTabbar: true,
  pageOrder: 3
});
import type { ChakraType } from '~/types/data.types';

const { addMusic, saveSet, removeSet, loadMusicSet, addChakra } = usePlaylist();

const router = useRouter();
const player = usePlayer();
const musicStore = useMusicStore();
const playerStore = usePlayerStore();
const menuStore = useMenuStore();

const subChakra: ChakraType[] = [
  { name: "Chakra.Balance", idx: 0, id: "Balance" },
  { name: "Chakra.Overall", idx: 99, id: "OverAll" },
  { name: "Chakra.Root", idx: 1, id: "Root" },
  { name: "Chakra.Sacral", idx: 2, id: "Sacral" },
  { name: "Chakra.Navel", idx: 3, id: "Navel" },
  { name: "Chakra.Waist", idx: 4, id: "Waist" },
  { name: "Chakra.Solar_Plexus", idx: 5, id: "Solar Plexus" },
  { name: "Chakra.Heart", idx: 6, id: "Heart" },
  { name: "Chakra.Pineal", idx: 7, id: "Pineal" },
  { name: "Chakra.Third_Eye", idx: 8, id: "Third Eye" },
  { name: "Chakra.Crown", idx: 9, id: "Crown" },
];

const {target} = useSwipeChange(() => router.push('/userCenter'), () => router.push('/music'))

const specified = (index: number) => {
  if (!playerStore.isPlaying) {
    playerStore.index = index;
    player.playIndex(index);
  } else if (playerStore.index === index) {
    player.pauseMusic()
  } else {
    player.pauseMusic();
    playerStore.index = index;
    player.playIndex(index);
  }
};
const removeList = (index: number) => {
  // 特殊情况：最后一个歌曲
  if (musicStore.queue.length <= 1) {
    player.pauseMusic();
    musicStore.queue.splice(index, 1);

    playerStore.index = 0;
    playerStore.src = "";
    musicStore.name = "Hints.select_music";
    return;
  };
  
  // 删除当前播放之后的歌曲
  if (index > playerStore.index) return musicStore.queue.splice(index, 1);
  
  // 删除正在播放的歌曲或之前的歌曲
  player.pauseMusic();
  if (index < playerStore.index) {
    // 删除之前的歌曲，调整当前索引
    playerStore.index--;
    musicStore.queue.splice(index, 1);
  } else if (index === playerStore.index) {
    // 删除当前歌曲，调整索引
    musicStore.queue.splice(index, 1);
    playerStore.index = playerStore.index !== 0 ? playerStore.index - 1 : 0;
  };
  player.playMusic();
};
const removeAll = () => {
  if (musicStore.queue.length <= 0) return showFailToast("列表已清空");
    showConfirmDialog({
    title: "警告",
    message: "確定要移除全部？"
  }).then(() => {
    player.pauseMusic();
    initPlayer();
  }).catch(() => console.log("cancel"))
};
const initPlayer = () => {
  musicStore.resetMusic();
  playerStore.resetPlayer();
};

</script>

<template>
  <div class="page__container h-full" ref="target">
    <div :class="['music__list__container', {'junior__mode': menuStore.isJuniorMenu}]">    
      <!-- 音乐列表主体 -->
      <div v-show="menuStore.isMusicList" class="musci__list__checkout">
        <van-list>
          <van-cell 
            v-for="(list, idx) in musicStore.queue" 
            :key="idx" 
            :class="[{ playing: playerStore.index == idx }]"
            center
            :id="list.id"
            :title="list.name"
            :value="(list.chakra as number)"
            @click="specified(idx)"
          >
            <template #right-icon>
              <font-awesome icon="trash" @click="removeList(idx)"/>
            </template>
          </van-cell>
        </van-list>
      </div>
      
      <van-divider />
      <disclaimer-notice />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "sass:color";
@import url("~/assets/scss/_transitions.scss");

.van-divider {
  --van-divider-margin: 10px auto;
}

.music__list__container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &.junior__mode {
    height: 130%;
  }
}

.musci__list__checkout {

  height: 60vh;
  overflow-y: auto;
  overflow-x: hidden;

  .van-cell {
    background: transparent;
  }

  :deep(.van-cell__value) {
    max-width: 24px;
    text-align: center;
  }

  .playing {
    background-color: $color-hover;
  }
}

.music__list__menu {

  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
  width: 100%;

  .van-cell {
    background: color.adjust($color: #ffffff, $alpha: -0.1);
  }
}
</style>
