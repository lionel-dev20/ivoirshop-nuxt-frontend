// server/utils/blog.ts
// Normalisation des articles WordPress (wp/v2/posts) vers un format simple et
// stable pour le frontend. On ne renvoie JAMAIS le HTML complet de l'article
// dans les listes : seul le temps de lecture en est déduit côté serveur, ce qui
// garde la réponse légère.

export interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string
  date: string
  image: string | null
  imageAlt: string
  author: string
  category: { id: number; name: string; slug: string } | null
  readingTime: number
  commentCount: number
  sticky: boolean
}

export interface BlogPostFull extends BlogPost {
  content: string
  modified: string
  categories: Array<{ id: number; name: string; slug: string }>
}

/** Entités HTML courantes renvoyées par WordPress (apostrophes typographiques…). */
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  laquo: '«',
  raquo: '»',
  rsquo: '’',
  lsquo: '‘',
  ldquo: '“',
  rdquo: '”',
  ndash: '–',
  mdash: '—',
  eacute: 'é',
  egrave: 'è',
  agrave: 'à',
  ccedil: 'ç',
  ecirc: 'ê',
  ocirc: 'ô',
  ugrave: 'ù',
}

export function decodeEntities(input: string): string {
  return input
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => NAMED_ENTITIES[name.toLowerCase()] ?? match)
}

/** Retire les balises HTML et normalise les espaces. */
export function stripHtml(html: string): string {
  return decodeEntities(
    String(html || '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim()
}

/** Tronque proprement sur une frontière de mot. */
export function truncate(text: string, max = 150): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}

/** Temps de lecture en minutes (base 200 mots/min, minimum 1). */
export function readingTime(html: string): number {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

/**
 * Convertit un article WordPress brut (avec _embed) vers notre format.
 * Tolérant : toute donnée absente devient une valeur neutre plutôt qu'une erreur.
 */
export function normalizePost(raw: any): BlogPost {
  const embedded = raw?._embedded || {}

  const media = embedded['wp:featuredmedia']?.[0]
  const sizes = media?.media_details?.sizes || {}
  const image =
    sizes.medium_large?.source_url ||
    sizes.large?.source_url ||
    sizes.medium?.source_url ||
    media?.source_url ||
    null

  // wp:term = [ catégories, étiquettes ]. On prend la 1re catégorie hors
  // "Non classé", qui n'apporte rien à l'affichage.
  const terms: any[] = embedded['wp:term']?.[0] || []
  const category =
    terms.find((t) => t?.slug && t.slug !== 'uncategorized' && t.slug !== 'non-classe') || terms[0] || null

  const contentHtml = raw?.content?.rendered || raw?.excerpt?.rendered || ''

  return {
    id: Number(raw?.id) || 0,
    slug: String(raw?.slug || ''),
    title: decodeEntities(String(raw?.title?.rendered || 'Sans titre')),
    excerpt: truncate(stripHtml(raw?.excerpt?.rendered || raw?.content?.rendered || '')),
    date: String(raw?.date_gmt ? `${raw.date_gmt}Z` : raw?.date || ''),
    image,
    imageAlt: decodeEntities(String(media?.alt_text || raw?.title?.rendered || '')),
    author: decodeEntities(String(embedded.author?.[0]?.name || 'IvoirShop')),
    category: category
      ? { id: Number(category.id) || 0, name: decodeEntities(String(category.name || '')), slug: String(category.slug || '') }
      : null,
    readingTime: readingTime(contentHtml),
    commentCount: Number(raw?.comment_count ?? 0) || 0,
    sticky: Boolean(raw?.sticky),
  }
}

/** Variante complète pour la page d'un article : conserve le HTML du contenu. */
export function normalizePostFull(raw: any): BlogPostFull {
  const base = normalizePost(raw)
  const terms: any[] = raw?._embedded?.['wp:term']?.[0] || []

  return {
    ...base,
    content: String(raw?.content?.rendered || ''),
    modified: String(raw?.modified_gmt ? `${raw.modified_gmt}Z` : raw?.modified || ''),
    categories: terms.map((t) => ({
      id: Number(t?.id) || 0,
      name: decodeEntities(String(t?.name || '')),
      slug: String(t?.slug || ''),
    })),
  }
}

/**
 * Appel à l'API WordPress avec un User-Agent explicite : le site est derrière
 * Cloudflare, qui rejette les requêtes sans User-Agent.
 */
export async function fetchWpPosts(
  wordpressUrl: string,
  params: Record<string, any>
): Promise<{ posts: any[]; total: number; totalPages: number }> {
  const response = await $fetch.raw<any[]>(`${wordpressUrl}/wp-json/wp/v2/posts`, {
    params: { _embed: 1, ...params },
    headers: { 'User-Agent': 'IvoirShop-Nuxt/1.0' },
    timeout: 8000,
  })

  return {
    posts: Array.isArray(response._data) ? response._data : [],
    total: Number(response.headers.get('x-wp-total') || 0),
    totalPages: Number(response.headers.get('x-wp-totalpages') || 0),
  }
}
