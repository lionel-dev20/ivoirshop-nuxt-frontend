<template>
    <div class="flex justify-between items-center gap-x-3">
        <!-- Left here baner -->
        <NuxtLink :to="brandUrl(leftBanner.link, 'Ilux')" @click="trackBrandClick('Ilux', brandUrl(leftBanner.link, 'Ilux'))"
            class="hidden md:block object-cover md:min-h-[380px] md:min-w-[250px]  rounded-md justify-start items-center gap-x-2 bg-white py-1.5 px-1.5 border-1 border-gray-100 shadow-md shadow-gray-100">
            <img :src="leftBanner.image" alt="Publicité 1" loading="lazy"
                class="object-cover h-[380px] w-[250px] rounded-md" />
        </NuxtLink>


        <!-- Middle here partenaires -->
        <div class="w-full">
            <h2
                class="block bg-white md:p-4 p-3 rounded-[4px] text-left font-extrabold text-lg md:text-xl mb-1.5 md:mb-4 border-1 border-gray-100 shadow-md shadow-gray-100">
                {{ partnersTitle }}</h2>
            <div class="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-5 md:gap-1.5 gap-1 h-full">
                <NuxtLink :to="brandUrl(item.link, item.title)"
                    @click="trackBrandClick(item.title, brandUrl(item.link, item.title))"
                    v-for="(item, index) in listParnerImg" :key="index"
                    :class="{'hidden': index >= listParnerImg.length - 3 && screenWidth < 768}"
                    class="object-cover h-full w-full rounded-md flex justify-start items-center gap-x-0.5 md:gap-x-1 md:gap-y-1 md:py-0.5 py-0.5 px-0.5 md:px-0.5 bg-white border-1 border-gray-100 shadow-md shadow-gray-100 hover:scale-103 transition-transform duration-200">
                    <img :src="item.image" :alt="item.title" loading="lazy"
                        class="object-cover h-12 w-auto md:w-auto md:h-full block items-center justify-center rounded-md shadow-gray-100" />
                </NuxtLink>
            </div>
        </div>


        <!-- Right here baner -->
        <NuxtLink :to="brandUrl(rightBanner.link, 'Leadder')"
            @click="trackBrandClick('Leadder', brandUrl(rightBanner.link, 'Leadder'))"
            class="hidden md:block object-cover md:min-h-[380px] md:min-w-[250px]  rounded-md flex justify-start items-center gap-x-3 bg-white py-1.5 px-1.5 border-1 border-gray-100 shadow-md shadow-gray-100">
            <img
                :src="rightBanner.image"
                alt="Publicité 1" loading="lazy" class="object-cover h-[380px] w-[250px] rounded-md" />
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">

// Valeurs par défaut = contenu historique (repli si WordPress indisponible).
//
// Les liens pointent vers les pages de marque /marque/<slug>, où <slug> est le
// slug de la taxonomie « marques » de WooCommerce — pas le nom affiché ici :
// « Smart » correspond à smart-technology et « SiverCrest » à silver-crest.
// Wildbaby et Iphone n'existent pas encore comme marques dans WooCommerce :
// ils restent sur la recherche tant qu'ils n'y sont pas créés.
const DEFAULT_LEFT_BANNER = { image: '/images/partenaireilux.png', link: '/marque/ilux' }
const DEFAULT_RIGHT_BANNER = { image: '/images/partenaire_leadder.png', link: '/marque/leadder' }
const DEFAULT_LOGOS = [
    {
        image: '/marques/Leadder.png',
        title: 'Leadder',
        link: '/marque/leadder'
    },
    {
        image: '/marques/Ilux.png',
        title: 'Ilux',
        link: '/marque/ilux'
    },
    {
        image: '/marques/Roch.png',
        title: 'Roch',
        link: '/marque/roch'
    },
    {
        image: '/marques/Smart_.png',
        title: 'Smart',
        link: '/marque/smart-technology'
    },
    {
        image: '/marques/Binatone.png',
        title: 'Binatone',
        link: '/marque/binatone'
    },
    {
        image: '/marques/Oraimo.png',
        title: 'Oraimo',
        link: '/marque/oraimo'
    },
    {
        image: '/marques/RAF.png',
        title: 'RAF',
        link: '/marque/raf'
    },
    {
        image: '/marques/Wildbaby.png',
        title: 'Wildbaby',
        link: '/recherche?q=wildbaby'
    },
    {
        image: '/marques/SiverCrest.png',
        title: 'SiverCrest',
        link: '/marque/silver-crest'
    },
    {
        image: '/marques/Nasco.png',
        title: 'Nasco',
        link: '/marque/nasco'
    },
    {
        image: '/marques/tecno.png',
        title: 'tecno',
        link: '/marque/tecno'
    },
    {
        image: '/marques/Infinix.png',
        title: 'Infinix',
        link: '/marque/infinix'
    },
    {
        image: '/marques/HP.png',
        title: 'HP',
        link: '/marque/hp'
    },
    {
        image: '/marques/Lenovo.png',
        title: 'Lenovo',
        link: '/marque/lenovo'
    },
    {
        image: '/marques/Iphone.png',
        title: 'Iphone',
        link: '/recherche?q=iphone'
    },
]

