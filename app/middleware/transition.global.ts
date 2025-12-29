export default defineNuxtRouteMiddleware((to, from) => {
  const toOrder = Number(to.meta.pageOrder) ?? 0;
  const fromOrder = Number(from.meta.pageOrder) ?? 0;

  if (to.path === from.path) return;
  if (!to.meta.pageOrder) return;

  const direction = (toOrder > fromOrder) ? 'slide-left' : 'slide-right';

  const applyTransition = (route: typeof to) => {
    if (route.meta.pageTransition === false) return;

    route.meta.pageTransition = {
      ...(((typeof route.meta.pageTransition) === 'object') ? route.meta.pageTransition : {}),
      name: direction
    };
  };

  applyTransition(to);
  applyTransition(from);
})
