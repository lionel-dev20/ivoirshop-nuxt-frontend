import { defineEventHandler, createError } from 'h3'
import axios from 'axios'

export default defineEventHandler(async () => {
  try {
    // Vérification de l'URL
    if (!process.env.WC_STORE_URL) {
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

    console.log('Récupération des catégories via endpoint personnalisé...')
    
    try {
      // Essayer d'abord l'endpoint personnalisé WordPress
      const { data: categoriesList } = await axios.get(
        `${process.env.WC_STORE_URL}/wp-json/custom/v1/categories`,
        axiosConfig
      )

      console.log(`${categoriesList.length} catégories trouvées via endpoint personnalisé`)
      return categoriesList
      
    } catch (customError: any) {
      console.warn('Endpoint personnalisé non accessible, tentative avec WooCommerce standard...', {
        message: customError.message,
        status: customError.response?.status
      })
      
      // Fallback vers l'API WooCommerce standard
      try {
        const wcConfig = {
          ...axiosConfig,
          auth: {
            username: process.env.WOOCOMMERCE_CONSUMER_KEY || '',
            password: process.env.WOOCOMMERCE_CONSUMER_SECRET || ''
          }
        }
        
        const { data: wcCategories } = await axios.get(
          `${process.env.WC_STORE_URL}/wp-json/wc/v3/products/categories`,
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

        console.log(`${formattedCategories.length} catégories trouvées via WooCommerce standard`)
        return formattedCategories
        
      } catch (wcError: any) {
        console.error('Erreur avec WooCommerce standard:', {
          message: wcError.message,
          status: wcError.response?.status
        })
        
        // Dernier fallback : données de test
        console.log('Utilisation de données de test...')
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
    console.error('Erreur lors de la récupération des catégories:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      url: err.config?.url
    })
    
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Erreur lors de la récupération des catégories: ${err.message}` 
    })
  }
})
