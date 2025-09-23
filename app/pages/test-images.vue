<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Test des Images de Produits</h1>
    
    <!-- Test des catégories -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Sélectionner une catégorie :</h2>
      <div v-if="categoriesLoading" class="text-blue-600">Chargement des catégories...</div>
      <div v-else-if="categoriesError" class="text-red-600">Erreur: {{ categoriesError }}</div>
      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="selectCategory(category)"
          :class="[
            'p-3 border rounded-lg hover:bg-gray-50 transition',
            selectedCategory?.id === category.id ? 'bg-blue-100 border-blue-500' : 'border-gray-200'
          ]"
        >
          <h3 class="font-medium">{{ category.name }}</h3>
          <p class="text-sm text-gray-600">Produits: {{ category.count || 0 }}</p>
        </button>
      </div>
    </div>

    <!-- Test des produits avec images -->
    <div v-if="selectedCategory">
      <h2 class="text-xl font-semibold mb-4">Produits de la catégorie {{ selectedCategory.name }} :</h2>
      
      <div v-if="productsLoading" class="text-blue-600">Chargement des produits...</div>
      <div v-else-if="productsError" class="text-red-600">Erreur: {{ productsError }}</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="product in products" 
          :key="product.id"
          class="border rounded-lg p-4"
        >
          <h3 class="font-medium mb-2">{{ product.name }}</h3>
          
          <!-- Test d'image -->
          <div class="mb-3">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Image principale :</h4>
            <img
              :src="getProductImage(product)"
              :alt="product.name"
              class="w-full h-32 object-cover rounded border"
              @error="handleImageError"
              @load="handleImageLoad"
            />
            <p class="text-xs text-gray-500 mt-1">
              Source: {{ getProductImage(product) }}
            </p>
          </div>
          
          <!-- Informations du produit -->
          <div class="text-sm space-y-1">
            <p><strong>ID:</strong> {{ product.id }}</p>
            <p><strong>Slug:</strong> {{ product.slug }}</p>
            <p><strong>Prix:</strong> {{ product.regular_price }}€</p>
            <p v-if="product.sale_price"><strong>Prix promo:</strong> {{ product.sale_price }}FCFA</p>
            <p><strong>Stock:</strong> {{ product.stock_status }}</p>
            <p><strong>Images:</strong> {{ product.images?.length || 0 }}</p>
          </div>
          
          <!-- Test du composant ProductCard -->
          <div class="mt-4 border-t pt-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Composant ProductCard :</h4>
            <ProductCard :product="product" />
          </div>
        </div>
      </div>
    </div>

    <!-- Instructions -->
    <div class="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <h3 class="font-medium text-yellow-900 mb-2">Instructions de test :</h3>
      <ul class="text-sm text-yellow-800 space-y-1">
        <li>1. Sélectionnez une catégorie pour voir ses produits</li>
        <li>2. Vérifiez que les images s'affichent correctement</li>
        <li>3. Vérifiez que le composant ProductCard fonctionne</li>
        <li>4. Regardez la console pour les erreurs d'images</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// Récupérer les catégories
const { data: categories, pending: categoriesLoading, error: categoriesError } = await useLazyFetch('/api/api/v1/categories')

// État réactif
const selectedCategory = ref(null)
const products = ref([])
const productsLoading = ref(false)
const productsError = ref(null)

// Sélectionner une catégorie
const selectCategory = async (category) => {
  selectedCategory.value = category
  productsLoading.value = true
  productsError.value = null
  
  try {
    const response = await $fetch(`/api/api/v1/products/category/${category.id}`)
    products.value = response.products || []
  } catch (error) {
    productsError.value = error.message
    console.error('Erreur lors du chargement des produits:', error)
  } finally {
    productsLoading.value = false
  }
}

// Récupérer l'image du produit
const getProductImage = (product) => {
  if (product.images && product.images.length > 0) {
    return product.images[0].src
  }
  return '/images/placeholder-product.jpg'
}

// Gestion d'erreur d'image
const handleImageError = (event) => {
  console.error('Erreur de chargement d\'image:', event.target.src)
  event.target.src = '/images/placeholder-product.jpg'
}

// Gestion de chargement d'image
const handleImageLoad = (event) => {
  console.log('Image chargée avec succès:', event.target.src)
}

// SEO
useHead({
  title: 'Test Images Produits - Ivoir Shop',
  meta: [
    { name: 'description', content: 'Test des images de produits dans Ivoir Shop' }
  ]
})
</script>
