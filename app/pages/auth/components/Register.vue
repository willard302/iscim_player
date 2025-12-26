<script setup lang="ts">
import { useAuthStore } from "~/store/useAuthStore";
import type { ButtonItem, FieldItem } from "~/types/data.types";

const router = useRouter();
const { showPassword } = useCommon();
const { register } = useAuth();

const fieldItems: FieldItem[] = reactive([
  { 
    label: "username",
    value: "", 
    name: "username", 
    type: "text",
    placeholder: "Hints.enter_email",
    required: true,
    message: 'Hints.enter_email',
    autocomplete: "username"
  },
  {
    label: "password", 
    value: "", 
    name: "password", 
    type: "password",
    placeholder: "Hints.enter_password",
    required: true, 
    message: 'Hints.enter_password',
    autocomplete: "new-password"
  },
  {
    label: "password_confirm", 
    value: "", 
    name: "password_confirm", 
    type: "password",
    placeholder: "Hints.enter_password",
    required: true, 
    message: 'Hints.enter_password',
    autocomplete: "new-password"
  }
]);
const buttonItems: ButtonItem[] = [
  { text: "submit", type: "submit" }
];

const handleRegister = async() => {
  const username = fieldItems.find(item => item.name === "username")?.value;
  const password = fieldItems.find(item => item.name === "password")?.value;
  const password_confirm = fieldItems.find(item => item.name === "password_confirm")?.value;
  if (password !== password_confirm) return showFailToast($t("Message.password_is_different"));
  
  showLoadingToast($t("Message.loading"));
  const data = await register(username as string, password as string);

  if(data.user && data.user.id) {
    showSuccessToast({
      message: $t("Message.register_successfully"), 
      onClose: () => {
        const authStore = useAuthStore();
        authStore.handleSwitchTab("log_in");  
      }
    })
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
    @submit="handleRegister"
    @passwordToggle="handleShowPassword"
  ></FieldForm>
</template>

<style scoped></style>
