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
  defaultAvatar: string
  locale: string
  showTabbar: boolean
  user: user
};

interface list {
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

export type MusicStoreState = {
  type: string
  title: string
  src: string
  lists: list[]
  index: number
  status: boolean
  mode: number
  currentTime: string
  duraTime: string
  item: null
  subMusic: any[]
  subMusicUpdated: any[]
  subSet: any[],
  chakra: chakraInfo
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
