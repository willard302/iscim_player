<script setup lang="ts">
definePageMeta({
  layout: "sub-page",
  title: "preferences",
  pageTransition: {
    name: 'slide-left',
    mode: 'out-in'
  },
  showHeader: true,
  showTabbar: true,
  showHeaderArrow: true,
  pageOrder: 4
});

const mainStore = useMainStore();
const musicStore = useMusicStore();
const router = useRouter();

const { logout } = useAuth();

const username = ref("");

const buttonLists = computed(() => [
  { 
    title: 'Music.music_mode', 
    action: musicStore.handleToggleType, 
    label: musicStore.isPro ? $t("Music.pro") : $t("Music.pub") 
  },
  { 
    title: 'language', 
    action: mainStore.toogleLocale, 
    label: mainStore.locale === 'tw' ? $t('Locale.tw') : $t('Locale.en')
  },
]);

const routeLists = reactive([
  { title: 'user_data', path: '/userCenter/profile' },
  { title: 'Notice.terms_of_service', path: '/policy/service' },
  { title: 'Notice.privacy_policy', path: '/policy/privacy' }
]);


onMounted(() => {
  if (!mainStore.userInfo || !mainStore.userInfo.id ) {
    console.error("There is no user, user_id.");
    router.push('/auth');
  };
});
</script>

<template>
  <div class="profile__container">
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
      <!-- <van-cell 
        :title="$t('log_out')"
        is-link
        @click="logout()"
      /> -->
    </van-cell-group>
  </div>
</template>

<style scoped lang="scss">
@import url("~/assets/scss/_transitions.scss");

.van-button--small {
  width: 42px;
}

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

// .profile__body {
//   box-shadow: 0 0 9px #ddd;
// }
</style>
