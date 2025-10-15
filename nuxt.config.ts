// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false }, // Désactivé en production
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
  ], '@nuxt/fonts'
],

  runtimeConfig: {
     public: {
      WOOCOMMERCE_API_URL: process.env.WOOCOMMERCE_API_URL || "https://admin.ivoirshop.ci/wp-json/wc/v3",
      WORDPRESS_URL: process.env.WORDPRESS_URL
    },
    WORDPRESS_URL: process.env.WORDPRESS_URL, // accessible côté serveur
    WC_STORE_URL: process.env.WC_STORE_URL || process.env.WORDPRESS_URL,
    WOOCOMMERCE_CONSUMER_KEY: process.env.WOOCOMMERCE_CONSUMER_KEY,
    WOOCOMMERCE_CONSUMER_SECRET: process.env.WOOCOMMERCE_CONSUMER_SECRET,
    // NODE_TLS_REJECT_UNAUTHORIZED: process.env.NODE_TLS_REJECT_UNAUTHORIZED, // ⚠️ Désactivé pour la sécurité
  },
   ssr: true,

  // Optimisations pour la production
  experimental: {
    payloadExtraction: false
  },
  
  // Optimisations de build
  build: {
    transpile: ['@headlessui/vue']
  },
  
  // Optimisations de performance
  nitro: {
    compressPublicAssets: true,
    minify: true
  },
  
  // Configuration pour la production
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'IvoirShop CI - Votre boutique en ligne',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/logo/ivoirshop-icon.ico' }
      ],
      meta: [
        { name: 'description', content: 'Découvrez notre large gamme de produits électroniques, électroménager et bien plus sur IvoirShop CI' },
        { name: 'keywords', content: 'boutique en ligne, Côte dIvoire, électronique, électroménager, smartphones, TV' }
      ]
    }
  }
})
