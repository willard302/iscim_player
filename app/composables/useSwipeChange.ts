export const useSwipeChange = (
  onSwipeLeft: () => void, 
  onSwipeRight: () => void
) => {
  const target = ref<HTMLElement>();

  useSwipe(target, {
    passive: false,
    threshold: 50, // 設定靈敏度，滑動 50px 就觸發
    onSwipeEnd(e, direction: string) {
      if (direction === 'left') {
        onSwipeLeft();
      } else if (direction === 'right') {
        onSwipeRight();
      }
    },
  });

  return { target };
};