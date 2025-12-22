// server/api/woocommerce/product/[slug].ts
import { defineEventHandler, getRouterParams, createError } from 'h3'
import { useRuntimeConfig } from '#imports'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const params = getRouterParams(event)
    const productSlug = params.slug
    const runtimeConfig = useRuntimeConfig()
    

    if (!runtimeConfig.WC_STORE_URL && !runtimeConfig.WORDPRESS_URL) {
      throw createError({ 
        statusCode: 500, 
        statusMessage: 'Configuration manquante' 
      })
    }

    const axiosConfig = {
      timeout: 10000,
      headers: {
        'User-Agent': 'Nuxt-WooCommerce-Client/1.0',
        'Content-Type': 'application/json'
      }
    }

    // Utilise l'endpoint personnalisé pour récupérer le produit
    const storeUrl = runtimeConfig.WC_STORE_URL || runtimeConfig.WORDPRESS_URL
    const { data } = await axios.get(
      `${storeUrl}/wp-json/custom/v1/product/${productSlug}`,
      axiosConfig
    )


    return {
      product: data.product,
      relatedProducts: data.related_products || [],
      categories: data.categories || []
    }
    
  } catch (err: any) {
    if (err.response?.status === 404) {
      throw createError({ 
        statusCode: 404, 
        statusMessage: 'Produit non trouvé' 
      })
    }
    
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Erreur: ${err.message}` 
    })
  }
})