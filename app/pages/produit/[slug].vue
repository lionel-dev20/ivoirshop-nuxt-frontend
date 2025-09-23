<!-- pages/produit/[slug].vue -->
<template>
  <div class="max-w-[1440px] mx-auto p-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-lg text-gray-600">Chargement du produit...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-16">
      <div class="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
        <h2 class="text-xl font-semibold text-red-800 mb-2">Produit non trouvé</h2>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <NuxtLink to="/categories" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
          Retour aux catégories
        </NuxtLink>
      </div>
    </div>

    <!-- Product Content -->
    <div v-else-if="product">
      <!-- Breadcrumb -->
      <nav class="mb-8">
        <ol class="flex items-center space-x-2 text-sm text-gray-500">
          <li><NuxtLink to="/" class="hover:text-gray-700">Accueil</NuxtLink></li>
          <!-- <li class="before:content-['>'] before:mx-2">
            <NuxtLink to="/categories" class="hover:text-gray-700">Catégories</NuxtLink>
          </li> -->
          <li v-for="category in product.categories" :key="category.id" class="before:content-['>'] before:mx-2">
            <NuxtLink :to="`/categorie/${category.slug}`" class="hover:text-gray-700">
              {{ category.name }}
            </NuxtLink>
          </li>
          <li class="before:content-['>'] before:mx-2 text-gray-900">{{ product.name }}</li>
        </ol>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <!-- Images du produit -->
        <div class="space-y-4">
          <!-- Image principale -->
          <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              v-if="selectedImage"
              :src="selectedImage.src"
              :alt="selectedImage.alt || product.name"
              class="w-full h-full object-cover cursor-zoom-in p-8 bg-white"
              @click="openLightbox"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <span>Aucune image</span>
            </div>
          </div>

          <!-- Miniatures -->
          <div v-if="product.images && product.images.length > 1" class="flex space-x-2 overflow-x-auto pb-2">
            <button
              v-for="(image, index) in product.images"
              :key="image.id"
              @click="selectedImageIndex = index"
              :class="[
                'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
                selectedImageIndex === index ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <img :src="image.src" :alt="image.alt" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Informations du produit -->
        <div class="space-y-6 rounded-md bg-white border border-gray-50 shadow shadow-gray-100 md:p-8">
          <div>
            <h1 class="text-[18px] font-bold text-gray-700 mb-2">{{ product.name }}</h1>
            
            <!-- Évaluation -->
            <div v-if="product.rating_count > 0" class="flex items-baseline mb-4">
              <div class="flex items-center">
                <span v-for="n in 5" :key="n" class="text-yellow-400">
                  {{ n <= Math.floor(product.rating_average) ? '★' : '☆' }}
                </span>
              </div>
              <span class="ml-2 text-sm text-gray-600">
                ({{ product.rating_count }} avis)
              </span>
            </div>
          </div>

          <!-- Prix -->
          <div class="space-y-2">
            <div v-if="product.on_sale" class="flex items-center space-x-3">
              <span class="text-2xl font-bold text-gray-800">
                {{ formatPrice(product.sale_price) }}
              </span>
              <span class="text-lg text-gray-500 line-through">
                {{ formatPrice(product.regular_price) }}
              </span>
              <span class="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                -{{ Math.round((1 - product.sale_price / product.regular_price) * 100) }}%
              </span>
            </div>
            <div v-else>
              <span class="text-3xl font-bold text-gray-900">
                {{ formatPrice(product.price) }}
              </span>
            </div>
          </div>

          <!-- Description courte -->
          <div v-if="product.short_description" class="prose max-w-none">
            <div v-html="product.short_description"></div>
          </div>

          <!-- Stock et disponibilité -->
          <div class="flex items-center space-x-4">
            <span
              :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                getStockStatusClass(product.stock_status)
              ]"
            >
              {{ getStockStatusText(product.stock_status) }}
            </span>
            <span v-if="product.sku" class="text-sm text-gray-500">
              SKU: {{ product.sku }}
            </span>
          </div>

          <!-- Attributs du produit -->
          <div v-if="visibleAttributes.length > 0" class="space-y-3">
            <h3 class="font-semibold text-gray-900">Caractéristiques</h3>
            <dl class="grid grid-cols-1 gap-2">
              <div v-for="attribute in visibleAttributes" :key="attribute.slug" class="flex">
                <dt class="font-medium text-gray-700 w-1/3">{{ attribute.name }}:</dt>
                <dd class="text-gray-600">{{ Array.isArray(attribute.values) ? attribute.values.join(', ') : attribute.values }}</dd>
              </div>
            </dl>
          </div>

          <!-- Actions -->
          <div class="space-y-4 pt-6 border-t">
            <div class="flex items-center space-x-4">
              <div class="flex items-center">
                <label for="quantity" class="block text-sm font-medium text-gray-700 mr-2">
                  Quantité:
                </label>
                <input
                  id="quantity"
                  v-model.number="quantity"
                  type="number"
                  min="1"
                  :max="product.stock_quantity || 999"
                  class="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <button
              v-if="product.in_stock"
              @click="addToCart"
              class="w-full bg-[#ff9900] hover:bg-[#ff9900]/80 text-white font-semibold py-3 px-6 rounded-[4px] transition-colors flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 21v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2"></path>
              </svg>
              <span>Ajouter au panier</span>
            </button>
            <button
              v-else
              disabled
              class="w-full bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg cursor-not-allowed"
            >
              Produit indisponible
            </button>
          </div>

          <!-- Informations additionnelles -->
          <div class="text-sm text-gray-600   space-y-1 pt-4 border-t">
            <p v-if="product.weight">Poids: {{ product.weight }}g</p>
            <p v-if="product.dimensions.length">
              Dimensions: {{ product.dimensions.length }} × {{ product.dimensions.width }} × {{ product.dimensions.height }} cm
            </p>
            <div v-if="product.categories.length > 0">
              <span class="font-medium">Catégories:</span>
              <span v-for="(category, index) in product.categories" :key="category.id">
                <NuxtLink :to="`/categorie/${category.slug}`" class="text-blue-600 hover:text-blue-800">
                  {{ category.name }}
                </NuxtLink>
                <span v-if="index < product.categories.length - 1">, </span>
              </span>
            </div>
            <div v-if="product.tags && product.tags.length > 0">
              <span class="font-medium">Tags:</span>
              <span class="ml-1">
                <span
                  v-for="(tag, index) in product.tags"
                  :key="tag.id"
                  class="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-1 mb-1"
                >
                  {{ tag.name }}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Description détaillée -->
      <div v-if="product.description" class="mb-16 bg-white border border-gray-100 shadow-md shadow-gray-100 md:p-8 rounded-sm">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Description</h2>
        <div class="prose max-w-none">
          <div v-html="product.description"></div>
        </div>
      </div>

      <!-- Produits associés -->
      <div v-if="relatedProducts.length > 0" class="mb-16">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Produits similaires</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div
            v-for="relatedProduct in relatedProducts"
            :key="relatedProduct.id"
            class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <NuxtLink :to="`/produit/${relatedProduct.slug}`">
              <div class="aspect-square bg-gray-100">
                <img
                  v-if="relatedProduct.image"
                  :src="relatedProduct.image.src"
                  :alt="relatedProduct.image.alt || relatedProduct.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                  <span>Aucune image</span>
                </div>
              </div>
              <div class="p-4">
                <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">{{ relatedProduct.name }}</h3>
                <div class="flex items-center justify-between">
                  <span v-if="relatedProduct.sale_price" class="text-red-600 font-bold">
                    {{ formatPrice(relatedProduct.sale_price) }}
                  </span>
                  <span
                    :class="relatedProduct.sale_price ? 'line-through text-gray-500 text-sm' : 'text-gray-700 font-semibold'"
                  >
                    {{ formatPrice(relatedProduct.regular_price || relatedProduct.price) }}
                  </span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox pour les images -->
    <div
      v-if="lightboxOpen"
      class="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
      @click="closeLightbox"
    >
      <div class="relative max-w-4xl max-h-full">
        <img
          :src="selectedImage?.src"
          :alt="selectedImage?.alt"
          class="max-w-full max-h-full object-contain"
        />
        <button
          @click="closeLightbox"
          class="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full w-10 h-10 flex items-center justify-center"
        >
          ✕
        </button>
        
        <!-- Navigation des images -->
        <button
          v-if="product.images.length > 1 && selectedImageIndex > 0"
          @click.stop="selectedImageIndex--"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full w-12 h-12 flex items-center justify-center"
        >
          ‹
        </button>
        <button
          v-if="product.images.length > 1 && selectedImageIndex < product.images.length - 1"
          @click.stop="selectedImageIndex++"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full w-12 h-12 flex items-center justify-center"
        >
          ›
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const productSlug = route.params.slug as string

