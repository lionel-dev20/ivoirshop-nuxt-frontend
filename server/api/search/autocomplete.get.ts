import { defineEventHandler, createError, getQuery } from 'h3'
import { useRuntimeConfig } from '#imports'
import { createWooCommerceClient } from '../../utils/woocommerce'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const runtimeConfig = useRuntimeConfig()
    
    const searchTerm = query.q as string
    const limit = parseInt(query.limit as string) || 10

    if (!searchTerm || searchTerm.trim().length < 2) {
      return { 
        suggestions: [] 
      }
    }

    // Configuration WooCommerce
    const api = await createWooCommerceClient({
      url: runtimeConfig.WORDPRESS_URL!,
      consumerKey: runtimeConfig.WOOCOMMERCE_CONSUMER_KEY!,
      consumerSecret: runtimeConfig.WOOCOMMERCE_CONSUMER_SECRET!,
      version: 'wc/v3',
    })

    console.log('🔍 Autocomplétion WooCommerce pour:', searchTerm, '| Limite:', limit)

    try {
      // Recherche des produits pour l'autocomplétion (optimisée)
      console.log('📡 Recherche de produits dans WooCommerce...')
      const { data: products } = await api.get('products', {
        search: searchTerm.trim(),
        per_page: Math.min(limit, 5), // Limité à 5 produits pour plus de vitesse
        status: 'publish',
        stock_status: 'instock',
        orderby: 'popularity', // Trier par popularité pour montrer les meilleurs résultats
        order: 'desc',
        // Retourner seulement les champs nécessaires pour l'autocomplétion
        _fields: 'id,name,slug,price,regular_price,sale_price,images'
      })

      console.log(`✅ ${products.length} produits trouvés`)
      
      // Recherche des catégories (optimisée)
      console.log('📡 Recherche de catégories dans WooCommerce...')
      const { data: categories } = await api.get('products/categories', {
        search: searchTerm.trim(),
        per_page: 3, // Limité à 3 catégories pour plus de vitesse
        hide_empty: true,
        orderby: 'count', // Trier par nombre de produits
        order: 'desc',
        _fields: 'id,name,slug,count' // Seulement les champs nécessaires
      })
      
      console.log(`✅ ${categories.length} catégories trouvées`)

      // Formater les suggestions
      const suggestions = []

      // Suggestions de produits
      products.forEach((product: any) => {
        suggestions.push({
          id: `product-${product.id}`,
          name: product.name,
          type: 'product',
          slug: product.slug,
          price: product.sale_price || product.regular_price || product.price,
          image: product.images && product.images.length > 0 ? product.images[0].src : null,
          categories: product.categories || []
        })
      })

      // Suggestions de catégories
      categories.forEach((category: any) => {
        suggestions.push({
          id: `category-${category.id}`,
          name: category.name,
          type: 'category',
          slug: category.slug,
          count: category.count || 0
        })
      })

      // Suggestions génériques
      const genericSuggestions = [
        {
          id: `generic-${searchTerm.toLowerCase().replace(/\s+/g, '-')}`,
          name: `Tous les produits "${searchTerm}"`,
          type: 'generic',
          search_term: searchTerm
        }
      ]

      // Ajouter des suggestions génériques si on a peu de résultats
      if (suggestions.length < limit) {
        suggestions.push(...genericSuggestions)
      }

      // Limiter le nombre de suggestions
      const limitedSuggestions = suggestions.slice(0, limit)

      console.log(`📝 ${limitedSuggestions.length} suggestions générées:`, {
        produits: limitedSuggestions.filter(s => s.type === 'product').length,
        categories: limitedSuggestions.filter(s => s.type === 'category').length,
        generiques: limitedSuggestions.filter(s => s.type === 'generic').length
      })

      return {
        suggestions: limitedSuggestions
      }

    } catch (wcError: any) {
      console.error('Erreur WooCommerce autocomplétion:', {
        message: wcError.message,
        status: wcError.response?.status
      })

      // Fallback : suggestions de base
      const fallbackSuggestions = [
        {
          id: 1,
          name: `${searchTerm} - Tous les produits`,
          type: 'generic',
          search_term: searchTerm
        },
        {
          id: 2,
          name: `Rechercher "${searchTerm}"`,
          type: 'generic',
          search_term: searchTerm
        }
      ]

      return {
        suggestions: fallbackSuggestions
      }
    }
    
  } catch (err: any) {
    console.error('Erreur lors de l\'autocomplétion:', {
      message: err.message,
      stack: err.stack
    })
    
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Erreur lors de l'autocomplétion: ${err.message}` 
    })
  }
})

