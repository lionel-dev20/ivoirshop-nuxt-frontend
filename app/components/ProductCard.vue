<template>
  <div
    class="relative lg:min-h-[310px] flex flex-col bg-white border border-gray-100 rounded-sm shadow shadow-gray-100 hover:shadow-md transition p-3"
  >
    <!-- Badge -->
    <div class="absolute top-2 left-2 flex flex-col gap-1">
      <span
        v-if="product.isNew"
        class="bg-green-600 text-white text-xs font-medium px-2 py-0.5 rounded"
      >
        Nouveau
      </span>
      <span
        class="bg-orange-200 text-orange-700 text-xs font-medium px-2 py-0.5 rounded z-20 absolute top-0  md:left-50 left-28 "
      >
        -{{ discountPercent }}%
        
      </span>
    </div>

    <!-- Image -->
    <NuxtLink :to="`/produit/${product.slug}`">
      <ProductImage 
        :src="getProductImageSrc(product)"
        :alt="product.name"
        class="mb-3"
        @image-loaded="handleImageLoaded"
      />
    </NuxtLink>

    <!-- Infos produit -->
    <div class="flex flex-col flex-1">
      <NuxtLink
        :to="`/produit/${product.slug}`"
        class="text-gray-800 font-medium line-clamp-1"
      >
        {{ product.name }}
      </NuxtLink>

      <!-- Barre de progression pour le compte à rebours -->
      <div v-if="showCountdownInfo" class="mt-2 text-sm text-gray-600">
        <div class="flex justify-between items-center mb-1">
          <span>Reste {{ countdownRemaining }}/{{ countdownTotal }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div
            class="bg-orange-500 h-2.5 rounded-full"
            :style="{ width: (countdownRemaining / countdownTotal) * 100 + '%' }"
          ></div>
        </div>
      </div>

      <!-- Prix -->
      <div class="mt-2 flex-col flex items-start">
        <!-- Produit variable : afficher fourchette de prix -->
        <div v-if="isVariableProduct">
          <div class="flex items-baseline gap-1">
            <span class="text-xs text-gray-500">À partir de</span>
            <span class="text-gray-800 text-lg font-semibold">{{ displayPrice }}</span>
          </div>
          <span class="text-xs text-blue-600 mt-1">{{ variationsCount }} options disponibles</span>
        </div>
        
        <!-- Produit simple : affichage normal -->
        <div v-else>
          <span class="text-gray-800 text-lg font-semibold">{{ formatPrice(product.salePrice || product.sale_price) }}</span>
          <span
            :class="[
              (product.on_sale || product.onSale) ? 'line-through text-gray-400 text-sm' : 'text-gray-500 text-[14px] line-through font-semibold'
            ]"
          >
            {{ formatPrice(product.regularPrice || product.regular_price || 0) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Bouton "Ajouter au panier" (visible uniquement sur pages catégories/recherche) -->
    <NuxtLink
      v-if="showAddToCart && isVariableProduct"
      :to="`/produit/${product.slug}`"
      :class="[
        'mt-3 w-full text-sm py-2.5 rounded-[4px] transition flex items-center justify-center gap-2',
        'bg-blue-600 text-white hover:bg-blue-700'
      ]"
    >
      <svg class="h-4 w-4 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      Voir les options
    </NuxtLink>
    
    <button
      v-else-if="showAddToCart"
      @click="addToCart"
      :disabled="!canAddToCart"
      :class="[
        'mt-3 w-full text-sm py-2.5 rounded-[4px] transition flex items-center justify-center gap-2',
        canAddToCart 
          ? 'bg-[#ff9900] text-white hover:bg-[#ff9900]/80' 
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      ]"
    >
      <div v-if="isAdding" class="animate-pulse">
        <div class="h-4 w-4 bg-white rounded"></div>
      </div>
      <svg v-else class="h-4 w-4 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
      </svg>
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup lang="ts">
import ProductImage from '~/components/ProductImage.vue'

interface Product {
  id: number
  name: string
  slug: string
  type?: string  // 'simple' | 'variable'
  thumbnail?: string
  image?: string
  images?: Array<{
    id: number
    src: string
    alt: string
  }>
  regularPrice?: number
  regular_price?: number
  salePrice?: number
  sale_price?: number
  price?: number | string
  price_html?: string
  min_price?: number | string
  max_price?: number | string
  variations?: any[]
  isNew?: boolean
  on_sale?: boolean
  stock_status?: string
  sku?: string
  shipping_class?: string
  weight?: string | number
  showCountdownInfo?: boolean
  countdownRemaining?: number
  countdownTotal?: number
}

const props = withDefaults(defineProps<{
  product: Product
  showAddToCart?: boolean
  showCountdownInfo?: boolean
  countdownRemaining?: number
  countdownTotal?: number
}>(), {
  showAddToCart: false,
  showCountdownInfo: false,
  countdownRemaining: 0,
  countdownTotal: 0
})

const emit = defineEmits<{
  addToCart: [product: Product]
  productClick: [product: Product]
  quickView: [product: Product]
  wishlistToggle: [product: Product]
  imageLoaded: []
}>()

