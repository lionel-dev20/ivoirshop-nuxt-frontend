import { defineEventHandler, getRouterParams, createError } from 'h3'
import axios from 'axios'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const WC_STORE_URL = runtimeConfig.WC_STORE_URL || runtimeConfig.public?.WORDPRESS_URL
    const params = getRouterParams(event)
    const categoryId = params.categoryId
    

    // Vérification de l'URL
    if (!WC_STORE_URL) {
      throw createError({ 
        statusCode: 500, 
        statusMessage: 'Configuration manquante' 
      })
    }

    // Configuration axios
    const axiosConfig = {
      timeout: 10000,
      headers: {
        'User-Agent': 'Nuxt-WooCommerce-Client/1.0',
        'Content-Type': 'application/json'
      }
    }

    
    // Configuration pour l'API WooCommerce avec authentification
    const wcConfig = {
      ...axiosConfig,
      auth: {
        username: runtimeConfig.WOOCOMMERCE_CONSUMER_KEY || '',
        password: runtimeConfig.WOOCOMMERCE_CONSUMER_SECRET || ''
      }
    }
    
    // Récupérer TOUS les produits avec pagination automatique
    let allProducts: any[] = []
    let currentPage = 1
    let hasMoreProducts = true
    const perPage = 100
    
    while (hasMoreProducts) {
      try {
        const { data: pageProducts, headers } = await axios.get(
          `${WC_STORE_URL}/wp-json/wc/v3/products`,
          {
            ...wcConfig,
            params: {
              category: categoryId,
              per_page: perPage,
              page: currentPage,
              status: 'publish'
            }
          }
        )
        
        if (pageProducts && pageProducts.length > 0) {
          allProducts = [...allProducts, ...pageProducts]
          
          // Vérifier s'il y a d'autres pages
          const totalPages = parseInt(headers['x-wp-totalpages'] || '1')
          const totalProducts = parseInt(headers['x-wp-total'] || '0')
          
          if (currentPage >= totalPages) {
            hasMoreProducts = false
          } else {
            currentPage++
          }
        } else {
          hasMoreProducts = false
        }
      } catch (pageError: any) {
        hasMoreProducts = false
      }
    }
    

    return {
      products: allProducts,
      total: allProducts.length,
      page: 1,
      per_page: allProducts.length
    }
    
  } catch (err: any) {
    
    if (err.response?.status === 404) {
      throw createError({ 
        statusCode: 404, 
        statusMessage: 'Catégorie non trouvée' 
      })
    }
    
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Erreur lors de la récupération des produits: ${err.message}` 
    })
  }
})
