<script setup lang="ts">
import type { ButtonItem, FieldItem } from '~/types/data.types';
import { useMainStore } from '~/store/useMainStore';
import { useAuthStore } from '~/store/useAuthStore';
const { login } = useAuth();
const { showPassword } = useCommon()
const { getUser, insertUser } = useDataBase();
const router = useRouter();
const mainStore = useMainStore();
const authStore = useAuthStore();

const fieldItems: FieldItem[] = reactive([
  { 
    label: "username",
    value: 'test001@gmail.com', 
    name: "username", 
    type: "text",
    placeholder: "Hints.enter_email",
    required: true,
    message: 'Hints.enter_email',
    autocomplete: "username"
  },
  {
    label: "password", 
    value: '123456', 
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
  showLoadingToast("Loading...");

  const username = account.find(item => item.name === 'username')?.value;
  const password = account.find(item => item.name === 'password')?.value;

  if (!username || !password) throw new Error("There is no username or password.");

  const response = await login(username as string, password as string);

  if (!response.user || !response.user.id) throw new Error("Login failed");

  const user_id = response.user.id;

  mainStore.setAuthenticiated(!!user_id);
  mainStore.setUser({id: user_id});

  const user = await getUser(user_id);
  if (!user) {
    console.error("user profile is null.");
    console.log("creating user profile...")
    const newInfo = await insertUser({
      id: user_id,
      email: username as string,
      avatar_url: "https://vvbtzvedcvhxibozbryz.supabase.co/storage/v1/object/public/icc_avatar/1765174676551-model01w.png"
    });
    if (newInfo) await insertUser(newInfo);
    navigateTo('/userCenter')
    return;
  }
  mainStore.setUser(user);
  
  if (user === null) {
    throw new Error(`the user is null.`)
  } else{
    showSuccessToast($t("Message.login_successfully"));
    setTimeout(() => {
      router.push('/userCenter');
    }, 2000);
  }
};
const handleShowPassword = (name: string) => {
  showPassword(fieldItems, name);
};
</script>

<template>
  <FieldForm 
    :fieldItems="fieldItems"
    :buttonItems="buttonItems"
    @submit="handleLogin"
    @button="authStore.handleShowForgetPassword"
    @passwordToggle="handleShowPassword"
  />
</template>

<style scoped></style>
