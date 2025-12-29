<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  pageTransition: {
    name: 'fade',
    mode: 'out-in'
  }
})

import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Logo from '~/assets/img/iscim_player_logo.png';
import ForgetPassword from './components/ForgetPassword.vue';

  const authStore = useAuthStore();

  const noticeText = ref("By choosing to continue, it is understood that you agree to our")
  
  const items = computed(() => [
    { name: 'log_in', comp: authStore.showForgetPassword ? ForgetPassword : Login },
    { name: 'register', comp: Register }
  ]);
</script>

<template>
  <div class="page__container">
    <div class="auth__container custom-tab">
      <van-tabs 
        v-model:active="authStore.active" 
        type="card"
        swipeable
      >
        <van-tab 
          v-for="(i, idx) in items" 
          :key="idx"
          :title="$t(i.name)"
          :name="i.name"
        >
          <van-image 
            width="60%"
            height="auto"
            fit="cover"
            round
            :src="Logo" 
          />
          <component :is="i.comp" />
          <van-notice-bar wrapable>
            {{ noticeText }}
            <a href="/policy/service">{{$t("Notice.terms_of_service")}}</a>
            {{ $t("and") }}
            <a href="/policy/privacy">{{$t("Notice.privacy_policy")}}</a>
          </van-notice-bar>
          <disclaimer-notice />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .auth__container .van-image {
    display: flex;
    margin: auto;
  }
  .van-notice-bar {
    --van-notice-bar-background: transparent;
  }
</style>
