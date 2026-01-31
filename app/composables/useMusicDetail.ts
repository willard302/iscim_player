import type { FieldItem } from "~/types/data.types";

export const useMusicDetail = () => {

  const uiState = reactive({
    showOptions: false,
    showInfo: false,
    showDialog: false
  });

  const fieldItems = ref<FieldItem[]>([]);

  const currentItem = ref<any>(null);

  const openOptions = (item: any) => {
    currentItem.value = item;
    uiState.showOptions = true;
    uiState.showInfo = false;
  };

  const transferToFields = (
    data: any,
    allowedNames?: string[]
  ): FieldItem[] => {
    if (!data) return [];

    const specializeKeys = new Set(['created_at', 'created_by']);
    const allowedSet = allowedNames ? new Set(allowedNames) : null;

    return Object.entries(data)
      .filter(([key]) => {
        return allowedSet ? allowedSet.has(key) : true;
      })
      .map(([key, value]) => ({
        label: specializeKeys.has(key) ? key : `Music.${key}`,
        value: String(value ?? ''),
        name: key,
        type: 'text'
      }))
  };

  const openInfo = (allowedFields?: string[]) => {
    if (!currentItem.value) return;
    fieldItems.value = transferToFields(currentItem.value, allowedFields);
    uiState.showInfo = true;
    uiState.showOptions = false;
  };

  return {
    uiState,
    fieldItems,
    currentItem,
    openOptions,
    openInfo,
    transferToFields
  }
}
