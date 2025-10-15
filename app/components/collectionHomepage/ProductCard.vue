<template>
  <div 
    class="product-card"
    :class="[
      `card-${cardStyle}`,
      { 'on-sale': product.on_sale, 'featured': product.featured }
    ]"
    @click="handleClick"
  >
    <!-- Badge promotionnel -->
    <div v-if="product.on_sale" class="sale-badge">
      <span v-if="salePercentage > 0">-{{ salePercentage }}%</span>
      <span v-else>Promo</span>
    </div>
    
    <!-- Badge featured -->
    <div v-if="product.featured && !product.on_sale" class="featured-badge">
      ⭐ Coup de cœur
    </div>

    <!-- Image du produit -->
    <div class="product-image-container">
      <img
        v-if="product.image?.src"
        :src="product.image.src"
        :alt="product.image.alt || product.name"
        class="product-image"
        loading="lazy"
        @error="handleImageError"
      />
      <div v-else class="product-image-placeholder">
        <Icon name="package" class="placeholder-icon" />
      </div>
      
      <!-- Overlay au survol pour le style detailed -->
      <div v-if="cardStyle === 'detailed'" class="image-overlay">
        <div class="overlay-actions">
          <button @click.stop="handleQuickView" class="overlay-btn">
            <Icon name="eye" />
            <span>Aperçu</span>
          </button>
          <button @click.stop="handleAddToCart" class="overlay-btn">
            <Icon name="shopping-cart" />
            <span>Ajouter</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Contenu du produit -->
    <div class="product-content">
      <!-- Catégorie (si demandée) -->
      <div v-if="showCategory && product.categories?.length" class="product-category">
        <NuxtLink 
          :to="`/categorie/${product.categories[0].slug}`"
          @click.stop
          class="category-link"
        >
          {{ product.categories[0].name }}
        </NuxtLink>
      </div>

      <!-- Nom du produit -->
      <h3 class="product-name" :title="product.name">
        {{ product.name }}
      </h3>

      <!-- Description courte (style detailed seulement) -->
      <p v-if="cardStyle === 'detailed' && product.short_description" class="product-description">
        {{ truncatedDescription }}
      </p>

      <!-- Note et avis (si disponibles) -->
      <div v-if="product.rating_average > 0" class="product-rating">
        <div class="stars">
          <span 
            v-for="star in 5" 
            :key="star" 
            class="star"
            :class="{ filled: star <= Math.round(product.rating_average) }"
          >
            ★
          </span>
        </div>
        <span class="rating-text">
          ({{ product.rating_count }} avis)
        </span>
      </div>

      <!-- Prix -->
      <div class="product-pricing">
        <div class="price-container">
          <!-- Prix en promotion -->
          <template v-if="product.on_sale && product.sale_price">
            <span class="current-price sale-price">
              {{ formatPrice(product.sale_price) }}
            </span>
            <span class="original-price">
              {{ formatPrice(product.regular_price) }}
            </span>
          </template>
          <!-- Prix normal -->
          <template v-else>
            <span class="current-price">
              {{ formatPrice(product.price || product.regular_price) }}
            </span>
          </template>
        </div>
      </div>

      <!-- Stock status -->
      <div class="stock-status" :class="`stock-${product.stock_status}`">
        <Icon 
          :name="stockIcon" 
          class="stock-icon"
        />
        <span>{{ stockText }}</span>
      </div>

      <!-- Actions -->
      <div class="product-actions" v-if="cardStyle !== 'compact'">
        <button 
          @click.stop="handleAddToCart"
          :disabled="!isInStock"
          class="add-to-cart-btn"
          :class="{ disabled: !isInStock }"
        >
          <Icon name="shopping-cart" />
          <span v-if="isInStock">Ajouter au panier</span>
          <span v-else>Rupture de stock</span>
        </button>
        
        <button 
          v-if="cardStyle === 'detailed'"
          @click.stop="handleWishlist" 
          class="wishlist-btn"
          :class="{ active: isInWishlist }"
        >
          <Icon :name="isInWishlist ? 'heart-filled' : 'heart'" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  cardStyle: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'compact', 'detailed'].includes(value)
  },
  showCategory: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['product-click', 'add-to-cart', 'quick-view', 'wishlist-toggle'])

// États réactifs
const isInWishlist = ref(false)

// Propriétés calculées
const salePercentage = computed(() => {
  if (!props.product.on_sale || !props.product.regular_price || !props.product.sale_price) {
    return 0
  }
  const regular = parseFloat(props.product.regular_price)
  const sale = parseFloat(props.product.sale_price)
  return Math.round(((regular - sale) / regular) * 100)
})

const truncatedDescription = computed(() => {
  if (!props.product.short_description) return ''
  const words = props.product.short_description.split(' ')
  return words.length > 15 ? words.slice(0, 15).join(' ') + '...' : props.product.short_description
})

const isInStock = computed(() => {
  return props.product.stock_status === 'instock'
})

const stockIcon = computed(() => {
  switch (props.product.stock_status) {
    case 'instock':
      return 'check-circle'
    case 'outofstock':
      return 'x-circle'
    case 'onbackorder':
      return 'clock'
    default:
      return 'help-circle'
  }
})

