import Components from "unplugin-vue-components/vite";
import {VantResolver} from "unplugin-vue-components/resolvers";
export default defineNuxtConfig({
  // runtimeConfig: {
  //   public: {
  //     apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://api.yourdomain.com'
  //   }
  // },
  nitro: {
    routeRules: {
      '/api/**': { cors: true }
    }
  },
  ssr: false,
  imports: {
    dirs: ['app/composables']
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  components: true,
  app: {
    baseURL: '/',
    buildAssetsDir: 'assets',
    head: {
      title: "iSCIM Player",
      meta: [
        {name: "viewport", content: "width=device-width, initial-scale=1"}
      ],
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
    }
  },
  vite: {
    plugins: [
      Components({
        resolvers: [VantResolver()]
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:`
            @use "~/assets/scss/_variable.scss" as *;
            @use "~/assets/scss/_mixin.scss" as *;
          `
        }
      }
    }
  },
  css: ['~/assets/scss/main.scss'],
  plugins: [
    {src:'~/plugins/vant.client.ts', mode: 'client'}
  ],
  modules: [
    "@nuxtjs/i18n",
    "@vant/nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    '@vesp/nuxt-fontawesome'
  ],
  piniaPluginPersistedstate: {
    storage: 'sessionStorage'
  },
  i18n: {
    defaultLocale: 'tw',
    locales: [
      {code: 'en', name: 'English', file: 'en.ts'},
      {code: 'tw', name: '繁體中文', file: 'tw.ts'}
    ]
  },

  vant: {
    defaultLocale: 'zh-TW'
  },
  fontawesome: {
    icons: {
      solid: [
        'house', 'user', 'pen', 'caret-right', 'check', 'ellipsis-vertical', 'music', 
        'compact-disc', 'square-plus', 'backward', 'pause', 'play', 'forward', 'repeat',
        'volume-high', 'volume-off', 'bars', 'xmark', 'trash', 'arrow-left', 'floppy-disk'
      ],
      regular: ['user', 'face-smile']
    }
  }
})