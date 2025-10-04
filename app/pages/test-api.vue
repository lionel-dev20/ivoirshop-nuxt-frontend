<template>
  <div class="container mx-auto p-8">
    <h1 class="text-3xl font-bold mb-8">Test API WordPress</h1>
    
    <!-- Test de configuration -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Configuration</h2>
      <button @click="testConfig" class="bg-blue-500 text-white px-4 py-2 rounded mr-4">
        Tester la Configuration
      </button>
      <div v-if="configResult" class="mt-4 p-4 bg-gray-100 rounded">
        <pre>{{ JSON.stringify(configResult, null, 2) }}</pre>
      </div>
    </div>

    <!-- Test WordPress -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Test WordPress</h2>
      <button @click="testWordPress" class="bg-green-500 text-white px-4 py-2 rounded mr-4">
        Tester WordPress API
      </button>
      <div v-if="wordpressResult" class="mt-4 p-4 bg-gray-100 rounded">
        <pre>{{ JSON.stringify(wordpressResult, null, 2) }}</pre>
      </div>
    </div>

    <!-- Test produits par catégorie -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Test Produits par Catégorie</h2>
      <div class="mb-4">
        <input 
          v-model="testCategory" 
          placeholder="Catégorie à tester (ex: smartphones)"
          class="border border-gray-300 px-3 py-2 rounded mr-4"
        />
        <button @click="testCategoryProducts" class="bg-purple-500 text-white px-4 py-2 rounded">
          Tester les Produits
        </button>
      </div>
      <div v-if="categoryResult" class="mt-4 p-4 bg-gray-100 rounded">
        <pre>{{ JSON.stringify(categoryResult, null, 2) }}</pre>
      </div>
    </div>

    <!-- Test du carousel -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Test ProductCarousel</h2>
      <div class="mb-4">
        <input 
          v-model="carouselCategory" 
          placeholder="Catégorie pour le carousel"
          class="border border-gray-300 px-3 py-2 rounded mr-4"
        />
      </div>
      
      <ProductCarousel 
        v-if="showCarousel"
        :title="`Test Carousel - ${carouselCategory}`"
        :category-slug="carouselCategory"
        :max-products="5"
        :autoplay="false"
        :show-pagination="true"
        :show-navigation="true"
      />
      
      <button @click="showCarousel = !showCarousel" class="bg-orange-500 text-white px-4 py-2 rounded">
        {{ showCarousel ? 'Masquer' : 'Afficher' }} Carousel
      </button>
    </div>
  </div>
</template>

<script setup>
import ProductCarousel from '~/components/ProductCarousel.vue'

const configResult = ref(null)
const wordpressResult = ref(null)
const categoryResult = ref(null)
const testCategory = ref('smartphones')
const carouselCategory = ref('smartphones')
const showCarousel = ref(false)

const testConfig = async () => {
  try {
    const response = await $fetch('/api/debug/config')
    configResult.value = response
  } catch (error) {
    configResult.value = { error: error.message }
  }
}

const testWordPress = async () => {
  try {
    const response = await $fetch('/api/debug/wordpress-test')
    wordpressResult.value = response
  } catch (error) {
    wordpressResult.value = { error: error.message }
  }
}

const testCategoryProducts = async () => {
  try {
    const response = await $fetch(`/api/debug/category-products-test?categorySlug=${testCategory.value}`)
    categoryResult.value = response
  } catch (error) {
    categoryResult.value = { error: error.message }
  }
}
</script>

