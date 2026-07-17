// server/api/wordpress/homepage.get.ts
// Proxy vers l'endpoint du plugin WordPress "IvoirShop Homepage Manager".
// Renvoie la configuration éditable de la page d'accueil.
// En cas d'indisponibilité de WordPress, renvoie { data: null } : le frontend
// utilise alors les valeurs par défaut définies dans chaque composant Vue.
import { defineEventHandler, setResponseHeader } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Cache court côté CDN/navigateur : la home change rarement.
  setResponseHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400')

  if (!config.WORDPRESS_URL) {
    return { success: false, data: null }
  }

  try {
    const response = await $fetch<any>(
      `${config.WORDPRESS_URL}/wp-json/${'ivoirshop/v1'}/homepage`,
      { timeout: 5000 }
    )

    if (response && response.success && response.data) {
      return { success: true, data: response.data, updatedAt: response.updatedAt || null }
    }
  } catch (error: any) {
    // Silencieux : on retombe sur les défauts des composants.
  }

  return { success: false, data: null }
})
