// server/api/debug/connection-test.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  

  if (!config.WORDPRESS_URL) {
    return {
      success: false,
      error: 'WORDPRESS_URL non configuré',
      message: 'La variable d\'environnement WORDPRESS_URL n\'est pas définie'
    }
  }

  if (!config.WOOCOMMERCE_CONSUMER_KEY || !config.WOOCOMMERCE_CONSUMER_SECRET) {
    return {
      success: false,
      error: 'Clés API WooCommerce manquantes',
      message: 'Les variables WOOCOMMERCE_CONSUMER_KEY et WOOCOMMERCE_CONSUMER_SECRET ne sont pas définies'
    }
  }

  try {
    // Test de connexion simple
    
    const response = await $fetch(`${config.WORDPRESS_URL}/wp-json/wc/v3/system_status`, {
      params: {
        consumer_key: config.WOOCOMMERCE_CONSUMER_KEY,
        consumer_secret: config.WOOCOMMERCE_CONSUMER_SECRET
      },
      timeout: 10000 // 10 secondes de timeout
    })

    
    return {
      success: true,
      message: 'Connexion à WordPress réussie',
      wordpress_url: config.WORDPRESS_URL,
      response_keys: Object.keys(response || {}),
      timestamp: new Date().toISOString()
    }

  } catch (error: any) {
    
    return {
      success: false,
      error: error.message,
      message: 'Impossible de se connecter à WordPress',
      wordpress_url: config.WORDPRESS_URL,
      timestamp: new Date().toISOString(),
      details: {
        code: error.code,
        status: error.status,
        statusText: error.statusText
      }
    }
  }
})

