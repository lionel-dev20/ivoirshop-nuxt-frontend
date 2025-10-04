// server/api/wordpress/category-products.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  
  const { categorySlug, limit = '12', page = '1' } = query

  console.log('=== API Category Products Debug ===')
  console.log('Query params:', query)
  console.log('Category slug:', categorySlug)
  console.log('WORDPRESS_URL:', config.WORDPRESS_URL ? 'Defined' : 'Not defined')

  if (!categorySlug) {
    console.error('Category slug is missing')
    throw createError({
      statusCode: 400,
      statusMessage: 'Category slug is required'
    })
  }

  // Si pas de config WordPress, retourner les produits de fallback
  if (!config.WORDPRESS_URL) {
    console.warn('WORDPRESS_URL non défini, utilisation des produits de fallback')
    return getFallbackProducts(categorySlug)
  }

  try {
    console.log(`Recherche des produits pour la catégorie: ${categorySlug}`)
    
    // D'abord, essayer de récupérer l'ID de la catégorie à partir du slug
    let categoryId = null
    try {
      const categories = await $fetch(`${config.WORDPRESS_URL}/wp-json/wc/v3/products/categories`, {
        params: {
          slug: categorySlug,
          consumer_key: config.WOOCOMMERCE_CONSUMER_KEY,
          consumer_secret: config.WOOCOMMERCE_CONSUMER_SECRET
        }
      })
      
      if (categories && Array.isArray(categories) && categories.length > 0) {
        categoryId = categories[0].id
        console.log(`Catégorie trouvée - ID: ${categoryId}, Nom: ${categories[0].name}`)
      }
    } catch (catError: any) {
      console.warn('Erreur lors de la récupération de la catégorie:', catError.message)
    }

    // Récupérer les produits de la catégorie
    const productsParams: any = {
      per_page: limit,
      page: page,
      status: 'publish',
      consumer_key: config.WOOCOMMERCE_CONSUMER_KEY,
      consumer_secret: config.WOOCOMMERCE_CONSUMER_SECRET
    }

    // Utiliser l'ID de catégorie si disponible, sinon essayer avec le slug
    if (categoryId) {
      productsParams.category = categoryId
    } else {
      // Essayer avec le slug directement
      productsParams.category = categorySlug
    }

    console.log('Paramètres de recherche produits:', { ...productsParams, consumer_key: '[HIDDEN]', consumer_secret: '[HIDDEN]' })

    const products = await $fetch(`${config.WORDPRESS_URL}/wp-json/wc/v3/products`, {
      params: productsParams
    })

    console.log('Réponse API produits:', products ? `${Array.isArray(products) ? products.length : 'Non-array'} produits` : 'Aucune réponse')

    if (products && Array.isArray(products)) {
      console.log(`Récupération de ${products.length} produits pour la catégorie ${categorySlug}`)
      
      // Transformer les produits pour le format attendu
      const transformedProducts = products.map(product => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.short_description || product.description || '',
        price: product.price || '0',
        regularPrice: product.regular_price || product.price || '0',
        salePrice: product.sale_price || null,
        image: product.images?.[0]?.src || '/images/placeholder-product.jpg',
        images: product.images?.map(img => img.src) || ['/images/placeholder-product.jpg'],
        stockStatus: product.stock_status || 'instock',
        onSale: product.on_sale || false,
        featured: product.featured || false,
        categories: product.categories?.map(cat => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug
        })) || []
      }))

      return {
        products: transformedProducts,
        total: products.length,
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      }
    }

  } catch (error: any) {
    console.error('Erreur lors de la récupération des produits:', error.message)
    console.error('Stack trace:', error.stack)
  }

  console.warn('Aucun produit trouvé, utilisation des produits de fallback')
  return getFallbackProducts(categorySlug)
})

