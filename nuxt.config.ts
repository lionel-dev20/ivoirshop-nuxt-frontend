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
    esbuild: {
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
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
  WORDPRESS_URL: process.env.WORDPRESS_URL,
  WC_STORE_URL: process.env.WC_STORE_URL || process.env.WORDPRESS_URL,
  WOOCOMMERCE_CONSUMER_KEY: process.env.WOOCOMMERCE_CONSUMER_KEY,
  WOOCOMMERCE_CONSUMER_SECRET: process.env.WOOCOMMERCE_CONSUMER_SECRET,
  
  public: {
    WOOCOMMERCE_API_URL: process.env.WOOCOMMERCE_API_URL || "https://admin.ivoirshop.ci/wp-json/wc/v3",
    WORDPRESS_URL: process.env.WORDPRESS_URL,
    WC_STORE_URL: process.env.WC_STORE_URL || process.env.WORDPRESS_URL, // ✅ Ajoutez cette ligne
  },
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
      title: 'IvoirShop.ci | Boutique en ligne Côte d’Ivoire – Téléphones, Électroménager, Mode & Livraison Rapidee',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/logo/ivoirshop-icon.ico' }
      ],
      meta: [
        { name: 'description', content: 'Achetez en ligne sur IvoirShop.ci : téléphones, électroménager, TV, mode et beauté. Meilleurs prix, livraison rapide et paiement sécurisé en Côte d’Ivoire.' },
        { name: 'keywords', content: 'boutique en ligne, Côte dIvoire, électronique, électroménager, smartphones, TV' }
      ]
    }
  }
})

