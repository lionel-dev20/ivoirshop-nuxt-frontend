<template>
  <div class="container mx-auto p-8 max-w-4xl">
    <h1 class="text-3xl font-bold mb-8">🔍 Diagnostic de Connexion</h1>
    
    <!-- Test de connexion -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Test de Connexion WordPress</h2>
      <button 
        @click="testConnection" 
        :disabled="loading"
        class="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {{ loading ? 'Test en cours...' : 'Tester la Connexion' }}
      </button>
      
      <div v-if="connectionResult" class="mt-4 p-4 rounded" :class="connectionResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
        <h3 class="font-semibold">{{ connectionResult.success ? '✅ Connexion Réussie' : '❌ Connexion Échouée' }}</h3>
        <p class="mt-2">{{ connectionResult.message }}</p>
        <details v-if="connectionResult.error" class="mt-2">
          <summary class="cursor-pointer font-medium">Détails de l'erreur</summary>
          <pre class="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">{{ JSON.stringify(connectionResult, null, 2) }}</pre>
        </details>
      </div>
    </div>

    <!-- Test des produits -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Test des Produits</h2>
      <div class="mb-4">
        <input 
          v-model="testCategory" 
          placeholder="Catégorie à tester (ex: smartphones)"
          class="border border-gray-300 px-3 py-2 rounded mr-4"
        />
        <button 
          @click="testProducts" 
          :disabled="loadingProducts"
          class="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {{ loadingProducts ? 'Test en cours...' : 'Tester les Produits' }}
        </button>
      </div>
      
      <div v-if="productsResult" class="mt-4 p-4 rounded" :class="productsResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
        <h3 class="font-semibold">{{ productsResult.success ? '✅ Produits Trouvés' : '❌ Aucun Produit' }}</h3>
        <p class="mt-2">Catégorie: {{ productsResult.category || testCategory }}</p>
        <p class="mt-2">Nombre de produits: {{ productsResult.products?.length || 0 }}</p>
        <details class="mt-2">
          <summary class="cursor-pointer font-medium">Détails complets</summary>
          <pre class="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-96">{{ JSON.stringify(productsResult, null, 2) }}</pre>
        </details>
      </div>
    </div>

    <!-- Test du carousel -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Test du Carousel</h2>
      <div class="mb-4">
        <input 
          v-model="carouselCategory" 
          placeholder="Catégorie pour le carousel"
          class="border border-gray-300 px-3 py-2 rounded mr-4"
        />
      </div>
      
      <ProductCarousel 
        v-if="showCarousel"
        :title="`Test - ${carouselCategory}`"
        :category-slug="carouselCategory"
        :max-products="3"
        :autoplay="false"
        :show-pagination="true"
        :show-navigation="true"
      />
      
      <button 
        @click="showCarousel = !showCarousel" 
        class="bg-purple-500 text-white px-6 py-3 rounded hover:bg-purple-600"
      >
        {{ showCarousel ? 'Masquer' : 'Afficher' }} Carousel
      </button>
    </div>
  </div>
</template>

<script setup>
import ProductCarousel from '~/components/ProductCarousel.vue'

const loading = ref(false)
const loadingProducts = ref(false)
const connectionResult = ref(null)
const productsResult = ref(null)
const testCategory = ref('smartphones')
const carouselCategory = ref('smartphones')
const showCarousel = ref(false)

const testConnection = async () => {
  loading.value = true
  connectionResult.value = null
  
  try {
    const response = await $fetch('/api/debug/connection-test')
    connectionResult.value = response
  } catch (error) {
    connectionResult.value = {
      success: false,
      error: error.message,
      message: 'Erreur lors du test de connexion'
    }
  } finally {
    loading.value = false
  }
}

const testProducts = async () => {
  loadingProducts.value = true
  productsResult.value = null
  
  try {
    const response = await $fetch(`/api/wordpress/category-products?categorySlug=${testCategory.value}`)
    productsResult.value = {
      success: true,
      category: testCategory.value,
      ...response
    }
  } catch (error) {
    productsResult.value = {
      success: false,
      error: error.message,
      category: testCategory.value,
      message: 'Erreur lors de la récupération des produits'
    }
  } finally {
    loadingProducts.value = false
  }
}
</script>

