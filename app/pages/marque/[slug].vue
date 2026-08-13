<!-- pages/marque/[slug].vue -->
<!-- Tous les produits d'une marque. Reprend la structure de la page catégorie
     (filtres, tri, pagination, drawer mobile) pour un parcours identique. -->
<template>
  <div class="max-w-[1440px] mx-auto p-2 md:p-6">
    <!-- Skeleton de chargement -->
    <CategoryPageSkeleton v-if="loading" />

    <!-- Gestion des erreurs -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <div class="flex">
        <div class="text-red-400">
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Erreur de chargement</h3>
          <p class="mt-1 text-sm text-red-700">{{ error }}</p>
          <button @click="refreshData" class="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded">
            Réessayer
          </button>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div v-else>
      <!-- Fil d'Ariane -->
      <nav class="text-xs text-gray-500 mb-3 flex flex-wrap items-center gap-1.5">
        <NuxtLink to="/" class="hover:text-[#ff9900] transition-colors">Accueil</NuxtLink>
        <span class="text-gray-300">/</span>
        <NuxtLink to="/marque" class="hover:text-[#ff9900] transition-colors">Marques</NuxtLink>
        <span class="text-gray-300">/</span>
        <span class="text-gray-700">{{ brand?.name }}</span>
      </nav>

      <!-- En-tête de la marque -->
      <div
        class="bg-white border border-gray-100 shadow-md shadow-gray-50 rounded-md p-4 md:p-5 mb-4 flex items-center gap-4">
        <img
          v-if="brandLogo"
          :src="brandLogo"
          :alt="brand?.name"
          loading="lazy"
          class="h-12 md:h-16 w-auto object-contain bg-white rounded shrink-0" />
        <div class="min-w-0">
          <h1 class="text-xl md:text-2xl font-extrabold text-gray-900 truncate">{{ brand?.name }}</h1>
          <p class="text-sm text-gray-500 mt-0.5">
            {{ allProducts.length }} produit{{ allProducts.length > 1 ? 's' : '' }} de la marque {{ brand?.name }}
          </p>
        </div>
      </div>

      <!-- Description de la marque (saisie dans WooCommerce) -->
      <div v-if="brand?.description" class="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-gray-700"
        v-html="brand.description"></div>

      <!-- Layout avec filtres et produits -->
      <div class="flex flex-col lg:flex-row gap-1 md:gap-6">
        <!-- Colonne latérale - Filtres -->
        <div class="lg:w-1/4">
          <div class="sticky top-6 hidden md:block">
            <ProductFilters :products="allProducts" :attributes="brandAttributes" :categories="brandCategories"
              @filter="handleFilter" @clear="handleClearFilters" />
          </div>
        </div>

        <!-- Colonne principale - Produits -->
        <div class="lg:w-full">
          <!-- En-tête avec compteur et tri -->
          <div
            class="bg-white border border-gray-100 shadow-md shadow-gray-50 rounded-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div class="flex items-center space-x-4">
              <h2 class="text-lg font-semibold text-gray-900">
                {{ filteredProducts.length }} produit{{ filteredProducts.length > 1 ? 's' : '' }}
              </h2>
              <span v-if="hasActiveFilters" class="text-sm text-blue-600">
                ({{ allProducts.length }} au total)
              </span>
            </div>

            <!-- Tri -->
            <div class="mt-4 sm:mt-0">
              <select v-model="sortBy"
                class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="default">Trier par défaut</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="name-asc">Nom A-Z</option>
                <option value="name-desc">Nom Z-A</option>
                <option value="rating-desc">Mieux notés</option>
                <option value="newest">Plus récents</option>
              </select>
            </div>
          </div>

          <!-- Liste des produits -->
          <div v-if="filteredProducts.length"
            class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-2 gap-1">
            <ProductCard v-for="product in paginatedProducts" :key="product.id" :product="product"
              :show-add-to-cart="true" />
          </div>

          <!-- Pagination -->
          <Pagination
            v-if="filteredProducts.length > itemsPerPage"
            :current-page="currentPage"
            :total-items="filteredProducts.length"
            :items-per-page="itemsPerPage"
            @page-change="handlePageChange" />

          <!-- Aucun produit après filtrage -->
          <div v-if="!filteredProducts.length && hasActiveFilters" class="text-center py-12">
            <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun produit trouvé</h3>
            <p class="mt-1 text-sm text-gray-500">Aucun produit ne correspond à vos critères de filtrage.</p>
            <button @click="handleClearFilters"
              class="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
              Effacer les filtres
            </button>
          </div>

          <!-- Marque sans produit -->
          <div v-else-if="!filteredProducts.length" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun produit</h3>
            <p class="mt-1 text-sm text-gray-500">
              Aucun produit disponible pour cette marque pour le moment.
            </p>
            <NuxtLink to="/marque"
              class="mt-4 inline-flex px-4 py-2 bg-[#ff9900] hover:bg-[#e68a00] text-black text-sm font-semibold rounded-md transition-colors">
              Voir toutes les marques
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom bar mobile avec bouton filtres -->
    <div v-if="!loading && !error"
      class="md:hidden sticky flex items-center justify-between shadow z-30 bottom-0 mt-4 bg-white py-2 px-3.5">
      <button @click="openFilterDrawer"
        class="inline-flex items-center gap-2 rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 focus:outline-none"
        type="button">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Voir les filtres
      </button>
    </div>

    <!-- Drawer mobile des filtres -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        leave-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0">
        <div v-if="isFilterDrawerOpen" class="fixed inset-0 bg-black bg-opacity-50 z-50" @click="closeFilterDrawer">
        </div>
      </Transition>

      <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        leave-active-class="transition-transform duration-300 ease-in"
        enter-from-class="translate-y-full"
        leave-to-class="translate-y-full">
        <div v-if="isFilterDrawerOpen"
          class="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[85vh] overflow-hidden flex flex-col"
          @click.stop>
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Filtres</h3>
            <button @click="closeFilterDrawer" class="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-4">
            <ProductFilters :products="allProducts" :attributes="brandAttributes" :categories="brandCategories"
              @filter="handleFilter" @clear="handleClearFilters" />
          </div>

          <div class="p-4 border-t border-gray-200 bg-gray-50">
            <div class="flex gap-3">
              <button @click="handleClearFilters"
                class="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Réinitialiser
              </button>
              <button @click="closeFilterDrawer"
                class="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-accent-300 transition-colors">
                Voir {{ filteredProducts.length }} produit{{ filteredProducts.length > 1 ? 's' : '' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const { data, pending: loading, error: fetchError, refresh } = await useLazyFetch(
  () => `/api/woocommerce/brand/${slug.value}`,
  {
    key: `brand-${slug.value}`,
    server: true,
    default: () => ({ brand: null, products: [], attributes: [], categories: [] }),
    watch: [slug],
  }
)

const brand = computed(() => (data.value as any)?.brand || null)
const allProducts = computed(() => (data.value as any)?.products || [])
const brandAttributes = computed(() => (data.value as any)?.attributes || [])
const brandCategories = computed(() => (data.value as any)?.categories || [])
const error = computed(() => {
  const err = fetchError.value as any
  if (!err) return null
  // Marque inexistante : message clair plutôt que l'erreur brute de l'API.
  if (err.statusCode === 404) return 'Cette marque n’existe pas ou n’est plus disponible.'
  return err.data?.message || err.message || null
})

// Une marque inexistante doit renvoyer un vrai 404, pas une page 200 « vide » :
// sans cela, les moteurs indexent une soft 404 pour chaque slug erroné.
watchEffect(() => {
  if ((fetchError.value as any)?.statusCode === 404) {
    throw createError({ statusCode: 404, statusMessage: 'Marque introuvable', fatal: true })
  }
})

// Logo : image WooCommerce si renseignée, sinon le fichier local /marques/<Nom>.png
// utilisé par le bloc partenaires de la page d'accueil.
const LOCAL_LOGOS: Record<string, string> = {
  leadder: '/marques/Leadder.png',
  ilux: '/marques/Ilux.png',
  roch: '/marques/Roch.png',
  'smart-technology': '/marques/Smart_.png',
  binatone: '/marques/Binatone.png',
  oraimo: '/marques/Oraimo.png',
  raf: '/marques/RAF.png',
  'silver-crest': '/marques/SiverCrest.png',
  nasco: '/marques/Nasco.png',
  tecno: '/marques/tecno.png',
  infinix: '/marques/Infinix.png',
  hp: '/marques/HP.png',
  lenovo: '/marques/Lenovo.png',
}

const brandLogo = computed(() => brand.value?.image || LOCAL_LOGOS[slug.value] || null)

// État des filtres et tri
const currentFilters = ref({
  priceMin: null as number | null,
  priceMax: null as number | null,
  rating: null as number | null,
  attributes: {} as Record<string, string[]>,
  brands: [] as string[],
  categories: [] as string[],
  inStock: false,
  onSale: false,
})

const sortBy = ref('default')
const currentPage = ref(1)
const itemsPerPage = 40

// Drawer mobile
const isFilterDrawerOpen = ref(false)

const openFilterDrawer = () => {
  isFilterDrawerOpen.value = true
  if (import.meta.client) document.body.style.overflow = 'hidden'
}

const closeFilterDrawer = () => {
  isFilterDrawerOpen.value = false
  if (import.meta.client) document.body.style.overflow = ''
}

if (import.meta.client) {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isFilterDrawerOpen.value) closeFilterDrawer()
  }
  watch(isFilterDrawerOpen, (isOpen) => {
    if (isOpen) window.addEventListener('keydown', handleEscape)
    else window.removeEventListener('keydown', handleEscape)
  })
}

