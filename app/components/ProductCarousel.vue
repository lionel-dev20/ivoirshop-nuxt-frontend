<!-- components/ProductCarousel.vue -->
<template>
  <div class="product-carousel-container">
    <!-- Header du carousel -->
    <div class="carousel-header" :class="headerBackgroundColor + ' px-2 py-1.5 lg:px-6 lg:py-3 p-2 border border-gray-100 rounded-sm shadow shadow-gray-100'">
      <h2 class="carousel-title" :class="headerColor">{{ title }}</h2>

      <button
        v-if="showViewAllButton"
        @click="viewAllProducts"
        class="view-all-button"
        :class="{ active: isViewingAll }"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        {{ isViewingAll ? 'Pagination' : 'Voir tout' }}
      </button>


      <div class="carousel-navigation">
        <button 
          @click="slidePrev" 
          :class="`nav-button nav-button-prev-${uniqueId} `"
          :disabled="swiper?.isBeginning"
        >
          <svg class="w-5 h-5" :class="navigationColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          @click="slideNext" 
          :class="`nav-button nav-button-next-${uniqueId}`"
          :disabled="swiper?.isEnd"
        >
          <svg class="w-5 h-5" :class="navigationColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex flex-col md:flex-row gap-3">
      <!-- Banner Image (visible on desktop left, on mobile above products) -->
      <div v-if="bannerImageUrl" class="md:w-1/4 w-full h-48 md:h-auto overflow-hidden rounded-md">
        <img :src="bannerImageUrl" alt="Promotion Banner" class="w-full h-full object-cover">
      </div>

      <!-- Swiper Container - Products (visible on desktop right, on mobile below banner) -->
      <div class="swiper-products-wrapper" :class="bannerImageUrl ? 'md:w-3/4' : 'w-full'">
        <div 
          ref="swiperContainer"
          class="swiper"
          :class="{ 'swiper-initialized': swiperInitialized }"
        >
          <div class="swiper-wrapper">
            <div 
              v-for="product in products" 
              :key="product.id"
              class="swiper-slide"
            >
              <ProductCard
                :product="product"
                :show-category="false"
                card-style="compact"
                @add-to-cart="handleAddToCart"
                @product-click="handleProductClick"
                @quick-view="handleQuickView"
                @wishlist-toggle="handleWishlistToggle"
                @image-loaded="handleImageLoaded"
              />
            </div>
          </div>
          
          <!-- Pagination dots -->
          <!-- <div :class="`swiper-pagination swiper-pagination-${uniqueId}`"></div> -->
        </div>
      </div>
    </div>
    
    <!-- Debug info -->
    <!-- <div v-if="!pending && !error" class="debug-info text-xs text-gray-500 mb-2">
      <div>Produits chargés: {{ products.length }}</div>
      <div>Catégorie: {{ props.categorySlug || props.categoryId || 'Aucune' }}</div>
    </div> -->

    <!-- État d'erreur -->
    <div v-if="error" class="error-state">
      <div class="error-card">
        <div class="error-icon">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3>Erreur de chargement</h3>
        <p>{{ error.message || 'Une erreur est survenue lors du chargement des produits.' }}</p>
        <div v-if="error.statusCode" class="text-sm text-red-500 mt-2">
          Code d'erreur: {{ error.statusCode }}
        </div>
        <button @click="refreshProducts" class="retry-button">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Réessayer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { Swiper } from 'swiper'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Props
interface Props {
  title?: string
  categoryId?: number
  categorySlug?: string
  maxProducts?: number
  autoplay?: boolean
  autoplayDelay?: number
  showPagination?: boolean
  showNavigation?: boolean
  headerBackgroundColor?: string // Nouvelle prop
  navigationColor?: string // Nouvelle prop
  headerColor?: string // Nouvelle prop
  bannerImageUrl?: string // Nouvelle prop
  gridColumns?: number // Nouvelle prop
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Produits recommandés',
  maxProducts: 20,
  autoplay: false,
  autoplayDelay: 3000,
  showPagination: true,
  showNavigation: true,
  headerBackgroundColor: 'bg-white', // Valeur par défaut
  navigationColor: 'text-gray-900', // Valeur par défaut
  headerColor: 'text-gray-900', // Valeur par défaut
  bannerImageUrl: '', // Valeur par défaut
  gridColumns: 4 // Valeur par défaut
})

// Emits
const emit = defineEmits<{
  addToCart: [product: any]
  productClick: [product: any]
  quickView: [product: any]
  wishlistToggle: [product: any]
}>()

