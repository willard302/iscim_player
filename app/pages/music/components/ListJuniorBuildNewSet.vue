<script setup lang="ts">
import { useMenuStore } from '~/store/useMenuStore';

const menuStore = useMenuStore();

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
</script>

<template>
  <div class="audio__list__container build_new_set">
    <div class="audio__list__header d-flex flex-between">
      <h3 class="audio__list__heading">
        <span v-if="menuStore.step === 1">{{$t("message.which_song_do_you_want_to_play")}}</span>
        <span v-if="menuStore.step === 2">{{$t("message.what_you_want_now")}}</span>
      </h3>
    </div>
    
    <!-- 步骤1：选择音乐 -->
    <template v-if="menuStore.step === 1">
      <!-- <TopTabbar 
        :items="musicListsLocal"
        :activeTab="showMenu"
        @tab-change="onClickAction"
      /> -->
      <!-- <ul
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
