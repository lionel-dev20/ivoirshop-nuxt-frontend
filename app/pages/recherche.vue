<!-- pages/recherche.vue -->
<template>
  <div class="max-w-[1440px] mx-auto p-6">
    <!-- Skeleton de chargement -->
    <div v-if="loading" class="flex flex-col lg:flex-row gap-6">
      <!-- Skeleton sidebar -->
      <div class="lg:w-1/4">
        <div class="bg-white rounded-md shadow-sm border border-gray-100 p-5">
          <div class="animate-pulse">
            <div class="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div class="space-y-4">
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              <div class="h-8 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded w-2/3"></div>
              <div class="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Skeleton contenu -->
      <div class="lg:w-3/4">
        <div class="animate-pulse">
          <div class="flex justify-between items-center mb-6">
            <div class="h-6 bg-gray-200 rounded w-32"></div>
            <div class="h-8 bg-gray-200 rounded w-40"></div>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div v-for="i in 8" :key="i" class="bg-white border border-gray-100 rounded-md overflow-hidden shadow-sm">
              <div class="w-full h-64 bg-gray-200"></div>
              <div class="p-4">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-5 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gestion des erreurs -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <div class="flex">
        <div class="text-red-400">
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">
            Erreur de chargement
          </h3>
          <p class="mt-1 text-sm text-red-700">{{ error }}</p>
          <button 
            @click="refreshData" 
            class="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded"
          >
            Réessayer
          </button>
        </div>
      </div>
    </div>

    <!-- Contenu principal avec layout sidebar + contenu -->
    <div v-else class="flex flex-col lg:flex-row gap-1 md:gap-4">
      <!-- Sidebar - Filtres (caché sur mobile) -->
      <div class="lg:w-[22%] hidden md:block">
        <div class="sticky top-6">
          <ProductFilters
            :products="allProducts"
            :attributes="searchAttributes"
            @filter="handleFilter"
            @clear="handleClearFilters"
          />
        </div>
      </div>

      <!-- Contenu principal - Résultats -->
      <div class="lg:w-[85%]">
        <!-- En-tête avec compteur et tri -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-4">
            <span class="text-sm font-medium text-gray-900">
              {{ filteredProducts.length }} produit{{ filteredProducts.length > 1 ? 's' : '' }}
            </span>
            <span v-if="searchQuery" class="text-sm text-gray-500">
              pour "{{ searchQuery }}"
            </span>
          </div>
          
          <div class="flex items-center space-x-2">
            <select
              v-model="sortBy"
              @change="handleSort"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="default">Trier par défaut</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="name-asc">Nom A-Z</option>
              <option value="name-desc">Nom Z-A</option>
              <option value="rating">Note</option>
              <option value="newest">Plus récents</option>
            </select>
          </div>
        </div>

        <!-- Liste des produits -->
        <div v-if="filteredProducts.length" class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 md:gap-2">
          <ProductCard
            v-for="product in paginatedProducts"
            :key="product.id"
            :product="product"
            :show-add-to-cart="true"
          />
        </div>

        <!-- Pagination -->
        <Pagination
          v-if="filteredProducts.length > itemsPerPage"
          :current-page="currentPage"
          :total-items="filteredProducts.length"
          :items-per-page="itemsPerPage"
          @page-change="handlePageChange"
        />
        
        <!-- Aucun produit filtré -->
        <div v-else-if="hasActiveFilters" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun produit trouvé</h3>
          <p class="mt-1 text-sm text-gray-500">
            Essayez de modifier vos critères de recherche ou de supprimer certains filtres.
          </p>
          <div class="mt-6">
            <button
              @click="handleClearFilters"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Effacer tous les filtres
            </button>
          </div>
        </div>

        <!-- Aucun résultat de recherche -->
        <div v-else-if="!hasResults && searchQuery" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun résultat</h3>
          <p class="mt-1 text-sm text-gray-500">
            Nous n'avons trouvé aucun produit correspondant à "{{ searchQuery }}".
          </p>
          <div class="mt-6">
            <button
              @click="goBack"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>

        <!-- Message par défaut -->
        <div v-else class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Rechercher des produits</h3>
          <p class="mt-1 text-sm text-gray-500">
            Utilisez la barre de recherche pour trouver des produits.
          </p>
        </div>
      </div>
    </div>

    <!-- Bottom bar mobile avec bouton filtres -->
    <div v-if="!loading && !error" class="md:hidden sticky flex items-center justify-center shadow z-30 bottom-0 mt-4 bg-white py-2 px-3.5">
      <button
        @click="openFilterDrawer"
        class="inline-flex items-center gap-2 rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2"
        type="button">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
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
        <div
          v-if="isFilterDrawerOpen"
          class="fixed inset-0 bg-black bg-opacity-50 z-50"
          @click="closeFilterDrawer">
        </div>
      </Transition>

      <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        leave-active-class="transition-transform duration-300 ease-in"
        enter-from-class="translate-y-full"
        leave-to-class="translate-y-full">
        <div
          v-if="isFilterDrawerOpen"
          class="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[85vh] overflow-hidden flex flex-col"
          @click.stop>
          <!-- En-tête du drawer avec bouton close -->
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Filtres</h3>
            <button
              @click="closeFilterDrawer"
              class="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Contenu du drawer avec scroll -->
          <div class="flex-1 overflow-y-auto p-4">
            <ProductFilters
              :products="allProducts"
              :attributes="searchAttributes"
              @filter="handleFilter"
              @clear="handleClearFilters" />
          </div>

          <!-- Footer avec boutons d'action -->
          <div class="p-4 border-t border-gray-200 bg-gray-50">
            <div class="flex gap-3">
              <button
                @click="handleClearFilters"
                class="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Réinitialiser
              </button>
              <button
                @click="closeFilterDrawer"
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
import { ref, computed, onMounted, watch } from 'vue'

