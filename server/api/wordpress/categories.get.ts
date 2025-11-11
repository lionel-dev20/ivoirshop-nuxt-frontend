// server/api/wordpress/categories.get.ts
export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  
  if (!config.WORDPRESS_URL) {
    console.warn('WORDPRESS_URL non défini, utilisation des catégories de fallback')
    return getFallbackCategories()
  }

  try {
    console.log('Récupération des catégories depuis WordPress...')
    
    // Essayer d'abord l'endpoint personnalisé
    try {
      const categories = await $fetch(`${config.WORDPRESS_URL}/wp-json/custom/v1/categories`)
      
      if (categories && Array.isArray(categories) && categories.length > 0) {
        console.log(`Récupération de ${categories.length} catégories depuis l'endpoint personnalisé`)
        
        // Transformer les catégories pour le format attendu
        const transformedCategories = categories.map(category => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description || '',
          image: null, // L'endpoint personnalisé n'inclut pas d'images
          count: category.count || 0
        }))

        return transformedCategories
      }
    } catch (customError) {
      console.log('Endpoint personnalisé non disponible:', customError.message)
    }

    // Fallback vers WooCommerce
    console.log('Tentative avec WooCommerce...')
    
    const categories = await $fetch(`${config.WORDPRESS_URL}/wp-json/wc/v3/products/categories`, {
      params: {
        per_page: 100, // Augmenté de 20 à 100
        orderby: 'count',
        order: 'desc',
        hide_empty: true,
        consumer_key: config.WOOCOMMERCE_CONSUMER_KEY,
        consumer_secret: config.WOOCOMMERCE_CONSUMER_SECRET
      }
    })

    if (categories && Array.isArray(categories) && categories.length > 0) {
      console.log(`Récupération de ${categories.length} catégories depuis WooCommerce`)
      
      // Transformer les catégories pour le format attendu
      const transformedCategories = categories.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        image: category.image?.src || null,
        count: category.count || 0
      }))

      return transformedCategories
    }

  } catch (error: any) {
    console.error('Erreur lors de la récupération des catégories:', error.message)
  }

  console.warn('Aucune catégorie trouvée, utilisation des catégories de fallback')
  return getFallbackCategories()
})

function getFallbackCategories() {
  // return [
  //   {
  //     id: 1,
  //     name: 'Nouveautés',
  //     slug: 'nouveaute',
  //     description: 'Découvrez nos derniers produits et nouveautés',
  //     count: 25
  //   },
  //   {
  //     id: 2,
  //     name: 'Électronique',
  //     slug: 'electronique',
  //     description: 'Smartphones, ordinateurs, accessoires et plus',
  //     count: 150
  //   },
  //   {
  //     id: 3,
  //     name: 'Électroménager',
  //     slug: 'electromenager',
  //     description: 'Gros et petit électroménager pour votre maison',
  //     count: 80
  //   },
  //   {
  //     id: 4,
  //     name: 'Mode & Beauté',
  //     slug: 'mode-beaute',
  //     description: 'Vêtements, cosmétiques et accessoires de mode',
  //     count: 120
  //   },
  //   {
  //     id: 5,
  //     name: 'Maison & Jardin',
  //     slug: 'maison-jardin',
  //     description: 'Décoration, mobilier et équipements de jardin',
  //     count: 95
  //   },
  //   {
  //     id: 6,
  //     name: 'Sports & Loisirs',
  //     slug: 'sports-loisirs',
  //     description: 'Équipements sportifs et articles de loisirs',
  //     count: 60
  //   }
  // ]
}
