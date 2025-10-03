// server/api/wordpress/category-products.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  
  const { categorySlug, limit = '12', page = '1' } = query

  if (!categorySlug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category slug is required'
    })
  }

  if (!config.WORDPRESS_URL) {
    console.warn('WORDPRESS_URL non défini, utilisation des produits de fallback')
    return getFallbackProducts()
  }

  try {
    console.log(`Récupération des produits pour la catégorie: ${categorySlug}`)
    
    // Récupérer les produits de la catégorie
    const products = await $fetch(`${config.WORDPRESS_URL}/wp-json/wc/v3/products`, {
      params: {
        category: categorySlug,
        per_page: limit,
        page: page,
        status: 'publish',
        consumer_key: config.WOOCOMMERCE_CONSUMER_KEY,
        consumer_secret: config.WOOCOMMERCE_CONSUMER_SECRET
      }
    })

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
  }

  console.warn('Aucun produit trouvé, utilisation des produits de fallback')
  return getFallbackProducts()
})

function getFallbackProducts() {
  return {
    products: [
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
    ],
    total: 2,
    page: 1,
    limit: 12
  }
}
