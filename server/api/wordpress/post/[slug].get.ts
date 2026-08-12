// server/api/wordpress/post/[slug].get.ts
// Un article complet + quelques articles à lire ensuite.
import { createError, defineEventHandler, getRouterParam, setResponseHeader } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug manquant' })
  }

  if (!config.WORDPRESS_URL) {
    throw createError({ statusCode: 503, statusMessage: 'WordPress non configuré' })
  }

  setResponseHeader(
    event,
    'Cache-Control',
    'public, max-age=300, s-maxage=600, stale-while-revalidate=86400'
  )

  let raw: any
  try {
    const { posts } = await fetchWpPosts(config.WORDPRESS_URL as string, { slug, per_page: 1 })
    raw = posts[0]
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'WordPress injoignable' })
  }

  if (!raw) {
    throw createError({ statusCode: 404, statusMessage: 'Article introuvable' })
  }

  const post = normalizePostFull(raw)

  // Suite de lecture : même catégorie en priorité, sinon les plus récents.
  const relatedParams: Record<string, any> = { per_page: 3, exclude: post.id }
  if (post.category?.id) relatedParams.categories = post.category.id

  let related = await fetchWpPosts(config.WORDPRESS_URL as string, relatedParams)
    .then((r) => r.posts.map(normalizePost))
    .catch(() => [] as BlogPost[])

  if (related.length === 0 && post.category?.id) {
    related = await fetchWpPosts(config.WORDPRESS_URL as string, { per_page: 3, exclude: post.id })
      .then((r) => r.posts.map(normalizePost))
      .catch(() => [] as BlogPost[])
  }

  return { success: true, post, related }
})
