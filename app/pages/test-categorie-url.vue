<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Test des URLs /categorie/slug</h1>
    
    <!-- Test des catégories -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Catégories disponibles :</h2>
      <div v-if="categoriesLoading" class="text-blue-600">Chargement des catégories...</div>
      <div v-else-if="categoriesError" class="text-red-600">Erreur: {{ categoriesError }}</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="p-4 border rounded-lg hover:bg-gray-50"
        >
          <h3 class="font-medium">{{ category.name }}</h3>
          <p class="text-sm text-gray-600">Slug: {{ category.slug }}</p>
          <p class="text-sm text-gray-600">Produits: {{ category.count || 0 }}</p>
          
          <!-- Liens de test -->
          <div class="mt-3 space-y-2">
            <NuxtLink 
              :to="`/categorie/${category.slug}`"
              class="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Voir page /categorie/{{ category.slug }}
            </NuxtLink>
            
            <a 
              :href="`/api/woocommerce/category/${category.slug}`"
              target="_blank"
              class="inline-block bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 ml-2"
            >
              API JSON
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Test spécifique pour Clothing -->
    <div v-if="clothingCategory" class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Test spécifique pour Clothing :</h2>
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 class="font-medium text-blue-900">{{ clothingCategory.name }}</h3>
        <p class="text-sm text-blue-700">Slug: {{ clothingCategory.slug }}</p>
        <p class="text-sm text-blue-700">Produits: {{ clothingCategory.count || 0 }}</p>
        
        <div class="mt-4 space-y-2">
          <NuxtLink 
            :to="`/categorie/${clothingCategory.slug}`"
            class="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            🛍️ Voir la page Clothing
          </NuxtLink>
          
          <a 
            :href="`/api/woocommerce/category/${clothingCategory.slug}`"
            target="_blank"
            class="inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 ml-2"
          >
            🔗 API JSON
          </a>
        </div>
      </div>
    </div>

    <!-- Test du composant Nouveaute -->
    <div v-if="clothingCategory" class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Test du composant Nouveaute pour Clothing :</h2>
      <div class="border rounded-lg p-4">
        <Nouveaute 
          :category-id="clothingCategory.id"
          :grid-columns="3"
          :products-per-page="6"
        />
      </div>
    </div>

    <!-- Instructions -->
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <h3 class="font-medium text-yellow-900 mb-2">Instructions de test :</h3>
      <ul class="text-sm text-yellow-800 space-y-1">
        <li>1. Cliquez sur "Voir page /categorie/slug" pour tester l'URL</li>
        <li>2. Cliquez sur "API JSON" pour voir les données brutes</li>
        <li>3. Vérifiez que les produits s'affichent correctement</li>
        <li>4. Testez la navigation entre les pages</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// Test des catégories
const { data: categories, pending: categoriesLoading, error: categoriesError } = await useLazyFetch('/api/api/v1/categories')

// Trouver la catégorie Clothing
const clothingCategory = computed(() => {
  if (!categories.value) return null
  return categories.value.find(cat => cat.slug === 'clothing')
})

// SEO
useHead({
  title: 'Test URLs Catégorie - Ivoir Shop',
  meta: [
    { name: 'description', content: 'Test des URLs /categorie/slug dans Ivoir Shop' }
  ]
})
</script>

