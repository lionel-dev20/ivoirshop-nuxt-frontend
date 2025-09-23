<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Test du composant Nouveaute</h1>
    
    <!-- Test avec différentes catégories -->
    <div class="space-y-8">
      
      <!-- Test 1: Avec un slug -->
      <div>
        <h2 class="text-xl font-semibold mb-4">Test avec slug "clothing"</h2>
        <div class="border rounded-lg p-4">
          <Nouveaute 
            category-slug="clothing"
            :grid-columns="3"
            :products-per-page="6"
          />
        </div>
      </div>

      <!-- Test 2: Avec un ID (si vous connaissez l'ID) -->
      <div v-if="firstCategoryId">
        <h2 class="text-xl font-semibold mb-4">Test avec ID {{ firstCategoryId }}</h2>
        <div class="border rounded-lg p-4">
          <Nouveaute 
            :category-id="firstCategoryId"
            :grid-columns="3"
            :products-per-page="6"
          />
        </div>
      </div>

      <!-- Test 3: Liste des catégories disponibles -->
      <div>
        <h2 class="text-xl font-semibold mb-4">Catégories disponibles</h2>
        <div v-if="categoriesLoading" class="text-blue-600">Chargement...</div>
        <div v-else-if="categoriesError" class="text-red-600">Erreur: {{ categoriesError }}</div>
        <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div 
            v-for="category in categories" 
            :key="category.id"
            class="p-3 border rounded hover:bg-gray-50"
          >
            <h3 class="font-medium">{{ category.name }}</h3>
            <p class="text-sm text-gray-600">Slug: {{ category.slug }}</p>
            <p class="text-sm text-gray-600">ID: {{ category.id }}</p>
            <p class="text-sm text-gray-600">Produits: {{ category.count || 0 }}</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
// Récupérer les catégories pour les tests
const { data: categories, pending: categoriesLoading, error: categoriesError } = await useLazyFetch('/api/api/v1/categories')

// Prendre la première catégorie pour le test avec ID
const firstCategoryId = computed(() => {
  return categories.value?.[0]?.id
})

// SEO
useHead({
  title: 'Test Composant Nouveaute - Ivoir Shop',
  meta: [
    { name: 'description', content: 'Test du composant Nouveaute dans Ivoir Shop' }
  ]
})
</script>
