import { defineEventHandler } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  
  return {
    config: {
      WORDPRESS_URL: runtimeConfig.WORDPRESS_URL,
      WC_STORE_URL: runtimeConfig.WC_STORE_URL,
      WOOCOMMERCE_CONSUMER_KEY: runtimeConfig.WOOCOMMERCE_CONSUMER_KEY ? '***' + runtimeConfig.WOOCOMMERCE_CONSUMER_KEY.slice(-4) : 'undefined',
      WOOCOMMERCE_CONSUMER_SECRET: runtimeConfig.WOOCOMMERCE_CONSUMER_SECRET ? '***' + runtimeConfig.WOOCOMMERCE_CONSUMER_SECRET.slice(-4) : 'undefined',
    },
    env: {
      WORDPRESS_URL: process.env.WORDPRESS_URL,
      WC_STORE_URL: process.env.WC_STORE_URL,
      WOOCOMMERCE_CONSUMER_KEY: process.env.WOOCOMMERCE_CONSUMER_KEY ? '***' + process.env.WOOCOMMERCE_CONSUMER_KEY.slice(-4) : 'undefined',
      WOOCOMMERCE_CONSUMER_SECRET: process.env.WOOCOMMERCE_CONSUMER_SECRET ? '***' + process.env.WOOCOMMERCE_CONSUMER_SECRET.slice(-4) : 'undefined',
    }
  }
})

