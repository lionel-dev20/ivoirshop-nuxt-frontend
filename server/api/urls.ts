import type { SitemapUrlInput } from '@nuxtjs/sitemap'
import axios from 'axios'
import { useRuntimeConfig } from '#imports'

export default defineSitemapEventHandler(async (): Promise<SitemapUrlInput[]> => {
  const runtimeConfig = useRuntimeConfig()
  const generatedAt = new Date().toISOString()

  // 1. Routes statiques principales
  const urls: SitemapUrlInput[] = [
    { loc: '/', lastmod: generatedAt },
    // { loc: '/home', lastmod: generatedAt },
    { loc: '/recherche', lastmod: generatedAt },
    // { loc: '/diagnostic', lastmod: generatedAt },
    // { loc: '/mes-commandes', lastmod: generatedAt },
    // { loc: '/checkout', lastmod: generatedAt },
    // { loc: '/thank-you', lastmod: generatedAt },
    { loc: '/payment/process-success', lastmod: generatedAt },
    // Auth
    { loc: '/auth/login', lastmod: generatedAt },
    { loc: '/auth/signup', lastmod: generatedAt },
    { loc: '/auth/profil', lastmod: generatedAt },
  ]

  // 2. Catégories (URL type /categorie/[slug])
  try {
    // On réutilise la logique existante de l'API interne pour récupérer les catégories
    const categories: Array<{
      slug: string
      date_modified?: string
      date_modified_gmt?: string
      modified_at?: string
    }> = await $fetch('/api/api/v1/categories')

    for (const category of categories) {
      if (category.slug) {
        const lastModified =
          category.date_modified_gmt ||
          category.date_modified ||
          category.modified_at ||
          generatedAt

        urls.push({
          loc: `/categorie/${category.slug}`,
          ...(lastModified && { lastmod: new Date(lastModified).toISOString() }),
        })
      }
    }
  } catch {
    // En cas d'erreur, on n'empêche pas la génération du sitemap global
  }

  // 3. Produits (URL type /produit/[slug])
  try {
    const WORDPRESS_URL = runtimeConfig.WORDPRESS_URL || runtimeConfig.public?.WORDPRESS_URL
    const WOOCOMMERCE_CONSUMER_KEY = runtimeConfig.WOOCOMMERCE_CONSUMER_KEY
    const WOOCOMMERCE_CONSUMER_SECRET = runtimeConfig.WOOCOMMERCE_CONSUMER_SECRET

    if (WORDPRESS_URL && WOOCOMMERCE_CONSUMER_KEY && WOOCOMMERCE_CONSUMER_SECRET) {
      const axiosConfig = {
        timeout: 10000,
        headers: {
          'User-Agent': 'Nuxt-WooCommerce-Client/1.0',
          'Content-Type': 'application/json',
        },
        auth: {
          username: WOOCOMMERCE_CONSUMER_KEY,
          password: WOOCOMMERCE_CONSUMER_SECRET,
        },
      }

      const perPage = 100
      let page = 1
      let hasMore = true

      while (hasMore) {
        const { data: products, headers } = await axios.get(
          `${WORDPRESS_URL}/wp-json/wc/v3/products`,
          {
            ...axiosConfig,
            params: {
              status: 'publish',
              per_page: perPage,
              page,
            },
          },
        )

        if (Array.isArray(products) && products.length > 0) {
          for (const product of products as Array<{
            slug?: string
            date_modified?: string
            date_modified_gmt?: string
            modified?: string
          }>) {
            if (product.slug) {
              const lastModified =
                product.date_modified_gmt ||
                product.date_modified ||
                product.modified ||
                generatedAt

              urls.push({
                loc: `/produit/${product.slug}`,
                ...(lastModified && { lastmod: new Date(lastModified).toISOString() }),
              })
            }
          }

          const totalPages = parseInt((headers as any)['x-wp-totalpages'] || '1')
          if (!Number.isFinite(totalPages) || page >= totalPages) {
            hasMore = false
          } else {
            page += 1
          }
        } else {
          hasMore = false
        }
      }
    }
  } catch {
    // En cas d'erreur réseau/WooCommerce, on garde quand même les autres URLs
  }

  return urls
})