import { Preferences } from '@capacitor/preferences';

export const useLocalStorage = () => {
  const STORAGE_KEY = reactive({
    MUSICSETS: 'my_music_sets'
  });

  const saveMusicSetsToDevice = async (sets: any[]) => {
    await Preferences.set({
      key: STORAGE_KEY.MUSICSETS,
      value: JSON.stringify(sets)
    })
  };

  const loadMusicSetsFromDevice = async () => {
    const { value } = await Preferences.get({ key: STORAGE_KEY.MUSICSETS });
    return value ? JSON.parse(value) : [];
  };

  return {
    STORAGE_KEY,
    saveMusicSetsToDevice,
    loadMusicSetsFromDevice
  }
}
