// server/api/woocommerce/product/[slug].ts
import { defineEventHandler, getRouterParams, createError } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const params = getRouterParams(event)
    const productSlug = params.slug
    
    console.log('Recherche du produit:', productSlug)

    if (!process.env.WC_STORE_URL) {
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
    const { data } = await axios.get(
      `${process.env.WC_STORE_URL}/wp-json/custom/v1/product/${productSlug}`,
      axiosConfig
    )

    console.log('Produit trouvé:', data.product?.name)

    return {
      product: data.product,
      relatedProducts: data.related_products || [],
      categories: data.categories || []
    }
    
  } catch (err: any) {
    console.error('Erreur détaillée:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      url: err.config?.url
    })
    
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