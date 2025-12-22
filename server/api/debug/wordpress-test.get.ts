// server/api/debug/wordpress-test.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const { categorySlug = 'smartphones' } = query


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
    const healthCheck = await $fetch(`${config.WORDPRESS_URL}/wp-json/wc/v3/system_status`, {
      params: {
        consumer_key: config.WOOCOMMERCE_CONSUMER_KEY,
        consumer_secret: config.WOOCOMMERCE_CONSUMER_SECRET
      }
    })

    // Test 2: Récupérer les catégories
    const categories = await $fetch(`${config.WORDPRESS_URL}/wp-json/wc/v3/products/categories`, {
      params: {
        per_page: 10,
        consumer_key: config.WOOCOMMERCE_CONSUMER_KEY,
        consumer_secret: config.WOOCOMMERCE_CONSUMER_SECRET
      }
    })

    // Test 3: Chercher la catégorie spécifique
    const categorySearch = await $fetch(`${config.WORDPRESS_URL}/wp-json/wc/v3/products/categories`, {
      params: {
        search: categorySlug,
        consumer_key: config.WOOCOMMERCE_CONSUMER_KEY,
        consumer_secret: config.WOOCOMMERCE_CONSUMER_SECRET
      }
    })

    // Test 4: Récupérer tous les produits (limité)
    const products = await $fetch(`${config.WORDPRESS_URL}/wp-json/wc/v3/products`, {
      params: {
        per_page: 5,
        status: 'publish',
        consumer_key: config.WOOCOMMERCE_CONSUMER_KEY,
        consumer_secret: config.WOOCOMMERCE_CONSUMER_SECRET
      }
    })

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

