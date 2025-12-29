<script setup lang="ts">
definePageMeta({
  title:"music_list",
  showHeader: true,
  showTabbar: true,
  pageOrder: 3
});
import MenuSlot from './components/MenuSlot.vue';
import ListJuniorMode from './components/ListJuniorMode.vue';
import MusicListSlot from './components/MusicListSlot.vue';
import { useMenuStore } from '~/store/useMenuStore';
import { useMusicStore } from '~/store/useMusicStore';
import { usePlayerStore } from '~/store/usePlayerStore';
import type { ChakraType } from '~/types/data.types';

const { addMusic, saveSet, removeSet, loadMusicSet, addChakra } = usePlaylist();
const { getMusics, getSets } = useDataBase();

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

const menu_1th = computed(() => {
  const chakra = { name: musicStore.chakra.name, id: "chakra" };
  const set = { name: "Menu.set", id: "set" };
  const music = { name: "Menu.music", id: "music" };
  const myMusic = { name: "Menu.custom_music", id: "mymusic" };
  const pro = [chakra, set, music, myMusic];
  const pub = [set, music];
  return musicStore.isPro ? pro : pub;
});

const loadDataSets = async() => {

  const music_custom = await getMusics('custom') || [];
  const set_custom = await getSets({category: 'custom', is_pro: true});
  const set_numbers = await getSets({category: 'numbers', is_pro: musicStore.isPro});
  const set_five_elements = await getSets({category: 'five_elements', is_pro: musicStore.isPro});

  musicStore.subSet = [
    {
      name: "Set.numbers",
      id: "numbers",
      menu: set_numbers,
    },
    {
      name: "Set.five_elements",
      id: "five_elements",
      menu: set_five_elements
    }
  ];
  
  if (musicStore.isPro) {
    const custom_music = Array.isArray(music_custom) ? music_custom : [];

    musicStore.subSet.push({
      name: "Set.custom",
      id: "custom",
      menu: set_custom
    })

    musicStore.subMusicUpdated = [
      {
        name: "Menu.numbers_music",
        id: "numbers_music",
        menu: musicStore.composeMusic(custom_music, 'Numbers')
      },
      {
        name: "Menu.five_elements_music",
        id: "five_elements_music",
        menu: musicStore.composeMusic(custom_music, "Five_Elements")
      }
    ];
  }
};
const loadDataMusics = async() => {
  const music_default = await getMusics('default') || [];
  try {
    //  设置基础音乐数据 
    musicStore.subMusic = [
      {name: "Music.fast", id: "fast", menu: musicStore.composeMusic(music_default, 'Fast')},
      {name: "Music.medium", id: "medium", menu: musicStore.composeMusic(music_default, 'Medium')},
      {name: "Music.slow", id: "slow", menu: musicStore.composeMusic(music_default, 'Slow')}
    ];
    
    // 根据用户类型设置不同的数据集
    loadDataSets();
  } catch (error) {
    console.error('Error fetching APIs: ', error);
  };
};
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

onMounted(async() => {
  await loadDataMusics();
});
</script>

<template>
  <div class="page__container" ref="target">
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
  
      <!-- Junior模式 -->
      <ListJuniorMode 
        v-if="menuStore.isJuniorMenu"
        @remove-all="removeAll"
      />
  
      <div v-show="menuStore.isAdvancedMenu" class="music__list__menu">
  
        <MenuSlot
          v-show="menuStore.openMenu === 'navMenu'"
          :lists="menu_1th"
          @remove-all="removeAll"
        />
  
        <MenuSlot 
          v-show="menuStore.openMenu === 'music'"
          :lists="musicStore.subMusic"
        />
  
        <MusicListSlot
          v-for="(item, idx) in musicStore.subMusic" 
          :key="idx"
          v-show="menuStore.openMenu === item.id"
          :list="item"
          @get-music="addMusic"
        />
  
        <MenuSlot 
          v-show="menuStore.openMenu === 'mymusic'"
          :lists="musicStore.subMusicUpdated"
        />
  
        <MusicListSlot
          v-for="(item, idx) in musicStore.subMusicUpdated" 
          :key="idx"
          v-show="menuStore.openMenu === item.id"
          :list="item"
          @get-music="addMusic"
        />
  
        <MenuSlot 
          v-show="menuStore.openMenu === 'set'"
          :lists="musicStore.subSet"
        />
  
        <MusicListSlot
          v-for="(item, idx) in musicStore.subSet" 
          :key="idx"
          v-show="menuStore.openMenu === item.id"
          :list="item"
          @get-music="loadMusicSet"
          @save-music="saveSet"
          @remove-music="removeSet"
        />
  
        <van-list v-show="menuStore.openMenu === 'chakra'">
          <van-cell 
            v-for="(item, idx) in subChakra" 
            :key="idx"
            :title="$t(item.name)"
            @click="addChakra(item)"
          />
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
