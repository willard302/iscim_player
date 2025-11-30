<script setup lang="ts">
import { useMusicStore } from "~/store/useMusic";
import logo from "../../assets/img/iscim-logo.png";
const musicStore = useMusicStore();
const type = musicStore.type;
const {transTime} = useCommon();
// 界面状态
const isTab = ref("player");
const openChatRoom = ref(false);
const diskRotation = ref(0);
const slideVal = ref(0);
const volume = ref(true);
const volumeVal = ref(100);

const audioRef = ref<any>(null);
const audioProgress = ref<any>(null);
// 数据存储
const recordRef = ref<any>(null);
const overAllArr = ref([]);
const repeatMode = ref("repeatNone");
const recorderNotice = [
  { text: "Music_recorder.text_01" },
  { text: "Music_recorder.text_02" },
  {
    text: "Music_recorder.text_03",
    list: [
      "Music_recorder.text_03_list_1",
      "Music_recorder.text_03_list_2",
      "Music_recorder.text_03_list_3",
    ],
  },
  { text: "Music_recorder.text_04" },
];

// ============== 音频播放控制 ==============
const loadSongs = (song:any) => {
  console.log("loads...")
  // if (!song) return;
  // musicStore.title = song.name;
  // musicStore.src = song.url;
  musicStore.title = "test-Music";
  musicStore.src = "/music_custom/custom_01.mp3";
};
const onDurationChange = () => {
  const audio = audioRef.value;
  if (!audio || audio.duration === Infinity) return;
  
  musicStore.duraTime = transTime(audio.duration);
};
const onTimeUpdateListener = () => {
  const audio = audioRef.value;
  if (!audio || audio.duration <= 0) return;
  
  // 更新进度条和时间显示
  slideVal.value = (audio.currentTime / audio.duration) * 100;
  musicStore.currentTime = transTime(parseInt(audio.currentTime));
  
  // 更新唱片旋转动画
  onDiskRotation(audio);
};
const onDiskRotation = (audio:any) => {
  // 计算旋转角度
  diskRotation.value = (audio.currentTime / audio.duration) * 360 * 60;
  
  // 重置进度
  if (audio.currentTime === 0) {
    slideVal.value = 0;
    diskRotation.value = 0;
  }
};

// ============== 播放控制 ==============
const playMusic = () => {
  console.log("playMusic")
  // if (musicStore.lists.length === 0) return musicStore.title = "Hints.select_music";
  
  musicStore.status = true;
  loadSongs(musicStore.lists[musicStore.index]);
  setTimeout(() => {
    audioRef.value.play();
  }, 200);
};
const pauseMusic = () => {
  console.log("pauseMusic")
  musicStore.status = false;
  audioRef.value.pause();
};

const play = () => {
  console.log("play", audioRef.value.src)
  musicStore.status ? pauseMusic() : playMusic();
};

const nextSong = () => {
  play();
  
  // 循环播放列表
  musicStore.index = (musicStore.index < musicStore.lists.length - 1) 
    ? musicStore.index + 1 
    : 0;
    
  playMusic();
};
const prevSong = () => {
  play();
  
  // 循环播放列表
  musicStore.index = (musicStore.index > 0)
    ? musicStore.index - 1
    : musicStore.lists.length - 1;
    
  playMusic();
};

const endSong = () => {
  pauseMusic();
  
  // 播放列表未播放完
  if (musicStore.index < musicStore.lists.length - 1) {
    musicStore.index++;
    return;
  };
  
  // 播放列表已播放完，根据模式处理
  switch (musicStore.mode) {
    case 1: // 单曲循环
      playMusic();
      break;
    case 2: // 全部循环
      musicStore.index = 0;
      playMusic();
      break;
    // 默认不循环，停止播放
  }
};

// ============== 进度条控制 ==============
const clickProgress = (e:any) => {
  if (!musicStore.src) return;
  
  const progress = audioProgress.value;
  const audio = audioRef.value;
  
  // 计算点击位置对应的时间
  const x = progress.getBoundingClientRect().right - e.clientX;
  const width = progress.getBoundingClientRect().width;
  const rate = (width - x - 8) / width;
  
  // 设置当前播放时间
  audio.currentTime = rate * audio.duration;
};
const mouseSlide = (e:any) => {
  const audio = audioRef.value;
  const progress = audioProgress.value;
  const self = e.currentTarget;
  const startX = e.clientX - self.offsetLeft;
  
  document.onmousemove = (e) => {
    const percent = ((e.clientX - startX) / progress.clientWidth) * 100;
    
    // 确保在有效范围内
    if (percent >= 0 && percent <= 100) {
      slideVal.value = percent;
      audio.currentTime = (percent / 100) * audio.duration;
    }
  };
  document.onmouseup = () => {
    document.onmousemove = null;
    document.onmouseup = null;
  };
};
const touchSlide = (e:any) => {
  const audio = audioRef.value;
  const progress = audioProgress.value;
  const self = e.currentTarget;
  const startX = e.targetTouches[0].clientX - self.offsetLeft;
  
  // 使用被动事件监听器添加触摸移动事件
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  document.addEventListener('touchend', handleTouchEnd, { passive: true });
  
  function handleTouchMove(e:any) {
    e.preventDefault(); // 阻止滚动
    const percent = ((e.targetTouches[0].clientX - startX) / progress.clientWidth) * 100;
    
    // 确保在有效范围内
    if (percent >= 0 && percent <= 100) {
      slideVal.value = percent; // 使用保存的Vue实例引用
      audio.currentTime = (percent / 100) * audio.duration;
    }
  }
  
  function handleTouchEnd() {
    // 移除事件监听器
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  }
};

