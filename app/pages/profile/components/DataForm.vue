<script setup lang="ts">
import type { PickerConfirmEventParams } from 'vant';
import type { FieldItem } from '~/types/data.types';
import type { UserInsert, UserRow } from '~/types/supabase';
const {t} = useI18n();

const mainStore = useMainStore();

const props = defineProps<{
  editable: boolean
}>();
const emit = defineEmits(['update', 'submit', 'editable']);

const order = [
  "id", "email", "name", "gender", "birthday", "inviter", "join_date", "created_at", "created_by"
];
const hideItems = ['id', 'created_at', 'created_by', 'avatar_url'];
const pickerOptions = {
  gender: [
    { text: t('male'), value: 'male' },
    { text: t('female'), value: 'female' },
  ],
  date:[]
};

const showPickerGender = ref(false);
const showPickerDate = ref(false);
const localUser = ref({...mainStore.userInfo});

const fields = computed<FieldItem[]>(() => {
  return Object.entries(localUser.value)
    .filter(([key]) => !hideItems.includes(key))
    .map(([key, val]) => ({
      label: key,
      value: fieldValue(key, String(val)),
      name: key
    }))
    .sort((a,b) => order.indexOf(a.name) - order.indexOf(b.name));
});

const fieldValue = (key: string, val: string) => {
  if (!val) return '';
  switch (key) {
    case 'gender': return t(val);
    default: return val;
  };
};
const onChangeData = (info: FieldItem) => {
  if (!info.name) return;
  const updateData = { [info.name]: info.value ?? '' } as Partial<UserRow>
  localUser.value = {...localUser.value, ...updateData}
};
const onConfirmPicker = (
  key: keyof UserInsert, 
  {selectedValues}: PickerConfirmEventParams
) => {
  const newData = { [key]: String(selectedValues[0]) } as Partial<UserInsert>;
  localUser.value = { ...localUser.value, ...newData };
  showPickerGender.value = false;
};
const onSubmit = () => {
  emit('submit', localUser.value);
};
const toggleEdit = () => {
  if( props.editable ) {
    localUser.value = mainStore.userInfo
  };
  emit('editable', props.editable ? false : true); 
};
const handleToggle = (action: string) => {
  if (!props.editable) return;
  switch(action) {
    case "gender":
      showPickerGender.value = !showPickerGender.value;
      break;
    case "date":
      showPickerDate.value = !showPickerDate.value;
    default:
      break;
  }
};

</script>

<template>
  <van-form @submit="onSubmit" :disabled="!editable">
    <van-cell-group inset>
      <Avatar />

      <template v-for="f in fields" :key="f.name">
        <van-field
          v-if="['gender'].includes(f.name)"
          is-link
          readonly
          v-model="(f.value as string)"
          :label="$t(f.label)"
          @click="handleToggle(f.name)" 
        />
        <van-field 
          v-else-if="f.name === 'email'"
          type="email"
          v-model="(f.value as string)"
          :label="$t(f.label)"
          @update:model-value="val => onChangeData({...f, value: val})"
        />
        <van-field 
          v-else-if="f.name === 'name'"
          type="text"
          v-model="(f.value as string)"
          :label="$t(f.label)"
          @update:model-value="val => onChangeData({...f, value: val})"
        />

        <van-field 
          v-else-if="['birthday', 'join_date'].includes(f.name)"
          type="date"
          v-model="(f.value as string)"
          :label="$t(f.label)"
          @update:model-value="val => onChangeData({...f, value: val})"
        />
        <van-field 
          v-else
          type="text"
          v-model="(f.value as string)"
          :label="$t(f.label)"
          @update:model-value="val => onChangeData({...f, value: val})"
        />

        <van-popup
          v-if="f.name === 'gender'"
          v-model:show="showPickerGender"
          round
          position="bottom"
        >
          <van-picker 
            :columns="pickerOptions.gender"
            @confirm="params => onConfirmPicker('gender', params)"
            @cancel="handleToggle('gender')"
          />
        </van-popup>

      </template>
    </van-cell-group>

    <van-space class="button__container">
      <van-button
        round
        block
        type="primary"
        @click.prevent="toggleEdit"
      >
        {{ !props.editable ? $t("edit") : $t("cancel") }}
      </van-button>
      <van-button
        v-if="props.editable"
        round
        block
        type="primary"
        native-type="submit"
      >
        {{ $t("submit") }}
      </van-button>
    </van-space>
  </van-form>
</template>

<style scoped lang="scss">

.van-cell-group {
  max-width: 400px;
  margin: auto;
}

.button__container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 10px;
  overflow-y: auto;

  :deep(.van-space-item) {
    width: 45%
  };
}
</style>