// Produits filtrés et triés
const filteredProducts = computed(() => {
  let filtered = [...allProducts.value]
  const f = currentFilters.value

  if (f.priceMin !== null) {
    filtered = filtered.filter((p) => (p.sale_price || p.regular_price || p.price) >= f.priceMin!)
  }
  if (f.priceMax !== null) {
    filtered = filtered.filter((p) => (p.sale_price || p.regular_price || p.price) <= f.priceMax!)
  }
  if (f.rating !== null) {
    filtered = filtered.filter((p) => (p.average_rating || 0) >= f.rating!)
  }
  if (f.inStock) {
    filtered = filtered.filter((p) => p.stock_status === 'instock')
  }
  if (f.onSale) {
    filtered = filtered.filter((p) => p.sale_price && p.sale_price > 0)
  }

  Object.entries(f.attributes).forEach(([attrName, selectedValues]) => {
    if (!selectedValues.length) return
    filtered = filtered.filter((product) => {
      const attr = product.attributes?.find((a: any) => a.name === attrName)
      if (attr?.options) return selectedValues.some((v) => attr.options.includes(v))

      const meta = product.meta_data?.find(
        (m: any) => m.key === `pa_${attrName}` || m.key === `attribute_${attrName}`
      )
      if (meta?.value) return selectedValues.includes(meta.value)

      return false
    })
  })

  if (f.categories.length > 0) {
    filtered = filtered.filter((product) =>
      Array.isArray(product.categories)
        ? product.categories.some((cat: any) => f.categories.includes(cat.slug))
        : false
    )
  }

  switch (sortBy.value) {
    case 'price-asc':
      filtered.sort(
        (a, b) =>
          (a.sale_price || a.regular_price || a.price || 0) - (b.sale_price || b.regular_price || b.price || 0)
      )
      break
    case 'price-desc':
      filtered.sort(
        (a, b) =>
          (b.sale_price || b.regular_price || b.price || 0) - (a.sale_price || a.regular_price || a.price || 0)
      )
      break
    case 'name-asc':
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      filtered.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'rating-desc':
      filtered.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
      break
    case 'newest':
      filtered.sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
      break
  }

  return filtered
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredProducts.value.slice(start, start + itemsPerPage)
})

