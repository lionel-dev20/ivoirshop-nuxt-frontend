// server/api/wordpress/blog.get.ts
// Agrège en un seul appel tout ce dont la page /blog a besoin :
//   - featured : les articles épinglés ("Mis en avant" dans WordPress)
//   - latest   : les derniers articles publiés
//   - popular  : les articles les plus commentés
//
// Les trois requêtes partent en parallèle. Si WordPress est injoignable, on
// renvoie des listes vides : la page affiche son état "bientôt disponible"
// plutôt qu'une erreur.
import { defineEventHandler, getQuery, setResponseHeader } from 'h3'
import { useRuntimeConfig } from '#imports'

const FEATURED_COUNT = 6
const POPULAR_COUNT = 5
const DEFAULT_LATEST = 6

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const latestCount = Math.min(Math.max(Number(query.latest) || DEFAULT_LATEST, 1), 24)

  setResponseHeader(
    event,
    'Cache-Control',
    'public, max-age=300, s-maxage=600, stale-while-revalidate=86400'
  )

  const empty = {
    success: false,
    featured: [] as BlogPost[],
    latest: [] as BlogPost[],
    popular: [] as BlogPost[],
    total: 0,
    totalPages: 0,
  }

  if (!config.WORDPRESS_URL) return empty

  const wp = config.WORDPRESS_URL as string

  // Articles épinglés.
  const featuredPromise = fetchWpPosts(wp, { sticky: true, per_page: FEATURED_COUNT })
    .then((r) => r.posts.map(normalizePost))
    .catch(() => [] as BlogPost[])

  // Les plus commentés. `orderby=comment_count` n'est pas autorisé par défaut
  // dans l'API REST de WordPress : le plugin IvoirShop l'active. Si le plugin
  // n'est pas à jour, WordPress renvoie une erreur 400 et on retombe sur un tri
  // local parmi les 30 articles les plus récents.
  const popularPromise = fetchWpPosts(wp, {
    orderby: 'comment_count',
    order: 'desc',
    per_page: POPULAR_COUNT,
  })
    .then((r) => r.posts.map(normalizePost))
    .catch(() =>
      // Repli volontairement léger : une requête large (30 articles + _embed)
      // dépasse le délai en rendu serveur et vide la colonne.
      fetchWpPosts(wp, { per_page: 10 })
        .then((r) =>
          r.posts
            .map(normalizePost)
            .sort((a, b) => b.commentCount - a.commentCount)
            .slice(0, POPULAR_COUNT)
        )
        .catch(() => [] as BlogPost[])
    )

  const [featured, popular] = await Promise.all([featuredPromise, popularPromise])

  // Les articles à la une sont exclus de la liste chronologique pour éviter
  // qu'ils apparaissent deux fois sur la même page.
  const latestResult = await fetchWpPosts(wp, {
    per_page: latestCount,
    page: 1,
    ...(featured.length ? { exclude: featured.map((p) => p.id).join(',') } : {}),
  }).catch(() => ({ posts: [], total: 0, totalPages: 0 }))

  const latest = latestResult.posts.map(normalizePost)

  return {
    success: featured.length > 0 || latest.length > 0 || popular.length > 0,
    featured,
    latest,
    popular,
    total: latestResult.total,
    totalPages: latestResult.totalPages,
  }
})
