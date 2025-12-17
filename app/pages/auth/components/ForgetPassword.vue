<script setup lang="ts">
import type { ButtonItem, FieldItem } from '~/types/data.types';
import { useAuthStore } from '~/store/useAuthStore';
const { showPassword } = useAuth();
const authStore = useAuthStore();

const fieldItems: FieldItem[] = reactive([
  { 
    label: "email",
    value: 'test001@gmail.com', 
    name: "username", 
    type: "text",
    placeholder: "Hints.enter_email",
    required: true,
    message: 'Hints.enter_email',
    autocomplete: "username"
  }
]);

const buttonItems: ButtonItem[] = [
  { text: "submit", type: "submit" },
  { text: "Menu.back", type: "button", action: authStore.handleShowForgetPassword }
];

const handleSubmit = () => {
  console.log("submit", fieldItems.find(f => f.name === 'username')?.value)
}

const handleShowPassword = (name: string) => {
  showPassword(fieldItems, name);
};
</script>

<template>
  <FieldForm 
    :fieldItems="fieldItems"
    :buttonItems="buttonItems"
    @submit="handleSubmit"
    @button="authStore.handleShowForgetPassword"
    @passwordToggle="handleShowPassword"
  />
</template>

<style scoped></style>
