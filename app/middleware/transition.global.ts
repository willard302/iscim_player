export default defineNuxtRouteMiddleware((to, from) => {
  const toOrder = to.meta.pageOrder;
  const fromOrder = from.meta.pageOrder;

  if (to.path === from.path || typeof toOrder !== 'number') return;

  const fromOrderVal = typeof fromOrder === 'number' ? fromOrder : 0;

  const isLoopBack = fromOrderVal === 1 && toOrder === 3;
  const isLoopForward = fromOrderVal === 3 && toOrder ===1;
  const isNaturalForward = toOrder > fromOrderVal;

  const direction = (isLoopForward || (isNaturalForward && !isLoopBack))
    ? 'slide-left'
    : 'slide-right';

  [to, from].forEach((route) => {
    if (route.meta.pageTransition === false) return;

    route.meta.pageTransition = {
      ...(typeof route.meta.pageTransition === 'object' ? route.meta.pageTransition : {}),
      name: direction
    }
  });
})
