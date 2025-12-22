<template>
  <div class="relative">
    <!-- Input de recherche -->
    <div class="relative">
      <input
        v-model="searchQuery"
        @input="handleSearchInput"
        @focus="showSuggestions = true"
        @blur="handleBlur"
        @keydown.enter="performSearch"
        @keydown.arrow-down="navigateSuggestions(1)"
        @keydown.arrow-up="navigateSuggestions(-1)"
        @keydown.escape="hideSuggestions"
        type="text"
        placeholder="Rechercher des produits..."
        class="w-full px-4 py-2 pl-10 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        :class="{ 'rounded-b-none': showSuggestions && suggestions.length > 0 }"
      />
      
      <!-- Icône de recherche -->
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <!-- Bouton de recherche -->
      <button
        @click="performSearch"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
        :disabled="!searchQuery.trim()"
      >
        <svg 
          class="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
          :class="{ 'text-blue-500': searchQuery.trim() }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Suggestions d'autocomplétion -->
    <div
      v-if="showSuggestions && suggestions.length > 0"
      class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-b-lg shadow-lg max-h-96 overflow-y-auto"
    >
      <div class="py-1">
        <!-- Suggestions de produits -->
        <div v-if="productSuggestions.length > 0" class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Produits
        </div>
        <NuxtLink
          v-for="(suggestion, index) in productSuggestions"
          :key="`product-${suggestion.id}`"
          :to="`/produit/${suggestion.slug}`"
          @click="hideSuggestions"
          @mouseenter="selectedIndex = getProductIndex(index)"
          class="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-3 no-underline"
          :class="{ 'bg-blue-50': selectedIndex === getProductIndex(index) }"
        >
          <img
            v-if="suggestion.image"
            :src="suggestion.image"
            :alt="suggestion.name"
            class="w-8 h-8 object-cover rounded"
          />
          <div v-else class="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ suggestion.name }}</p>
            <p class="text-xs text-gray-500">{{ formatPrice(suggestion.price) }}</p>
          </div>
        </NuxtLink>

        <!-- Suggestions de catégories -->
        <div v-if="categorySuggestions.length > 0" class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Catégories
        </div>
        <NuxtLink
          v-for="(suggestion, index) in categorySuggestions"
          :key="`category-${suggestion.id}`"
          :to="`/categorie/${suggestion.slug}`"
          @click="hideSuggestions"
          @mouseenter="selectedIndex = getCategoryIndex(index)"
          class="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-3 no-underline"
          :class="{ 'bg-blue-50': selectedIndex === getCategoryIndex(index) }"
        >
          <div class="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900">{{ suggestion.name }}</p>
            <p class="text-xs text-gray-500">{{ suggestion.count }} produit{{ suggestion.count > 1 ? 's' : '' }}</p>
          </div>
        </NuxtLink>

        <!-- Suggestions de tags -->
        <div v-if="tagSuggestions.length > 0" class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Tags
        </div>
        <div
          v-for="(suggestion, index) in tagSuggestions"
          :key="`tag-${suggestion.id}`"
          @click="selectSuggestion(suggestion)"
          @mouseenter="selectedIndex = getTagIndex(index)"
          class="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-3"
          :class="{ 'bg-blue-50': selectedIndex === getTagIndex(index) }"
        >
          <div class="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900">{{ suggestion.name }}</p>
            <p class="text-xs text-gray-500">{{ suggestion.count }} produit{{ suggestion.count > 1 ? 's' : '' }}</p>
          </div>
        </div>

        <!-- Suggestions génériques -->
        <div v-if="genericSuggestions.length > 0" class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Recherches
        </div>
        <div
          v-for="(suggestion, index) in genericSuggestions"
          :key="`generic-${index}`"
          @click="selectSuggestion(suggestion)"
          @mouseenter="selectedIndex = getGenericIndex(index)"
          class="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-3"
          :class="{ 'bg-blue-50': selectedIndex === getGenericIndex(index) }"
        >
          <div class="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900">{{ suggestion.name }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Message de chargement -->
    <div
      v-if="isLoading && !suggestions.length"
      class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-b-lg shadow-lg"
    >
      <div class="px-3 py-3">
        <div class="flex items-center space-x-3">
          <!-- Spinner animé -->
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <div class="flex-1">
            <div class="animate-pulse space-y-2">
              <div class="h-3 bg-gray-200 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-2">Recherche en cours...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { close: closeMobileSearch } = useMobileSearch()

// État réactif
const searchQuery = ref('')
const suggestions = ref([])
const showSuggestions = ref(false)
const isLoading = ref(false)
const selectedIndex = ref(-1)
const searchTimeout = ref(null)

// Cache pour les suggestions (évite les requêtes répétées)
const suggestionsCache = ref<Map<string, any[]>>(new Map())

// Suggestions filtrées par type
const productSuggestions = computed(() => 
  suggestions.value.filter(s => s.type === 'product')
)

const categorySuggestions = computed(() => 
  suggestions.value.filter(s => s.type === 'category')
)

const tagSuggestions = computed(() => 
  suggestions.value.filter(s => s.type === 'tag')
)

const genericSuggestions = computed(() => 
  suggestions.value.filter(s => s.type === 'generic')
)

// Gestion de l'input de recherche
const handleSearchInput = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  if (searchQuery.value.trim().length < 2) {
    suggestions.value = []
    showSuggestions.value = false
    isLoading.value = false
    return
  }
  
  // Afficher l'indicateur de chargement immédiatement
  isLoading.value = true
  showSuggestions.value = true
  
  // Debounce réduit pour des suggestions plus rapides
  searchTimeout.value = setTimeout(() => {
    fetchSuggestions()
  }, 150) // Délai réduit à 150ms pour plus de réactivité
}

