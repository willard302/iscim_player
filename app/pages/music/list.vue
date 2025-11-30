<script setup lang="ts">
definePageMeta({title:"album_list", layout: "music"})
import { useMainStore } from '~/store/useMain';
import { useMenuStore } from '~/store/useMenu';
import { useMusicStore } from '~/store/useMusic';
import type { chakraItem, chakraType } from '~/types/data.types';
const { playMusic, pauseMusic, addMusic, saveSet, removeSet, loadSongSets, addChakra} = usePlayer();
const mainStore = useMainStore();
const musicStore = useMusicStore();
const menuStore = useMenuStore();
const user = mainStore.user;
const subChakra: chakraItem[] = [
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
const subMusicUpdated = ref([]);
const menu_1th = computed(() => {
  const chakra = { name: musicStore.chakra.name, id: "chakra" };
  const set = { name: "Menu.set", id: "set" };
  const music = { name: "Menu.music", id: "music" };
  const myMusic = { name: "Menu.custom_music", id: "mymusic" };
  const pro = [chakra, set, music, myMusic];
  const pub = [set, music];
  return user && user.musicTherapy ? pro : pub;
});

const updateSubMusic = () => {
  const fastMenu = musicStore.subMusic.map(music => ({
    ...music,
    name: `Fast ${music.name}`
  }));
  const medMenu = musicStore.subMusic.map(music => ({
    ...music,
    name: `Medium ${music.name}`
  }));
  const slowMenu = musicStore.subMusic.map(music => ({
    ...music,
    name: `Slow ${music.name}`
  }));
  const newResult = [
    {name: "Fast", menu: fastMenu},
    {name: "Medium", menu: medMenu},
    {name: "Slow", menu: slowMenu}
  ];
  return newResult;
};
// ============== API数据加载 ==============
const loadApiData = async() => {
  // 根据用户类型确定API URL
  let apiUrls = getApiUrls();
  
  try {
    // 并行请求所有API
    const responses = await Promise.all(apiUrls.map(url => fetch(url)));
    const result = await Promise.all(
      responses.map(res => {
        if(!res.ok) throw new Error(`Failed to fetch: ${res.url} - ${res.status}`)
        return res.json();
      })
    );
    
    // 设置基础音乐数据
    musicStore.subMusic = result[0];
    
    // 根据用户类型设置不同的数据集
    setupDataSets(result);
  } catch (error) {
    console.error('Error fetching APIs: ', error);
  }
};
const getApiUrls = () => {
  if (musicStore.type === 'pro') {
    return [
      "/music_default/menu.json",
      "/music_set/default_pro.json",
      "/music_set/default_fiveElements.json",
      "/music_set/custom_new.json",
      "/music_set/custom_test.json",
    ];
  };
  
  return [
    "/music_default/menu.json", 
    "/music_set/default_pub.json",
    "/music_set/default_fiveElements.json",
  ];
};
const setupDataSets = (result:any) => {
  if (musicStore.type === 'pro') {
    musicStore.subSet = [
      {
        name: "Set.numbers",
        class: "numbersSet",
        menu: result[1],
      },
      {
        name: "Set.five_elements",
        class: "fiveElementsSet",
        menu: result[2]
      },
      {
        name: "Set.custom",
        class: "customSet",
        menu: result[3],
      }
    ];
    subMusicUpdated.value = result[4];
  } else {
    musicStore.subSet = [
      {
        name: "Set.numbers",
        class: "numbersSet",
        menu: result[1],
      },
      {
        name: "Set.fiveElements",
        class: "fiveElementsSet",
        menu: result[2]
      }
    ];
  }
};
const specified = (index: number) => {
  pauseMusic();
  musicStore.index = index;
  playMusic();
};

const removeList = (index: number) => {
  // 特殊情况：最后一个歌曲
  if (musicStore.lists.length <= 1) {
    pauseMusic();
    musicStore.lists.splice(index, 1);
    initPlayer();
    return;
  };
  
  // 删除当前播放之后的歌曲
  if (index > musicStore.index) return musicStore.lists.splice(index, 1);
  
  // 删除正在播放的歌曲或之前的歌曲
  pauseMusic();
  if (index < musicStore.index) {
    // 删除之前的歌曲，调整当前索引
    musicStore.index--;
    musicStore.lists.splice(index, 1);
  } else if (index === musicStore.index) {
    // 删除当前歌曲，调整索引
    musicStore.lists.splice(index, 1);
    musicStore.index = musicStore.index !== 0 ? musicStore.index - 1 : 0;
  };
  playMusic();
};
const removeAll = () => {
  pauseMusic();
  initPlayer();
};
const initPlayer = () => {
  musicStore.lists = [];
  musicStore.index = -1;
  musicStore.src = "";
  musicStore.title = "Please Select Music";
  musicStore.currentTime = "00:00";
  musicStore.duraTime = "00:00";
};

onMounted(async() => {
  const res = await loadApiData();
  const res2 = updateSubMusic()
});
</script>

<template>
  <div :class="['list__container', {'openNav': menuStore.openMenu !== 'off'}]">
    <!-- Junior模式 -->
    <!-- <template v-if="isJuniorMode">
      <music-list-junior 
        :musicLists="subMusicUpdated"
        :subSet="subSet"
        :user="user"
        :chakra="chakra"
        :openMenu="openMenu"
        @hand-play="$emit('handle-play', $event)"
        @hand-play-set="$emit('load-song-sets', $event)"
        @hand-save-set="saveSet"
        @hand-toggle-menu="toggleMenu"
        @remove-all="removeAll"
        @hand-remove-set="removeSet"
      ></music-list-junior>
    </template> -->
  
    <!-- 音乐列表主体 -->
    <van-list class="audio__list__body">
      <van-cell 
        v-for="(list, idx) in musicStore.lists" 
        :key="idx" 
        class="audio__list__item" 
        :id="list.id"
      >
        <button 
          :class="[
            'audio__list__button audio__list__button--item', 
            { playing: musicStore.index == idx },
          ]"
          @click="specified(idx)">
          {{ list.title }}
        </button>
        <label v-if="user" class="text-m">{{ list.chakra }}</label>
        <button 
          class="audio__list__button audio__list__button--delete text-m" 
          @click="removeList(idx)"
        >
          <font-awesome icon="trash" />
        </button>
      </van-cell>
    </van-list>

    <!-- 子菜单 -->
    <div v-show="menuStore.openMenu !== 'off'" class="audio__subMenu">
      <div class="subMenu__container">
        <!-- 导航菜单 -->
        <van-list v-show="menuStore.openMenu === 'navMenu'">
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
        </van-list>

        <!-- 音乐菜单 -->
        <van-list v-show="menuStore.openMenu === 'music'">
          <van-cell
            v-for="(item, idx) in musicStore.subMusic" 
            :key="idx" 
            :title="item.name"
            @click="menuStore.toggleMenu(item.name)"
          />
        </van-list>

        <!-- 用户音乐菜单 -->
        <template v-if="musicStore.subMusicUpdated">
          <van-list v-show="menuStore.openMenu === 'mymusic'"
            v-for="(item, idx) in musicStore.subMusicUpdated"
            :key="idx"
          >
            <van-cell 
              @click="menuStore.toggleMenu(item.name)"
            >
              <button>{{$t(item.name)}}</button>
            </van-cell>
          </van-list>
          <MusicListSlot 
            v-show="menuStore.openMenu === item.name"
            v-for="(item, idx) in musicStore.subMusicUpdated"
            :key="idx"
            :list="item"
            @get-music="addMusic"
          />
        </template>

        <!-- 音乐列表槽 -->
        <MusicListSlot 
          v-show="menuStore.openMenu === item.name" 
          v-for="(item, idx) in musicStore.subMusic" 
          :key="idx"
          :list="item"
          className="subMusic"
          @get-music="addMusic"
        />

        <!-- 集合菜单 -->
        <ul v-show="menuStore.openMenu === 'set'">
          <li 
            v-for="(item, idx) in musicStore.subSet"
            :key="idx"
            @click="menuStore.toggleMenu(item.name)"
          >
            <button>{{$t(item.name)}}</button>
          </li>
        </ul>
        <MusicListSlot 
          v-show="menuStore.openMenu === item.name"
          v-for="(item, idx) in musicStore.subSet" 
          :key="idx"
          :list="item"
          @get-music="loadSongSets"
          @save-music="saveSet"
          @remove-music="removeSet"
        />
        
        <template v-if="user">
          <ul v-show="menuStore.openMenu === 'chakra'">
            <li 
              v-for="(item, idx) in subChakra" 
              :key="idx"
              @click="addChakra(item)"
            >
              <button>{{ $t(item.name) }}</button>
            </li>
          </ul>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.audio__list__header {
  width: 100%;
  background: transparent;
}

.audio__subMenu {
  width: 100%;
}

:deep(.van-cell__title) {
  text-align: center;
}
</style>
