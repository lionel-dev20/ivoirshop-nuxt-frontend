<template>
  <div class="py-12 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Titre de la section -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          Découvrez nos catégories
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Explorez notre large gamme de produits organisés par catégories
        </p>
      </div>

      <!-- Grille des blocs de catégories -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Skeleton de chargement -->
        <div v-if="pending" v-for="n in 6" :key="`skeleton-${n}`" class="bg-white rounded-lg shadow-md overflow-hidden">
          <!-- Skeleton image de catégorie -->
          <div class="h-48 bg-gray-200 animate-pulse"></div>
          
          <!-- Skeleton contenu -->
          <div class="p-6">
            <div class="animate-pulse">
              <div class="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div class="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>

        <!-- Contenu réel -->
        <div 
          v-else
          v-for="category in categories" 
          :key="category.id"
          class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
        >
          <!-- Image de la catégorie -->
          <div class="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
            <img 
              v-if="category.image" 
              :src="category.image" 
              :alt="category.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <div class="text-white text-6xl font-bold opacity-50">
                {{ category.name.charAt(0) }}
              </div>
            </div>
            
            <!-- Overlay avec nombre de produits -->
            <div class="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-3 py-1">
              <span class="text-sm font-medium text-gray-700">
                {{ category.count }} produits
              </span>
            </div>
          </div>

          <!-- Contenu de la catégorie -->
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {{ category.name }}
            </h3>
            
            <p v-if="category.description" class="text-gray-600 text-sm mb-4 line-clamp-2">
              {{ category.description }}
            </p>

            <!-- Bouton d'action -->
            <NuxtLink 
              :to="`/categorie/${category.slug}`"
              class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm group-hover:underline"
            >
              Voir les produits
              <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Bouton "Voir toutes les catégories" -->
      <div class="text-center mt-12">
        <NuxtLink 
          to="/categorie"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Voir toutes les catégories
          <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image?: string
  count: number
}

// Récupération des catégories depuis l'API
const { data: categories, pending, error } = await useFetch<Category[]>('/api/wordpress/categories', {
  default: () => [],
  server: false
})

// Catégories de fallback si pas de données
const fallbackCategories: Category[] = [
 
]

// Utiliser les catégories WordPress ou le fallback
const displayCategories = computed(() => {
  if (categories.value && categories.value.length > 0) {
    return categories.value.slice(0, 6) // Limiter à 6 catégories
  }
  return fallbackCategories
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
