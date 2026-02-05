import { Locale } from "vant";
import { LOCALE_CONFIG, type LocaleKey } from "~/utils/locale";
export const useAppLocale = () => {
  const mainStore = useMainStore();
  const {setLocale} = useI18n();

 const updateLocale = (lang: string) => {
    const config = LOCALE_CONFIG[lang as LocaleKey] || LOCALE_CONFIG.tw;
    setLocale(config.i18n);
    Locale.use(config.vantName, config.vantPackage);
  };

  const initLocale = () => {
    watch(
      () => mainStore.locale, 
      (newLang) => updateLocale(newLang),
      {immediate: true}
    )
  };

  return {
    initLocale,
    updateLocale
  }
}
