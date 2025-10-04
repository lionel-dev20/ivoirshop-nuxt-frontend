// server/api/debug/config.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  return {
    wordpressUrl: config.WORDPRESS_URL ? 'Defined' : 'Not defined',
    consumerKey: config.WOOCOMMERCE_CONSUMER_KEY ? 'Defined' : 'Not defined',
    consumerSecret: config.WOOCOMMERCE_CONSUMER_SECRET ? 'Defined' : 'Not defined',
    timestamp: new Date().toISOString()
  }
})

