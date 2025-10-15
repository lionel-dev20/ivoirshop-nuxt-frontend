import { defineEventHandler, createError } from 'h3'
import axios from 'axios'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const WORDPRESS_URL = runtimeConfig.WORDPRESS_URL || runtimeConfig.public?.WORDPRESS_URL
    const CONSUMER_KEY = runtimeConfig.WOOCOMMERCE_CONSUMER_KEY
    const CONSUMER_SECRET = runtimeConfig.WOOCOMMERCE_CONSUMER_SECRET

    // Vérification de la configuration
    if (!WORDPRESS_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
      console.error('Configuration WooCommerce manquante')
      throw createError({ 
        statusCode: 500, 
        statusMessage: 'Configuration WooCommerce manquante' 
      })
    }

    // Configuration axios
    const axiosConfig = {
      timeout: 10000,
      headers: {
        'User-Agent': 'Nuxt-WooCommerce-Client/1.0',
        'Content-Type': 'application/json'
      },
      auth: {
        username: CONSUMER_KEY,
        password: CONSUMER_SECRET
      }
    }

    console.log('Récupération des attributs de produits...')

    // Récupérer tous les attributs de produits
    const { data: attributes } = await axios.get(
      `${WORDPRESS_URL}/wp-json/wc/v3/products/attributes`,
      axiosConfig
    )

    console.log(`${attributes.length} attributs trouvés`)

    // Pour chaque attribut, récupérer les termes (valeurs possibles)
    const attributesWithTerms = await Promise.all(
      attributes.map(async (attr: any) => {
        try {
          const { data: terms } = await axios.get(
            `${WORDPRESS_URL}/wp-json/wc/v3/products/attributes/${attr.id}/terms`,
            {
              ...axiosConfig,
              params: { per_page: 100 } // Récupérer jusqu'à 100 termes par attribut
            }
          )

          return {
            id: attr.id,
            name: attr.name,
            slug: attr.slug,
            type: attr.type,
            order_by: attr.order_by,
            has_archives: attr.has_archives,
            terms: terms.map((term: any) => ({
              id: term.id,
              name: term.name,
              slug: term.slug,
              count: term.count
            }))
          }
        } catch (err) {
          console.error(`Erreur lors de la récupération des termes pour l'attribut ${attr.slug}:`, err)
          return {
            id: attr.id,
            name: attr.name,
            slug: attr.slug,
            type: attr.type,
            order_by: attr.order_by,
            has_archives: attr.has_archives,
            terms: []
          }
        }
      })
    )

    console.log('Attributs avec termes récupérés:', attributesWithTerms.length)

    return {
      attributes: attributesWithTerms,
      total: attributesWithTerms.length
    }
    
  } catch (err: any) {
    console.error('Erreur lors de la récupération des attributs:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    })
    
    // Retourner des attributs vides en cas d'erreur
    return {
      attributes: [],
      total: 0,
      error: err.message
    }
  }
})