// État réactif
const swiperContainer = ref<HTMLElement | null>(null)
const swiper = ref<Swiper | null>(null)
const swiperInitialized = ref(false)
const pending = ref(false)
const error = ref<any>(null)
const products = ref<any[]>([])

// ID unique pour isoler les carousels
const uniqueId = Math.random().toString(36).substr(2, 9)

// Compteur d'images chargées
const loadedImagesCount = ref(0)
const totalImagesCount = ref(0)

// Configuration Swiper
const swiperModules = [Navigation, Pagination]
// Temporairement désactivé pour éviter les erreurs d'import
// if (props.autoplay) {
//   swiperModules.push(Autoplay)
// }

// Fonctions
const initSwiper = () => {
  if (!swiperContainer.value) return

  swiper.value = new Swiper(swiperContainer.value, {
    modules: swiperModules,
    slidesPerView: 1,
    spaceBetween: 6,
    loop: false,
    grabCursor: true,
    
    // Configuration de base
    
    // Responsive breakpoints
    breakpoints: {
      360: {
        slidesPerView: 1.98,
        spaceBetween: 6,
      },
      480: {
        slidesPerView: 2.25,
        spaceBetween: 6,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 6,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 6,
      },
      1024: {
        slidesPerView: props.gridColumns > 4 ? 4 : props.gridColumns,
        spaceBetween: 12,
      },
      1280: {
        slidesPerView: props.gridColumns,
        spaceBetween: 12,
      }
    },

    // Navigation
    navigation: {
      nextEl: `.nav-button-next-${uniqueId}`,
      prevEl: `.nav-button-prev-${uniqueId}`,
      disabledClass: 'nav-button-disabled'
    },

    // Pagination
    pagination: {
      el: `.swiper-pagination-${uniqueId}`,
      clickable: true,
      dynamicBullets: true
    },

    // Autoplay
    autoplay: props.autoplay ? {
      delay: props.autoplayDelay,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    } : false,

    // Effets
    effect: 'slide',
    speed: 600,

    // Événements
    on: {
      init: () => {
        swiperInitialized.value = true
      },
      slideChange: () => {
        // Événement personnalisé si nécessaire
      },
      resize: () => {
        if (swiper.value) {
          swiper.value.update()
        }
      }
    }
  })
}

const slideNext = () => {
  if (swiper.value) {
    swiper.value.slideNext()
  }
}

const slidePrev = () => {
  if (swiper.value) {
    swiper.value.slidePrev()
  }
}

const loadProducts = async () => {
  if (!props.categoryId && !props.categorySlug) {
    // Charger des produits génériques si aucune catégorie spécifiée
    await loadGenericProducts()
    return
  }

  pending.value = true
  error.value = null

  try {
    // Utiliser l'API WordPress principale
    let apiUrl = '/api/wordpress/category-products'
    
    if (props.categoryId) {
      apiUrl += `?category_id=${props.categoryId}`
    } else if (props.categorySlug) {
      // Validation du categorySlug
      if (!props.categorySlug.trim()) {
        throw new Error('Category slug cannot be empty')
      }
      apiUrl += `?categorySlug=${encodeURIComponent(props.categorySlug)}`
    }

    const response = await $fetch(apiUrl) as any
    
    // Gérer la réponse selon le format de l'API
    if (response?.products && Array.isArray(response.products)) {
      products.value = response.products.slice(0, props.maxProducts)
    } else if (response && Array.isArray(response)) {
      // Si l'API retourne directement un tableau de produits
      products.value = response.slice(0, props.maxProducts)
    } else {
      console.warn('Format de réponse API inattendu:', response)
      products.value = []
    }
    
    // Initialiser le compteur d'images
    totalImagesCount.value = products.value.length
    loadedImagesCount.value = 0
  } catch (err: any) {
    console.error('Erreur lors du chargement des produits:', err)
    error.value = {
      message: err.message || 'Une erreur est survenue lors du chargement des produits.',
      statusCode: err.statusCode || 500
    }
    products.value = []
  } finally {
    pending.value = false
  }
}

const loadGenericProducts = async () => {
  pending.value = true
  error.value = null

  try {
    const response = await $fetch('/api/wordpress/homepage-products') as any
    
    // Gérer la réponse selon le format de l'API
    if (response?.hero_products && Array.isArray(response.hero_products)) {
      products.value = response.hero_products.slice(0, props.maxProducts)
    } else if (response?.products && Array.isArray(response.products)) {
      products.value = response.products.slice(0, props.maxProducts)
    } else if (response && Array.isArray(response)) {
      products.value = response.slice(0, props.maxProducts)
    } else {
      console.warn('Format de réponse API inattendu pour les produits génériques:', response)
      products.value = []
    }
  } catch (err: any) {
    console.error('Erreur lors du chargement des produits génériques:', err)
    error.value = {
      message: err.message || 'Une erreur est survenue lors du chargement des produits.',
      statusCode: err.statusCode || 500
    }
    products.value = []
  } finally {
    pending.value = false
  }
}

