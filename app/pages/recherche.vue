<!-- pages/recherche.vue -->
<template>
  <div class="max-w-6xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">
      Résultats de recherche
      <span v-if="searchQuery" class="text-blue-600">"{{ searchQuery }}"</span>
    </h1>

    <!-- Skeleton de chargement -->
    <div v-if="loading" class="max-w-[1440px] mx-auto p-6">
      <!-- Skeleton barre de recherche -->
      <div class="mb-6">
        <div class="animate-pulse">
          <div class="h-12 bg-gray-200 rounded-lg w-full mb-4"></div>
        </div>
      </div>

      <!-- Skeleton filtres -->
      <div class="mb-6">
        <div class="animate-pulse">
          <div class="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div class="flex space-x-4">
            <div class="h-8 bg-gray-200 rounded w-20"></div>
            <div class="h-8 bg-gray-200 rounded w-24"></div>
            <div class="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>

      <!-- Skeleton résultats -->
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-0.5 md:gap-3.5">
        <div v-for="i in 8" :key="i" class="bg-white border border-gray-100 rounded-md overflow-hidden shadow-md shadow-gray-100">
          <!-- Skeleton image -->
          <div class="w-full h-64 bg-gray-200 animate-pulse"></div>
          
          <!-- Skeleton contenu -->
          <div class="p-3.5">
            <div class="animate-pulse">
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div class="flex items-center justify-between">
                <div class="h-5 bg-gray-200 rounded w-20"></div>
                <div class="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>

          <!-- Skeleton bouton -->
          <div class="px-4 pb-4">
            <div class="animate-pulse">
              <div class="w-full h-10 bg-gray-200 rounded"></div>
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
            Erreur de recherche
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

    <!-- Contenu principal -->
    <div v-else>
      <!-- Layout avec filtres et produits -->
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Colonne latérale - Filtres -->
        <div class="lg:w-1/4">
          <div class="sticky top-6">
            <ProductFilters
              :products="allProducts"
              :attributes="searchAttributes"
              @filter="handleFilter"
              @clear="handleClearFilters"
            />
          </div>
        </div>

        <!-- Colonne principale - Produits -->
        <div class="lg:w-3/4">
          <!-- En-tête avec compteur et tri -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div class="flex items-center space-x-4">
              <h2 class="text-lg font-semibold text-gray-900">
                {{ filteredProducts.length }} résultat{{ filteredProducts.length > 1 ? 's' : '' }}
              </h2>
              <span v-if="hasActiveFilters" class="text-sm text-blue-600">
                ({{ allProducts.length }} au total)
              </span>
            </div>
            
            <!-- Tri -->
            <div class="mt-4 sm:mt-0">
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
                <option value="rating-desc">Mieux notés</option>
                <option value="newest">Plus récents</option>
                <option value="relevance">Pertinence</option>
              </select>
            </div>
          </div>

          <!-- Liste des produits -->
          <div v-if="filteredProducts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div 
              v-for="product in filteredProducts" 
              :key="product.id" 
              class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
            >
              <!-- Lien vers la fiche produit -->
              <NuxtLink :to="`/produit/${product.slug}`" class="block">
                <div class="aspect-w-16 aspect-h-9">
                  <img
                    v-if="product.images && product.images.length > 0"
                    :src="product.images[0].src"
                    :alt="product.name"
                    class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    @error="onImageError"
                  />
                  <div 
                    v-else 
                    class="w-full h-48 bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-colors"
                  >
                    <span class="text-gray-400">Aucune image</span>
                  </div>
                </div>
                
                <div class="p-4">
                  <h2 class="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {{ product.name }}
                  </h2>
                  
                  <!-- Prix -->
                  <div class="flex items-center justify-between mb-3">
                    <div>
                      <span v-if="product.sale_price" class="text-red-600 font-bold">
                        {{ formatPrice(product.sale_price) }}
                      </span>
                      <span 
                        :class="product.sale_price ? 'line-through text-gray-500 text-sm ml-2' : 'text-gray-700 font-semibold'"
                      >
                        {{ formatPrice(product.regular_price || product.price) }}
                      </span>
                      <!-- Badge promotion -->
                      <span 
                        v-if="product.sale_price" 
                        class="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded"
                      >
                        -{{ Math.round((1 - product.sale_price / product.regular_price) * 100) }}%
                      </span>
                    </div>
                    
                    <!-- Badge stock -->
                    <span 
                      v-if="product.stock_status"
                      :class="getStockStatusClass(product.stock_status)"
                      class="px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {{ getStockStatusText(product.stock_status) }}
                    </span>
                  </div>
                  
                  <!-- Description courte -->
                  <p 
                    v-if="product.short_description" 
                    class="text-gray-600 text-sm mt-2 line-clamp-3"
                    v-html="product.short_description"
                  ></p>

                  <!-- Call to action -->
                  <div class="mt-4 flex items-center justify-between">
                    <span class="text-sm text-gray-500">Voir les détails</span>
                    <svg 
                      class="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </NuxtLink>

              <!-- Actions rapides -->
              <div class="px-4 pb-4">
                <button 
                  @click.prevent="addToCartQuick(product)"
                  :disabled="product.stock_status !== 'instock'"
                  :class="[
                    'w-full py-2 px-4 rounded-md text-sm font-medium transition-colors',
                    product.stock_status === 'instock' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  ]"
                >
                  {{ product.stock_status === 'instock' ? 'Ajouter au panier' : 'Indisponible' }}
                </button>
              </div>
            </div>
          </div>
          
          <!-- Aucun produit filtré -->
          <div v-else-if="hasActiveFilters" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun résultat trouvé</h3>
            <p class="mt-1 text-sm text-gray-500">
              Aucun produit ne correspond à vos critères de filtrage.
            </p>
            <button
              @click="handleClearFilters"
              class="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Effacer les filtres
            </button>
          </div>
          
          <!-- Aucun résultat de recherche -->
          <div v-else class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun résultat</h3>
            <p class="mt-1 text-sm text-gray-500">
              Aucun produit trouvé pour "{{ searchQuery }}". Essayez avec d'autres mots-clés.
            </p>
            <button
              @click="goBack"
              class="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Récupération du paramètre de recherche
