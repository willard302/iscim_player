import vantUS from 'vant/es/locale/lang/en-US';
import vantTW from 'vant/es/locale/lang/zh-TW';

export const LOCALE_CONFIG = {
  tw: {i18n: 'tw', vantName: 'zh-TW', vantPackage: vantTW},
  en: {i18n: 'en', vantName: 'en-US', vantPackage: vantUS}
} as const;

export type LocaleKey = keyof typeof LOCALE_CONFIG;