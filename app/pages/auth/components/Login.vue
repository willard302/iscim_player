<script setup lang="ts">
import type { ButtonItem, FieldItem } from '~/types/data.types';
const { login, loginWithGoogle } = useAuth();
const { showPassword } = useCommon()
const { getUser, insertUser } = useDataBase();
const router = useRouter();
const mainStore = useMainStore();
const authStore = useAuthStore();

const fieldItems: FieldItem[] = reactive([
  { 
    label: "username",
    value: "test001@gmail.com", 
    name: "username", 
    type: "text",
    placeholder: "Hints.enter_email",
    required: true,
    message: 'Hints.enter_email',
    autocomplete: "username"
  },
  {
    label: "password", 
    value: "123456", 
    name: "password", 
    type: "password",
    placeholder: "Hints.enter_password",
    required: true, 
    message: 'Hints.enter_password',
    autocomplete: "current-password"
  }
]);

const buttonItems: ButtonItem[] = [
  { text: "log_in", type: "submit" },
  { text: "Menu.forget_password", type: "button", action: authStore.handleShowForgetPassword }
];

const handleLogin = async(account: FieldItem[]) => {
  
  // const username = account.find(item => item.name === 'username')?.value;
  // const password = account.find(item => item.name === 'password')?.value;

  // if (!username || !password) return console.error("There is no username or password.");

  // showLoadingToast($t("Message.loading"));

  // const response = await login(username as string, password as string);

  // if (!response.user || !response.user.id) throw new Error("Login failed");

  // const user_id = response.user.id;

  // mainStore.setAuthenticiated(!!user_id);
  // mainStore.setUser({id: user_id});
  mainStore.setAuthenticiated(true);
  mainStore.setUser({id: '12322223111'})

  // const user = await getUser(user_id);
  // if (!user) {
  //   console.error("user profile is null.");
  //   console.log("creating user profile...")
  //   const newInfo = await insertUser({
  //     id: user_id,
  //     email: username as string
  //   });
  //   if (newInfo) await insertUser(newInfo);
  //   navigateTo('/home')
  //   return;
  // }
  // mainStore.setUser(user);
  
  // if (user === null) {
  //   throw new Error(`the user is null.`)
  // } else{
  //   showSuccessToast({
  //     message: $t("Message.login_successfully"),
  //     onClose: () => router.push('/home')
  //   });
  // }
  router.push('/home')
};
const handleShowPassword = (name: string) => {
  showPassword(fieldItems, name);
};
const handleGoogleLogin = async() => {
  try {
    showLoadingToast("Redirecting to Google...");
    await loginWithGoogle();
  } catch (error: any) {
    showFailToast(error.message || "Google Login Failed")
  }
}
</script>

<template>
  <div class="login__container custom-button">
    <FieldForm 
      :fieldItems="fieldItems"
      :buttonItems="buttonItems"
      @submit="handleLogin"
      @button="authStore.handleShowForgetPassword"
      @passwordToggle="handleShowPassword"
    />
    <van-divider>{{ $t("or") }}</van-divider>
    <div class="login__container--social">
      <van-button
        block
        type="default"
        @click="handleGoogleLogin()"
      >
        <template #icon>
          <font-awesome :icon="['fab', 'google']" class="google-icon" />
        </template>
        Sign in with Google
      </van-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .login__container {
    --van-divider-text-color: $color9;
    --van-divider-border-color: $color8;

    .van-button {
      max-width: 90%;
      margin: auto;
    }
  }
</style>
