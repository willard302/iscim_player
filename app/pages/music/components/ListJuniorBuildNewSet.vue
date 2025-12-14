<script setup lang="ts">
import { useMenuStore } from '~/store/useMenuStore';
import { useMusicStore } from '~/store/useMusicStore';
import type { MusicMenu, Song } from '~/types/data.types';

const props = defineProps<{
  musicListsLocal: MusicMenu[]
}>();

onMounted(() => {
  console.log(props.musicListsLocal)
})

const active = reactive({
  music: 0
});

const menuStore = useMenuStore();
const musicStore = useMusicStore();

const { removeMusic } = usePlaylist();

const newLists = [
  { 
    name: "working", 
    children: [
      {name:'routine', id:'routine'}, 
      {name:'major_meetings', id:'major_meetings'},
    ] 
  },
  { 
    name: "reinforce_learning", 
    children: [
      {name:'weekday_review', id:'weekday_review'}, 
      {name:'review_before_exam', id:'review_before_exam'},
    ] 
  },
  { 
    name: "take_a_nap", 
    children: [
      {name:'full_charge', id:'full_charge'}, 
      {name:'fast_charge', id:'fast_charge'},
    ] 
  },
];

const showMenu = ref("");
const musicOrder = ref(0);
const musicListsSelected = ref<Song[]>([]);

onMounted(() => {
  menuStore.step = 1;
})

const handleCheck = (music: any) => {
  musicStore.subMusicUpdated.forEach(musicList => {
  // musicList.menu.forEach(item => {
  //   // console.log(item)
  //   // if (item !== music) return;

  //   // if (!item.checked) {
  //   //   musicOrder.value++;
  //   //   musicListsSelected.value.push(item);
  //   //   item.order = musicOrder.value;
  //   //   return;
  //   // };

  //   // musicOrder.value--;
  //   // musicListsSelected.value.forEach(one => removeMusic(one, music));
  //   // musicListsSelected.value = musicListsSelected.value.filter(one => one.order !== null);
  //   // removeMusic(item, music);
  // });
});
}

// const submitCustomSet = () => {
//   if (showMenu.value === "") {
//     showNotify({message:"message.please_select_a_music_situation"})
//     return;
//   };
//   const setToEmit = JSON.parse(JSON.stringify(set));

//   emit('hand-play', setToEmit);
//   emit('hand-save-set', setToEmit);

//   // 重置状态
//   menuStore.step = 0;
//   isTab.value = "";
//   initMusicListsSelected();
// };
const checked = ref([])
</script>

<template>
  <div>
    <div class="audio__list__header">
      <h3 class="audio__list__heading">
        <span v-if="menuStore.step === 1">{{$t("Message.which_song_do_you_want_to_play")}}</span>
        <span v-if="menuStore.step === 2">{{$t("Message.what_you_want_now")}}</span>
      </h3>
    </div>

    <!-- step1: 選擇音樂 -->
    <template v-if="menuStore.step === 1">
      <van-tabs
        v-model:active="active.music"
        sticky
        type="card"
      >
        <van-tab
          v-for="(m, mIdx) in musicListsLocal"
          :key="mIdx"
          :title="m.name"
        >
          <van-checkbox-group
            v-model="checked"
          >
            <van-checkbox 
              v-for="(i, iIdx) in m.menu"
              :name="i.name"
              @click="handleCheck(i)"
            >
              {{ i.name }}
            </van-checkbox>
          </van-checkbox-group>
        </van-tab>
      </van-tabs>
      <!-- <ul
        v-for="(item, idx) in musicStore.subMusicUpdated" 
        :key="idx"
      >
        <li
          v-for="(one, idx) of item.menu" 
          :key="idx"
          :class="['music__item', {'selected': one.checked}]"
        >
          <label :for="one.id">
            {{ one.name }}
            <div class="checkBox">
              {{ one.order }}
            </div> 
          </label>
          <input 
            :id="one.id" 
            type="checkbox" 
            v-model="one.checked" 
            @click.stop="handleCheck(one)"
          />
        </li>
      </ul> -->
    </template>

    <!-- 步骤2：选择选项 -->
    <!-- <template v-if="menuStore.step === 2">
      <ul
        v-for="(item, idx) in newLists" 
        :key="idx" 
        class="tab__wrap flex-column"
      >
        <li class="tab__item">
          <div class="c-button-2 pure">{{ $t(item.name) }}</div>
        </li>
        <li class="tab__item">
          <TopTabbar
            className="music__option flex-row"
            :items="item.children" 
            :activeTab="showMenu"
            @tab-change="onClickAction"
          ></TopTabbar>
        </li>
      </ul>
    </template> -->

    <div class="tab__item audio__list__footer mt-10">
      <template v-if="menuStore.step === 1" >
        <div>
          <!-- <input 
            class="music__item set__name" 
            v-model="set.name"
            type="text" 
            :placeholder="$t('message.please_enter_a_name_for_the_set')" 
          /> -->
        </div>
        <!-- <button 
          class="c-button-2" 
          @click="onClickAction('select_option')"
        >
          {{$t('Next')}}
        </button> -->
      </template>
      <!-- <button 
        v-if="menuStore.step === 2" 
        class="c-button-2" 
        @click="onClickAction('submit')"
      >
        {{$t('save_and_play')}}
      </button> -->
    </div>
  </div>
</template>

<style scoped></style>
