<template>
  <div class="container mx-auto p-8 max-w-6xl">
    <h1 class="text-3xl font-bold mb-8">🔍 Test des Images</h1>
    
    <!-- Test de l'API d'images -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Test API Images</h2>
      <div class="mb-4">
        <input 
          v-model="testCategory" 
          placeholder="Catégorie à tester (ex: televisions)"
          class="border border-gray-300 px-3 py-2 rounded mr-4"
        />
        <button 
          @click="testImages" 
          :disabled="loading"
          class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {{ loading ? 'Test en cours...' : 'Tester les Images' }}
        </button>
      </div>
      
      <div v-if="imageTestResult" class="mt-4 p-4 rounded" :class="imageTestResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
        <h3 class="font-semibold">{{ imageTestResult.success ? '✅ Images Analysées' : '❌ Erreur' }}</h3>
        <div v-if="imageTestResult.success" class="mt-2">
          <p>Total produits: {{ imageTestResult.totalProducts }}</p>
          <div class="mt-2">
            <p>Avec image directe: {{ imageTestResult.summary.productsWithImage }}</p>
            <p>Avec tableau d'images: {{ imageTestResult.summary.productsWithImagesArray }}</p>
            <p>Avec thumbnail: {{ imageTestResult.summary.productsWithThumbnail }}</p>
            <p>Sans images: {{ imageTestResult.summary.productsWithNoImages }}</p>
          </div>
        </div>
        <details class="mt-2">
          <summary class="cursor-pointer font-medium">Détails complets</summary>
          <pre class="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-96">{{ JSON.stringify(imageTestResult, null, 2) }}</pre>
        </details>
      </div>
    </div>

    <!-- Test du carousel avec images -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Test Carousel avec Images</h2>
      <div class="mb-4">
        <input 
          v-model="carouselCategory" 
          placeholder="Catégorie pour le carousel"
          class="border border-gray-300 px-3 py-2 rounded mr-4"
        />
      </div>
      
      <ProductCarousel 
        v-if="showCarousel"
        :title="`Test Images - ${carouselCategory}`"
        :category-slug="carouselCategory"
        :max-products="5"
        :autoplay="false"
        :show-pagination="true"
        :show-navigation="true"
      />
      
      <button 
        @click="showCarousel = !showCarousel" 
        class="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
      >
        {{ showCarousel ? 'Masquer' : 'Afficher' }} Carousel
      </button>
    </div>

    <!-- Test du composant Nouveaute -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Test Composant Nouveaute</h2>
      <div class="mb-4">
        <input 
          v-model="nouveauteCategory" 
          placeholder="Catégorie pour Nouveaute"
          class="border border-gray-300 px-3 py-2 rounded mr-4"
        />
      </div>
      
      <Nouveaute 
        v-if="showNouveaute"
        :category-slug="nouveauteCategory"
        :grid-columns="4"
        :products-per-page="8"
      />
      
      <button 
        @click="showNouveaute = !showNouveaute" 
        class="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
      >
        {{ showNouveaute ? 'Masquer' : 'Afficher' }} Nouveaute
      </button>
    </div>
  </div>
</template>

<script setup>
import ProductCarousel from '~/components/ProductCarousel.vue'
import Nouveaute from '~/components/collectionHomepage/Nouveaute.vue'

const loading = ref(false)
const imageTestResult = ref(null)
const testCategory = ref('televisions')
const carouselCategory = ref('televisions')
const nouveauteCategory = ref('televisions')
const showCarousel = ref(false)
const showNouveaute = ref(false)

const testImages = async () => {
  loading.value = true
  imageTestResult.value = null
  
  try {
    const response = await $fetch(`/api/debug/test-images?categorySlug=${testCategory.value}`)
    imageTestResult.value = response
  } catch (error) {
    imageTestResult.value = {
      success: false,
      error: error.message,
      message: 'Erreur lors du test des images'
    }
  } finally {
    loading.value = false
  }
}
</script>

