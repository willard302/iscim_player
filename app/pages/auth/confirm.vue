<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
// 如果你有設定 auto-import，這行可能不需要
import { useRouter } from '#app'; 
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n(); // 使用 i18n

// 倒數計時設定
const countdown = ref(5);
let timer: ReturnType<typeof setInterval> | null = null;

// 跳轉到登入頁
const handleLogin = () => {
  router.replace('/auth'); // 使用 replace 防止用戶按上一頁回到這裡
};

// 跳轉到首頁
const handleGoHome = () => {
  router.replace('/home');
};

onMounted(() => {
  // 啟動自動倒數跳轉 (可選功能)
  timer = setInterval(() => {
    // countdown.value--;
    if (countdown.value <= 0) {
      handleLogin(); // 倒數結束自動去登入頁
    }
  }, 1000);
});

onUnmounted(() => {
  // 組件卸載時清除計時器，防止內存洩漏
  if (timer) clearInterval(timer);
});
</script>
<template>
  <div class="register-success-page">
    <div class="content">
      <div class="icon-wrapper">
        <van-icon name="checked" size="80" class="success-icon" />
      </div>

      <h2 class="title">{{ t('auth.register_success_title') }}</h2>
      <p class="subtitle">
        {{ t('auth.register_success_desc', '您的帳號已建立，請登入以開始使用服務。') }}
      </p>

      <div class="actions">
        <van-button 
          type="primary" 
          block 
          round 
          size="large"
          @click="handleLogin"
        >
          {{ t('auth.login_now') }}
        </van-button>
        
        <van-button 
          class="home-btn"
          plain 
          block 
          round 
          size="large"
          type="primary"
          @click="handleGoHome"
        >
          {{ t('common.back_home') }} ({{ countdown }}s)
        </van-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 使用 Flexbox 讓內容垂直置中
.register-success-page {
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;

  .content {
    width: 100%;
    max-width: 400px;
    text-align: center;
  }
}

.icon-wrapper {
  margin-bottom: 24px;
  
  // 簡單的進場動畫
  animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  .success-icon {
    // 使用 Vant 的成功綠色變數，或自定義顏色
    color: var(--van-success-color, #07c160);
  }
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 40px;
}

.actions {
  .van-button {
    margin-bottom: 16px;
    font-weight: bold;
  }
  
  // 第二顆按鈕稍微淡一點的樣式
  .home-btn {
    border: none;
    color: #999;
  }
}

// 動畫定義
@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>