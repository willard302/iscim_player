<script setup lang="ts">
definePageMeta({title: "user_center"});
import Avatar from '~/components/Avatar.vue';
import { useMainStore } from '~/store/useMainStore';
const mainStore = useMainStore();
const router = useRouter();

const { logout } = useAuth();

onMounted(() => {
  if (!mainStore.userInfo || !mainStore.userInfo.id ) throw new Error("There is no user, user_id.");
  username.value = mainStore.userInfo.name ?? "guest";
});

const isEdit = ref(false);
const username = ref("");

const lists = reactive([
  { title: 'user_data', path: '/userCenter/profile' },
  { title: 'setting', path: '/userCenter/setting' }
]);

const handleToggleState = async() => {
  const userId = mainStore.userInfo.id;
  if (!userId) throw new Error("There is no id.");

  isEdit.value = !isEdit.value;
};
</script>

<template>
  <div class="profile__container">
    <Avatar />
    <van-cell-group class="profile__header">
      <div class="profile__heading">
        <div class="status">
          <van-cell-group inset>
            <van-field v-model="mainStore.userInfo.name" input-align="center" :disabled="!isEdit" />
          </van-cell-group>
          <van-button v-if="!isEdit" @click="handleToggleState()">
            <font-awesome :icon="['fas', 'pen']" />
          </van-button>
          <van-button v-else @click="handleToggleState()">
            <font-awesome :icon="['fas', 'check']" />
          </van-button>
        </div>
      </div>
    </van-cell-group>
    <van-cell-group class="profile__content" inset>
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
        @click="logout"
      />
    </van-cell-group>
  </div>
</template>

<style scoped lang="scss">

.profile__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  --van-cell-background: transparent;
}

.profile__header {
  text-align: center;
  margin-bottom: 10px;
  border-radius: 10px;
  --van-cell-group-background: transparent;
}

.profile__heading {
  display: flex;
  align-items: center;
  justify-content: center;

  .name {
    font-weight: 700;
    font-size: 1.4rem;
    margin: 0 auto;
  }

  .status {
    border: none;
    display: flex;
    align-items: center;
    position: relative;

    >input {
      height: 44px;
      text-align: center;
      border: none;
      border-bottom: 1px solid #888888;
    }

    svg {
      font-size: 0.8rem;

      &:hover,
      &:active,
      &:focus{
        color: #888888;
      }
    }

    .van-button {
      position: absolute;
      right: 0;
    }
    
    .van-button--default {
      --van-button-default-background: transparent;
      --van-button-default-border-color: transparent;
    }
  }
}

.van-cell-group{

  width: 100%;
  margin: 3px auto;

  &.profile__content {
    box-shadow: 0 0 9px #ddd;
  }
}
</style>
