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

    console.log('Récupération des marques...')

    let brands: any[] = []

    // Méthode 1 : Essayer de récupérer les marques via une taxonomie personnalisée
    // (extensions comme Perfect Brands for WooCommerce, YITH WooCommerce Brands, etc.)
    try {
      const { data: productBrands } = await axios.get(
        `${WORDPRESS_URL}/wp-json/wc/v3/products/brands`,
        {
          ...axiosConfig,
          params: { per_page: 100 }
        }
      )
      brands = productBrands.map((brand: any) => ({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        count: brand.count,
        image: brand.image?.src || null
      }))
      console.log(`${brands.length} marques trouvées via taxonomie 'brands'`)
    } catch (err: any) {
      console.log('Taxonomie brands non disponible, essai avec l\'attribut brand...')
      
      // Méthode 2 : Essayer de récupérer les marques via l'attribut 'brand' ou 'marque'
      try {
        // Récupérer tous les attributs
        const { data: attributes } = await axios.get(
          `${WORDPRESS_URL}/wp-json/wc/v3/products/attributes`,
          axiosConfig
        )

        // Chercher l'attribut 'brand', 'marque' ou similaire
        const brandAttribute = attributes.find((attr: any) => 
          attr.slug === 'brand' || 
          attr.slug === 'marque' || 
          attr.slug === 'pa_brand' || 
          attr.slug === 'pa_marque' ||
          attr.name.toLowerCase() === 'brand' ||
          attr.name.toLowerCase() === 'marque'
        )

        if (brandAttribute) {
          console.log('Attribut marque trouvé:', brandAttribute.name)
          
          // Récupérer les termes de cet attribut
          const { data: terms } = await axios.get(
            `${WORDPRESS_URL}/wp-json/wc/v3/products/attributes/${brandAttribute.id}/terms`,
            {
              ...axiosConfig,
              params: { per_page: 100 }
            }
          )

          brands = terms.map((term: any) => ({
            id: term.id,
            name: term.name,
            slug: term.slug,
            count: term.count,
            image: null
          }))
          
          console.log(`${brands.length} marques trouvées via attribut`)
        } else {
          console.log('Aucun attribut marque trouvé')
        }
      } catch (attrErr) {
        console.error('Erreur lors de la récupération des marques via attribut:', attrErr)
      }
    }

    return {
      brands,
      total: brands.length
    }
    
  } catch (err: any) {
    console.error('Erreur lors de la récupération des marques:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    })
    
    // Retourner des marques vides en cas d'erreur
    return {
      brands: [],
      total: 0,
      error: err.message
    }
  }
})

