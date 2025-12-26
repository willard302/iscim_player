import Components from "unplugin-vue-components/vite";
import {VantResolver} from "unplugin-vue-components/resolvers";
export default defineNuxtConfig({
  app: {
    baseURL: '/home',
    buildAssetsDir: 'assets',
    head: {
      title: "iSCIM Player",
      meta: [
        {name: "viewport", content: "width=device-width, initial-scale=1"},
        {name: "description", content: "iscim專用播放網站"}
      ],
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
    }
  },
  compatibilityDate: '2025-07-15',
  components: true,
  css: [
    '~/assets/scss/main.scss',
    '~/assets/scss/_vant.scss'
  ],
  devtools: { enabled: true },
  fontawesome: {
    icons: {
      solid: [
        'house', 'user', 'pen', 'caret-right', 'check', 'ellipsis-vertical', 'music', 
        'compact-disc', 'square-plus', 'backward', 'pause', 'play', 'forward', 'repeat',
        'volume-high', 'volume-off', 'bars', 'xmark', 'trash', 'arrow-left', 'floppy-disk',
        'eye', 'eye-slash'
      ],
      regular: ['user', 'face-smile']
    }
  },
  i18n: {
    defaultLocale: 'tw',
    locales: [
      {code: 'en', name: 'English', file: 'en.ts'},
      {code: 'tw', name: '繁體中文', file: 'tw.ts'}
    ]
  },
  imports: {
    dirs: ['app/composables']
  },
  modules: [
    "@nuxtjs/i18n",
    "@vant/nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    '@vesp/nuxt-fontawesome',
    '@nuxtjs/supabase'
  ],
  nitro: {
    routeRules: {
      '/api/**': { cors: true }
    }
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY
    }
  },
  plugins: [
    {src:'~/plugins/vant.client.ts', mode: 'client'}
  ],
  piniaPluginPersistedstate: {
    storage: 'sessionStorage'
  },
  ssr: false,
  supabase: {
    redirect: true,
    redirectOptions: {
      login: '/auth',
      callback: '/auth/confirm',
      exclude: ["/policy/*", "/en/policy/*"]
    },
    types: '~/types/database.types.ts'
  },
  typescript: {
    typeCheck: true,
    strict: true
  },
  vant: {
    defaultLocale: 'zh-TW'
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:`
            @use "~/assets/scss/_variable.scss" as *;
            @use "~/assets/scss/_mixin.scss" as *;
          `
        }
      }
    },
    plugins: [
      Components({
        resolvers: [VantResolver()]
      })
    ],
    server: {
      hmr: {
        protocol: 'ws',
        host: 'localhost'
      }
    }
  }
})