export type message = {
  text: string
  value: string
};

export type user = {
  id: string
  name?: string
  avatar?: string
  birthday?: string
  musicTherapy: boolean
};

export type MainStoreState = {
  isAuthenticated: boolean
  tabBarActive: string
  locale: string
  showTabbar: boolean
  user: user
};

export type Song = {
  id: string
  title: string
  src: string
  index?: number
  chakra?: number
}

export type chakraType = {
  name: string,
  num: number,
  idx: number,
  list: any[]
}

export type chakraItem = {
  name: string,
  idx: number,
  id: string
}

export type chakraInfo = {
  name: string,
  num: number,
  idx: number,
  lists: any[],
}

export type MenuStoreState = {
  openMenu: string,
  isJuniorMode: boolean,
  openSubNav: boolean
}

export type MusicStoreState = {
  type: string
  title: string
  queue: Song[]
  item: null
  subMusic: any[]
  subMusicUpdated: any[]
  subSet: any[],
  chakra: chakraInfo,
  slidePercent: number,
  diskRotation: number
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

interface SetList {
  title: string,
  src: string
}

export type MusicSetList = {
  name: string,
  amount: number,
  intro: string,
  content: SetList[],
  chakra: any[],
}

export type MenuTypes = {
  navMenu: boolean
  music: boolean
  mymusic: boolean
  set: boolean
  chakra: boolean
}