const searchQuery = computed(() => route.query.q as string || '')

// Utilisation de useLazyFetch pour la recherche
const { data, pending: loading, error: fetchError, refresh } = await useLazyFetch(`/api/search`, {
  key: `search-${searchQuery.value}`,
  server: true,
  default: () => ({ products: [] }),
  query: {
    q: searchQuery
  },
  watch: [searchQuery]
})

// Données réactives
const allProducts = computed(() => data.value?.products || [])
const error = computed(() => fetchError.value?.data?.message || fetchError.value?.message || null)

// État des filtres et tri
const currentFilters = ref({
  priceMin: null as number | null,
  priceMax: null as number | null,
  rating: null as number | null,
  attributes: {} as Record<string, string[]>,
  inStock: false,
  onSale: false
})

const sortBy = ref('relevance')

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
            m.key === `pa_${attrName}` || m.key === `attribute_${attrName}`
          )
          if (meta && meta.value) {
            return selectedValues.includes(meta.value)
          }
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
    case 'rating-desc':
      filtered.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
      break
    case 'newest':
      filtered.sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
      break
    case 'relevance':
      // Tri par pertinence (produits avec le terme de recherche dans le nom en premier)
      filtered.sort((a, b) => {
        const query = searchQuery.value.toLowerCase()
        const aName = a.name.toLowerCase()
        const bName = b.name.toLowerCase()
        
        const aStartsWith = aName.startsWith(query)
        const bStartsWith = bName.startsWith(query)
        
        if (aStartsWith && !bStartsWith) return -1
        if (!aStartsWith && bStartsWith) return 1
        
        const aContains = aName.includes(query)
        const bContains = bName.includes(query)
        
        if (aContains && !bContains) return -1
        if (!aContains && bContains) return 1
        
        return 0
      })
      break
  }
  
  return filtered
})

// Vérifier s'il y a des filtres actifs
const hasActiveFilters = computed(() => {
  return currentFilters.value.priceMin !== null ||
         currentFilters.value.priceMax !== null ||
         currentFilters.value.rating !== null ||
         currentFilters.value.inStock ||
         currentFilters.value.onSale ||
         Object.values(currentFilters.value.attributes).some(values => values.length > 0)
})

// Attributs de recherche (générés automatiquement)
const searchAttributes = computed(() => {
  return []
})

// Fonction pour recharger manuellement les données
const refreshData = () => {
  return refresh()
}

// Gestion des filtres
const handleFilter = (filters: any) => {
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
}

// Gestion du tri
const handleSort = () => {
  // Le tri est géré automatiquement par le computed filteredProducts
}

// Retour à l'accueil
const goBack = () => {
  router.push('/')
}

// Formatage du prix
const formatPrice = (price: string | number) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(numPrice)
}

// Gestion du statut de stock
const getStockStatusClass = (status: string) => {
  switch (status) {
    case 'instock':
      return 'bg-green-100 text-green-800'
    case 'outofstock':
      return 'bg-red-100 text-red-800'
    case 'onbackorder':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStockStatusText = (status: string) => {
  switch (status) {
    case 'instock':
      return 'En stock'
    case 'outofstock':
      return 'Rupture'
    case 'onbackorder':
      return 'Sur commande'
    default:
      return status
  }
}

// Gestion d'erreur d'image
const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/images/placeholder-product.jpg'
}

// Action rapide d'ajout au panier
const addToCartQuick = (product: any) => {
  const cartStore = useCartStore()
  cartStore.addItem(product, 1)
  cartStore.openCart()
  
  console.log('Ajout rapide au panier:', product.name)
}

// SEO Meta pour la recherche
useSeoMeta({
  title: () => searchQuery.value ? `Recherche: "${searchQuery.value}" - Ma Boutique` : 'Recherche - Ma Boutique',
  description: () => `Résultats de recherche pour "${searchQuery.value}"`,
  ogTitle: () => `Recherche: "${searchQuery.value}"`,
  ogDescription: () => `Résultats de recherche pour "${searchQuery.value}"`
})
</script>

<style>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animation hover pour les images */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}
</style>


