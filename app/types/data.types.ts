import type { ButtonNativeType, FieldType } from "vant";
import type { UserInsert, UserUpdate } from "./supabase";

export type ButtonItem = {
  text: string
  type: ButtonNativeType
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

export type Message = {
  text: string
  value: string
};

export type MainStoreState = {
  isAuthenticated: boolean,
  locale: string,
  userInfo: UserInsert | UserUpdate
}

export type Song = {
  id: string
  name: string
  src: string
  intro?: string
  index?: number
  chakra?: number
  checked?: boolean
  order?: number | null
}

export type MusicMenu = {
  name: string,
  id?: string,
  class?: string,
  menu: Song[]
}

export type ChakraType = {
  name: string,
  id?: string,
  num?: number,
  idx: number,
  lists?: any[]
}

export type MenuStoreState = {
  openMenu: string,
  openSubNav: boolean,
  isJuniorMode: boolean,
  step: number
}

export type MusicStoreState = {
  type: string
  name: string
  queue: Song[]
  item: null
  subMusic: MusicMenu[]
  subMusicUpdated: MusicMenu[]
  subSet: any[]
  chakra: ChakraType
  newSet: SetType
  slidePercent: number
  diskRotation: number
  isDragging: boolean
  isLoaded: boolean
}

export type PlayerStoreState = {
  isPlaying: boolean
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

export type SetType = {
  name: string
  type: string
  content: Song[]
  chakra?: any
  intro?: string
  mode?: string
}

export type PolicyPart = {
  title: string
  content?: string
  contents?: string[]
  lists?: string[]
}
