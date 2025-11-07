<template>
  <div class="category-display">
    <!-- État d'erreur -->
    <div v-if="error" class="error-container">
      <div class="error-card">
        <div class="error-icon">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3>Erreur de chargement</h3>
        <p>{{ error.message || 'Une erreur est survenue lors du chargement de la catégorie.' }}</p>
        <button @click="refreshCategory" class="retry-button">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Réessayer
        </button>
      </div>
    </div>

    <!-- Contenu principal -->
    <div v-if="categoryData" class="category-content">
      
      <!-- Header de la catégorie -->
      <div class="category-header bg-white px-2 py-1.5 lg:px-5 lg:py-1 p-2 border border-gray-100 rounded-sm shadow shadow-gray-100">
        <div class="category-hero" :class="{ 'with-image': categoryData.image }">
          <div class="category-info" :class="{ 'overlay-content': categoryData.image }">
            
            <!-- Titre et description -->
            <div class="category-details">
              <h1 class="category-title">{{ categoryData.name }}</h1>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-4 mt-4">
        <!-- Banner Image (visible on desktop left, on mobile above products) -->
        <div v-if="bannerImageUrl" class="md:w-1/4 w-full h-48 md:h-auto overflow-hidden rounded-md">
          <img :src="bannerImageUrl" alt="Promotion Banner" class="w-full h-full object-cover">
        </div>

        <!-- Grille de produits -->
        <div v-if="filteredProducts.length > 0" class="products-section" :class="bannerImageUrl ? 'md:w-3/4' : 'w-full'">
          <div class="products-grid" :class="`grid-${gridColumns}`">
            <ProductCard
              v-for="product in paginatedProducts"
              :key="product.id"
              :product="product"
              :show-category="false"
              :card-style="cardStyle"
              @add-to-cart="handleAddToCart"
              @product-click="handleProductClick"
              @quick-view="handleQuickView"
              @wishlist-toggle="handleWishlistToggle"
            />
          </div>
          
          <!-- Pagination avec bouton "Voir tout" -->
          <div v-if="totalPages > 1" class="pagination-section">
            <div class="pagination-info">
              Affichage {{ startIndex }}-{{ endIndex }} sur {{ filteredProducts.length }} produits
            </div>
            
            <div class="pagination-controls">
              <!-- Bouton Précédent -->
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
              
              <!-- Numéros de pages -->
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
              
              <!-- Bouton Voir tout -->
              <button
                @click="viewAllProducts"
                class="view-all-button"
                :class="{ active: isViewingAll }"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                {{ isViewingAll ? 'Pagination' : 'Voir tout' }}
              </button>
              
              <!-- Bouton Suivant -->
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

          <!-- Message "Voir tout" actif -->
          <div v-if="isViewingAll" class="viewing-all-notice">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Vous visualisez tous les {{ filteredProducts.length }} produits</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props du composant
const props = defineProps({
  // Identifiants de catégorie
  categorySlug: {
    type: String,
    required: false
  },
  categoryId: {
    type: [Number, String],
    required: false
  },
  
  // Configuration d'affichage
  gridColumns: {
    type: Number,
    default: 5,
    validator: (value) => [2, 3, 4, 5, 6].includes(value)
  },
  cardStyle: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'compact', 'detailed'].includes(value)
  },
  productsPerPage: {
    type: Number,
    default: 15
  },
  
  // Options d'affichage
  showDescription: {
    type: Boolean,
    default: true
  },
  showStats: {
    type: Boolean,
    default: true
  },
  showSubcategories: {
    type: Boolean,
    default: true
  },
  showFilters: {
    type: Boolean,
    default: true
  },
  showBreadcrumb: {
    type: Boolean,
    default: true
  },
  bannerImageUrl: {
    type: String,
    default: ''
  }
})

// Configuration
const config = useRuntimeConfig()
const baseURL = config.public.wordpressUrl || 'https://admin.ivoirshop.ci'

// États réactifs
const categoryData = ref(null)
const productsData = ref(null)
const subcategories = ref([])
const currentPage = ref(1)
const sortBy = ref('menu_order')
const isViewingAll = ref(false) // Nouvel état pour "Voir tout"
const activeFilters = ref({
  sale: false,
  featured: false,
  inStock: false
})

// Fetch des données de catégorie
const { data: fetchedCategory, pending, error, refresh: refreshCategory } = await useLazyAsyncData(
  `category-${props.categorySlug || props.categoryId}`,
  async () => {
    try {
      let categoryInfo = null
      
      // Récupérer les informations de la catégorie
      if (props.categoryId) {
        const categories = await $fetch('/api/api/v1/categories')
        categoryInfo = categories.find(cat => cat.id == props.categoryId)
      } else if (props.categorySlug) {
        const categories = await $fetch('/api/api/v1/categories')
        categoryInfo = categories.find(cat => cat.slug === props.categorySlug)
      }
      
      if (!categoryInfo) {
        console.error('Catégorie non trouvée avec les paramètres:', { categoryId: props.categoryId, categorySlug: props.categorySlug })
        throw new Error('Catégorie non trouvée')
      }
      
      // Récupérer les produits de la catégorie
      const products = await $fetch(`/api/api/v1/products/category/${categoryInfo.id}?per_page=100`)
      
      // Récupérer les sous-catégories
      const allCategories = await $fetch('/api/api/v1/categories')
      const subCats = allCategories.filter(cat => cat.parent === categoryInfo.id)
      
      return {
        category: categoryInfo,
        products: products,
        subcategories: subCats
      }
    } catch (err) {
      console.error('Erreur lors du fetch de la catégorie:', err)
      throw err
    }
  },
  {
    server: false
  }
)

