// server/api/woocommerce/brand/[slug].get.ts
// Produits d'une marque : /marque/[slug] côté frontend.
//
// WooCommerce ne sait pas filtrer les produits par slug de marque
// (`?brand=binatone` renvoie une liste vide) : il faut d'abord résoudre le
// slug en identifiant de terme, puis filtrer avec `?brand=<id>`.
import { defineEventHandler, getRouterParam, createError, setResponseHeader } from 'h3'
import axios from 'axios'
import { useRuntimeConfig } from '#imports'
import { determineShippingClass, buildProductFacets } from '../../../utils/catalog'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const WORDPRESS_URL = runtimeConfig.WORDPRESS_URL || runtimeConfig.public?.WORDPRESS_URL
  const CONSUMER_KEY = runtimeConfig.WOOCOMMERCE_CONSUMER_KEY
  const CONSUMER_SECRET = runtimeConfig.WOOCOMMERCE_CONSUMER_SECRET

  const slug = String(getRouterParam(event, 'slug') || '').toLowerCase()

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Marque manquante' })
  }

  if (!WORDPRESS_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
    throw createError({ statusCode: 500, statusMessage: 'Configuration WooCommerce manquante' })
  }

  // Champs strictement nécessaires à ProductCard, aux filtres et au calcul de
  // la classe de livraison. Sans cette restriction, WooCommerce renvoie tout le
  // contenu des produits : 690 Ko et 14 s pour 100 produits, contre 270 Ko et
  // 2,3 s ici. La différence est ce qui rend la page utilisable.
  const PRODUCT_FIELDS = [
    'id', 'name', 'slug', 'type', 'sku',
    'price', 'regular_price', 'sale_price', 'on_sale', 'price_html',
    'images', 'stock_status', 'average_rating', 'rating_count',
    'categories', 'attributes', 'variations', 'date_created',
    'weight', 'shipping_class', 'meta_data',
  ].join(',')

  const axiosConfig = {
    timeout: 20000,
    headers: {
      'User-Agent': 'Nuxt-WooCommerce-Client/1.0',
      'Content-Type': 'application/json',
    },
    auth: { username: CONSUMER_KEY, password: CONSUMER_SECRET },
  }

  /**
   * WooCommerce répond ici de façon irrégulière : la même requête peut prendre
   * 2 s ou dépasser 20 s. Sans nouvelle tentative, un pic passager se traduit
   * par une page de marque vide affichée en HTTP 200, ce qui est pire qu'une
   * erreur franche. On réessaie donc avant d'abandonner.
   */
  const getWithRetry = async (url: string, params: Record<string, any>, attempts = 3) => {
    let lastError: any
    for (let i = 0; i < attempts; i++) {
      try {
        return await axios.get(url, { ...axiosConfig, params })
      } catch (err) {
        lastError = err
        if (i < attempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500 * (i + 1)))
        }
      }
    }
    throw lastError
  }

  // 1. Résolution du slug en terme de marque.
  let brand: { id: number; name: string; slug: string; count: number; image: string | null; description: string } | null = null

  try {
    const { data: brands } = await getWithRetry(`${WORDPRESS_URL}/wp-json/wc/v3/products/brands`, {
      per_page: 100,
    })

    const match = (brands || []).find((b: any) => String(b.slug).toLowerCase() === slug)
    if (match) {
      brand = {
        id: match.id,
        name: match.name,
        slug: match.slug,
        count: match.count || 0,
        image: match.image?.src || null,
        description: match.description || '',
      }
    }
  } catch {
    throw createError({ statusCode: 503, statusMessage: 'Impossible de récupérer les marques' })
  }

  if (!brand) {
    throw createError({ statusCode: 404, statusMessage: 'Marque introuvable' })
  }

  // 2. Tous les produits de la marque, page par page.
  const allProducts: any[] = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    try {
      const { data: pageProducts, headers } = await getWithRetry(
        `${WORDPRESS_URL}/wp-json/wc/v3/products`,
        {
          brand: brand.id,
          per_page: 100,
          page,
          status: 'publish',
          _fields: PRODUCT_FIELDS,
        }
      )

      if (Array.isArray(pageProducts) && pageProducts.length > 0) {
        allProducts.push(...pageProducts)
        const totalPages = parseInt(headers['x-wp-totalpages'] || '1')
        hasMore = Number.isFinite(totalPages) && page < totalPages
        page += 1
      } else {
        hasMore = false
      }
    } catch (err) {
      // Échec de la toute première page : la marque a des produits mais on n'a
      // rien à afficher. Mieux vaut une erreur explicite qu'une page « vide »
      // servie en HTTP 200, que les moteurs indexeraient comme telle.
      if (page === 1 && brand.count > 0) {
        throw createError({
          statusCode: 503,
          statusMessage: 'Les produits de cette marque sont momentanément indisponibles',
        })
      }
      // Pages suivantes : on sert ce qui a été récupéré plutôt que rien.
      hasMore = false
    }
  }

  const products = allProducts.map((product: any) => ({
    ...product,
    shipping_class: determineShippingClass(product),
  }))

  const { attributes, categories } = buildProductFacets(products)

  setResponseHeader(event, 'Cache-Control', 'public, max-age=120, s-maxage=600, stale-while-revalidate=86400')

  return { brand, products, attributes, categories }
})