const stockText = computed(() => {
  switch (props.product.stock_status) {
    case 'instock':
      return 'En stock'
    case 'outofstock':
      return 'Rupture de stock'
    case 'onbackorder':
      return 'En réapprovisionnement'
    default:
      return 'Statut inconnu'
  }
})

// Fonctions utilitaires
const formatPrice = (price) => {
  if (!price) return 'Prix non disponible'
  const numericPrice = parseFloat(price)
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(numericPrice).replace('XOF', 'FCFA')
}

// Gestionnaires d'événements
const handleClick = () => {
  emit('product-click', props.product)
}

const handleAddToCart = () => {
  if (isInStock.value) {
    emit('add-to-cart', props.product, 1)
  }
}

const handleQuickView = () => {
  emit('quick-view', props.product)
}

const handleWishlist = () => {
  isInWishlist.value = !isInWishlist.value
  emit('wishlist-toggle', props.product, isInWishlist.value)
}

const handleImageError = (event) => {
  // Remplacer par une image par défaut
  event.target.style.display = 'none'
  event.target.parentNode.classList.add('image-error')
}

// Vérifier si le produit est dans la wishlist au montage
onMounted(() => {
  // Ici vous pouvez vérifier si le produit est dans la wishlist
  // isInWishlist.value = checkIfInWishlist(props.product.id)
})
</script>

<style scoped>
.product-card {
  @apply relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 cursor-pointer;
}

.product-card:hover {
  @apply shadow-lg transform translate-y-[-2px];
}

/* Badges */
.sale-badge {
  @apply absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10;
}

.featured-badge {
  @apply absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded z-10;
}

/* Image container */
.product-image-container {
  @apply relative aspect-square overflow-hidden bg-gray-100;
}

.product-image {
  @apply w-full h-full object-cover transition-transform duration-300;
}

.product-card:hover .product-image {
  @apply scale-105;
}

.product-image-placeholder {
  @apply w-full h-full flex items-center justify-center bg-gray-100;
}

.placeholder-icon {
  @apply w-12 h-12 text-gray-400;
}

.image-error::after {
  content: 'Image non disponible';
  @apply absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm;
}

/* Overlay pour le style detailed */
.image-overlay {
  @apply absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 transition-opacity duration-300;
}

.card-detailed:hover .image-overlay {
  @apply opacity-100;
}

.overlay-actions {
  @apply flex gap-2;
}

.overlay-btn {
  @apply flex flex-col items-center gap-1 px-3 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors;
}

.overlay-btn span {
  @apply text-xs;
}

/* Contenu du produit */
.product-content {
  @apply p-4;
}

.card-compact .product-content {
  @apply p-3;
}

.product-category {
  @apply mb-2;
}

.category-link {
  @apply text-xs text-blue-600 hover:text-blue-800 font-medium;
}

.product-name {
  @apply text-sm font-semibold text-gray-900 mb-2 line-clamp-2;
  min-height: 2.5rem;
}

.card-compact .product-name {
  @apply text-sm mb-1;
  min-height: 1.25rem;
}

.product-description {
  @apply text-sm text-gray-600 mb-3 line-clamp-2;
}

/* Rating */
.product-rating {
  @apply flex items-center gap-2 mb-3;
}

.stars {
  @apply flex;
}

.star {
  @apply text-gray-300 text-sm;
}

.star.filled {
  @apply text-yellow-400;
}

.rating-text {
  @apply text-xs text-gray-500;
}

/* Prix */
.product-pricing {
  @apply mb-3;
}

.price-container {
  @apply flex items-center gap-2;
}

.current-price {
  @apply text-lg font-bold text-gray-900;
}

.sale-price {
  @apply text-red-600;
}

.original-price {
  @apply text-sm text-gray-500 line-through;
}

.card-compact .current-price {
  @apply text-base;
}

.wc-price {
  @apply text-sm mt-1;
}

/* Stock status */
.stock-status {
  @apply flex items-center gap-1 text-xs mb-3;
}

.stock-instock {
  @apply text-green-600;
}

.stock-outofstock {
  @apply text-red-600;
}

.stock-onbackorder {
  @apply text-yellow-600;
}

.stock-icon {
  @apply w-3 h-3;
}

/* Actions */
.product-actions {
  @apply flex gap-2;
}

.add-to-cart-btn {
  @apply flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium;
}

.add-to-cart-btn.disabled {
  @apply bg-gray-400 cursor-not-allowed hover:bg-gray-400;
}

.wishlist-btn {
  @apply flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg hover:border-red-500 hover:text-red-500 transition-colors;
}

.wishlist-btn.active {
  @apply border-red-500 text-red-500 bg-red-50;
}

/* Styles spécifiques pour chaque variation */
.card-compact {
  @apply shadow-sm;
}

.card-compact .product-image-container {
  @apply aspect-[4/3];
}

.card-detailed {
  @apply shadow-md;
}

.card-detailed .product-image-container {
  @apply aspect-[3/4];
}

/* Responsive */
@media (max-width: 640px) {
  .product-actions {
    @apply flex-col;
  }
  
  .add-to-cart-btn {
    @apply text-xs px-2 py-1.5;
  }
  
  .product-name {
    @apply text-xs;
    min-height: 2rem;
  }
  
  .current-price {
    @apply text-base;
  }
}

/* Utility classes */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>