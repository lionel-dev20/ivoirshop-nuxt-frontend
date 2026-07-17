// Plugin universel (SSR + client) : récupère UNE fois la configuration éditable
// de la page d'accueil (plugin WordPress "IvoirShop Homepage Manager") et la
// stocke dans un état partagé.
//
// Étant `async`, ce plugin bloque le rendu SSR jusqu'à résolution : la config
// est donc disponible AVANT le rendu → aucun décalage d'hydratation, et les
// composants peuvent la lire de façon synchrone via useHomepageConfig().
import type { HomepageConfig } from '~/composables/useHomepageConfig'

export default defineNuxtPlugin(async () => {
  const state = useState<HomepageConfig | null>('homepage-config', () => null)

  // Déjà résolu (navigation client ultérieure) : ne pas refetch.
  if (state.value !== null) return

  try {
    const res = await $fetch<{ success: boolean; data: HomepageConfig | null }>(
      '/api/wordpress/homepage'
    )
    // `data` peut être null si WordPress est indisponible : les composants
    // utiliseront alors leurs valeurs par défaut internes.
    state.value = res?.data ?? null
  } catch {
    state.value = null
  }
})