// Données du produit avec cache
const { data, pending: loading, error: fetchError } = await useLazyFetch(`/api/woocommerce/product/${productSlug}`, {
  key: `product-${productSlug}`,
  server: true,
  default: () => ({ product: null, relatedProducts: [], categories: [] })
})

const product = computed(() => data.value?.product)
const relatedProducts = computed(() => data.value?.relatedProducts || [])
const error = computed(() => fetchError.value?.data?.message || fetchError.value?.message)

// État local
const quantity = ref(1)
const selectedImageIndex = ref(0)
const lightboxOpen = ref(false)


// SEO Meta
useSeoMeta({
  title: () => product.value ? `${product.value.name} - Ma Boutique` : 'Produit - Ma Boutique',
  ogTitle: () => product.value?.name,
  description: () => product.value?.short_description?.replace(/<[^>]*>/g, ''),
  ogDescription: () => product.value?.short_description?.replace(/<[^>]*>/g, ''),
  ogImage: () => product.value?.images?.[0]?.src
})


// Images
const selectedImage = computed(() => {
  return product.value?.images?.[selectedImageIndex.value] || null
})

// Attributs visibles
const visibleAttributes = computed(() => {
  return product.value?.attributes?.filter(attr => attr.visible) || []
})

// Formatage du prix
const formatPrice = (price: string | number) => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price

  return new Intl.NumberFormat("en-US",  {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice) + " FCFA"
}

const getStockStatusClass = (status: string) => {
  switch (status) {
    case 'instock':
      return 'bg-green-100 text-green-800'
    case 'outofstock':
      return 'bg-red-100 text-red-800'
    case 'onbackorder':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStockStatusText = (status: string) => {
  switch (status) {
    case 'instock':
      return 'En stock'
    case 'outofstock':
      return 'Rupture de stock'
    case 'onbackorder':
      return 'Sur commande'
    default:
      return status
  }
}

// Actions
const addToCart = () => {
  if (!product.value) return
  
  const cartStore = useCartStore()
  cartStore.addItem(product.value, quantity.value)
  cartStore.openCart()
  
  // Feedback visuel
  console.log(`Ajout au panier: ${product.value.name}, quantité: ${quantity.value}`)
}

const openLightbox = () => {
  lightboxOpen.value = true
}

const closeLightbox = () => {
  lightboxOpen.value = false
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.prose {
  color: #374151;
}

.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  color: #111827;
  font-weight: 600;
}

.prose p {
  margin-bottom: 1rem;
}

.prose ul, .prose ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.prose li {
  margin-bottom: 0.25rem;
}
</style>