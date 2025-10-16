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
        class="bg-orange-200 text-orange-700 text-xs font-medium px-2 py-0.5 rounded z-20 absolute top-0  md:left-52 left-28 "
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
        :to="`/product/${product.slug}`"
        class="text-gray-800 font-medium line-clamp-1"
      >
        {{ product.name }}
      </NuxtLink>

      <!-- Prix -->
      <div class="mt-2 flex-col flex items-start">
        <span class="text-gray-800 text-lg font-semibold">{{ formatPrice(product.salePrice || product.sale_price) }}</span>

        <!-- <span v-if="product.on_sale || product.onSale" class="text-red-600 text-lg font-semibold">
          {{ formatPrice(product.salePrice || product.sale_price || 0) }}
        </span> -->
        <span
          :class="[
            (product.on_sale || product.onSale) ? 'line-through text-gray-400 text-sm' : 'text-gray-500 text-[14px] line-through font-semibold'
          ]"
        >
          {{ formatPrice(product.regularPrice || product.regular_price || 0) }}
        </span>
      </div>
    </div>

    <!-- Bouton -->
    <!-- <button
      @click="addToCart"
      :disabled="!canAddToCart"
      :class="[
        'mt-3 w-full text-sm py-2.5 rounded-[4px] transition flex items-center justify-center gap-2',
        canAddToCart 
          ? 'bg-[#ff9900] text-white hover:bg-[#ff9900]/80' 
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      ]"
    > -->
      <!-- <div v-if="isAdding" class="animate-pulse">
        <div class="h-4 w-4 bg-white rounded"></div>
      </div> -->
      <!-- <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
      </svg> -->
      <!-- {{ buttonText }}
    </button> -->
  </div>
</template>

<script setup lang="ts">
import ProductImage from '~/components/ProductImage.vue'

interface Product {
  id: number
  name: string
  slug: string
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
  isNew?: boolean
  on_sale?: boolean
  stock_status?: string
  sku?: string
}

const props = defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  addToCart: [product: Product]
  productClick: [product: Product]
  quickView: [product: Product]
  wishlistToggle: [product: Product]
  imageLoaded: []
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
const formatPrice = (price: string | number) => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price

  return new Intl.NumberFormat("en-US",  {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice) + " FCFA"
}

// Récupérer la source d'image du produit pour le composant ProductImage
const getProductImageSrc = (product: Product): string | string[] | null => {
  console.log('=== ProductCard Image Debug ===')
  console.log('Product:', product)
  console.log('Product image property:', product.image)
  console.log('Product images array:', product.images)
  console.log('Product thumbnail:', product.thumbnail)
  
  // Priorité 1: Propriété image directe
  if (product.image && product.image !== '/images/placeholder-product.jpg') {
    console.log('Using product.image:', product.image)
    return product.image
  }
  
  // Priorité 2: Si thumbnail existe, l'utiliser
  if (product.thumbnail && product.thumbnail !== '/images/placeholder-product.jpg') {
    console.log('Using product.thumbnail:', product.thumbnail)
    return product.thumbnail
  }
  
  // Priorité 3: Retourner le tableau images complet pour que ProductImage le gère
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    console.log('Using product.images array:', product.images)
    // Convertir en tableau de strings pour compatibilité
    return product.images.map(img => img.src)
  }
  
  // Aucune image trouvée
  console.log('No image found, returning null')
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
  console.log('Stock status:', stockStatus, 'Product:', product.value.name)
  
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
