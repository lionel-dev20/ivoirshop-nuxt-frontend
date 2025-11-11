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
      ],
      script: [
        {
          innerHTML: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1091644285194397');
            fbq('track', 'PageView');
          `,
          type: 'text/javascript'
        },
        {
          src: 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js',
          defer: true,
          type: 'text/javascript'
        },
        {
          innerHTML: `
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(async function(OneSignal) {
              await OneSignal.init({
                appId: "c16c70ab-fa4c-429b-9cd0-84ed90343914",
              });
            });
          `,
          type: 'text/javascript'
        },
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-SRMB4DV3VY',
          async: true,
          type: 'text/javascript'
        },
        {
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SRMB4DV3VY');
          `,
          type: 'text/javascript'
        }
      ] as any,
      noscript: [
        {
          innerHTML: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1091644285194397&ev=PageView&noscript=1"/>`
        }
      ]
    }
  }
})

