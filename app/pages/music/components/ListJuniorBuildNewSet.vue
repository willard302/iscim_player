<script setup lang="ts">
import type { MusicLocal, SubMusic } from '~/types/data.types';

const props = defineProps<{
  subMusicLocal: SubMusic[]
}>();

const emit = defineEmits(['submit'])

const checked = ref([]);

const active = reactive({
  music: 0
});

const menuStore = useMenuStore();
const musicStore = useMusicStore();

const { removeMusic } = usePlaylist();

const newLists = [
  { 
    name: "Music.working", 
    children: [
      {name:'Music.routine', id:'routine'}, 
      {name:'Music.major_meetings', id:'major_meetings'},
    ] 
  },
  { 
    name: "Music.reinforce_learning", 
    children: [
      {name:'Music.weekday_review', id:'weekday_review'}, 
      {name:'Music.review_before_exam', id:'review_before_exam'},
    ] 
  },
  { 
    name: "Music.take_a_nap", 
    children: [
      {name:'Music.full_charge', id:'full_charge'}, 
      {name:'Music.fast_charge', id:'fast_charge'},
    ] 
  },
];

const showMenu = ref("");
const musicOrder = ref(0);
const musicListsSelected = ref<MusicLocal[]>([]);

const subTitle = computed((): string => {
  switch(menuStore.step) {
    case 1: return "Message.which_song_do_you_want_to_play";
    case 2: return "Message.what_you_want_now";
    default: return "";
  };
});

const handleCheck = (music: any) => {
  props.subMusicLocal.forEach(musicList => {
    if (!musicList.menu) return;
    musicList.menu.forEach(item => {
      if (item !== music) return;

      item.checked = !item.checked;

      if (item.checked) {
        musicOrder.value++;
        musicListsSelected.value.push(item);
        item.sort_order = musicOrder.value;
        return;
      };

      musicOrder.value--;
      musicListsSelected.value.forEach(one => removeMusic(one, music));
      musicListsSelected.value = musicListsSelected.value.filter(one => one.sort_order !== null);
      removeMusic(item, music);
    });
  });
};

const handleNext = () => {
  showMenu.value = '';
  if (musicListsSelected.value.length === 0) {
    showFailToast($t("Message.please_select_a_music_at_least"));
    return;
  }; 
  if (musicStore.newSet.name.length === 0) {
    showFailToast($t("Message.please_enter_a_name_for_the_set"));
    return;
  };
  musicStore.newSet.content = [...musicListsSelected.value];
  menuStore.step = 2;
};

const handleSubmit = () => {
  emit('submit', musicStore.newSet);
  menuStore.resetStep()
};

const handleSelectMode = (e: string) => {
  musicStore.newSet.mode = e;
};
</script>

<template>
  <div>
    <van-divider >{{$t(subTitle)}}</van-divider>

    <van-space class="content" direction="vertical" fill>
      <div class="musicList__body">

        <template v-if="menuStore.step === 1">
          <van-tabs
            v-model:active="active.music"
            type="card"
          >
            <van-tab
              v-for="(m, mIdx) in subMusicLocal"
              :key="mIdx"
              :title="$t(m.name)"
            >
              <van-checkbox-group v-model="checked">
                <van-cell-group inset>
                  <van-cell
                    v-for="(i, iIdx) in m.menu"
                    :key="iIdx"
                    :title="i.name"
                    @click="handleCheck(i)"
                    clickable
                  >
                    <template #right-icon>
                      <van-checkbox :name="i.name">
                        <template #icon>
                          {{ i.sort_order === 0 ? null : i.sort_order }}
                        </template>
                      </van-checkbox>
                    </template>
                  </van-cell>
                </van-cell-group>
              </van-checkbox-group>
            </van-tab>
          </van-tabs>
        </template>

        <template v-if="menuStore.step === 2">
          <van-space direction="vertical" fill>
            <div
              v-for="(item, idx) in newLists" 
              :key="idx" 
              class="custom-button"
            >
              <van-divider>{{ $t(item.name) }}</van-divider>
              <van-row>
                <van-col
                  v-for="(c, cIdx) in item.children"
                  :key="cIdx"
                  span="12"
                >
                  <van-button @click="handleSelectMode(c.id)">{{ $t(c.name) }}</van-button>
                </van-col>
              </van-row>
            </div>
          </van-space>
        </template>
      </div>
      <van-divider />
      <div class="musicList__footer custom-button">
        <template v-if="menuStore.step === 1">
          <van-field 
            v-model="musicStore.newSet.name"
            type="text"
            :placeholder="$t('Message.please_enter_a_name_for_the_set')" 
          />
          <van-button class="van-tab--card" @click="handleNext()">
            {{ $t("Menu.next") }}
          </van-button>
        </template>
        <template v-if="menuStore.step === 2">
          <van-button class="van-tab--card" @click="handleSubmit()">
            {{ $t("Menu.save_and_play") }}
          </van-button>
        </template>
      </div>
    </van-space>
  </div>
</template>

<style scoped lang="scss">
@use 'sass:color';

  .van-checkbox__icon {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-size: 1.2rem;
  }
  .van-cell-group--inset {
    --van-cell-group-background: transparent;
  }
  .van-cell--clickable {
    --van-cell-background: transparent;
  }
  .van-divider {
    --van-divider-border-color: $color23;
    --van-divider-margin: 10px;
  }

  :deep(.van-tabs__content) {
    height: 40vh;
    overflow-y: auto;
  }

</style>

