<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Test de la catégorie Clothing</h1>
    
    <!-- Test des catégories -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Liste des catégories disponibles :</h2>
      <div v-if="categoriesLoading" class="text-blue-600">Chargement des catégories...</div>
      <div v-else-if="categoriesError" class="text-red-600">Erreur: {{ categoriesError }}</div>
      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="p-4 border rounded-lg hover:bg-gray-50"
          :class="{ 'bg-blue-100 border-blue-500': category.slug === 'clothing' }"
        >
          <h3 class="font-medium">{{ category.name }}</h3>
          <p class="text-sm text-gray-600">Slug: {{ category.slug }}</p>
          <p class="text-sm text-gray-600">ID: {{ category.id }}</p>
          <p class="text-sm text-gray-600">Produits: {{ category.count || 0 }}</p>
        </div>
      </div>
    </div>

    <!-- Test du composant Nouveaute pour Clothing -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Test du composant Nouveaute pour Clothing :</h2>
      <Nouveaute 
        category-slug="clothing"
        :grid-columns="3"
        :products-per-page="6"
      />
    </div>

    <!-- Test direct des produits de Clothing -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Test direct des produits Clothing :</h2>
      <div v-if="productsLoading" class="text-blue-600">Chargement des produits...</div>
      <div v-else-if="productsError" class="text-red-600">Erreur: {{ productsError }}</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          v-for="product in clothingProducts" 
          :key="product.id"
          class="p-4 border rounded-lg hover:shadow-md"
        >
          <h3 class="font-medium">{{ product.name }}</h3>
          <p class="text-sm text-gray-600">Prix: {{ formatPrice(product.price) }}</p>
          <p class="text-sm text-gray-600">Stock: {{ product.stock_status }}</p>
          <p class="text-sm text-gray-600">En vente: {{ product.on_sale ? 'Oui' : 'Non' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Test des catégories
const { data: categories, pending: categoriesLoading, error: categoriesError } = await useLazyFetch('/api/api/v1/categories')

// Test des produits de la catégorie Clothing
const clothingCategory = computed(() => {
  if (!categories.value) return null
  return categories.value.find(cat => cat.slug === 'clothing')
})

const { data: clothingProductsData, pending: productsLoading, error: productsError } = await useLazyFetch(
  () => clothingCategory.value ? `/api/api/v1/products/category/${clothingCategory.value.id}` : null
)

// Extraire les produits de la réponse
const clothingProducts = computed(() => {
  return clothingProductsData.value?.products || []
})

const formatPrice = (price) => {
  if (!price) return 'Prix non disponible'
  const numericPrice = parseFloat(price)
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(numericPrice)
}

// SEO
useHead({
  title: 'Test Catégorie Clothing - Ivoir Shop',
  meta: [
    { name: 'description', content: 'Test de la catégorie Clothing dans Ivoir Shop' }
  ]
})
</script>