// Récupération des suggestions
const fetchSuggestions = async () => {
  const searchTerm = searchQuery.value.trim().toLowerCase()
  
  // Vérifier le cache d'abord
  if (suggestionsCache.value.has(searchTerm)) {
    suggestions.value = suggestionsCache.value.get(searchTerm) || []
    isLoading.value = false
    return
  }
  
  try {
    const startTime = performance.now()
    
    const response = await $fetch('/api/search/autocomplete', {
      query: {
        q: searchTerm,
        limit: 8 // Réduit de 10 à 8 pour plus de rapidité
      }
    })
    
    const endTime = performance.now()
    
    suggestions.value = response.suggestions || []
    selectedIndex.value = -1
    
    // Mettre en cache (max 20 entrées)
    if (suggestionsCache.value.size > 20) {
      const firstKey = suggestionsCache.value.keys().next().value
      suggestionsCache.value.delete(firstKey)
    }
    suggestionsCache.value.set(searchTerm, suggestions.value)
    
  } catch (error) {
    suggestions.value = []
  } finally {
    isLoading.value = false
  }
}

// Gestion du blur
const handleBlur = () => {
  // Délai pour permettre le clic sur les suggestions
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

// Navigation au clavier
const navigateSuggestions = (direction: number) => {
  if (suggestions.value.length === 0) return
  
  const totalSuggestions = suggestions.value.length
  selectedIndex.value = Math.max(0, Math.min(totalSuggestions - 1, selectedIndex.value + direction))
}

// Sélection d'une suggestion (pour tags et recherches génériques uniquement)
const selectSuggestion = (suggestion: any) => {
  if (suggestion.type === 'tag') {
    // Recherche par tag
    performSearch(suggestion.name)
  } else if (suggestion.type === 'generic') {
    // Recherche générique
    performSearch(suggestion.search_term || suggestion.name)
  }
  
  hideSuggestions()
}

// Recherche (avec support mobile amélioré)
const performSearch = (query?: string) => {
  // Si query est un objet (événement), on l'ignore
  if (typeof query === 'object' || query === '[object KeyboardEvent]' || query === '[object PointerEvent]') {
    query = undefined
  }
  
  const searchTerm = query || searchQuery.value.trim()
  if (!searchTerm) return
  
  // Fermer les suggestions
  hideSuggestions()
  
  // Masquer le clavier sur mobile
  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    const activeElement = document.activeElement as HTMLElement
    if (activeElement && activeElement.blur) {
      activeElement.blur()
    }
  }
  
  // Rediriger vers la page de recherche
  router.push(`/recherche?q=${encodeURIComponent(searchTerm)}`)
}

// Masquer les suggestions
const hideSuggestions = () => {
  showSuggestions.value = false
  selectedIndex.value = -1
  // Fermer l'overlay mobile si on est sur mobile
  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    closeMobileSearch()
  }
}

// Formatage du prix
const formatPrice = (price: string | number) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(numPrice).replace('XOF', 'FCFA')
}

// Index des suggestions pour la navigation
const getProductIndex = (index: number) => index
const getCategoryIndex = (index: number) => productSuggestions.value.length + index
const getTagIndex = (index: number) => productSuggestions.value.length + categorySuggestions.value.length + index
const getGenericIndex = (index: number) => productSuggestions.value.length + categorySuggestions.value.length + tagSuggestions.value.length + index

// Nettoyage du timeout
onUnmounted(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})
</script>