function getFallbackProducts(categorySlug?: string) {
  // Produits de fallback basés sur la catégorie
  const fallbackProductsByCategory: any = {
    smartphones: [
      {
        id: 1,
        name: 'iPhone 14 Pro',
        slug: 'iphone-14-pro',
        description: 'Smartphone Apple avec puce A16 Bionic et caméra Pro 48MP',
        price: '999.99',
        regularPrice: '999.99',
        salePrice: null,
        image: '/images/placeholder-product.jpg',
        images: ['/images/placeholder-product.jpg'],
        stockStatus: 'instock',
        onSale: false,
        featured: true,
        categories: [
          { id: 1, name: 'Smartphones', slug: 'smartphones' }
        ]
      },
      {
        id: 2,
        name: 'Samsung Galaxy S23',
        slug: 'samsung-galaxy-s23',
        description: 'Smartphone Android avec écran AMOLED 120Hz',
        price: '799.99',
        regularPrice: '899.99',
        salePrice: '799.99',
        image: '/images/placeholder-product.jpg',
        images: ['/images/placeholder-product.jpg'],
        stockStatus: 'instock',
        onSale: true,
        featured: true,
        categories: [
          { id: 1, name: 'Smartphones', slug: 'smartphones' }
        ]
      },
      {
        id: 3,
        name: 'Google Pixel 7',
        slug: 'google-pixel-7',
        description: 'Smartphone Google avec caméra IA avancée',
        price: '599.99',
        regularPrice: '599.99',
        salePrice: null,
        image: '/images/placeholder-product.jpg',
        images: ['/images/placeholder-product.jpg'],
        stockStatus: 'instock',
        onSale: false,
        featured: false,
        categories: [
          { id: 1, name: 'Smartphones', slug: 'smartphones' }
        ]
      }
    ],
    electromenager: [
      {
        id: 4,
        name: 'Réfrigérateur Samsung',
        slug: 'refrigerateur-samsung',
        description: 'Réfrigérateur double porte avec technologie No Frost',
        price: '899.99',
        regularPrice: '999.99',
        salePrice: '899.99',
        image: '/images/placeholder-product.jpg',
        images: ['/images/placeholder-product.jpg'],
        stockStatus: 'instock',
        onSale: true,
        featured: true,
        categories: [
          { id: 2, name: 'Électroménager', slug: 'electromenager' }
        ]
      },
      {
        id: 5,
        name: 'Lave-linge Bosch',
        slug: 'lave-linge-bosch',
        description: 'Lave-linge 7kg avec technologie EcoSilence Drive',
        price: '599.99',
        regularPrice: '599.99',
        salePrice: null,
        image: '/images/placeholder-product.jpg',
        images: ['/images/placeholder-product.jpg'],
        stockStatus: 'instock',
        onSale: false,
        featured: false,
        categories: [
          { id: 2, name: 'Électroménager', slug: 'electromenager' }
        ]
      }
    ],
    televisions: [
      {
        id: 6,
        name: 'TV Samsung 55" 4K',
        slug: 'tv-samsung-55-4k',
        description: 'Télévision Samsung 55 pouces 4K UHD avec Smart TV',
        price: '799.99',
        regularPrice: '899.99',
        salePrice: '799.99',
        image: '/images/placeholder-product.jpg',
        images: ['/images/placeholder-product.jpg'],
        stockStatus: 'instock',
        onSale: true,
        featured: true,
        categories: [
          { id: 3, name: 'Télévisions', slug: 'televisions' }
        ]
      }
    ]
  }

  // Produits génériques par défaut
  const defaultProducts = [
    {
      id: 1,
      name: 'Smartphone Samsung Galaxy',
      slug: 'smartphone-samsung-galaxy',
      description: 'Smartphone haut de gamme avec écran AMOLED',
      price: '299.99',
      regularPrice: '349.99',
      salePrice: '299.99',
      image: '/images/placeholder-product.jpg',
      images: ['/images/placeholder-product.jpg'],
      stockStatus: 'instock',
      onSale: true,
      featured: true,
      categories: [
        { id: 1, name: 'Électronique', slug: 'electronique' }
      ]
    },
    {
      id: 2,
      name: 'Ordinateur Portable HP',
      slug: 'ordinateur-portable-hp',
      description: 'Ordinateur portable performant pour le travail',
      price: '599.99',
      regularPrice: '599.99',
      salePrice: null,
      image: '/images/placeholder-product.jpg',
      images: ['/images/placeholder-product.jpg'],
      stockStatus: 'instock',
      onSale: false,
      featured: false,
      categories: [
        { id: 1, name: 'Électronique', slug: 'electronique' }
      ]
    }
  ]

  const products = categorySlug && fallbackProductsByCategory[categorySlug] 
    ? fallbackProductsByCategory[categorySlug] 
    : defaultProducts

  console.log(`Retour de ${products.length} produits de fallback pour la catégorie: ${categorySlug || 'default'}`)

  return {
    products,
    total: products.length,
    page: 1,
    limit: 12
  }
}
