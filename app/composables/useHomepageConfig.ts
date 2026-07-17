// Composable de configuration de la page d'accueil.
//
// Lit l'état partagé rempli par le plugin `homepage-config.ts` (récupéré depuis
// WordPress via /api/wordpress/homepage). Lecture SYNCHRONE : aucun await requis
// dans les composants. Si WordPress est indisponible, `config` vaut null et
// chaque composant retombe sur ses valeurs par défaut internes via `section()`.
//
// Utilisation :
//   const { config, section } = useHomepageConfig()
//   const slides = computed(() => section('hero', 'slides', DEFAULT_SLIDES))
import { computed } from 'vue'

export interface HomepageConfig {
  background?: Record<string, any>
  hero?: { slides?: any[] }
  rightAds?: Record<string, any>
  partners?: Record<string, any>
  countdowns?: any[]
  acheterEnLigne?: Record<string, any>
  doubleBanners?: any[][]
  productCarousels?: any[]
  nouveaute?: Record<string, any>
  seo?: Record<string, any>
  [key: string]: any
}

export const useHomepageConfig = () => {
  const state = useState<HomepageConfig | null>('homepage-config', () => null)

  const config = computed<HomepageConfig | null>(() => state.value)

  /**
   * Récupère une sous-valeur de la config avec repli sur une valeur par défaut.
   * @param group    Section (ex : 'hero')
   * @param key      Clé dans la section (ex : 'slides'). null = toute la section.
   * @param fallback Valeur par défaut si absente/vide.
   */
  const section = <T>(group: string, key: string | null, fallback: T): T => {
    const grp = state.value?.[group]
    if (grp == null) return fallback
    if (key == null) return (grp as T) ?? fallback
    const val = (grp as Record<string, any>)[key]
    if (val == null) return fallback
    // Un tableau vide côté WP ne doit pas masquer le contenu par défaut.
    if (Array.isArray(val) && val.length === 0) return fallback
    return val as T
  }

  return { config, section }
}