// ============== 音量控制 ==============
const openVolume = () => {
  // 切换静音状态
  volume.value = !volume.value;
  volumeVal.value = volume.value ? 100 : 0;
  setVolume();
};
const setVolume = () => {
  if (!audioRef.value) return;
  audioRef.value.volume = volumeVal.value / 100;
};

// ============== 播放模式控制 ==============
const normalMode = () => {
  musicStore.mode = 0;
  repeatMode.value = "repeatNone";
};
const repeatOneMode = () => {
  musicStore.mode = 1;
  repeatMode.value = "repeatOne";
};
const repeatAllMode = () => {
  musicStore.mode = 2;
  repeatMode.value = "repeatAll";
};
const modeBtn = () => {
  switch (musicStore.mode) {
    case 0:
      repeatOneMode();
      break;
    case 1:
      repeatAllMode();
      break;
    case 2:
      normalMode();
      break;
    default:
      normalMode();
      break;
  }
};

</script>

<template>
  <div class="player__container">
    <audio
      hidden
      ref="audioRef"
      :src="musicStore.src" 
      :volume="volumeVal / 100"
      @ended="endSong" 
      @timeupdate="onTimeUpdateListener"
      @durationchange="onDurationChange"
    >
      <source src="" type="audio/mp3" />
    </audio>
    
    <!-- 唱片图像 -->
    <div :class="['audio__container--img', {'playing': musicStore.status}]" @click="play">
      <div class="audio__img__wrap" :style="'rotate: -' + diskRotation + 'deg'">
        <img class="audio__img" :src="logo" alt="iSCIM" />
      </div>
    </div>
    
    <!-- 歌曲標題 -->
    <h3 class="audio__title">{{ musicStore.title }}</h3>
    
    <!-- 進度條 -->
    <div class="audio__container--progress">
      <div class="audio__progress" ref="audioProgress" @click="clickProgress">
        <div 
          class="audio__slide" 
          :style="'left:' + slideVal + '%'" 
          @touchstart.passive="touchSlide" 
          @mousedown="mouseSlide"
        ></div>
        <div class="audio__fill"></div>
      </div>
      <div class="audio__text--progress">
        <span>{{ musicStore.currentTime }}</span>
        <span>{{ musicStore.duraTime }}</span>
      </div>
    </div>
    
    <!-- 控制按钮 -->
    <div class="audio__container--navigation">
      <!-- 播放控制 -->
      <div class="audio__navigation--play">
        <button class="action-btn prev" @click="prevSong()">
           <font-awesome icon="backward" />
        </button>
        <button class="action-btn action-btn-big" @click.lazy="play()">
           <font-awesome :icon="musicStore.status ? 'pause' : 'play'" />
        </button>
        <button class="action-btn next" @click="nextSong()">
           <font-awesome icon="forward" />
        </button>
        <button class="action-btn" @click="modeBtn()">
          <font-awesome 
            :class="['fa-solid fa-repeat', repeatMode]" 
            icon="repeat" 
            style="color: #ffffff;"
          />
        </button>
      </div>
      
      <!-- 音量控制 -->
      <div class="audio__navigation--volume">
        <button @click="openVolume()">
          <font-awesome :icon="volume ? 'volume-high' : 'volume-off'" />
        </button>
        <input 
          class="audio__value--volume"
          type="range" 
          min="1" 
          max="100"
          v-model="volumeVal"
          @change="setVolume()" 
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.player__container {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 100%;
}
.audio__container--img {
  max-width: 280px;
  margin: 0 auto;
  border-radius: 50%;
  box-shadow: 0 8px 16px -6px rgba(16, 16, 16, 0.3);
  overflow: hidden;
  z-index: 99;
}
.audio__img__wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #c9adef94;
  border: 3px solid #8d03a2;
  border-radius: 50%;
  z-index: -1;
  transition: all 1.5s linear;

  .audio__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    max-width: 100%;
    opacity: 1;
  }

  @mixin audio-img {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    border-radius: 50%;
    z-index: -1;
    margin: auto;
    transition: all 1.5s;
  }

  &::before {
    @include audio-img;
    content: "";
    width: 95%;
    height: 95%;
    border: 3px solid #b604d1;
  }

  &::after {
    @include audio-img;
    content: "";
    width: 90%;
    height: 90%;
    border: 3px solid #8d03a2;
  }
}

.audio__title {
  color: $color-font;
}

.audio__container--progress {
  display: inline-block;
  margin: 0 auto;
  pointer-events: none;
  width: 100%;

  .audio__progress {
    position: relative;
    width: 100%;
    height: 5px;
    background-color: $color-base;
    pointer-events: all;
    z-index: 0;
    cursor: pointer;

    .audio__slide {
      position: relative;
      top: -2px;
      right: 1px;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background-color: wheat;
      z-index: 99;
      cursor: pointer;
    }

    .audio__fill {
      position: relative;
      top: -9px;
      height: 5px;
      width: 0%;
      background-color: wheat;
      pointer-events: none;
      cursor: pointer;
    }
  }

  .audio__text--progress {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}


.audio__container--navigation {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 10px;
}

.audio__navigation--play {
  width: 40%;

  .action-btn {
    position: relative;
  }

  .fa-repeat::after {
    content: "";
    font-weight: 900;
    font-size: 1rem;
    color: $color9;
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .fa-repeat.repeatNone::after {
    content: "X"
  }

  .fa-repeat.repeatOne::after {
    content: "1"
  }

  .fa-repeat.repeatAll::after {
    content: "A"
  }
}

.audio__navigation--volume {
  width: 120px;
  display: flex;
  align-items: center;

  .audio__value--volume {
    background-color: $color-base;
    height: 3px;
    width: 70%;
    margin-left: 5px;
  }
}



</style>