const hasActiveFilters = computed(() => {
  const f = currentFilters.value
  return (
    f.priceMin !== null ||
    f.priceMax !== null ||
    f.rating !== null ||
    f.inStock ||
    f.onSale ||
    f.categories.length > 0 ||
    Object.values(f.attributes).some((values) => values.length > 0)
  )
})

const refreshData = () => refresh()

const handleFilter = (filters: any) => {
  currentFilters.value = { ...filters }
}

const handleClearFilters = () => {
  currentFilters.value = {
    priceMin: null,
    priceMax: null,
    rating: null,
    attributes: {},
    brands: [],
    categories: [],
    inStock: false,
    onSale: false,
  }
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

watch([() => currentFilters.value, sortBy, slug], () => {
  currentPage.value = 1
}, { deep: true })

const runtime = useRuntimeConfig()
const siteUrl = (runtime.public.SITE_URL as string) || 'https://ivoirshop.ci'

useSeoMeta({
  title: () => (brand.value ? `${brand.value.name} — Tous les produits | IvoirShop` : 'Marque | IvoirShop'),
  description: () =>
    brand.value
      ? `Découvrez tous les produits ${brand.value.name} disponibles chez IvoirShop en Côte d'Ivoire. Livraison à Abidjan et en région.`
      : 'Découvrez nos marques.',
  ogTitle: () => brand.value?.name,
  ogImage: () => brandLogo.value || undefined,
})

useHead({
  link: [{ rel: 'canonical', href: () => `${siteUrl}/marque/${slug.value}` }],
})
</script>