// Vérifier si c'est un produit variable
const isVariableProduct = computed(() => {
  return props.product.type === 'variable' && (props.product.variations?.length || 0) > 0
})

// Nombre de variations
const variationsCount = computed(() => {
  if (!isVariableProduct.value) return 0
  return props.product.variations?.length || 0
})

// Prix à afficher pour produit variable
const displayPrice = computed(() => {
  if (!isVariableProduct.value) {
    return formatPrice(props.product.salePrice || props.product.sale_price || 0)
  }
  
  // Pour produit variable, utiliser min_price si disponible
  if (props.product.min_price) {
    const minPrice = typeof props.product.min_price === 'string' 
      ? parseFloat(props.product.min_price) 
      : props.product.min_price
    
    const maxPrice = props.product.max_price 
      ? (typeof props.product.max_price === 'string' ? parseFloat(props.product.max_price) : props.product.max_price)
      : minPrice
    
    // Si prix identiques, afficher un seul prix
    if (minPrice === maxPrice) {
      return formatPrice(minPrice)
    }
    
    // Sinon afficher la fourchette
    return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
  }
  
  // Fallback sur le prix normal
  return formatPrice(props.product.price || props.product.sale_price || 0)
})

// Vérifier si promo
const discountPercent = computed(() => {
  if (isVariableProduct.value) return 0  // Pas de badge promo pour les produits variables
  
  const salePrice = props.product.salePrice || props.product.sale_price
  const regularPrice = props.product.regularPrice || props.product.regular_price
  
  if (!salePrice || !regularPrice) return 0
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100)
})

// Produit en promo ?
const product = computed(() => ({
  ...props.product,
  onSale: (props.product.salePrice !== undefined || props.product.sale_price !== undefined) && 
         (props.product.on_sale || false)
}))

// Format prix
const formatPrice = (price: string | number) => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price

  return new Intl.NumberFormat("en-US",  {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice) + " FCFA"
}

// Récupérer la source d'image du produit pour le composant ProductImage
const getProductImageSrc = (product: Product): string | string[] | null => {
  // Priorité 1: Propriété image directe
  if (product.image && product.image !== '/images/placeholder-product.jpg') {
    return product.image
  }
  
  // Priorité 2: Si thumbnail existe, l'utiliser
  if (product.thumbnail && product.thumbnail !== '/images/placeholder-product.jpg') {
    return product.thumbnail
  }
  
  // Priorité 3: Retourner le tableau images complet pour que ProductImage le gère
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    // Convertir en tableau de strings pour compatibilité
    return product.images.map(img => img.src)
  }
  
  // Aucune image trouvée
  return null
}

// Store du panier
const cartStore = useCartStore()

// Gestion du chargement d'image
const handleImageLoaded = () => {
  // Émettre un événement au parent pour notifier que l'image est chargée
  emit('imageLoaded')
}

// État du bouton
const isAdding = ref(false)

// Vérifier si on peut ajouter au panier
const canAddToCart = computed(() => {
  const stockStatus = product.value.stock_status?.toLowerCase()
  
  // Considérer comme disponible si pas de statut défini ou si en stock
  if (!stockStatus || stockStatus === 'instock' || stockStatus === 'onbackorder') {
    return true
  }
  
  // Indisponible seulement si explicitement outofstock
  return stockStatus !== 'outofstock'
})

// Texte du bouton
const buttonText = computed(() => {
  if (isAdding.value) return 'Ajout...'
  if (!canAddToCart.value) return 'Indisponible'
  return 'Ajouter au panier'
})

// Ajouter au panier
const addToCart = async () => {
  if (!canAddToCart.value || isAdding.value) return
  
  // Si produit variable, rediriger vers la fiche produit
  if (isVariableProduct.value) {
    navigateTo(`/produit/${props.product.slug}`)
    return
  }
  
  isAdding.value = true
  
  try {
    // Préparer les données du produit pour le panier
    const regularPrice = props.product.regularPrice || props.product.regular_price || 0
    const salePrice = props.product.salePrice || props.product.sale_price
    
    const cartProduct = {
      id: props.product.id,
      name: props.product.name,
      slug: props.product.slug,
      price: parseFloat(String(regularPrice)),
      regular_price: parseFloat(String(regularPrice)),
      sale_price: salePrice ? parseFloat(String(salePrice)) : undefined,
      image: getProductImageData(props.product),
      stock_status: props.product.stock_status || 'instock',
      sku: props.product.sku || '',
      shipping_class: props.product.shipping_class || 'medium',
      weight: props.product.weight || ''
    }
    
    // Ajouter au panier
    cartStore.addItem(cartProduct, 1)
    
    // Ouvrir le panier
    cartStore.openCart()
    
  } catch (error) {
  } finally {
    isAdding.value = false
  }
}

// Récupérer les données d'image pour le panier
const getProductImageData = (product: Product) => {
  if (product.images && product.images.length > 0) {
    return {
      src: product.images[0]?.src || '/images/placeholder-product.jpg',
      alt: product.images[0]?.alt || product.name
    }
  }
  
  if (product.thumbnail) {
    return {
      src: product.thumbnail,
      alt: product.name
    }
  }
  
  return {
    src: '/images/placeholder-product.jpg',
    alt: product.name
  }
}
</script>
