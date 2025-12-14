<script setup lang="ts">
import { useMusicStore } from '~/store/useMusicStore';
import MusicListSlot from './MusicListSlot.vue';

const musicStore = useMusicStore();

const { loadSongSets, removeSet } = usePlaylist();
</script>

<template>

  <div>
    ListJuniorLoadSet
  </div>

  <!-- <TopTabbar
    :items="musicStore.subSet"
    :activeTab="showMenu"
    @tab-change="onClickAction"
  ></TopTabbar> -->

  <!-- <music-list-slot
    v-for="(item, idx) in musicStore.subSet"
    :key="idx"
    :list="item"
    type="junior-mode"
    className="customSet set__container scroll__container"
    @get-music="loadSongSets"
    @remove-music="removeSet"
  /> -->
</template>

<style scoped></style>
