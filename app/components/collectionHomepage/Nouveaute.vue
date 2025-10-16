<template>
  <div class="category-display">
    <!-- État de chargement supprimé - affichage direct des produits -->

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


      <!-- Filtres et tri -->
      

      <!-- Grille de produits -->
      <div v-if="filteredProducts.length > 0" class="products-section">
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
        
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination-section">
          <div class="pagination-info">
            Affichage {{ startIndex }}-{{ endIndex }} sur {{ filteredProducts.length }} produits
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

      

    <!-- État vide après filtrage -->
    <div v-else-if="categoryData && productsData?.products?.length > 0" class="empty-filtered-state">
        <div class="empty-content">
          <svg class="w-16 h-16 empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          <h3>Aucun produit trouvé</h3>
          <p>Aucun produit ne correspond à vos critères de filtrage.</p>
          <button @click="clearAllFilters" class="clear-filters-button">
            Effacer les filtres
          </button>
        </div>
      </div>

    <!-- État vide général -->
    <div v-else-if="categoryData" class="empty-state">
        <div class="empty-content">
          <svg class="w-16 h-16 empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3>Aucun produit disponible</h3>
          <p>Cette catégorie ne contient aucun produit pour le moment.</p>
          <NuxtLink to="/" class="back-home-button">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à l'accueil
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- État de chargement initial vide -->
    <div v-else class="initial-empty-state">
      <div class="empty-content">
        <svg class="w-16 h-16 empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3>Catégorie non trouvée</h3>
        <p>La catégorie demandée n'existe pas ou n'est pas disponible.</p>
        <NuxtLink to="/" class="back-home-button">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l'accueil
        </NuxtLink>
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
    default: 4,
    validator: (value) => [2, 3, 4, 5, 6].includes(value)
  },
  cardStyle: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'compact', 'detailed'].includes(value)
  },
  productsPerPage: {
    type: Number,
    default: 12
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
      console.log('Recherche de catégorie:', { categoryId: props.categoryId, categorySlug: props.categorySlug })
      
      if (props.categoryId) {
        const categories = await $fetch('/api/api/v1/categories')
        console.log('Catégories récupérées par ID:', categories.length)
        categoryInfo = categories.find(cat => cat.id == props.categoryId)
        console.log('Catégorie trouvée par ID:', categoryInfo)
      } else if (props.categorySlug) {
        const categories = await $fetch('/api/api/v1/categories')
        console.log('Catégories récupérées par slug:', categories.length)
        console.log('Slugs disponibles:', categories.map(cat => cat.slug))
        categoryInfo = categories.find(cat => cat.slug === props.categorySlug)
        console.log('Catégorie trouvée par slug:', categoryInfo)
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
    server: false // Désactiver le SSR pour ce fetch si nécessaire
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
  
  // Ajouter les catégories parentes si nécessaire
  if (categoryData.value.parent > 0) {
    // Logique pour récupérer les catégories parentes
    // (simplifiée pour cet exemple)
  }
  
  items.push({
    id: categoryData.value.id,
    name: categoryData.value.name,
    link: `/category/${categoryData.value.slug}`
  })
  
  return items
})

const subcategoriesCount = computed(() => subcategories.value.length)

const averagePrice = computed(() => {
  if (!productsData.value?.products?.length) return 0
  
  const prices = productsData.value.products
    .map(p => parseFloat(p.price))
    .filter(price => price > 0)
  
  if (prices.length === 0) return 0
  
  return prices.reduce((sum, price) => sum + price, 0) / prices.length
})

const saleCount = computed(() => {
  if (!productsData.value?.products?.length) return 0
  return productsData.value.products.filter(p => p.on_sale).length
})

const featuredCount = computed(() => {
  if (!productsData.value?.products?.length) return 0
  return productsData.value.products.filter(p => p.featured).length
})

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
      // menu_order - garder l'ordre par défaut
      break
  }
  
  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / props.productsPerPage)
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * props.productsPerPage
  const end = start + props.productsPerPage
  return filteredProducts.value.slice(start, end)
})

const startIndex = computed(() => {
  return Math.min(((currentPage.value - 1) * props.productsPerPage) + 1, filteredProducts.value.length)
})

const endIndex = computed(() => {
  return Math.min(currentPage.value * props.productsPerPage, filteredProducts.value.length)
})

