import { defineEventHandler, createError } from 'h3'
import axios from 'axios'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async () => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const WC_STORE_URL = runtimeConfig.WC_STORE_URL || runtimeConfig.public?.WORDPRESS_URL
    const WOOCOMMERCE_CONSUMER_KEY = runtimeConfig.WOOCOMMERCE_CONSUMER_KEY
    const WOOCOMMERCE_CONSUMER_SECRET = runtimeConfig.WOOCOMMERCE_CONSUMER_SECRET

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

    
    try {
      // Essayer d'abord l'endpoint personnalisé WordPress
      const { data: categoriesList } = await axios.get(
        `${WC_STORE_URL}/wp-json/custom/v1/categories`,
        axiosConfig
      )

      return categoriesList
      
    } catch (customError: any) {
      // Fallback vers l'API WooCommerce standard
      try {
        const wcConfig = {
          ...axiosConfig,
          auth: {
            username: WOOCOMMERCE_CONSUMER_KEY || '',
            password: WOOCOMMERCE_CONSUMER_SECRET || ''
          }
        }
        
        const { data: wcCategories } = await axios.get(
          `${WC_STORE_URL}/wp-json/wc/v3/products/categories`,
          wcConfig
        )

        // Convertir le format WooCommerce vers le format attendu
        const formattedCategories = wcCategories.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          count: cat.count,
          parent: cat.parent
        }))

        return formattedCategories
        
      } catch (wcError: any) {
        // Dernier fallback : données de test
        return [
          {
            id: 1,
            name: 'Clothing',
            slug: 'clothing',
            description: 'Vêtements et accessoires',
            count: 0,
            parent: 0
          },
          {
            id: 2,
            name: 'Electronics',
            slug: 'electronics',
            description: 'Appareils électroniques',
            count: 0,
            parent: 0
          }
        ]
      }
    }
    
  } catch (err: any) {
    
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Erreur lors de la récupération des catégories: ${err.message}` 
    })
  }
})
