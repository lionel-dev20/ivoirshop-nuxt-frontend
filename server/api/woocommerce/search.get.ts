import { defineEventHandler, getQuery, createError } from 'h3'
import { useRuntimeConfig } from '#imports'
import { createWooCommerceClient } from '../../utils/woocommerce'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const runtimeConfig = useRuntimeConfig()
    
    const searchTerm = query.q as string
    const page = parseInt(query.page as string) || 1
    const perPage = parseInt(query.per_page as string) || 100 // Augmenté de 20 à 100
    const category = query.category as string
    const minPrice = query.min_price as string
    const maxPrice = query.max_price as string
    const orderBy = query.orderby as string || 'relevance'
    const order = query.order as string || 'desc'

    if (!searchTerm || searchTerm.trim().length < 2) {
      return { 
        products: [], 
        total: 0, 
        totalPages: 0, 
        currentPage: page,
        searchTerm: searchTerm || ''
      }
    }

    // Configuration WooCommerce
    const api = await createWooCommerceClient({
      url: runtimeConfig.WORDPRESS_URL!,
      consumerKey: runtimeConfig.WOOCOMMERCE_CONSUMER_KEY!,
      consumerSecret: runtimeConfig.WOOCOMMERCE_CONSUMER_SECRET!,
      version: 'wc/v3',
    })

    // Paramètres de recherche WooCommerce
    const searchParams: any = {
      search: searchTerm.trim(),
      per_page: perPage,
      page: page,
      status: 'publish',
      stock_status: 'instock',
      orderby: orderBy,
      order: order,
      // Inclure les métadonnées pour les attributs
      meta_data: true,
      // Inclure les images
      images: true,
      // Inclure les catégories
      categories: true,
      // Inclure les attributs
      attributes: true
    }

    // Filtres optionnels
    if (category) {
      searchParams.category = category
    }

    if (minPrice) {
      searchParams.min_price = minPrice
    }

    if (maxPrice) {
      searchParams.max_price = maxPrice
    }

    console.log('Recherche WooCommerce de TOUS les produits:', { searchTerm, searchParams })

    try {
      // Récupérer TOUS les produits correspondant à la recherche avec pagination automatique
      let allProducts: any[] = []
      let currentPage = 1
      let hasMoreProducts = true
      const productsPerPage = 100
      let totalProducts = 0
      let totalPages = 0

      while (hasMoreProducts) {
        console.log(`Recherche WooCommerce - page ${currentPage}...`)
        const pageParams = { ...searchParams, per_page: productsPerPage, page: currentPage }
        const { data: pageProducts, headers } = await api.get('products', pageParams)

        if (pageProducts && pageProducts.length > 0) {
          allProducts = [...allProducts, ...pageProducts]
          totalProducts = parseInt(headers['x-wp-total'] || '0')
          totalPages = parseInt(headers['x-wp-totalpages'] || '0')
          
          console.log(`✅ Page ${currentPage}/${totalPages}: ${pageProducts.length} produits (${allProducts.length}/${totalProducts} total)`)
          
          if (currentPage >= totalPages) {
            hasMoreProducts = false
          } else {
            currentPage++
          }
        } else {
          hasMoreProducts = false
        }
      }

      const products = allProducts
      console.log(`✅ RECHERCHE WC TERMINÉE: ${products.length} produits trouvés pour "${searchTerm}"`)

      // Fonction pour déterminer le shipping_class d'un produit
      const determineShippingClass = (product: any): string => {
        let shippingClass = product.shipping_class || ''
        
        if (shippingClass) {
          const normalized = shippingClass.toLowerCase()
          if (normalized === 'light' || normalized === 'leger' || normalized === 'léger') return 'light'
          if (normalized === 'medium' || normalized === 'moyen') return 'medium'
          if (normalized === 'heavy' || normalized === 'lourd') return 'heavy'
        }
        
        if (product.weight && parseFloat(product.weight) > 0) {
          const weight = parseFloat(product.weight)
          if (weight < 2) return 'light'
          if (weight >= 2 && weight <= 10) return 'medium'
          return 'heavy'
        }
        
        return 'medium'
      }

      // Formater les produits pour l'affichage
      const formattedProducts = products.map((product: any) => ({
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
        stock_quantity: product.stock_quantity,
        manage_stock: product.manage_stock,
        weight: product.weight,
        shipping_class: determineShippingClass(product),
        images: product.images || [],
        categories: product.categories || [],
        tags: product.tags || [],
        attributes: product.attributes || [],
        meta_data: product.meta_data || [],
        average_rating: product.average_rating || 0,
        rating_count: product.rating_count || 0,
        total_sales: product.total_sales || 0,
        date_created: product.date_created,
        date_modified: product.date_modified,
        permalink: product.permalink,
        // Informations de recherche
        search_relevance: calculateRelevance(product, searchTerm)
      }))

      // Trier par pertinence si demandé
      if (orderBy === 'relevance') {
        formattedProducts.sort((a: any, b: any) => b.search_relevance - a.search_relevance)
      }

      return {
        products: formattedProducts,
        total: formattedProducts.length,
        totalPages: 1,
        currentPage: 1,
        perPage: formattedProducts.length,
        searchTerm: searchTerm,
        hasMore: false
      }

    } catch (wcError: any) {
      console.error('Erreur WooCommerce:', {
        message: wcError.message,
        status: wcError.response?.status,
        data: wcError.response?.data
      })

      // Fallback : recherche basique
      return {
        products: [],
        total: 0,
        totalPages: 0,
        currentPage: page,
        perPage: perPage,
        searchTerm: searchTerm,
        hasMore: false,
        error: 'Erreur lors de la recherche des produits'
      }
    }

  } catch (err: any) {
    console.error('Erreur lors de la recherche:', {
      message: err.message,
      stack: err.stack
    })
    
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Erreur lors de la recherche: ${err.message}` 
    })
  }
})

// Fonction pour calculer la pertinence de recherche
function calculateRelevance(product: any, searchTerm: string): number {
  const term = searchTerm.toLowerCase()
  let relevance = 0

  // Nom du produit (poids le plus élevé)
  if (product.name.toLowerCase().includes(term)) {
    relevance += 10
  }

  // Nom commence par le terme de recherche
  if (product.name.toLowerCase().startsWith(term)) {
    relevance += 15
  }

  // Description courte
  if (product.short_description && product.short_description.toLowerCase().includes(term)) {
    relevance += 5
  }

  // Description complète
  if (product.description && product.description.toLowerCase().includes(term)) {
    relevance += 3
  }

  // Catégories
  if (product.categories && product.categories.length > 0) {
    product.categories.forEach((cat: any) => {
      if (cat.name.toLowerCase().includes(term)) {
        relevance += 7
      }
    })
  }

  // Tags
  if (product.tags && product.tags.length > 0) {
    product.tags.forEach((tag: any) => {
      if (tag.name.toLowerCase().includes(term)) {
        relevance += 5
      }
    })
  }

  // Attributs
  if (product.attributes && product.attributes.length > 0) {
    product.attributes.forEach((attr: any) => {
      if (attr.options && attr.options.length > 0) {
        attr.options.forEach((option: string) => {
          if (option.toLowerCase().includes(term)) {
            relevance += 3
          }
        })
      }
    })
  }

  // Métadonnées
  if (product.meta_data && product.meta_data.length > 0) {
    product.meta_data.forEach((meta: any) => {
      if (meta.value && typeof meta.value === 'string' && meta.value.toLowerCase().includes(term)) {
        relevance += 2
      }
    })
  }

  // Bonus pour les produits en stock
  if (product.stock_status === 'instock') {
    relevance += 1
  }

  // Bonus pour les produits en promotion
  if (product.on_sale) {
    relevance += 1
  }

  // Bonus pour les produits bien notés
  if (product.average_rating >= 4) {
    relevance += 1
  }

  return relevance
}
