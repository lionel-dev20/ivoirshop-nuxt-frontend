// server/api/wordpress/category/[slug].get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug de catégorie requis'
    })
  }

  if (!config.WORDPRESS_URL) {
    console.warn('WORDPRESS_URL non défini')
    return null
  }

  try {
    console.log(`Récupération de la catégorie avec slug: ${slug}`)
    
    // Essayer d'abord l'endpoint personnalisé
    try {
      const categories = await $fetch(`${config.WORDPRESS_URL}/wp-json/custom/v1/categories`)
      
      if (categories && Array.isArray(categories)) {
        const category = categories.find((cat: any) => cat.slug === slug)
        
        if (category) {
          console.log(`Catégorie trouvée via endpoint personnalisé: ${category.name}`)
          return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            count: category.count || 0
          }
        }
      }
    } catch (customError) {
      console.log('Endpoint personnalisé non disponible, tentative avec WooCommerce...')
    }

    // Fallback vers WooCommerce
    const categories = await $fetch(`${config.WORDPRESS_URL}/wp-json/wc/v3/products/categories`, {
      params: {
        slug: slug,
        per_page: 1,
        consumer_key: config.WOOCOMMERCE_CONSUMER_KEY,
        consumer_secret: config.WOOCOMMERCE_CONSUMER_SECRET
      }
    })

    if (categories && Array.isArray(categories) && categories.length > 0) {
      const category = categories[0]
      console.log(`Catégorie trouvée via WooCommerce: ${category.name}`)
      
      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        image: category.image?.src || null,
        count: category.count || 0
      }
    }

    console.log(`Aucune catégorie trouvée pour le slug: ${slug}`)
    return null

  } catch (error: any) {
    console.error('Erreur lors de la récupération de la catégorie:', error.message)
    return null
  }
})

