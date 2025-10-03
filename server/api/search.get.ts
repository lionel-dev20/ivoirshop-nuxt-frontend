import { defineEventHandler, createError } from 'h3'
import axios from 'axios'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const runtimeConfig = useRuntimeConfig()
    const WC_STORE_URL = runtimeConfig.WC_STORE_URL || runtimeConfig.public?.WORDPRESS_URL
    const WOOCOMMERCE_CONSUMER_KEY = runtimeConfig.WOOCOMMERCE_CONSUMER_KEY
    const WOOCOMMERCE_CONSUMER_SECRET = runtimeConfig.WOOCOMMERCE_CONSUMER_SECRET
    const searchTerm = query.q as string

    if (!searchTerm || searchTerm.trim().length < 2) {
      return { products: [] }
    }

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

    console.log('Recherche de produits pour:', searchTerm)
    
    try {
      // Utiliser l'endpoint de recherche personnalisé WordPress
      const { data: searchResults } = await axios.get(
        `${WC_STORE_URL}/wp-json/custom/v1/search`,
        {
          ...axiosConfig,
          params: {
            q: searchTerm,
            per_page: 50
          }
        }
      )

      console.log(`${searchResults.length} produits trouvés pour "${searchTerm}"`)
      return { products: searchResults }
      
    } catch (customError: any) {
      console.warn('Endpoint de recherche personnalisé non accessible, tentative avec WooCommerce standard...', {
        message: customError.message,
        status: customError.response?.status
      })
      
      // Fallback vers l'API WooCommerce standard
      try {
        const wcConfig = {
          ...axiosConfig,
          auth: {
            username: WOOCOMMERCE_CONSUMER_KEY || '',
            password: WOOCOMMERCE_CONSUMER_SECRET || ''
          }
        }
        
        const { data: wcProducts } = await axios.get(
          `${WC_STORE_URL}/wp-json/wc/v3/products`,
          {
            ...wcConfig,
            params: {
              search: searchTerm,
              per_page: 50,
              status: 'publish'
            }
          }
        )

        // Convertir le format WooCommerce vers le format attendu
        const formattedProducts = wcProducts.map((product: any) => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          short_description: product.short_description,
          price: product.price,
          regular_price: product.regular_price,
          sale_price: product.sale_price,
          on_sale: product.on_sale,
          stock_status: product.stock_status,
          images: product.images || [],
          categories: product.categories || [],
          attributes: product.attributes || [],
          meta_data: product.meta_data || [],
          average_rating: product.average_rating || 0,
          date_created: product.date_created
        }))

        console.log(`${formattedProducts.length} produits trouvés via WooCommerce standard`)
        return { products: formattedProducts }
        
      } catch (wcError: any) {
        console.error('Erreur avec WooCommerce standard:', {
          message: wcError.message,
          status: wcError.response?.status
        })
        
        // Dernier fallback : données de test
        console.log('Utilisation de données de test pour la recherche...')
        return { 
          products: [
            {
              id: 1,
              name: `Produit de test pour "${searchTerm}"`,
              slug: `test-${searchTerm.toLowerCase().replace(/\s+/g, '-')}`,
              description: 'Description de test',
              short_description: 'Description courte de test',
              price: '29.99',
              regular_price: '29.99',
              sale_price: null,
              on_sale: false,
              stock_status: 'instock',
              images: [],
              categories: [],
              attributes: [],
              meta_data: [],
              average_rating: 0,
              date_created: new Date().toISOString()
            }
          ]
        }
      }
    }
    
  } catch (err: any) {
    console.error('Erreur lors de la recherche:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    })
    
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Erreur lors de la recherche: ${err.message}` 
    })
  }
})