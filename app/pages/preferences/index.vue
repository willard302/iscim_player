<script setup lang="ts">
import type { ChakraType } from '~/types/data.types';

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

const showPickerChakras = ref(false);
const pickerValue = ref([]);

const subChakra = computed(() => [
  { text: $t("Chakra.balance"), idx: 0, value: "Balance" },
  { text: $t("Chakra.overall"), idx: 99, value: "OverAll" },
  { text: $t("Chakra.root"), idx: 1, value: "Root" },
  { text: $t("Chakra.sacral"), idx: 2, value: "Sacral" },
  { text: $t("Chakra.navel"), idx: 3, value: "Navel" },
  { text: $t("Chakra.waist"), idx: 4, value: "Waist" },
  { text: $t("Chakra.solar_plexus"), idx: 5, value: "Solar Plexus" },
  { text: $t("Chakra.heart"), idx: 6, value: "Heart" },
  { text: $t("Chakra.pineal"), idx: 7, value: "Pineal" },
  { text: $t("Chakra.third_eye"), idx: 8, value: "Third Eye" },
  { text: $t("Chakra.crown"), idx: 9, value: "Crown" },
]);

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
  { 
    title: 'enhance', 
    action: () => showPickerChakras.value = true, 
    label: $t(String(musicStore.chakra.name))
  },
]);

const routeLists = reactive([
  { title: 'user_data', path: '/userCenter/profile' },
  { title: 'Notice.terms_of_service', path: '/policy/service' },
  { title: 'Notice.privacy_policy', path: '/policy/privacy' }
]);

const onConfirm = (res: any) => {
  showPickerChakras.value = false;
  pickerValue.value = res.selectedValues;
  musicStore.chakra.name = res.selectedOptions[0].text;
  musicStore.chakra.num = subChakra.value.find(s => s.text === musicStore.chakra.name)?.idx;
};

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
    </van-cell-group>

    <van-popup v-model:show="showPickerChakras" destroy-on-close round position="bottom">
      <van-picker
        :model-value="pickerValue"
        :columns="subChakra"
        @cancel="showPickerChakras = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<style scoped lang="scss">
@import url("~/assets/scss/_transitions.scss");

.van-button--small {
  width: 72px;
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
