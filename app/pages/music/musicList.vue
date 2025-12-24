<script setup lang="ts">
definePageMeta({title:"album_list", layout: "music"});
import MenuSlot from './components/MenuSlot.vue';
import ListJuniorMode from './components/ListJuniorMode.vue';
import MusicListSlot from './components/MusicListSlot.vue';
import { useMenuStore } from '~/store/useMenuStore';
import { useMusicStore } from '~/store/useMusicStore';
import { usePlayerStore } from '~/store/usePlayerStore';
import type { ChakraType } from '~/types/data.types';

const { addMusic, saveSet, removeSet, loadSongSets, addChakra } = usePlaylist();
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
const menu_1th = computed(() => {
  const chakra = { name: musicStore.chakra.name, id: "chakra" };
  const set = { name: "Menu.set", id: "set" };
  const music = { name: "Menu.music", id: "music" };
  const myMusic = { name: "Menu.custom_music", id: "mymusic" };
  const pro = [chakra, set, music, myMusic];
  const pub = [set, music];
  return musicStore.isPro ? pro : pub;
});

const getApiUrls = () => {
  if (musicStore.isPro) {
    return [
      "/music_default/menu.json",
      "/music_set/default_pro.json",
      "/music_set/default_fiveElements.json",
      "/music_set/custom_new.json",
      "/music_custom/menu.json",
    ];
  };
  
  return [
    "/music_default/menu.json", 
    "/music_set/default_pub.json",
    "/music_set/default_fiveElements.json",
  ];
};

const setupDataSets = (result:any) => {
  if (musicStore.isPro) {
    musicStore.subSet = [
      {
        name: "Set.numbers",
        menu: result[1],
      },
      {
        name: "Set.five_elements",
        menu: result[2]
      },
      {
        name: "Set.custom",
        menu: result[3],
      }
    ];
    musicStore.subMusicUpdated = [
      {
        name: "Menu.numbers_music",
        menu: musicStore.composeMusic(result[4], 'Numbers')
      },
      {
        name: "Menu.five_elements_music",
        menu: musicStore.composeMusic(result[4], "Five_Elements")
      }
    ];
  } else {
    musicStore.subSet = [
      {
        name: "Set.numbers",
        menu: result[1],
      },
      {
        name: "Set.five_elements",
        menu: result[2]
      }
    ];
  };
};
const loadApiData = async() => {

  const apiUrls = getApiUrls();

  try {
    const request = apiUrls.map(async( url ) => {
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP ERROR! Status: ${res.status}, URL: ${url}`);
      };

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") === -1) {
        const text = await res.text();
        console.error(`錯誤:預期是JSON但收到HTML，請檢查路徑${url}`);
        console.error(`回傳內容預覽：${text.substring(0, 50)}`);
      };
      return res.json();
    });
    const result = await Promise.all(request);
    //  设置基础音乐数据 
    musicStore.subMusic = [
      {name: "Music.fast", id: "fast", menu: musicStore.composeMusic(result[0], 'Fast')},
      {name: "Music.medium", id: "medium", menu: musicStore.composeMusic(result[0], 'Medium')},
      {name: "Music.slow", id: "slow", menu: musicStore.composeMusic(result[0], 'Slow')}
    ];
    
    // 根据用户类型设置不同的数据集
    setupDataSets(result);
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
  player.pauseMusic();
  initPlayer();
};
const initPlayer = () => {
  musicStore.resetMusic();
  playerStore.resetPlayer();
};

onMounted(async() => {
  await loadApiData();
});
</script>

<template>
  <div>
  
    <!-- 音乐列表主体 -->
    <div v-show="menuStore.active.musicList" class="list__container checkout">
      <van-list>
        <van-cell 
          v-for="(list, idx) in musicStore.queue" 
          :key="idx" 
          :class="[{ playing: playerStore.index == idx }]"
          center
          :id="list.id"
          :title="list.name"
          :value="list.chakra"
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
      v-if="menuStore.active.juniorMenu"
      @remove-all="removeAll"
    />

    <div v-show="menuStore.active.advanceMenu" class="list__container menu">

      <MenuSlot
        v-show="menuStore.openMenu === 'navMenu'"
        :lists="menu_1th"
        @remove-all="removeAll"
      />
      <!-- <van-list v-show="menuStore.openMenu === 'navMenu'">
        <van-cell 
          v-for="(item, idx) in menu_1th" 
          :key="idx"
          :title="$t(item.name)"
          @click="menuStore.toggleMenu(item.id)"
        />
        <van-cell 
          :title="$t('clean_all')"
          @click="removeAll()"
        />
      </van-list> -->

      <MenuSlot 
        v-show="menuStore.openMenu === 'music'"
        :lists="musicStore.subMusic"
      />
      <!-- <van-list v-show="menuStore.openMenu === 'music'">
        <van-cell
          v-for="(item, idx) in musicStore.subMusic" 
          :key="idx" 
          :title="$t(item.name)"
          @click="menuStore.toggleMenu(item.id)"
        />
      </van-list> -->

      <MenuSlot 
        v-show="menuStore.openMenu === 'mymusic'"
        :lists="musicStore.subMusicUpdated"
      />
      <!-- <van-list v-show="menuStore.openMenu === 'mymusic'">
        <van-cell 
          v-for="(item, idx) in musicStore.subMusicUpdated"
          :key="idx"
          :title="$t(item.name)"
          @click="menuStore.toggleMenu(item.name)"
        />
      </van-list> -->

      <MenuSlot 
        v-show="menuStore.openMenu === 'set'"
        :lists="musicStore.subSet"
      />
      <!-- <van-list v-show="menuStore.openMenu === 'set'">
        <van-cell 
          v-for="(item, idx) in musicStore.subSet"
          :key="idx"
          :title="$t(item.name)"
          @click="menuStore.toggleMenu(item.name)"
        />
      </van-list> -->
      
      <!-- <MenuSlot 
        v-show="menuStore.openMenu === 'chakra'"
        :lists="subChakra"
      />  -->
      <van-list v-show="menuStore.openMenu === 'chakra'">
        <van-cell 
          v-for="(item, idx) in subChakra" 
          :key="idx"
          :title="$t(item.name)"
          @click="addChakra(item)"
        />
      </van-list>

      <!-- 音乐列表槽 -->
      <MusicListSlot
        v-for="(item, idx) in musicStore.subMusic" 
        :key="idx"
        v-show="menuStore.openMenu === item.name"
        :list="item"
        @get-music="addMusic"
      />
      <!-- updated -->
      <MusicListSlot
        v-for="(item, idx) in musicStore.subMusicUpdated" 
        :key="idx"
        v-show="menuStore.openMenu === item.name"
        :list="item"
        @get-music="addMusic"
      />
      
      <!-- 集合菜單 -->
      <MusicListSlot
        v-for="(item, idx) in musicStore.subSet" 
        :key="idx"
        v-show="menuStore.openMenu === item.name"
        :list="item"
        @get-music="loadSongSets"
        @save-music="saveSet"
        @remove-music="removeSet"
      />
    </div>
    <van-divider />
    <disclaimer-notice />
  </div>
</template>

<style scoped lang="scss">
@use "sass:color";
.list__container {
  width: 100%;
}

.list__container.checkout {

  .van-list {
    height: 60vh;
    overflow-y: scroll;
  }

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

.list__container.menu {

  position: absolute;
  top: 48px;
  left: 0;
  z-index: 99;

  .van-cell {
    background: color.adjust($color: #ffffff, $alpha: -0.1);
  }
}
</style>
