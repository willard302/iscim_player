<script setup lang="ts">
definePageMeta({title:"album_list", layout: "music"})
import { useMainStore } from '~/store/useMainStore';
import { useMenuStore } from '~/store/useMenuStore';
import { useMusicStore } from '~/store/useMusicStore';
import { usePlayerStore } from '~/store/usePlayerStore';
import type { chakraItem } from '~/types/data.types';
const { addMusic, saveSet, removeSet, loadSongSets, addChakra } = usePlaylist();
const player = usePlayer();
const mainStore = useMainStore();
const musicStore = useMusicStore();
const playerStore = usePlayerStore();
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
  musicStore.subMusic = [
    {name: "Music.fast", menu: fastMenu},
    {name: "Music.medium", menu: medMenu},
    {name: "Music.slow", menu: slowMenu}
  ];
};
// ============== API数据加载 ==============
const loadApiData = async() => {
  let apiUrls = getApiUrls();

  try {
    const responses = await Promise.all(apiUrls.map(url => fetch(url)));
    const result = await Promise.all(
      responses.map(res => {
        if(!res.ok) throw new Error(`Failed to fetch: ${res.url} - ${res.status}`)
        return res.json();
      })
    );
    
    // 设置基础音乐数据
    musicStore.subMusic = result[0];
    updateSubMusic()
    
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
      "/music_set/default_custom.json",
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
    musicStore.subMusicUpdated = result[4];
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

    playerStore.index = -1;
    playerStore.src = "";
    musicStore.title = "Please Select Music"
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
  <div :class="[{'openNav': menuStore.openMenu !== 'off'}]">
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
    <div class="list__container checkout">
      <van-list>
        <van-cell 
          v-for="(list, idx) in musicStore.queue" 
          :key="idx" 
          :class="[{ playing: playerStore.index == idx }]"
          center
          :id="list.id"
          :title="list.title"
          :value="list.chakra"
          @click="specified(idx)"
        >
          <template #right-icon>
            <font-awesome icon="trash" @click="removeList(idx)"/>
          </template>
        </van-cell>
      </van-list>
    </div>

    <div v-show="menuStore.openMenu !== 'off'" class="list__container menu">

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

      <van-list v-show="menuStore.openMenu === 'music'">
        <van-cell
          v-for="(item, idx) in musicStore.subMusic" 
          :key="idx" 
          :title="item.name"
          @click="menuStore.toggleMenu(item.name)"
        />
      </van-list>

      <van-list v-show="menuStore.openMenu === 'mymusic'">
        <van-cell 
          v-for="(item, idx) in musicStore.subMusicUpdated"
          :key="idx"
          :title="item.name"
          @click="menuStore.toggleMenu(item.name)"
        />
      </van-list>

      <van-list v-show="menuStore.openMenu === 'set'">
        <van-cell 
          v-for="(item, idx) in musicStore.subSet"
          :key="idx"
          :title="$t(item.name)"
          @click="menuStore.toggleMenu(item.name)"
        />
      </van-list>
      
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
  </div>
</template>

<style scoped lang="scss">
@use "sass:color";
.list__container {
  width: 100%;
  position: absolute;
  top: 46px;
  left: 0;
}

.list__container.checkout {
  .van-cell {
    background: transparent;
  }

  .playing {
    background-color: $color-hover;
  }
}

.list__container.menu {
  .van-cell {
    background: color.adjust($color: #ffffff, $alpha: -0.1);
  }
}
</style>