// Interface pour les filtres
interface ProductFilters {
  priceMin: number | null
  priceMax: number | null
  rating: number | null
  attributes: Record<string, string[]>
  inStock: boolean
  onSale: boolean
}

// Interface pour les attributs
interface Attribute {
  name: string
  label: string
  slug?: string
  options: Array<{
    value: string
    label: string
    count: number
  }>
}

// Récupération des paramètres de route
const route = useRoute()
const router = useRouter()

// État réactif
const loading = ref(true)
const error = ref<string | null>(null)
const allProducts = ref<any[]>([])
const searchAttributes = ref<Attribute[]>([])

// État des filtres
const currentFilters = ref<ProductFilters>({
  priceMin: null,
  priceMax: null,
  rating: null,
  attributes: {},
  inStock: false,
  onSale: false
})

const sortBy = ref('default')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 40

// État du drawer mobile des filtres
const isFilterDrawerOpen = ref(false)

const openFilterDrawer = () => {
  isFilterDrawerOpen.value = true
  // Empêcher le scroll du body quand le drawer est ouvert
  if (process.client) {
    document.body.style.overflow = 'hidden'
  }
}

const closeFilterDrawer = () => {
  isFilterDrawerOpen.value = false
  // Réactiver le scroll du body
  if (process.client) {
    document.body.style.overflow = ''
  }
}

// Fermer le drawer avec la touche Échap
if (process.client) {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isFilterDrawerOpen.value) {
      closeFilterDrawer()
    }
  }
  
  watch(isFilterDrawerOpen, (isOpen) => {
    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
    } else {
      window.removeEventListener('keydown', handleEscape)
    }
  })
}

// Terme de recherche depuis l'URL
const searchQuery = computed(() => route.query.q as string || '')

// Utilisation de useLazyFetch pour récupérer les données de recherche
const { data, pending, error: fetchError, refresh } = await useLazyFetch('/api/search', {
  key: `search-${searchQuery.value}`,
  server: true,
  default: () => ({ products: [], total: 0 }),
  query: computed(() => ({
    q: searchQuery.value,
    page: 1,
    per_page: 50
  }))
})

// Mise à jour des données
watch(data, (newData) => {
  if (newData && 'products' in newData) {
    allProducts.value = (newData as any).products || []
    loading.value = false
  }
}, { immediate: true })

watch(pending, (isPending) => {
  loading.value = isPending
})

watch(fetchError, (err) => {
  if (err) {
    error.value = err.data?.message || err.message || 'Erreur lors de la recherche'
    loading.value = false
  }
})

