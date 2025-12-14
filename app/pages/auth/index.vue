<script setup lang="ts">
  definePageMeta({layout: 'auth'})
  import Login from './components/Login.vue';
  import Register from './components/Register.vue';
  import Logo from '~/assets/img/iscim_player_logo.png';

  const active = ref(0);
  const items = reactive([
    { name: 'log_in', comp: shallowRef(Login) },
    { name: 'register', comp: shallowRef(Register) }
  ]);
</script>

<template>
  <div class="auth__container">
    <van-tabs 
      v-model:active="active" 
      sticky 
      type="card"
    >
      <van-image 
        width="60%"
        height="auto"
        fit="cover"
        round
        :src="Logo" 
      />
      <van-tab 
        v-for="(i, idx) in items" 
        :key="idx"
        :title="$t(i.name)"
      >
        <component :is="i.comp" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<style scoped lang="scss">
  .auth__container {
    position: fixed;
    top: 10%;
    text-align: center;
  }
  :deep(.van-tabs__nav--card) {
    height: 40px;
    border-radius: 10px;
    overflow: hidden;
  }
</style>
