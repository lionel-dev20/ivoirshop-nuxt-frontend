import { defineEventHandler, getRouterParams, createError } from 'h3'
import axios from 'axios'
import { useRuntimeConfig } from '#imports'

// Fonction helper pour formater les labels d'attributs
function formatAttributeLabel(name: string): string {
  const labels: Record<string, string> = {
    'color': 'Couleur',
    'colour': 'Couleur',
    'size': 'Taille',
    'storage': 'Stockage',
    'capacity': 'Capacité',
    'ram': 'Mémoire RAM',
    'brand': 'Marque',
    'marque': 'Marque',
    'material': 'Matériau',
    'weight': 'Poids',
    'dimensions': 'Dimensions',
    'screen-size': 'Taille d\'écran',
    'processor': 'Processeur',
    'operating-system': 'Système d\'exploitation',
    'connectivity': 'Connectivité',
    'warranty': 'Garantie'
  }
  
  const normalizedName = name.toLowerCase().replace(/[_\s]+/g, '-')
  return labels[normalizedName] || name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ')
}

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const WORDPRESS_URL = runtimeConfig.WORDPRESS_URL || runtimeConfig.public?.WORDPRESS_URL
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
    if (!WORDPRESS_URL) {
      console.error('Variable d\'environnement WORDPRESS_URL manquante')
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
      `${WORDPRESS_URL}/wp-json/test/v1/wc-status`,
      axiosConfig
    )

    console.log('Status WooCommerce:', categories)

    // Si le test fonctionne, utilise l'endpoint des catégories
    const { data: categoriesList } = await axios.get(
      `${WORDPRESS_URL}/wp-json/custom/v1/categories`,
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

    // Récupère TOUS les produits de cette catégorie avec pagination
    console.log('Récupération des produits avec pagination...')
    
    let allProducts: any[] = []
    let currentPage = 1
    let hasMoreProducts = true
    const perPage = 100
    
    // Configuration pour l'API WooCommerce
    const wcConfig = {
      ...axiosConfig,
      auth: {
        username: runtimeConfig.WOOCOMMERCE_CONSUMER_KEY || '',
        password: runtimeConfig.WOOCOMMERCE_CONSUMER_SECRET || ''
      }
    }
    
    // Boucle pour récupérer tous les produits page par page
    while (hasMoreProducts) {
      try {
        console.log(`Récupération de la page ${currentPage}...`)
        const { data: pageProducts, headers } = await axios.get(
          `${WORDPRESS_URL}/wp-json/wc/v3/products`,
          {
            ...wcConfig,
            params: {
              category: currentCategory.id,
              per_page: perPage,
              page: currentPage,
              status: 'publish'
            }
          }
        )
        
        if (pageProducts && pageProducts.length > 0) {
          allProducts = [...allProducts, ...pageProducts]
          console.log(`Page ${currentPage}: ${pageProducts.length} produits récupérés`)
          
          // Vérifier s'il y a d'autres pages
          const totalPages = parseInt(headers['x-wp-totalpages'] || '1')
          if (currentPage >= totalPages) {
            hasMoreProducts = false
          } else {
            currentPage++
          }
        } else {
          hasMoreProducts = false
        }
      } catch (pageError: any) {
        console.error(`Erreur lors de la récupération de la page ${currentPage}:`, pageError.message)
        hasMoreProducts = false
      }
    }
    
    const products = allProducts
    console.log(`✅ TOTAL: ${products.length} produits trouvés pour la catégorie ${currentCategory.name}`)

    // Extraire les attributs uniques des produits de cette catégorie
    const attributesMap = new Map<string, Set<string>>()
    const brandsSet = new Set<string>()

    products.forEach((product: any) => {
      // Extraire les attributs WooCommerce
      if (product.attributes && Array.isArray(product.attributes)) {
        product.attributes.forEach((attr: any) => {
          if (attr.variation) { // Seulement les attributs utilisés pour les variations
            if (!attributesMap.has(attr.name)) {
              attributesMap.set(attr.name, new Set())
            }
            if (attr.options && Array.isArray(attr.options)) {
              attr.options.forEach((option: string) => {
                attributesMap.get(attr.name)?.add(option)
              })
            }
          }
        })
      }

      // Extraire les marques
      if (product.brands && Array.isArray(product.brands)) {
        product.brands.forEach((brand: any) => {
          brandsSet.add(brand.name)
        })
      }
    })

    // Convertir en format utilisable par le frontend
    const categoryAttributes = Array.from(attributesMap.entries()).map(([name, values]) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      label: formatAttributeLabel(name),
      options: Array.from(values).map(value => ({
        value,
        label: value,
        count: products.filter((p: any) => 
          p.attributes?.some((a: any) => a.name === name && a.options?.includes(value))
        ).length
      }))
    }))

    const categoryBrands = Array.from(brandsSet).map(brand => ({
      name: brand,
      slug: brand.toLowerCase().replace(/\s+/g, '-'),
      count: products.filter((p: any) => 
        p.brands?.some((b: any) => b.name === brand)
      ).length
    }))

    console.log(`${categoryAttributes.length} types d'attributs trouvés`)
    console.log(`${categoryBrands.length} marques trouvées`)

    return { 
      category: currentCategory, 
      products: products || [],
      attributes: categoryAttributes,
      brands: categoryBrands
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