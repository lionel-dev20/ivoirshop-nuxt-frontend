import { defineEventHandler, createError, getQuery } from 'h3'
import { useRuntimeConfig } from '#imports'
import { createWooCommerceClient } from '../utils/woocommerce'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const runtimeConfig = useRuntimeConfig()
    
    const searchTerm = query.q as string
    const page = parseInt(query.page as string) || 1
    const perPage = parseInt(query.per_page as string) || 20

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

    console.log('Recherche de produits pour:', searchTerm)

    try {
      // Recherche des produits WooCommerce
      const { data: products, headers } = await api.get('products', {
        search: searchTerm.trim(),
        per_page: perPage,
        page: page,
        status: 'publish',
        stock_status: 'instock',
        orderby: 'title',
        order: 'asc',
        meta_data: true,
        images: true,
        categories: true,
        attributes: true
      })

      // Extraire les informations de pagination
      const totalProducts = parseInt(headers['x-wp-total'] || '0')
      const totalPages = parseInt(headers['x-wp-totalpages'] || '0')

      // Formater les produits
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
        permalink: product.permalink
      }))

      console.log(`${formattedProducts.length} produits trouvés sur ${totalProducts} total`)

      return {
        products: formattedProducts,
        total: totalProducts,
        totalPages: totalPages,
        currentPage: page,
        perPage: perPage,
        searchTerm: searchTerm,
        hasMore: page < totalPages
      }

    } catch (wcError: any) {
      console.error('Erreur WooCommerce:', {
        message: wcError.message,
        status: wcError.response?.status,
        data: wcError.response?.data
      })

      // Fallback : données de test
      console.log('Utilisation de données de test pour la recherche...')
      return { 
        products: [
          {
            id: 1,
            name: `Produit de test pour "${searchTerm}"`,
            slug: `test-${searchTerm.toLowerCase().replace(/\s+/g, '-')}`,
            description: 'Description de test',
            short_description: 'Description courte de test',
            price: '29.99',
            regular_price: '29.99',
            sale_price: null,
            on_sale: false,
            stock_status: 'instock',
            images: [],
            categories: [],
            attributes: [],
            meta_data: [],
            average_rating: 0,
            date_created: new Date().toISOString()
          }
        ],
        total: 1,
        totalPages: 1,
        currentPage: 1,
        perPage: perPage,
        searchTerm: searchTerm,
        hasMore: false
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