// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: ['@pinia/nuxt', [
    'shadcn-nuxt',
    {
      /**
       * Prefix for all the imported component
       */
      prefix: '',
      /**
       * Directory that the component lives in.
       * @default "./shadcn/ui"
       */
      componentDir: './shadcn/ui'
    },
  ], '@nuxt/fonts',
  '@nuxt/image'
],

  fonts: {      
    google: {
      families: {
        "Sora": [400, 500, 700, 800, 900],
        'Montserrat': [400, 500, 700],
        'font-optical-sizing': 'auto',
        'font-style': 'normal'
      }
    }
  },

  runtimeConfig: {
     public: {
      WOOCOMMERCE_API_URL: process.env.WOOCOMMERCE_API_URL || "http://ivoir-shop.local/wp-json/wc/v3",
      WORDPRESS_URL: process.env.WORDPRESS_URL
    },
    WORDPRESS_URL: process.env.WORDPRESS_URL, // accessible côté serveur
    WC_STORE_URL: process.env.WC_STORE_URL,
    WOOCOMMERCE_CONSUMER_KEY: process.env.WOOCOMMERCE_CONSUMER_KEY,
    WOOCOMMERCE_CONSUMER_SECRET: process.env.WOOCOMMERCE_CONSUMER_SECRET,
    NODE_TLS_REJECT_UNAUTHORIZED: process.env.NODE_TLS_REJECT_UNAUTHORIZED,
  },
   ssr: true,

  // Optimisation
  experimental: {
    payloadExtraction: false
  }
})