<script setup lang="ts">
definePageMeta({
  title: "user_center",
  showHeader: true,
  showTabbar: true,
  pageOrder: 4
});
import Avatar from '~/components/Avatar.vue';
import { useMainStore } from '~/store/useMainStore';
import { useMenuStore } from '~/store/useMenuStore';
import { useMusicStore } from '~/store/useMusicStore';

const mainStore = useMainStore();
const menuStore = useMenuStore();
const musicStore = useMusicStore();
const router = useRouter();

const { logout } = useAuth();
const {target} = useSwipeChange(() => router.push('/home'), () => router.push('/music/musicList'))

const username = ref("");

const routeLists = reactive([
  { title: 'user_data', path: '/userCenter/profile' }
]);

const buttonLists = computed(() => {
  return [
    { title: 'Music.music_mode', action: musicStore.handleToggleType, label: musicStore.isPro ? $t("Music.pro") : $t("Music.pub") },
    { title: 'Music.menu_mode', action: menuStore.toggleJuniorMode, label: menuStore.isJuniorMode ? $t('basic_mode') : $t('advanced_mode') },
  ]
})

onMounted(() => {
  if (!mainStore.userInfo || !mainStore.userInfo.id ) throw new Error("There is no user, user_id.");
  username.value = mainStore.userInfo.name ?? "guest";
});
</script>

<template>
  <div class="page__container" ref="target">
    <div class="profile__container">
      <Avatar />
      <div class="profile__header">
        <van-divider >{{ mainStore.userInfo.name }}</van-divider>
      </div>
      <van-cell-group class="profile__body" inset>

        <van-cell
          v-for="(b, bIdx) in buttonLists"
          :key="bIdx"
          :title="$t(b.title)"
          center
        >
          <template #value>
            <van-button size="small" @click="b.action">{{ b.label }}</van-button>
          </template>
        </van-cell>
        <van-cell 
          v-for="(item, idx) in routeLists" 
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
  </div>
</template>

<style scoped lang="scss">
@import url("~/assets/scss/_transitions.scss");

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