// Watchers pour mettre à jour les données
watch(fetchedCategory, (newData) => {
  if (newData) {
    categoryData.value = newData.category
    productsData.value = newData.products
    subcategories.value = newData.subcategories
  }
}, { immediate: true })

// Propriétés calculées
const breadcrumbItems = computed(() => {
  if (!categoryData.value) return []
  
  const items = [
    { id: 'home', name: 'Accueil', link: '/' },
    { id: 'shop', name: 'Boutique', link: '/shop' }
  ]
  
  items.push({
    id: categoryData.value.id,
    name: categoryData.value.name,
    link: `/category/${categoryData.value.slug}`
  })
  
  return items
})

const subcategoriesCount = computed(() => subcategories.value.length)

const filteredProducts = computed(() => {
  if (!productsData.value?.products?.length) return []
  
  let filtered = [...productsData.value.products]
  
  // Appliquer les filtres
  if (activeFilters.value.sale) {
    filtered = filtered.filter(product => product.on_sale)
  }
  
  if (activeFilters.value.featured) {
    filtered = filtered.filter(product => product.featured)
  }
  
  if (activeFilters.value.inStock) {
    filtered = filtered.filter(product => product.stock_status === 'instock')
  }
  
  // Appliquer le tri
  switch (sortBy.value) {
    case 'date':
      filtered.sort((a, b) => new Date(b.date_created) - new Date(a.date_created))
      break
    case 'price_asc':
      filtered.sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0))
      break
    case 'price_desc':
      filtered.sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0))
      break
    case 'popularity':
      filtered.sort((a, b) => (b.rating_count || 0) - (a.rating_count || 0))
      break
    case 'rating':
      filtered.sort((a, b) => (b.rating_average || 0) - (a.rating_average || 0))
      break
    default:
      break
  }
  
  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / props.productsPerPage)
})

const paginatedProducts = computed(() => {
  // Si "Voir tout" est actif, retourner tous les produits
  if (isViewingAll.value) {
    return filteredProducts.value
  }
  
  // Sinon, paginer normalement
  const start = (currentPage.value - 1) * props.productsPerPage
  const end = start + props.productsPerPage
  return filteredProducts.value.slice(start, end)
})

const startIndex = computed(() => {
  if (isViewingAll.value) return 1
  return Math.min(((currentPage.value - 1) * props.productsPerPage) + 1, filteredProducts.value.length)
})

const endIndex = computed(() => {
  if (isViewingAll.value) return filteredProducts.value.length
  return Math.min(currentPage.value * props.productsPerPage, filteredProducts.value.length)
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

const hasActiveFilters = computed(() => {
  return Object.values(activeFilters.value).some(Boolean)
})

// Méthodes
const viewAllProducts = () => {
  isViewingAll.value = !isViewingAll.value
  if (!isViewingAll.value) {
    currentPage.value = 1 // Retour à la page 1 en mode pagination
  }
  // Scroll vers le haut
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const toggleFilter = (filterType) => {
  activeFilters.value[filterType] = !activeFilters.value[filterType]
  currentPage.value = 1
  isViewingAll.value = false // Désactiver "Voir tout" lors du filtrage
}

const clearAllFilters = () => {
  activeFilters.value = {
    sale: false,
    featured: false,
    inStock: false
  }
  currentPage.value = 1
  isViewingAll.value = false
}

const applySorting = () => {
  currentPage.value = 1
  isViewingAll.value = false
}

// Gestionnaires d'événements
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

// SEO et meta
if (categoryData.value) {
  useHead({
    title: `${categoryData.value.name} - Boutique`,
    meta: [
      {
        name: 'description',
        content: categoryData.value.description || `Découvrez notre collection ${categoryData.value.name.toLowerCase()}`
      }
    ]
  })
}
</script>

<style scoped>
@import "~/assets/css/tailwind.css";

.category-display {
  @apply min-h-auto;
}

/* Bouton "Voir tout" */
.view-all-button {
  @apply inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200;
}

.view-all-button.active {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.view-all-button svg {
  @apply transition-transform duration-200;
}

.view-all-button.active svg {
  @apply rotate-180;
}

/* Message "Voir tout" actif */
.viewing-all-notice {
  @apply flex items-center justify-center gap-2 mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm font-medium;
}

/* États d'erreur */
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

/* Header de catégorie */
.category-header {
  @apply mb-3;
}

.category-hero {
  @apply relative overflow-hidden;
}

.category-hero.with-image {
  @apply bg-black rounded-xl;
}

.category-info {
  @apply p-2 lg:p-4;
}

.category-title {
  @apply text-xl lg:text-2xl font-bold mb-1;
}

/* Grille de produits */
.products-section {
  @apply mb-8;
}

.products-grid {
  @apply grid gap-1 md:gap-2;
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
  @apply flex items-center justify-center gap-2 flex-wrap;
}

.pagination-button {
  @apply inline-flex items-center gap-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors;
}

.pagination-numbers {
  @apply flex items-center gap-1;
}

.pagination-number {
  @apply w-10 h-10 flex items-center justify-center text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors;
}

.pagination-number.active {
  @apply bg-blue-600 text-white border-blue-600;
}

/* Responsive */
@media (max-width: 640px) {
  .pagination-controls {
    @apply flex-col gap-3;
  }
  
  .pagination-numbers {
    @apply order-first;
  }
  
  .view-all-button {
    @apply w-full justify-center;
  }
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.category-content {
  animation: fadeIn 0.5s ease-out;
}
</style>