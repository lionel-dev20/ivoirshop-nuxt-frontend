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
    return null
  }

  try {
    
    // Vérifier si le slug est un ID numérique
    const isNumericId = !isNaN(Number(slug)) && slug.trim() !== ''
    const categoryId = isNumericId ? Number(slug) : null
    
    // Essayer d'abord l'endpoint personnalisé
    try {
      const categories = await $fetch(`${config.WORDPRESS_URL}/wp-json/custom/v1/categories`)
      
      if (categories && Array.isArray(categories)) {
        // Si c'est un ID numérique, chercher par ID, sinon par slug
        const category = categoryId 
          ? categories.find((cat: any) => cat.id === categoryId)
          : categories.find((cat: any) => cat.slug === slug)
        
        if (category) {
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
    }

    // Fallback vers WooCommerce
    let categories
    if (categoryId) {
      // Si c'est un ID numérique, récupérer directement par ID
      try {
        const category = await $fetch(`${config.WORDPRESS_URL}/wp-json/wc/v3/products/categories/${categoryId}`, {
          params: {
            consumer_key: config.WOOCOMMERCE_CONSUMER_KEY,
            consumer_secret: config.WOOCOMMERCE_CONSUMER_SECRET
          }
        })
        
        if (category) {
          return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            image: category.image?.src || null,
            count: category.count || 0
          }
        }
      } catch (idError) {
      }
    }
    
    // Essayer par slug si ce n'est pas un ID ou si la recherche par ID a échoué
    categories = await $fetch(`${config.WORDPRESS_URL}/wp-json/wc/v3/products/categories`, {
      params: {
        slug: slug,
        per_page: 1,
        consumer_key: config.WOOCOMMERCE_CONSUMER_KEY,
        consumer_secret: config.WOOCOMMERCE_CONSUMER_SECRET
      }
    })

    if (categories && Array.isArray(categories) && categories.length > 0) {
      const category = categories[0]
      
      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        image: category.image?.src || null,
        count: category.count || 0
      }
    }

    return null

  } catch (error: any) {
    return null
  }
})

