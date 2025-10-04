// server/api/debug/category-products-test.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const { categorySlug = 'smartphones' } = query

  console.log('=== Category Products Test ===')
  console.log('Category slug:', categorySlug)

  if (!config.WORDPRESS_URL) {
    return {
      error: 'WORDPRESS_URL not configured',
      products: [],
      categoryInfo: null
    }
  }

  try {
    // Étape 1: Trouver la catégorie par slug
    console.log(`Recherche de la catégorie avec le slug: ${categorySlug}`)
    const categories = await $fetch(`${config.WORDPRESS_URL}/wp-json/wc/v3/products/categories`, {
      params: {
        consumer_key: config.WOOCOMMERCE_CONSUMER_KEY,
        consumer_secret: config.WOOCOMMERCE_CONSUMER_SECRET
      }
    })

    console.log(`Total des catégories disponibles: ${categories?.length || 0}`)
    
    // Afficher toutes les catégories disponibles pour debug
    if (categories && Array.isArray(categories)) {
      console.log('Catégories disponibles:')
      categories.forEach((cat: any, index: number) => {
        console.log(`${index + 1}. ID: ${cat.id}, Nom: "${cat.name}", Slug: "${cat.slug}"`)
      })
    }

    // Chercher la catégorie correspondante
    const targetCategory = categories?.find((cat: any) => 
      cat.slug === categorySlug || 
      cat.name.toLowerCase().includes(categorySlug.toLowerCase())
    )

    console.log('Catégorie trouvée:', targetCategory ? {
      id: targetCategory.id,
      name: targetCategory.name,
      slug: targetCategory.slug
    } : 'Aucune')

    if (!targetCategory) {
      return {
        error: `Catégorie "${categorySlug}" non trouvée`,
        availableCategories: categories?.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug
        })) || [],
        products: []
      }
    }

    // Étape 2: Récupérer les produits de cette catégorie
    console.log(`Récupération des produits pour la catégorie ID: ${targetCategory.id}`)
    const products = await $fetch(`${config.WORDPRESS_URL}/wp-json/wc/v3/products`, {
      params: {
        category: targetCategory.id,
        per_page: 10,
        status: 'publish',
        consumer_key: config.WOOCOMMERCE_CONSUMER_KEY,
        consumer_secret: config.WOOCOMMERCE_CONSUMER_SECRET
      }
    })

    console.log(`Produits trouvés pour "${targetCategory.name}": ${products?.length || 0}`)

    // Transformer les produits
    const transformedProducts = products?.map((product: any) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.short_description || product.description || '',
      price: product.price || '0',
      regularPrice: product.regular_price || product.price || '0',
      salePrice: product.sale_price || null,
      image: product.images?.[0]?.src || '/images/placeholder-product.jpg',
      images: product.images?.map((img: any) => img.src) || ['/images/placeholder-product.jpg'],
      stockStatus: product.stock_status || 'instock',
      onSale: product.on_sale || false,
      featured: product.featured || false,
      categories: product.categories?.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug
      })) || []
    })) || []

    return {
      success: true,
      categoryInfo: {
        id: targetCategory.id,
        name: targetCategory.name,
        slug: targetCategory.slug
      },
      products: transformedProducts,
      total: transformedProducts.length,
      rawProducts: products?.length || 0
    }

  } catch (error: any) {
    console.error('Erreur lors du test des produits par catégorie:', error.message)
    return {
      success: false,
      error: error.message,
      products: []
    }
  }
})

