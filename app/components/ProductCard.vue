<template>
  <div
    class="relative flex flex-col bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition p-3"
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
        v-if="product.on_sale || product.onSale"
        class="bg-red-600 text-white text-xs font-medium px-2 py-0.5 rounded"
      >
        -{{ discountPercent }}%
      </span>
    </div>

    <!-- Image -->
    <NuxtLink :to="`/produit/${product.slug}`">
      <img
        :src="getProductImage(product)"
        :alt="product.name"
        class="w-full h-48 object-cover rounded-md mb-3"
        loading="lazy"
        @error="handleImageError"
      />
    </NuxtLink>

    <!-- Infos produit -->
    <div class="flex flex-col flex-1">
      <NuxtLink
        :to="`/product/${product.slug}`"
        class="text-gray-800 font-medium line-clamp-2 hover:text-indigo-600 transition"
      >
        {{ product.name }}
      </NuxtLink>

      <!-- Prix -->
      <div class="mt-2 flex items-center gap-2">
        <span v-if="product.on_sale || product.onSale" class="text-red-600 font-semibold">
          {{ formatPrice(product.salePrice || product.sale_price) }}
        </span>
        <span
          :class="[
            (product.on_sale || product.onSale) ? 'line-through text-gray-400 text-sm' : 'text-gray-900 font-semibold'
          ]"
        >
          {{ formatPrice(product.regularPrice || product.regular_price) }}
        </span>
      </div>
    </div>

    <!-- Bouton -->
    <button
      @click="addToCart"
      :disabled="!canAddToCart"
      :class="[
        'mt-3 w-full text-sm py-2 rounded-lg transition flex items-center justify-center gap-2',
        canAddToCart 
          ? 'bg-[#ff9900] text-white hover:bg-[#ff9900]/80' 
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      ]"
    >
      <svg v-if="isAdding" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
      </svg>
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Product {
  id: number
  name: string
  slug: string
  thumbnail?: string
  images?: Array<{
    id: number
    src: string
    alt: string
  }>
  regularPrice?: number
  regular_price?: number
  salePrice?: number
  sale_price?: number
  isNew?: boolean
  on_sale?: boolean
  stock_status?: string
  sku?: string
}

const props = defineProps<{
  product: Product
}>()

// Vérifier si promo
const discountPercent = computed(() => {
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
const formatPrice = (price?: number) =>
  price ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price) : ''

// Récupérer l'image du produit
const getProductImage = (product: Product) => {
  // Si thumbnail existe, l'utiliser
  if (product.thumbnail) {
    return product.thumbnail
  }
  
  // Sinon, prendre la première image du tableau images
  if (product.images && product.images.length > 0) {
    return product.images[0]?.src || '/images/placeholder-product.jpg'
  }
  
  // Image par défaut
  return '/images/placeholder-product.jpg'
}

// Gestion d'erreur d'image
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/images/placeholder-product.jpg'
}

// Store du panier
const cartStore = useCartStore()

// État du bouton
const isAdding = ref(false)

// Vérifier si on peut ajouter au panier
const canAddToCart = computed(() => {
  return product.value.stock_status === 'instock' || product.value.stock_status === 'onbackorder'
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
      sku: props.product.sku || ''
    }
    
    // Ajouter au panier
    cartStore.addItem(cartProduct, 1)
    
    // Ouvrir le panier
    cartStore.openCart()
    
    // Notification de succès (optionnel)
    console.log('Produit ajouté au panier:', props.product.name)
    
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error)
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
