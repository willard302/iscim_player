<script setup lang="ts">
definePageMeta({layout: 'auth'})
import { useAuthStore } from '~/store/useAuthStore';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Logo from '~/assets/img/iscim_player_logo.png';
import ForgetPassword from './components/ForgetPassword.vue';

  const authStore = useAuthStore();

  const active = ref(0);
  
  const items = computed(() => [
    { name: 'log_in', comp: authStore.showForgetPassword ? ForgetPassword : Login },
    { name: 'register', comp: Register }
  ]);
</script>

<template>
  <div class="auth__container custom-tab">
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
    text-align: center;
  }
</style>
