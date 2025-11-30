<script setup lang="ts">
import { useMainStore } from '~/store/useMain';

const emit = defineEmits(['remove-all', 'hand-play', 'hand-save-set'])

const mainStore = useMainStore()
const isTab = ref("");
const isStep = ref(0);
const musicListsLocal = ref([]);
const musicListsSelected = ref([]);
const musicOrder = ref(0);
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
const set = ref({
  name: "",
  type: "custom",
  value: "",
  chakra: {},
  content: []
});
const sets = reactive([]);
const customSets = reactive([]);
const showMenu = ref("");
const items = computed(() => {
  const build_set = { name: "build_new_set", id: "build_new_set" };
  const load_set = { name: "load_set", id: "load_set" };
  const remove_all = { name: "remove_all", id: "remove_all" };
  return mainStore.user ? [build_set, load_set, remove_all] : [load_set, remove_all];
});

const initMusicListsSelected = () => {
  musicListsSelected.value = [];
  musicOrder.value = 0;
  
  if (musicListsLocal.value && Array.isArray(musicListsLocal.value)) {
    musicListsLocal.value = musicListsLocal.value.map(category => {
      const newCategory = { ...category };
      if (newCategory.menu && Array.isArray(newCategory.menu)) {
        newCategory.menu = newCategory.menu.map(item => ({
          ...item,
          checked: false,
          order: null
        }));
      }
      
      return newCategory;
    });
  }
  
  // 重置set对象
  set.value = {
    name: "",
    type: "custom",
    value: "",
    chakra: {},
    content: []
  };
}

const submitCustomSet = () => {
  if (showMenu.value === "") {
    showNotify({message:"message.please_select_a_music_situation"})
    return;
  };
  const setToEmit = JSON.parse(JSON.stringify(set));

  emit('hand-play', setToEmit);
  emit('hand-save-set', setToEmit);

  // 重置状态
  isStep.value = 0;
  isTab.value = "";
  initMusicListsSelected();
};

const onClickAction = (item:any) => {
  switch(item) {
    case "load_set":
      isTab.value = (isTab.value === item) ? "" : item;
      showMenu.value = 'numbers_set';
      break;
    case "build_new_set":
      isTab.value = (isTab.value === item) ? "" : item;
      isStep.value = 1;
      showMenu.value = 'numbers_music'
      break;
    case "remove_all":
      isTab.value = item;
      emit('remove-all')
      break;
    case "select_option":
      showMenu.value = '';
      if (musicListsSelected.value.length === 0) {
        showNotify({message: "message.please_select_a_music_at_least"});
        return;
      }; 
      if (set.name.length === 0) {
        showNotify({message: "message.please_enter_a_name_for_the_set"});
        return;
      };
      // set.content = musicListsSelected;
      isStep.value = 2;
      break;
    case "submit":
      submitCustomSet();
      break;
    default:
      if (isStep.value === 2) {
        set.value = item;
        showMenu.value = item;
      } else {
        // 切换菜单显示
        showMenu.value = item;
      }
      break;
  }
};

// onMounted(() => {
//   musicListsLocal.value = JSON.parse(JSON.stringify(musicLists.value))
// })

</script>

<template>
  <div class="audio__list music-list-junior">
    <!-- <TopTabbar
      :items="items" 
      :activeTab="isTab"
      @tab-change="onClickAction"
    ></TopTabbar> -->
    <div 
      v-if="isTab === 'build_new_set'" 
      class="audio__list__container build_new_set"
    >
      <div class="audio__list__header d-flex flex-between">
        <h3 class="audio__list__heading">
          <span v-if="isStep === 1">{{$t("message.which_song_do_you_want_to_play")}}</span>
          <span v-if="isStep === 2">{{$t("message.what_you_want_now")}}</span>
        </h3>
      </div>
      
      <!-- 步骤1：选择音乐 -->
      <template v-if="isStep === 1">
        <TopTabbar 
          :items="musicListsLocal"
          :activeTab="showMenu"
          @tab-change="onClickAction"
        />
        <ul
          v-if="showMenu === item.id"
          v-for="(item, idx) in musicListsLocal" 
          :key="idx"
          class="music__lists scroll__container"
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
        </ul>
      </template>

      <!-- 步骤2：选择选项 -->
      <template v-if="isStep === 2">
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
      </template>

      <div class="tab__item audio__list__footer mt-10">
        <template v-if="isStep === 1" >
          <div>
            <input 
              class="music__item set__name" 
              v-model="set.name"
              type="text" 
              :placeholder="$t('message.please_enter_a_name_for_the_set')" 
            />
          </div>
          <button 
            class="c-button-2" 
            @click="onClickAction('select_option')"
          >
            {{$t('Next')}}
          </button>
        </template>
        <button 
          v-if="isStep === 2" 
          class="c-button-2" 
          @click="onClickAction('submit')"
        >
          {{$t('save_and_play')}}
        </button>
      </div>
    </div>

    <template v-if="isTab === 'load_set'">
      <TopTabbar
        :items="subSet"
        :activeTab="showMenu"
        @tab-change="onClickAction"
      ></TopTabbar>

      <music-list-slot 
        v-show="showMenu === item.name"
        v-for="(item, idx) in subSet"
        :key="idx"
        :list="item"
        type="junior-mode"
        className="customSet set__container scroll__container"
        @get-music="getSongSets"
        @remove-music="removeSet"
      />
    </template>
  </div>
</template>

<style scoped></style>
