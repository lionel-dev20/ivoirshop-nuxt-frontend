<template>
  <div v-if="isVisible" class="countdown-display">
    <div class="countdown-header bg-red-500  px-2 py-1.5 lg:px-5 lg:py-2 p-2 rounded-sm shadow shadow-orange-100 flex justify-between items-center text-white">
      <h2 class="text-md lg:text-lg font-bold flex items-center gap-2">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ title }}
      </h2>
      <div class="flex items-center gap-2">
        <span class="text-sm">Termine dans</span>
        <div class="flex items-center gap-1 font-mono text-lg">
          <span class="bg-white text-gray-800 md:px-5 md:py-2 md:rounded-sm px-2 py-1 rounded-md">{{ formattedCountdown.days }}j</span> :
          <span class="bg-white text-gray-800 md:px-5 md:py-2 md:rounded-sm px-2 py-1 rounded-md">{{ formattedCountdown.hours }}h</span> :
          <span class="bg-white text-gray-800 md:px-5 md:py-2 md:rounded-sm px-2 py-1 rounded-md">{{ formattedCountdown.minutes }}m</span> :
          <span class="bg-white text-gray-800 md:px-5 md:py-2 md:rounded-sm px-2 py-1 rounded-md">{{ formattedCountdown.seconds }}s</span>
        </div>
        <NuxtLink to="/products/flash-sales" class="hidden md:block ml-4 px-4 py-1.5 md:px-5 md:py-3 md:rounded-sm bg-white text-gray-800 rounded-md text-sm font-semibold hover:bg-gray-100 transition-colors">
          Voir Plus
        </NuxtLink>
      </div>
    </div>

    <!-- État d'erreur -->
    <div v-if="error" class="error-container">
      <div class="error-card">
        <div class="error-icon">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3>Erreur de chargement</h3>
        <p>{{ error.message || 'Une erreur est survenue lors du chargement des produits.' }}</p>
        <button @click="refreshProducts" class="retry-button">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Réessayer
        </button>
      </div>
    </div>

    <!-- Grille de produits -->
    <div v-if="productsData?.length > 0 && !error" class="products-section mt-4">
      <div class="products-grid" :class="`grid-${gridColumns}`">
        <ProductCard
          v-for="product in paginatedProducts"
          :key="product.id"
          :product="product"
          :show-category="false"
          :card-style="cardStyle"
          :show-countdown-info="true"
          :countdown-remaining="product.countdownRemaining"
          :countdown-total="product.countdownTotal"
          @add-to-cart="handleAddToCart"
          @product-click="handleProductClick"
          @quick-view="handleQuickView"
          @wishlist-toggle="handleWishlistToggle"
        />
      </div>

      <!-- Pagination (si nécessaire) -->
      <div v-if="totalPages > 1" class="pagination-section">
        <div class="pagination-info">
          Affichage {{ startIndex }}-{{ endIndex }} sur {{ productsData.length }} produits
        </div>
        <div class="pagination-controls">
          <button
            @click="currentPage--"
            :disabled="currentPage <= 1"
            class="pagination-button"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Précédent
          </button>
          <div class="pagination-numbers">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              :class="{ active: page === currentPage }"
              class="pagination-number"
            >
              {{ page }}
            </button>
          </div>
          <button
            @click="currentPage++"
            :disabled="currentPage >= totalPages"
            class="pagination-button"
          >
            Suivant
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- État vide -->
    <div v-else-if="!pending && !error" class="empty-state">
      <div class="empty-content">
        <svg class="w-16 h-16 empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3>Aucun produit disponible</h3>
        <p>Il n'y a pas de produits pour cette promotion actuellement.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  countdownId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  categorySlug: {
    type: String,
    required: true
  },
  endTime: {
    type: String, // ISO 8601 string
    required: true
  },
  gridColumns: {
    type: Number,
    default: 4,
    validator: (value) => [2, 3, 4, 5, 6].includes(value)
  },
  productsPerPage: {
    type: Number,
    default: 12
  },
  cardStyle: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'compact', 'detailed'].includes(value)
  }
})

const productsData = ref([])
const error = ref(null)
const pending = ref(true)
const remainingTime = ref(0)
const countdownInterval = ref(null)
const currentPage = ref(1)

// Fonction pour obtenir une quantité aléatoire pour le compte à rebours
const getRandomQuantity = () => {
  const total = Math.floor(Math.random() * (20 - 10 + 1)) + 10; // Entre 10 et 20
  const remaining = Math.floor(Math.random() * total) + 1; // Entre 1 et total
  return { remaining, total };
};

// --- Countdown Logic ---
const calculateRemainingTime = () => {
  const now = new Date().getTime()
  const end = new Date(props.endTime).getTime()
  remainingTime.value = Math.max(0, end - now)

  if (remainingTime.value === 0 && countdownInterval.value) {
    clearInterval(countdownInterval.value)
    countdownInterval.value = null
  }
}

const formattedCountdown = computed(() => {
  const seconds = Math.floor((remainingTime.value / 1000) % 60)
  const minutes = Math.floor((remainingTime.value / (1000 * 60)) % 60)
  const hours = Math.floor((remainingTime.value / (1000 * 60 * 60)) % 24)
  const days = Math.floor(remainingTime.value / (1000 * 60 * 60 * 24))

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0')
  }
})

const isVisible = computed(() => remainingTime.value > 0)

