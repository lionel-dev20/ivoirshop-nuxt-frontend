import { defineEventHandler, getRouterParams, createError } from 'h3'
import axios from 'axios'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const WC_STORE_URL = runtimeConfig.WC_STORE_URL || runtimeConfig.public?.WORDPRESS_URL
    const params = getRouterParams(event)
    const categoryId = params.categoryId
    
    console.log('Récupération des produits pour la catégorie:', categoryId)

    // Vérification de l'URL
    if (!WC_STORE_URL) {
      console.error('Variable d\'environnement WC_STORE_URL manquante')
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

    console.log(`Récupération de TOUS les produits pour la catégorie: ${categoryId}`)
    
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
        console.log(`Récupération de la page ${currentPage} pour la catégorie ${categoryId}...`)
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
          console.log(`✅ Page ${currentPage}: ${pageProducts.length} produits récupérés`)
          
          // Vérifier s'il y a d'autres pages
          const totalPages = parseInt(headers['x-wp-totalpages'] || '1')
          const totalProducts = parseInt(headers['x-wp-total'] || '0')
          console.log(`📊 Total disponible: ${totalProducts} produits sur ${totalPages} pages`)
          
          if (currentPage >= totalPages) {
            hasMoreProducts = false
          } else {
            currentPage++
          }
        } else {
          hasMoreProducts = false
        }
      } catch (pageError: any) {
        console.error(`❌ Erreur page ${currentPage}:`, pageError.message)
        hasMoreProducts = false
      }
    }
    
    console.log(`✅ TOTAL FINAL: ${allProducts.length} produits récupérés pour la catégorie ${categoryId}`)

    return {
      products: allProducts,
      total: allProducts.length,
      page: 1,
      per_page: allProducts.length
    }
    
  } catch (err: any) {
    console.error('Erreur lors de la récupération des produits de catégorie:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      url: err.config?.url
    })
    
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