// Contenu piloté par WordPress (repli sur les valeurs par défaut).
const { section } = useHomepageConfig()
const partnersTitle = computed(() => section('partners', 'title', 'Nos partenaires'))
const leftBanner = computed(() => section('partners', 'leftBanner', DEFAULT_LEFT_BANNER))
const rightBanner = computed(() => section('partners', 'rightBanner', DEFAULT_RIGHT_BANNER))
const listParnerImg = computed(() => section('partners', 'logos', DEFAULT_LOGOS))

// --------------------------------------------------------------------------
// Liens des marques.
//
// Les liens enregistrés dans WordPress pointent encore, pour la plupart, vers
// la recherche (https://ivoirshop.ci/recherche?q=oraimo). On les réécrit ici
// vers la page de marque — /marque/oraimo/ — au moment de l'affichage : le
// bloc est donc corrigé sans dépendre d'une mise à jour côté WordPress.
//
// La correspondance se fait sur la taxonomie « marques » de WooCommerce, car
// le terme recherché ne vaut pas le slug : « Smart » correspond à
// smart-technology et « SiverCrest » à silver-crest. Une marque introuvable
// (Wildbaby, Iphone : elles n'existent pas dans WooCommerce) conserve son lien
// d'origine, plutôt que de renvoyer vers une page 404.
// --------------------------------------------------------------------------
const { data: brandsData } = await useFetch<{ brands: Array<{ slug: string; name: string }> }>(
    '/api/woocommerce/brands',
    { key: 'partner-brands', default: () => ({ brands: [] }) }
)

// Marques dont le nom affiché ne permet pas de retrouver le slug tout seul.
const BRAND_ALIASES: Record<string, string> = {
    smart: 'smart-technology',
    sivercrest: 'silver-crest',
}

const normalize = (value: string) =>
    String(value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]/g, '')

const brandIndex = computed(() => {
    const bySlug = new Map<string, string>()
    const byNormalized = new Map<string, string>()
    for (const brand of brandsData.value?.brands ?? []) {
        bySlug.set(brand.slug.toLowerCase(), brand.slug)
        byNormalized.set(normalize(brand.slug), brand.slug)
        byNormalized.set(normalize(brand.name), brand.slug)
    }
    return { bySlug, byNormalized }
})

/** Terme recherché dans un lien /recherche?q=..., sinon null. */
const searchTerm = (link: string): string | null => {
    if (!link.includes('recherche')) return null
    const query = link.split('?')[1]
    if (!query) return null
    const match = new URLSearchParams(query).get('q')
    return match ? match.trim() : null
}

/** URL finale du logo : page de marque si elle existe, lien d'origine sinon. */
const brandUrl = (link: string, title?: string): string => {
    const raw = String(link || '')

    // Lien déjà pointé vers une marque : on garantit seulement la barre finale.
    const already = raw.match(/\/marque\/([^/?#]+)/)
    if (already) return `/marque/${already[1]}/`

    const { bySlug, byNormalized } = brandIndex.value
    const candidates = [searchTerm(raw), title].filter(Boolean) as string[]

    for (const candidate of candidates) {
        const normalized = normalize(candidate)

        const alias = BRAND_ALIASES[normalized]
        if (alias && bySlug.has(alias)) return `/marque/${bySlug.get(alias)}/`

        const direct = bySlug.get(candidate.toLowerCase())
        if (direct) return `/marque/${direct}/`

        const fuzzy = byNormalized.get(normalized)
        if (fuzzy) return `/marque/${fuzzy}/`
    }

    return raw
}

/**
 * Suivi des clics via GTM (dataLayer), comme sur le reste du site.
 * `select_promotion` est l'événement e-commerce standard pour un emplacement
 * promotionnel : le bloc partenaires en est un.
 */
const trackBrandClick = (title: string, url: string) => {
    if (!import.meta.client) return
    const w = window as any
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push({
        event: 'select_promotion',
        creative_name: 'bloc_partenaires',
        promotion_name: title || 'Marque',
        link_url: url,
    })
}

const screenWidth = ref(0);

const isLargeScreen = computed(() => screenWidth.value >= 768);

onMounted(() => {
  screenWidth.value = window.innerWidth;
  window.addEventListener('resize', () => {
    screenWidth.value = window.innerWidth;
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', () => {
    screenWidth.value = window.innerWidth;
  });
});
</script>

<style scoped></style>