// --- Product Fetching Logic ---
const fetchProducts = async () => {
  pending.value = true
  error.value = null
  productsData.value = []

  if (!props.categorySlug) {
    error.value = new Error('Category slug is not provided.')
    pending.value = false
    return
  }

  try {
    const categories = await $fetch('/api/api/v1/categories')
    const categoryInfo = categories.find(cat => cat.slug === props.categorySlug)

    if (!categoryInfo) {
      console.error(`Category with slug "${props.categorySlug}" not found for countdown.`, categories)
      throw new Error(`Category with slug "${props.categorySlug}" not found`)
    }
    console.log(`Category found for countdown ${props.countdownId}:`, categoryInfo)

    const products = await $fetch(`/api/api/v1/products/category/${categoryInfo.id}?per_page=100`)
    console.log(`Products fetched for countdown ${props.countdownId} (category ${categoryInfo.slug}):`, products)
    productsData.value = products.products // Extrait le tableau 'products' de l'objet de réponse
  } catch (err) {
    console.error(`Error fetching products for category ${props.categorySlug}:`, err)
    error.value = err
  } finally {
    pending.value = false
  }
}

const refreshProducts = () => {
  fetchProducts()
}

const productsWithRandomQuantities = computed(() => {
  return productsData.value.map(product => {
    if (product.countdownRemaining === undefined || product.countdownTotal === undefined) {
      const { remaining, total } = getRandomQuantity();
      return { ...product, countdownRemaining: remaining, countdownTotal: total };
    }
    return product;
  });
});

// --- Pagination Logic ---
const totalPages = computed(() => {
  return Math.ceil(productsData.value.length / props.productsPerPage)
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * props.productsPerPage
  const end = start + props.productsPerPage
  return productsWithRandomQuantities.value.slice(start, end)
})

const startIndex = computed(() => {
  return Math.min(((currentPage.value - 1) * props.productsPerPage) + 1, productsData.value.length)
})

const endIndex = computed(() => {
  return Math.min(currentPage.value * props.productsPerPage, productsData.value.length)
})

const visiblePages = computed(() => {
  const pages = []
  const current = currentPage.value
  const total = totalPages.value

  let start = Math.max(1, current - 2)
  let end = Math.min(total, start + 4)

  if (end - start < 4) {
    start = Math.max(1, end - 4)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// --- Event Handlers (emits) ---
const emit = defineEmits(['product-click', 'add-to-cart', 'quick-view', 'wishlist-toggle'])

const handleAddToCart = ({ product, quantity }) => {
  emit('add-to-cart', { product, quantity })
}

const handleProductClick = (product) => {
  emit('product-click', product)
}

const handleQuickView = (product) => {
  emit('quick-view', product)
}

const handleWishlistToggle = (product, inWishlist) => {
  emit('wishlist-toggle', product, inWishlist)
}


// --- Lifecycle Hooks ---
onMounted(() => {
  calculateRemainingTime()
  if (isVisible.value) {
    fetchProducts()
    if (process.client) {
      countdownInterval.value = setInterval(calculateRemainingTime, 1000)
    }
  }
})

onUnmounted(() => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
})

watch(() => props.endTime, () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
  calculateRemainingTime()
  if (isVisible.value) {
    if (process.client) {
      countdownInterval.value = setInterval(calculateRemainingTime, 1000)
    }
  }
}, { immediate: true })

watch(() => props.categorySlug, () => {
  if (isVisible.value) {
    fetchProducts()
  }
})
</script>

<style scoped>
@reference "~/assets/css/tailwind.css"; 

/* Styles inspirés de Nouveaute.vue et adaptés */
.countdown-display {
  @apply min-h-auto;
}

.countdown-header {
  @apply mb-3;
  /* Utilisation de la couleur personnalisée */
  background-color: #cc6a01; /* Orange Ivoirshop */
}

.error-container {
  @apply flex justify-center items-center min-h-96 p-6;
}

.error-card {
  @apply bg-white rounded-lg shadow-lg p-8 text-center max-w-md;
}

.error-icon {
  @apply w-16 h-16 text-red-500 mx-auto mb-4;
}

.error-card h3 {
  @apply text-xl font-semibold text-gray-900 mb-2;
}

.error-card p {
  @apply text-gray-600 mb-6;
}

.retry-button {
  @apply inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors;
}

.products-section {
  @apply mb-8;
}

.products-grid {
  @apply grid gap-1 md:gap-3;
}

.grid-2 { @apply grid-cols-1 sm:grid-cols-2; }
.grid-3 { @apply grid-cols-1 sm:grid-cols-2 lg:grid-cols-3; }
.grid-4 { @apply grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4; }
.grid-5 { @apply grid-cols-2 md:grid-cols-3 2xl:grid-cols-5; }
.grid-6 { @apply grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6; }

/* Pagination */
.pagination-section {
  @apply mt-12 space-y-4;
}

.pagination-info {
  @apply text-center text-sm text-gray-600;
}

.pagination-controls {
  @apply flex items-center justify-center gap-2;
}

.pagination-button {
  @apply inline-flex items-center gap-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed;
}

.pagination-numbers {
  @apply flex items-center gap-1;
}

.pagination-number {
  @apply w-10 h-10 flex items-center justify-center text-sm border border-gray-300 rounded-lg hover:bg-gray-50;
}

.pagination-number.active {
  @apply bg-blue-600 text-white border-blue-600;
}

/* États vides */
.empty-state {
  @apply flex justify-center items-center min-h-96 p-6;
}

.empty-content {
  @apply text-center max-w-md;
}

.empty-icon {
  @apply w-20 h-20 text-gray-400 mx-auto mb-6;
}

.empty-content h3 {
  @apply text-xl font-semibold text-gray-900 mb-4;
}

.empty-content p {
  @apply text-gray-600 mb-6;
}

/* Responsive */
@media (max-width: 640px) {
  .countdown-header {
    @apply flex-col items-start;
  }
  .countdown-header > div {
    @apply mt-2;
  }
  .pagination-controls {
    @apply flex-col gap-4;
  }
  .pagination-numbers {
    @apply order-first;
  }
}
</style>
