// composables/useWooCommerce.ts
const WORDPRESS_API = 'https://admin.ivoirshop.ci/wp-json/custom/v1'
const HOMEPAGE_API = 'https://admin.ivoirshop.ci/wp-json/api/v1'

export const useWooCommerce = () => {
  // Catégories
  const getCategories = async () => {
    return await $fetch(`${WORDPRESS_API}/categories`)
  }

  // Produits par catégorie
  const getProductsByCategory = async (categoryId: number) => {
    return await $fetch(`${WORDPRESS_API}/products/${categoryId}`)
  }

  // Détail d'un produit
  const getProductBySlug = async (slug: string) => {
    return await $fetch(`${WORDPRESS_API}/product/${slug}`)
  }

  // Recherche
  const searchProducts = async (query: string, filters = {}) => {
    return await $fetch(`${WORDPRESS_API}/search`, {
      params: { q: query, ...filters }
    })
  }

  // Autocomplétion
  const getAutocomplete = async (query: string, limit = 10) => {
    return await $fetch(`${WORDPRESS_API}/search/autocomplete`, {
      params: { q: query, limit }
    })
  }

  // Produits page d'accueil
  const getHomepageProducts = async (params = {}) => {
    return await $fetch(`${HOMEPAGE_API}/homepage-products`, { params })
  }

  // Produits vedette
  const getFeaturedProducts = async (type = 'featured', limit = 8) => {
    return await $fetch(`${HOMEPAGE_API}/featured-products`, {
      params: { type, limit }
    })
  }

  // Créer une commande
  const createOrder = async (orderData: any) => {
    return await $fetch(`${WORDPRESS_API}/create-order`, {
      method: 'POST',
      body: orderData
    })
  }

  // Menu principal
  const getMenu = async () => {
    return await $fetch('https://admin.ivoirshop.ci/wp-json/wp/v2/menu-principal')
  }

  return {
    getCategories,
    getProductsByCategory,
    getProductBySlug,
    searchProducts,
    getAutocomplete,
    getHomepageProducts,
    getFeaturedProducts,
    createOrder,
    getMenu
  }
}
