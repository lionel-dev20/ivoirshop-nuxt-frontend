import { defineEventHandler, getRouterParams, createError } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    // Récupération des slugs depuis l'URL
    const params = getRouterParams(event)
    console.log('Params reçus:', params)
    
    // Gestion du slug (peut être string ou string[])
    let slugPath: string
    if (typeof params.slug === 'string') {
      slugPath = params.slug
    } else if (Array.isArray(params.slug)) {
      slugPath = params.slug.join('/')
    } else {
      return { category: null, products: [] }
    }

    const slugParts = slugPath.split('/')
    const lastSlug = slugParts[slugParts.length - 1]

    console.log('Slug recherché:', lastSlug)

    // Vérification de l'URL
    if (!process.env.WC_STORE_URL) {
      console.error('Variable d\'environnement WC_STORE_URL manquante')
      throw createError({ 
        statusCode: 500, 
        statusMessage: 'Configuration manquante' 
      })
    }

    // Configuration axios simple
    const axiosConfig = {
      timeout: 10000,
      headers: {
        'User-Agent': 'Nuxt-WooCommerce-Client/1.0',
        'Content-Type': 'application/json'
      }
    }

    console.log('Récupération des catégories via endpoint personnalisé...')
    
    // Utilise l'endpoint personnalisé au lieu de l'API WooCommerce standard
    const { data: categories } = await axios.get(
      `${process.env.WC_STORE_URL}/wp-json/test/v1/wc-status`,
      axiosConfig
    )

    console.log('Status WooCommerce:', categories)

    // Si le test fonctionne, utilise l'endpoint des catégories
    const { data: categoriesList } = await axios.get(
      `${process.env.WC_STORE_URL}/wp-json/custom/v1/categories`,
      axiosConfig
    )

    console.log(`${categoriesList.length} catégories trouvées`)

    // Recherche la catégorie correspondant au dernier slug
    const currentCategory = categoriesList.find((c: any) => c.slug === lastSlug)
    
    if (!currentCategory) {
      console.log(`Catégorie avec slug "${lastSlug}" non trouvée`)
      console.log('Slugs disponibles:', categoriesList.map((c: any) => c.slug))
      return { category: null, products: [] }
    }

    console.log('Catégorie trouvée:', currentCategory.name, 'ID:', currentCategory.id)

    // Récupère les produits de cette catégorie via l'endpoint personnalisé
    console.log('Récupération des produits...')
    const { data: products } = await axios.get(
      `${process.env.WC_STORE_URL}/wp-json/custom/v1/products/${currentCategory.id}`,
      axiosConfig
    )

    console.log(`${products.length} produits trouvés pour la catégorie ${currentCategory.name}`)

    return { 
      category: currentCategory, 
      products: products || [] 
    }
    
  } catch (err: any) {
    console.error('Erreur détaillée:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      url: err.config?.url
    })
    
    // Gestion spécifique des erreurs
    if (err.response?.status === 404) {
      throw createError({ 
        statusCode: 404, 
        statusMessage: 'Endpoint non trouvé - Avez-vous ajouté le code dans functions.php ?' 
      })
    }
    
    if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
      throw createError({ 
        statusCode: 503, 
        statusMessage: 'Impossible de se connecter au site WordPress' 
      })
    }
    
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Erreur: ${err.message}` 
    })
  }
})