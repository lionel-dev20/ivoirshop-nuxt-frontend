// server/api/wordpress/posts.get.ts
// Liste paginée d'articles. Utilisée par le bouton "Charger plus" de /blog et
// par la navigation par catégorie.
//
// Paramètres : page, perPage, category (slug ou id), search, exclude
import { defineEventHandler, getQuery, setResponseHeader } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  setResponseHeader(
    event,
    'Cache-Control',
    'public, max-age=300, s-maxage=600, stale-while-revalidate=86400'
  )

  const page = Math.max(Number(query.page) || 1, 1)
  const perPage = Math.min(Math.max(Number(query.perPage) || 9, 1), 30)

  if (!config.WORDPRESS_URL) {
    return { success: false, posts: [] as BlogPost[], total: 0, totalPages: 0, page, perPage }
  }

  const params: Record<string, any> = { page, per_page: perPage }

  if (query.search) params.search = String(query.search)
  if (query.exclude) params.exclude = String(query.exclude)

  // La catégorie peut arriver sous forme d'identifiant ou de slug.
  if (query.category) {
    const raw = String(query.category)
    if (/^\d+$/.test(raw)) {
      params.categories = Number(raw)
    } else {
      try {
        const terms = await $fetch<any[]>(`${config.WORDPRESS_URL}/wp-json/wp/v2/categories`, {
          params: { slug: raw, per_page: 1 },
          headers: { 'User-Agent': 'IvoirShop-Nuxt/1.0' },
          timeout: 8000,
        })
        if (Array.isArray(terms) && terms[0]?.id) {
          params.categories = terms[0].id
        } else {
          // Slug inconnu : aucun résultat plutôt que tous les articles.
          return { success: true, posts: [], total: 0, totalPages: 0, page, perPage }
        }
      } catch {
        return { success: false, posts: [], total: 0, totalPages: 0, page, perPage }
      }
    }
  }

  try {
    const { posts, total, totalPages } = await fetchWpPosts(config.WORDPRESS_URL as string, params)
    return { success: true, posts: posts.map(normalizePost), total, totalPages, page, perPage }
  } catch {
    return { success: false, posts: [] as BlogPost[], total: 0, totalPages: 0, page, perPage }
  }
})
