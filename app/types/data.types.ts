import type { ButtonNativeType, FieldType } from "vant";
import type { MusicRow, SetInsert, SetUpdate, UserInsert, UserUpdate } from "./supabase";

export type ButtonItem = {
  text: string
  type?: ButtonNativeType
  to?: string
  action?: () => void
};

export type FieldOption = {
  text: string
  value: string
  id?: string
}

export type FieldItem = {
  label: string
  value: string | number | boolean
  name: string
  type?: FieldType
  placeholder?: string
  required?: boolean
  message?: string
  autocomplete?: string
  options?: FieldOption[]
};

export type MainStoreState = {
  isAuthenticated: boolean,
  locale: string,
  userInfo: UserInsert | UserUpdate
  currentTab: number
  openPreferences: boolean
  openPolicyPrivacy: boolean
  openPolicyService: boolean
}

export type MusicStoreState = {
  openQueue: boolean
  openQueueEditor: boolean
  openSet: boolean
  name: string
  queue: any[]
  subMusic: SubMusic[]
  subMusicUpdated: SubMusic[]
  subSet: SubSet[]
  newSet: SetInsert
  currentSet: SetUpdate
  slidePercent: number
  diskRotation: number
  isDragging: boolean
  isLoading: boolean
  isDataLoaded: boolean
}

export type PlayerStoreState = {
  isPlaying: boolean
  isExpanded: boolean
  currentSong: MusicLocal | null
  src: string
  index: number
  volume: number
  volume_on: boolean;
  loop: "normal" | "repeatOne" | "repeatAll"
  currentTime: string
  currentSec: number
  duration: number
  duraTime: string
}

export type ChakraType = {
  name?: string
  text?: string
  id?: string
  num?: number
  value?: string
  idx: number
  lists?: any[]
}

export interface MusicLocal extends MusicRow {
  checked?: boolean
  sort_order?: number
}

export type SubMusic = {
  name: string
  id: string
  intro?: string
  menu?: MusicLocal[]
}

export type SubSet = {
  name: string,
  id: string,
  intro?: string,
  menu: SetInsert[]
}

export type PolicyPart = {
  title: string
  content?: string
  contents?: string[]
  lists?: string[]
}

export type Picker = {
  selectedIndexes: number[]
  selectedOptions: FieldOption[]
  selectedValues: string[]
}