const refreshProducts = () => {
  loadProducts()
}

// Gestionnaires d'événements
const handleAddToCart = (product: any) => {
  emit('addToCart', product)
}

const handleProductClick = (product: any) => {
  emit('productClick', product)
}

const handleQuickView = (product: any) => {
  emit('quickView', product)
}

const handleWishlistToggle = (product: any) => {
  emit('wishlistToggle', product)
}

// Gestion du chargement d'images
const handleImageLoaded = () => {
  loadedImagesCount.value++
  
  // Mettre à jour Swiper si toutes les images sont chargées
  if (loadedImagesCount.value >= totalImagesCount.value && swiper.value && swiperInitialized.value) {
    setTimeout(() => {
      swiper.value?.update()
    }, 50)
  }
}

// Lifecycle
onMounted(async () => {
  await loadProducts()
  await nextTick()
  
  // Attendre un peu plus pour que les images se chargent
  setTimeout(() => {
    initSwiper()
  }, 100)
})

onUnmounted(() => {
  if (swiper.value) {
    swiper.value.destroy(true, true)
  }
})

// Watchers
watch(() => products.value, () => {
  if (swiper.value && swiperInitialized.value) {
    swiper.value.update()
  }
}, { deep: true })

watch(() => props.categoryId, () => {
  loadProducts()
})

watch(() => props.categorySlug, () => {
  loadProducts()
})
</script>

<style scoped>
 @reference "~/assets/css/tailwind.css";
 .product-carousel-container {
  @apply w-full;
}

.carousel-header {
  @apply flex items-center justify-between md:mb-3 mb-1;
}

.carousel-title {
  @apply md:text-2xl text-base font-bold mb-0 text-left flex-1;
}

.carousel-navigation {
  @apply flex items-center space-x-2;
}

.nav-button {
  @apply w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}

.nav-button-disabled {
  @apply opacity-50 cursor-not-allowed;
}

.swiper-container {
  @apply relative;
}

.swiper {
  @apply overflow-hidden;
}

.swiper-wrapper {
  @apply flex;
}

.swiper-slide {
  @apply flex-shrink-0;
}

.swiper-pagination {
  @apply mt-6 flex justify-center;
}

.swiper-pagination-bullet {
  @apply w-2 h-2 bg-gray-300 rounded-full mx-1 cursor-pointer transition-colors;
}

.swiper-pagination-bullet-active {
  @apply bg-[#ff9900];
}

/* États de chargement */
.loading-state {
  @apply py-8;
}

.skeleton-carousel {
  @apply flex space-x-4 overflow-hidden;
}

.skeleton-slide {
  @apply flex-shrink-0 w-64 bg-white rounded-lg shadow-sm p-4;
}

.skeleton-product-image {
  @apply w-full h-48 bg-gray-200 rounded-lg mb-4 animate-pulse;
}

.skeleton-product-content {
  @apply space-y-2;
}

.skeleton-line {
  @apply bg-gray-200 rounded animate-pulse;
}

.skeleton-product-title {
  @apply h-4 w-3/4;
}

.skeleton-product-price {
  @apply h-4 w-1/2;
}

/* État d'erreur */
.error-state {
  @apply py-8;
}

.error-card {
  @apply text-center py-12 px-6 bg-red-50 rounded-lg border border-red-200;
}

.error-icon {
  @apply flex justify-center mb-4;
}

.error-card h3 {
  @apply text-lg font-semibold text-red-800 mb-2;
}

.error-card p {
  @apply text-red-600 mb-4;
}

.retry-button {
  @apply inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors;
}

/* Responsive */
@media (max-width: 640px) {
  .carousel-header {
    @apply flex-row items-center justify-between gap-2;
  }
  
  .carousel-title {
    @apply text-left text-sm;
  }
  
  .carousel-navigation {
    @apply flex-shrink-0 space-x-1;
  }
  
  .nav-button {
    @apply w-7 h-7;
  }
  
  .nav-button svg {
    @apply w-4 h-4;
  }
}


.carousel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.view-all-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid currentColor;
  border-radius: 0.375rem;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.view-all-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.view-all-button.active {
  background: rgba(255, 255, 255, 0.2);
}
</style>
