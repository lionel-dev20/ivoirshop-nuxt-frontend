// server/api/debug/wordpress-test.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const { categorySlug = 'smartphones' } = query

  console.log('=== WordPress API Test ===')
  console.log('WORDPRESS_URL:', config.WORDPRESS_URL)
  console.log('CONSUMER_KEY:', config.WOOCOMMERCE_CONSUMER_KEY ? 'Defined' : 'Not defined')
  console.log('CONSUMER_SECRET:', config.WOOCOMMERCE_CONSUMER_SECRET ? 'Defined' : 'Not defined')
  console.log('Category slug:', categorySlug)

  if (!config.WORDPRESS_URL) {
    return {
      error: 'WORDPRESS_URL not configured',
      config: {
        wordpressUrl: 'Not defined',
        consumerKey: config.WOOCOMMERCE_CONSUMER_KEY ? 'Defined' : 'Not defined',
        consumerSecret: config.WOOCOMMERCE_CONSUMER_SECRET ? 'Defined' : 'Not defined'
      }
    }
  }

  try {
    // Test 1: Vérifier la connexion de base
    console.log('Test 1: Connexion de base...')
    const healthCheck = await $fetch(`${config.WORDPRESS_URL}/wp-json/wc/v3/system_status`, {
      params: {
        consumer_key: config.WOOCOMMERCE_CONSUMER_KEY,
        consumer_secret: config.WOOCOMMERCE_CONSUMER_SECRET
      }
    })
    console.log('Health check réussi')

    // Test 2: Récupérer les catégories
    console.log('Test 2: Récupération des catégories...')
    const categories = await $fetch(`${config.WORDPRESS_URL}/wp-json/wc/v3/products/categories`, {
      params: {
        per_page: 10,
        consumer_key: config.WOOCOMMERCE_CONSUMER_KEY,
        consumer_secret: config.WOOCOMMERCE_CONSUMER_SECRET
      }
    })
    console.log(`Catégories trouvées: ${categories?.length || 0}`)

    // Test 3: Chercher la catégorie spécifique
    console.log(`Test 3: Recherche de la catégorie "${categorySlug}"...`)
    const categorySearch = await $fetch(`${config.WORDPRESS_URL}/wp-json/wc/v3/products/categories`, {
      params: {
        search: categorySlug,
        consumer_key: config.WOOCOMMERCE_CONSUMER_KEY,
        consumer_secret: config.WOOCOMMERCE_CONSUMER_SECRET
      }
    })
    console.log(`Catégories trouvées pour "${categorySlug}": ${categorySearch?.length || 0}`)

    // Test 4: Récupérer tous les produits (limité)
    console.log('Test 4: Récupération des produits...')
    const products = await $fetch(`${config.WORDPRESS_URL}/wp-json/wc/v3/products`, {
      params: {
        per_page: 5,
        status: 'publish',
        consumer_key: config.WOOCOMMERCE_CONSUMER_KEY,
        consumer_secret: config.WOOCOMMERCE_CONSUMER_SECRET
      }
    })
    console.log(`Produits trouvés: ${products?.length || 0}`)

    return {
      success: true,
      results: {
        healthCheck: 'OK',
        categoriesCount: categories?.length || 0,
        categorySearchResults: categorySearch?.length || 0,
        productsCount: products?.length || 0,
        sampleProducts: products?.slice(0, 2) || [],
        sampleCategories: categories?.slice(0, 3) || [],
        categorySearch: categorySearch || []
      },
      config: {
        wordpressUrl: config.WORDPRESS_URL,
        consumerKey: config.WOOCOMMERCE_CONSUMER_KEY ? 'Defined' : 'Not defined',
        consumerSecret: config.WOOCOMMERCE_CONSUMER_SECRET ? 'Defined' : 'Not defined'
      }
    }

  } catch (error: any) {
    console.error('Erreur lors du test WordPress:', error.message)
    return {
      success: false,
      error: error.message,
      config: {
        wordpressUrl: config.WORDPRESS_URL,
        consumerKey: config.WOOCOMMERCE_CONSUMER_KEY ? 'Defined' : 'Not defined',
        consumerSecret: config.WOOCOMMERCE_CONSUMER_SECRET ? 'Defined' : 'Not defined'
      }
    }
  }
})