// Produits filtrés et triés
const filteredProducts = computed(() => {
  let filtered = [...allProducts.value]
  
  // Filtrage par prix
  if (currentFilters.value.priceMin !== null) {
    filtered = filtered.filter(product => {
      const price = product.sale_price || product.regular_price || product.price
      return price >= currentFilters.value.priceMin!
    })
  }
  
  if (currentFilters.value.priceMax !== null) {
    filtered = filtered.filter(product => {
      const price = product.sale_price || product.regular_price || product.price
      return price <= currentFilters.value.priceMax!
    })
  }
  
  // Filtrage par note
  if (currentFilters.value.rating !== null) {
    filtered = filtered.filter(product => {
      const rating = product.average_rating || 0
      return rating >= currentFilters.value.rating!
    })
  }
  
  // Filtrage par stock
  if (currentFilters.value.inStock) {
    filtered = filtered.filter(product => product.stock_status === 'instock')
  }
  
  // Filtrage par promotion
  if (currentFilters.value.onSale) {
    filtered = filtered.filter(product => product.sale_price && product.sale_price > 0)
  }
  
  // Filtrage par attributs
  Object.entries(currentFilters.value.attributes).forEach(([attrName, selectedValues]) => {
    if (selectedValues.length > 0) {
      filtered = filtered.filter(product => {
        // Vérifier les attributs WooCommerce
        if (product.attributes) {
          const attr = product.attributes.find((a: any) => a.name === attrName)
          if (attr && attr.options) {
            return selectedValues.some(value => attr.options.includes(value))
          }
        }
        
        // Vérifier les meta_data
        if (product.meta_data) {
          const meta = product.meta_data.find((m: any) => 
            m.key === attrName || m.key === `pa_${attrName}` || m.key === `attribute_${attrName}`
          )
          return meta && selectedValues.includes(meta.value)
        }
        
        return false
      })
    }
  })
  
  // Tri
  switch (sortBy.value) {
    case 'price-asc':
      filtered.sort((a, b) => {
        const priceA = a.sale_price || a.regular_price || a.price || 0
        const priceB = b.sale_price || b.regular_price || b.price || 0
        return priceA - priceB
      })
      break
    case 'price-desc':
      filtered.sort((a, b) => {
        const priceA = a.sale_price || a.regular_price || a.price || 0
        const priceB = b.sale_price || b.regular_price || b.price || 0
        return priceB - priceA
      })
      break
    case 'name-asc':
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      filtered.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'rating':
      filtered.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
      break
    case 'newest':
      filtered.sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
      break
  }
  
  return filtered
})

// Produits paginés
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

// Vérifications
const hasResults = computed(() => allProducts.value.length > 0)
const hasActiveFilters = computed(() => {
  return currentFilters.value.priceMin !== null ||
         currentFilters.value.priceMax !== null ||
         currentFilters.value.rating !== null ||
         currentFilters.value.inStock ||
         currentFilters.value.onSale ||
         Object.values(currentFilters.value.attributes).some(values => values.length > 0)
})

// Gestion des filtres
const handleFilter = (filters: ProductFilters) => {
  currentFilters.value = { ...filters }
}

const handleClearFilters = () => {
  currentFilters.value = {
    priceMin: null,
    priceMax: null,
    rating: null,
    attributes: {},
    inStock: false,
    onSale: false
  }
  currentPage.value = 1 // Reset à la page 1
}

// Gestion du changement de page
const handlePageChange = (page: number) => {
  currentPage.value = page
}

// Réinitialiser la page quand les filtres ou la recherche changent
watch([() => currentFilters.value, sortBy, searchQuery], () => {
  currentPage.value = 1
}, { deep: true })

// Gestion du tri
const handleSort = () => {
  // Le tri est géré automatiquement par le computed filteredProducts
}

// Rafraîchissement des données
const refreshData = () => {
  error.value = null
  refresh()
}

// Retour à l'accueil
const goBack = () => {
  router.push('/')
}

// SEO Meta pour la recherche
useSeoMeta({
  title: () => searchQuery.value ? `Recherche: "${searchQuery.value}" - IvoirShop CI` : 'Recherche - IvoirShop CI',
  description: () => `Résultats de recherche pour "${searchQuery.value}" sur IvoirShop CI`,
  ogTitle: () => searchQuery.value ? `Recherche: "${searchQuery.value}"` : 'Recherche',
  ogDescription: () => `Découvrez nos produits correspondant à votre recherche "${searchQuery.value}"`
})

// Meta de la page
definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>