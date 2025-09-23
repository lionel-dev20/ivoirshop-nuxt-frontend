<template>
  <div class="md:hidden">
    <!-- Bouton de recherche mobile -->
    <button
      @click="showMobileSearch = true"
      class="p-2 text-gray-400 hover:text-gray-500 transition-colors"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>

    <!-- Overlay de recherche mobile -->
    <div
      v-if="showMobileSearch"
      class="fixed inset-0 z-50 bg-black bg-opacity-50"
      @click="showMobileSearch = false"
    >
      <div
        class="bg-white p-4 mx-4 mt-20 rounded-lg shadow-lg"
        @click.stop
      >
        <div class="flex items-center space-x-3 mb-4">
          <div class="flex-1">
            <SearchBox @search="handleSearch" />
          </div>
          <button
            @click="showMobileSearch = false"
            class="p-2 text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Suggestions rapides -->
        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-gray-700 mb-2">Recherches populaires</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="term in popularSearches"
              :key="term"
              @click="searchTerm(term)"
              class="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              {{ term }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showMobileSearch = ref(false)

// Recherches populaires
const popularSearches = [
  'Téléphones',
  'Vêtements',
  'Chaussures',
  'Électronique',
  'Maison',
  'Sport'
]

// Gestion de la recherche
const handleSearch = (query: string) => {
  showMobileSearch.value = false
  router.push(`/recherche?q=${encodeURIComponent(query)}`)
}

const searchTerm = (term: string) => {
  handleSearch(term)
}
</script>