const visiblePages = computed(() => {
  const pages = []
  const current = currentPage.value
  const total = totalPages.value
  
  // Afficher jusqu'à 5 numéros de page
  let start = Math.max(1, current - 2)
  let end = Math.min(total, start + 4)
  
  // Ajuster si on est près de la fin
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
const toggleFilter = (filterType) => {
  activeFilters.value[filterType] = !activeFilters.value[filterType]
  currentPage.value = 1 // Reset à la première page
}

const clearAllFilters = () => {
  activeFilters.value = {
    sale: false,
    featured: false,
    inStock: false
  }
  currentPage.value = 1
}

const applySorting = () => {
  currentPage.value = 1 // Reset à la première page lors du tri
}

const formatPrice = (price) => {
  if (!price) return 'Prix non disponible'
  const numericPrice = parseFloat(price)
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(numericPrice).replace('XOF', 'FCFA')
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
  event.target.parentNode.classList.add('image-error')
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

<style>
@reference "~/assets/css/tailwind.css"; 


.category-display {
  @apply min-h-screen;
}

/* États de chargement */
.loading-container {
  @apply p-6;
}

.skeleton-category {
  @apply max-w-7xl mx-auto;
}

.skeleton-header {
  @apply flex flex-col lg:flex-row gap-6 mb-12;
}

.skeleton-image {
  @apply w-full lg:w-1/3 h-64 bg-gray-200 rounded-lg animate-pulse;
}

.skeleton-content {
  @apply flex-1 space-y-4;
}

.skeleton-line {
  @apply bg-gray-200 rounded animate-pulse;
}

.skeleton-title {
  @apply h-8 w-2/3;
}

.skeleton-description {
  @apply h-4 w-full;
}

.skeleton-stats {
  @apply h-4 w-1/2;
}

.skeleton-products-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3;
}

.skeleton-product-card {
  @apply bg-white rounded-lg border overflow-hidden;
}

.skeleton-product-image {
  @apply w-full h-48 bg-gray-200 animate-pulse;
}

.skeleton-product-content {
  @apply p-4 space-y-2;
}

.skeleton-product-title {
  @apply h-4 w-3/4;
}

.skeleton-product-price {
  @apply h-4 w-1/2;
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

.category-image-container {
  @apply relative h-64 lg:h-80;
}

.category-image {
  @apply w-full h-full object-cover;
}

.image-overlay {
  @apply absolute inset-0 bg-black/40 ;
}

.category-info {
  @apply p-2 lg:p-4;
}

/* .category-info.overlay-content {
  @apply absolute inset-0 flex flex-col justify-end text-white;
} */

/* Breadcrumb */
.breadcrumb {
  @apply mb-4;
}

.breadcrumb-list {
  @apply flex items-center gap-2 text-sm;
}

.breadcrumb-item {
  @apply flex items-center gap-2;
}

.breadcrumb-link {
  @apply text-blue-600 hover:text-blue-800;
}

.overlay-content .breadcrumb-link {
  @apply text-white hover:text-blue-200;
}

.breadcrumb-current {
  @apply font-medium;
}

.breadcrumb-separator {
  @apply w-4 h-4 text-gray-400;
}

/* Détails de catégorie */
.category-title {
  @apply text-xl lg:text-2xl font-bold mb-1;
}

.category-description {
  @apply text-lg text-gray-600 mb-6 max-w-3xl;
}

.overlay-content .category-description {
  @apply text-gray-200;
}

.category-stats {
  @apply flex flex-wrap items-center gap-6 text-sm;
}

.stat-item {
  @apply flex items-center gap-2;
}

.stat-item svg {
  @apply w-4 h-4;
}

/* Sous-catégories */
.subcategories-section {
  @apply mb-12;
}

.section-title {
  @apply text-2xl font-bold mb-6;
}

.subcategories-grid {
  @apply grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3;
}

.subcategory-card {
  @apply bg-white rounded-lg border border-gray-200 p-4 text-center hover:shadow-md transition-shadow;
}

.subcategory-image {
  @apply w-16 h-16 mx-auto mb-3 rounded-lg overflow-hidden;
}

.subcategory-image img {
  @apply w-full h-full object-cover;
}

.subcategory-placeholder {
  @apply w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center;
}

.subcategory-placeholder svg {
  @apply w-8 h-8 text-gray-400;
}

.subcategory-name {
  @apply font-medium text-sm mb-1;
}

.subcategory-count {
  @apply text-xs text-gray-500;
}

/* Filtres */
.filters-section {
  @apply mb-8;
}

.filters-header {
  @apply flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6;
}

.filters-controls {
  @apply flex flex-col sm:flex-row items-start sm:items-center gap-4;
}

.quick-filters {
  @apply flex flex-wrap gap-2;
}

.filter-button {
  @apply inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors;
}

.filter-button.active {
  @apply bg-blue-50 border-blue-500 text-blue-600;
}

.filter-count {
  @apply text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full;
}

.filter-button.active .filter-count {
  @apply bg-blue-200 text-blue-700;
}

.sort-controls {
  @apply flex items-center gap-2;
}

.sort-select {
  @apply px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500;
}

/* Filtres actifs */
.active-filters {
  @apply flex flex-wrap items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200 mb-6;
}

.active-filters-label {
  @apply text-sm font-medium text-blue-900;
}

.active-filters-list {
  @apply flex flex-wrap gap-2;
}

.active-filter-tag {
  @apply inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700;
}

.clear-filters-button {
  @apply text-sm text-blue-600 hover:text-blue-800 font-medium;
}

/* Grille de produits */
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
.empty-filtered-state,
.empty-state,
.initial-empty-state {
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

.back-home-button {
  @apply inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors;
}

/* Responsive */
@media (max-width: 640px) {
  .category-title {
    @apply text-2xl;
  }
  
  .filters-controls {
    @apply flex-col items-stretch;
  }
  
  .quick-filters {
    @apply grid grid-cols-2 gap-2;
  }
  
  .filter-button {
    @apply justify-center;
  }
  
  .subcategories-grid {
    @apply grid-cols-2;
  }
  
  .pagination-controls {
    @apply flex-col gap-4;
  }
  
  .pagination-numbers {
    @apply order-first;
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

/* Image d'erreur */
.image-error::after {
  content: 'Image non disponible';
  @apply absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm;
}
</style>
