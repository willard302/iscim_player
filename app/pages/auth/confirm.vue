<script setup lang="ts">
definePageMeta({layout: 'auth'});
import type { ButtonItem } from '~/types/data.types';

const authStore = useAuthStore();

const buttonItems: ButtonItem[] = [
  { text: 'Button.send_verification_email', type: 'submit' },
  { text: 'Button.back', to: '/home' }
]

const handleSubmit = () => {
  console.log('Send Verification Email clicked');
};
</script>
<template>
  <div class="confirm__container">
    <div class="content">
      <div class="icon-wrapper">
        <van-icon name="checked" size="80" class="success-icon" />
      </div>

      <h2 class="title">{{ $t('Message.we_have_send_verification_email') }}</h2>
      <p class="subtitle">
        {{ $t('Message.if_you_have_not_received_the_letter_or_need_to_reverify') }}
      </p>

      <van-field
        type="text"
        :label="$t('Message.please_check')"
        label-width="40%"
        size="large"
        label-align="center"
        input-align="center"
        colon
        v-model="authStore.email" 
      />
      <FieldForm 
        :button-items="buttonItems"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.confirm__container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;

  .content {
    width: 100%;
    max-width: 400px;

    .van-field {
      --van-cell-horizontal-padding: 0;
    }

    :deep(.van-field__control--center) {
      background-color: $color3;
      font-weight: bold;
      font-size: 1rem;
    }
  }
}

.icon-wrapper {
  margin-bottom: 24px;
  text-align: center;
  
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