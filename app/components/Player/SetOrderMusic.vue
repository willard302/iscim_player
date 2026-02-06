<script setup lang="ts">
const musicStore = useMusicStore();
const { updateSetToDb } = useDataBase();

const activeTab = ref(0);
const showPickerChakras = ref(false);
const pickerValue = ref([]);
const selectedItem = ref<any>();

const subTabActive = reactive<Record<string, number>>({
  system: 0,
  custom: 0
});

const musicTabs = computed(() => [
  {
    key: 'system',
    name: 'Menu.system_music',
    data: musicStore.subMusic
  },
  {
    key: 'custom',
    name: 'Menu.custom_music',
    data: musicStore.subMusicUpdated
  }
]);

const subChakra = computed(() => [
  { text: $t("Chakra.balance"), idx: 0, value: "Balance" },
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

const handleSelectChakra = (item: any) => {
  selectedItem.value = item;
  showPickerChakras.value = true;
};

const handleAddToSet = async(item: any) => {
  const _set = musicStore.currentSet;
  if (!_set || !_set.id) return;
  if (!Array.isArray(_set.content)) _set.content = [];
  _set.content.push(item);
  const res = await updateSetToDb (_set.id, { content: _set.content});

  if (res) showSuccessToast($t("Toast.add_successfully"));
};

const handleNextStep = () => {
  console.log('Next')
};

const handleCancel = () => {
  musicStore.setPlayerSetOrderMusic(false);
};

const onConfirmChakra = (res: any) => {
  showPickerChakras.value = false;
  pickerValue.value = res.selectedValues;
  selectedItem.value.chakra = res.selectedOptions[0].idx;
};

onMounted(() => {
  if(!musicStore.isPro) return;
  musicStore.initMusicData();
});

</script>

<template>
  <div>
    <CommonSubHeader 
      :title="musicStore.currentSet?.name"
      left-icon="arrow-left"
      @click-left="musicStore.setPlayerSetOrderMusic(false)"
    />
    <van-tabs
      v-model:active="activeTab"
      class="custom-tab"
      sticky
      type="card"
    >
      <van-tab
        v-for="tab in musicTabs"
        :key="tab.key"
        :name="tab.name"
        :title="$t(tab.name)"
      >
        <van-tabs
          v-model:active="subTabActive[tab.key]"
          type="card"
          class="inner-tabs"
        >
          <van-tab
            v-for="(subMusic, subIdx) in tab.data"
            :key="subIdx"
            :title="$t(subMusic.name)"
          >
            <div class="scrollable-list">
              <van-cell-group inset>
                <van-cell
                  v-for="(item, itemIdx) in subMusic.menu"
                  :key="itemIdx"
                  :title="item.name"
                  clickable
                >
                  <template #label>
                    <van-text-ellipsis
                      rows="1"
                      :content="String(item.intro)"
                      expand-text=""
                      collapse-text=""
                    />
                  </template>
                  <template #right-icon>
                    <van-button 
                      size="small"
                      @click="handleSelectChakra(item)"
                    >
                      {{ item.chakra }}
                    </van-button>
                    <van-button
                      size="small"
                      icon="add-o"
                      @click="handleAddToSet(item)"
                    />
                  </template>
                </van-cell>
              </van-cell-group>
            </div>
          </van-tab>
        </van-tabs>
      </van-tab>      
    </van-tabs>
    <van-action-bar>
      <van-action-bar-icon 
        icon="close" text="cancel" 
        @click="handleCancel" 
      />
      <van-action-bar-icon 
        icon="arrow-double-right" text="next" 
        @click="handleNextStep" 
      />
    </van-action-bar>

    <van-popup v-model:show="showPickerChakras" destroy-on-close round position="bottom">
      <van-picker
        :model-value="pickerValue"
        :columns="subChakra"
        @cancel="showPickerChakras = false"
        @confirm="onConfirmChakra"
      />
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';
.van-action-bar-icon {
  flex: 1;
}

:deep(.van-popup) {
  position: absolute;
}

.scrollable-list {
  overflow-y: auto;
  padding-bottom: 10px;
  height: calc(100dvh - var(--van-tabs-card-height)*2 - var(--header-h) - var(--tabbar-h) - var(--sat) - var(--sab));

  .van-cell-group--inset {
    --van-cell-group-inset-padding: 0;
  }
}

.showMiniBar .scrollable-list {
  height: calc(100dvh - var(--van-tabs-card-height)*2 - var(--header-h) - var(--tabbar-h) - var(--minibar-h) - var(--sat) - var(--sab));
}

.van-cell-group--inset {
  --van-cell-group-background: transparent;
}

.van-cell--clickable {
  --van-cell-background: transparent;
  align-items: center;

  &.selected {
    color: $color-text-tertiary;
    font-weight: bold;
  }
}

.van-cell--clickable:active {
  background-color: transparent;
}

</style>
