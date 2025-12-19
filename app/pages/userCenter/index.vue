<script setup lang="ts">
definePageMeta({title: "user_center"});
import Avatar from '~/components/Avatar.vue';
import { useMainStore } from '~/store/useMainStore';
const mainStore = useMainStore();
const router = useRouter();

const { logout } = useAuth();

const username = ref("");

const lists = reactive([
  { title: 'user_data', path: '/userCenter/profile' },
  { title: 'setting', path: '/userCenter/setting' }
]);

onMounted(() => {
  if (!mainStore.userInfo || !mainStore.userInfo.id ) throw new Error("There is no user, user_id.");
  username.value = mainStore.userInfo.name ?? "guest";
});
</script>

<template>
  <div class="profile__container">
    <Avatar />
    <div class="profile__header">
      <van-divider >{{ mainStore.userInfo.name }}</van-divider>
    </div>
    <van-cell-group class="profile__body" inset>
      <van-cell 
        v-for="(item, idx) in lists" 
        :key="idx" 
        is-link 
        :title="$t(item.title)"
        @click="router.push(item.path)"
      />
      <van-cell 
        :title="$t('log_out')"
        is-link
        @click="logout()"
      />
    </van-cell-group>
  </div>
</template>

<style scoped lang="scss">

.van-cell-group {
  width: 100%;
}

.profile__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  --van-cell-background: transparent;

  --van-divider-text-color: $color5;
  --van-divider-font-size: 1.2rem;
}

.profile__body {
  box-shadow: 0 0 9px #ddd;
}
</style>
