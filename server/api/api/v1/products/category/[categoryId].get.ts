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

    // Récupérer les paramètres de requête
    const query = getQuery(event)
    const perPage = query.per_page || 100
    const page = query.page || 1

    console.log(`Récupération des produits - Catégorie: ${categoryId}, Page: ${page}, Per Page: ${perPage}`)
    
    // Utilise l'endpoint personnalisé WordPress pour récupérer les produits par catégorie
    const { data: productsResponse } = await axios.get(
      `${WC_STORE_URL}/wp-json/custom/v1/products/${categoryId}`,
      axiosConfig
    )

    console.log(`${productsResponse.length} produits trouvés pour la catégorie ${categoryId}`)

    // L'endpoint WordPress retourne déjà le bon format, on l'utilise directement
    return {
      products: productsResponse,
      total: productsResponse.length,
      page: parseInt(page as string),
      per_page: parseInt(perPage as string)
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
