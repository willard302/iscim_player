import { setToastDefaultOptions } from "vant";

export default defineNuxtPlugin((nuxtApp) => {
  setToastDefaultOptions({duration: 1500});
  setToastDefaultOptions({forbidClick: true})
})
