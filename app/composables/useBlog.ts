// Types et helpers d'affichage du blog.
// Le format renvoyé par /api/wordpress/* est déjà normalisé côté serveur
// (server/utils/blog.ts) : ici on ne fait que du formatage d'affichage.

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

export const useBlog = () => {
  /** Date courte à la française : "12 août 2026". */
  const formatDate = (iso: string): string => {
    if (!iso) return ''
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return ''
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  }

  /** Date compacte pour les cartes : "12 août". */
  const formatDateShort = (iso: string): string => {
    if (!iso) return ''
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return ''
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(date)
  }

  const formatReadingTime = (minutes: number): string => `${Math.max(1, minutes || 1)} min de lecture`

  const postUrl = (post: Pick<BlogPost, 'slug'>): string => `/blog/${post.slug}`

  return { formatDate, formatDateShort, formatReadingTime, postUrl }
}
