<!-- pages/produit/[slug].vue -->
<template>
  <div class="max-w-[1440px] mx-auto md:p-6 p-2">
    <!-- Skeleton de chargement -->
    <div v-if="loading" class="max-w-[1440px] mx-auto p-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Skeleton images -->
        <div class="space-y-4">
          <div class="animate-pulse">
            <div class="w-full h-96 bg-gray-200 rounded-lg"></div>
          </div>
          <div class="flex space-x-2">
            <div v-for="i in 4" :key="i" class="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>

        <!-- Skeleton contenu -->
        <div class="space-y-6">
          <div class="animate-pulse">
            <!-- Titre -->
            <div class="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>

            <!-- Prix -->
            <div class="flex items-center space-x-4 mb-6">
              <div class="h-8 bg-gray-200 rounded w-24"></div>
              <div class="h-6 bg-gray-200 rounded w-20"></div>
            </div>

            <!-- Description -->
            <div class="space-y-2 mb-6">
              <div class="h-4 bg-gray-200 rounded w-full"></div>
              <div class="h-4 bg-gray-200 rounded w-4/5"></div>
              <div class="h-4 bg-gray-200 rounded w-3/5"></div>
            </div>

            <!-- Options -->
            <div class="space-y-4 mb-6">
              <div class="h-6 bg-gray-200 rounded w-1/3"></div>
              <div class="flex space-x-2">
                <div class="h-10 bg-gray-200 rounded w-16"></div>
                <div class="h-10 bg-gray-200 rounded w-16"></div>
                <div class="h-10 bg-gray-200 rounded w-16"></div>
              </div>
            </div>

            <!-- Quantité et bouton -->
            <div class="flex items-center space-x-4 mb-6">
              <div class="h-10 bg-gray-200 rounded w-20"></div>
              <div class="h-12 bg-gray-200 rounded w-48"></div>
            </div>

            <!-- Informations supplémentaires -->
            <div class="space-y-3">
              <div class="h-4 bg-gray-200 rounded w-2/3"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-16">
      <div class="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
        <h2 class="text-xl font-semibold text-red-800 mb-2">Produit non trouvé</h2>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <NuxtLink to="/categories"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
          Retour aux catégories
        </NuxtLink>
      </div>
    </div>

    <!-- Product Content -->
    <div v-else-if="product">
      <!-- Breadcrumb -->
      <nav class="mb-8">
        <ol class="flex items-center space-x-2 text-sm text-gray-500  overflow-x-auto scrollbar-hide pr-4 md:pr-0">
          <li>
            <NuxtLink to="/" class="hover:text-gray-700">Accueil</NuxtLink>
          </li>
          <li v-for="category in product.categories" :key="category.id" class="flex items-center">
            <span class="mx-2 text-gray-400">›</span>
            <NuxtLink :to="`/categorie/${category.slug}`" class="hover:text-gray-700 truncate">
              {{ category.name }}
            </NuxtLink>
          </li>
          <li class="flex items-center text-gray-900 truncate">
            <span class="mx-2 text-gray-400">›</span>
            {{ product.name }}
          </li>
        </ol>
      </nav>

      <div class="flex flex-col lg:flex-row gap-4 mb-8">
        <!-- Images du produit -->
        <div class="lg:w-2/3 space-y-4">
          <!-- Image principale -->
          <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img v-if="selectedImage" :src="selectedImage.src" :alt="selectedImage.alt || product.name"
              class="w-full h-full object-cover cursor-zoom-in p-8 bg-white" @click="openLightbox" />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <span>Aucune image</span>
            </div>
          </div>

          <!-- Miniatures -->
          <div v-if="product.images && product.images.length > 1" class="flex space-x-2 overflow-x-auto pb-2">
            <button v-for="(image, index) in product.images" :key="image.id" @click="selectedImageIndex = index" :class="[
              'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
              selectedImageIndex === index ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'
            ]">
              <img :src="image.src" :alt="image.alt" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Informations du produit -->
        <div class="w-3/3 space-y-6 rounded-md p-3 bg-white border border-gray-50 shadow shadow-gray-100 md:p-8">
          <div>
            <h1 class="text-[18px] font-medium text-gray-700 mb-2">{{ product.name }}</h1>

            <!-- Évaluation -->
            <div v-if="product.rating_count > 0" class="flex items-baseline mb-4">
              <div class="flex items-center">
                <span v-for="n in 5" :key="n" class="text-yellow-400">
                  {{ n <= Math.floor(product.rating_average) ? '★' : '☆' }} </span>
              </div>
              <span class="ml-2 text-sm text-gray-600">
                ({{ product.rating_count }} avis)
              </span>
            </div>
          </div>

          <!-- Prix -->
          <div class="space-y-2">
            <div v-if="product.on_sale" class="flex md:items-center items-end space-x-3">
              <span class="md:text-2xl text-xl font-bold text-gray-800">
                {{ formatPrice(product.sale_price) }}
              </span>
              <span class="md:text-lg text-md text-gray-500 line-through">
                {{ formatPrice(product.regular_price) }}
              </span>
              <span class="bg-red-100 text-red-800 md:text-sm text-[12px] font-medium px-2 py-1 rounded">
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
            <span :class="[
              'px-3 py-1 rounded-full md:text-sm text-[12px] font-medium',
              getStockStatusClass(product.stock_status)
            ]">
              {{ getStockStatusText(product.stock_status) }}
            </span>
            <span v-if="product.sku" class="md:text-sm text-[12px] text-gray-500">
              SKU: {{ product.sku }}
            </span>
          </div>

          <!-- Attributs du produit -->
          <div v-if="visibleAttributes.length > 0" class="space-y-3">
            <h3 class="font-semibold text-gray-900">Caractéristiques</h3>
            <dl class="grid grid-cols-1 gap-2">
              <div v-for="attribute in visibleAttributes" :key="attribute.slug" class="flex">
                <dt class="font-medium text-gray-700 w-1/3">{{ attribute.name }}:</dt>
                <dd class="text-gray-600">{{ Array.isArray(attribute.values) ? attribute.values.join(', ') :
                  attribute.values }}</dd>
              </div>
            </dl>
          </div>

          <!-- Actions -->
          <div class="flex space-x-2 md:space-x-4 space-y-4 pt-6 border-t">
            <div class="flex items-center space-x-4">
              <div class="flex items-center">
                <label for="quantity" class="block text-[12px] md:text-sm font-medium text-gray-700 mr-2">
                  Quantité:
                </label>
                <input id="quantity" v-model.number="quantity" type="number" min="1"
                  :max="product.stock_quantity || 999"
                  class="md:w-20 w-10 text-center px-1 md:px-3 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>


            <div class="w-full md:flex items-center md:-mt-4 justify-between gap-x-2.5">
              <!-- ajouter au panier  -->
              <div class="w-full">
                <button v-if="product.in_stock" @click="addToCart"
                  class="flex w-full h-13 cursor-pointer bg-[#f19100] hover:bg-[#ff9900]/80 text-white font-semibold py-3 px-4 rounded-[4px] transition-colors items-center justify-center space-x-2">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 21v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2">
                    </path>
                  </svg>
                  <span class="cursor-pointer">Achetez maintenant</span>
                </button>
                <button v-else disabled
                  class="w-full bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg cursor-not-allowed">
                  Produit indisponible
                </button>
              </div>
               <h4 class="text-md md:text-lg font-bold hidden">Ou</h4>
              <!-- commander par whatsapp -->
              <div class="hidden w-full overflow-x-auto">
                <button @click="orderViaWhatsapp"
                  class="flex max-w-[270px] md:w-full h-13 min-w-[210px] cursor-pointer bg-[#1aaa0f] hover:bg-[#138c0ade] text-white text-sm md:text-[12px] font-medium md:font-semibold md:py-3 md:px-2 rounded-[4px] transition-colors items-center justify-center space-x-2">
                  <img src="/logo/whatsapp-order.png" class="w-5 h-5 md:w-6 md:h-6" width="24" height="24"/>
                  <span class="text-center text-[12px] md:text-[14px]">Commander par WhatsApp</span>
                </button>
              </div>
            </div>
          </div>


          <!-- <button v-if="product.in_stock" @click="addToCart"
                  class="w-full hidden h-13 cursor-pointer bg-[#f19100] hover:bg-[#ff9900]/80 text-white font-semibold py-3 px-4 rounded-[4px] transition-colors flex items-center justify-center space-x-2">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 21v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2">
                    </path>
                  </svg>
                  <span class="cursor-pointer">Achetez maintenant</span>
                </button> -->


          <div class="flex flex-col lg:flex-row md:gap-x-2 items-center justify-between">

            <!--Methode de paiement disponoble-->
            <div
              class="w-full md:w-full flex-col lg:flex-row md:items-center gap-x-1 bg-sky-50 px-4 md:py-4.5 py-4 rounded-md">
              <span class="text-[15px] md:text-md mb-4 md:mb-0 font-bold text-sky-800 text-center md:text-left">Paiement
                sécurisé, simple et rapide</span>
              <div class="flex flex-row items-center gap-x-3 md:mt-4">
                <ul v-for="methode in logoMethodePaiement" :key="methode.name">
                  <li>
                    <NuxtLink to="">
                      <img :src="methode.logo" :alt="methode.name" class="w-12 h-12 rounded-full shadow-md mt-4 md:mt-0"
                        loading="lazy" decoding="async" width="48" height="48">
                      <!-- <p class="text-sm text-sky-700 font-bold text-center mt-2">{{ methode.name }}</p> -->

                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </div>

            <!--besoin d'aide-->
            <div class="flex w-full md:w-full gap-x-2.5 mt-3 md:mt-0  items-center bg-slate-50 p-4 rounded-sm">
              <img src="/logo/call.png" alt="Besoin d'aide" class="w-20 h-20 rounded-full shadow-md " loading="lazy"
                decoding="async" height="46">
              <div>
                <span class="text-[13px] font-bold text-gray-900">Besoin d'aide pour Acheter ?</span>
                <p>Cliquez et appeler</p>
                <button class="mt-4 md:py-1 py-1">
                  <NuxtLink to=""
                    class=" border-amber-400 border-2 px-3 text-[16px] md:text-[19px] text-[#f90] py-2 rounded-sm text-xl font-bold hover:text-[#fff] hover:bg-[#f90] hover:border-[#f90] cursor-pointer transition-all duration-300">
                    +225 0701518845</NuxtLink>
                </button>
              </div>
            </div>

          </div>

          <!-- Informations additionnelles -->
          <div class="text-sm text-gray-600   space-y-1 pt-4 border-t">
            <p v-if="product.weight">Poids: {{ product.weight }}g</p>
            <p v-if="product.dimensions.length">
              Dimensions: {{ product.dimensions.length }} × {{ product.dimensions.width }} × {{
                product.dimensions.height }} cm
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
                <span v-for="(tag, index) in product.tags" :key="tag.id"
                  class="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                  {{ tag.name }}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Description détaillée -->
      <div v-if="product.description"
        class="mb-16 bg-white border border-gray-100 shadow-md p-6 md:px-8 shadow-gray-100 md:p-8 rounded-sm">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Description</h2>
        <div class="prose max-w-none">
          <div v-html="product.description"></div>
        </div>
      </div>

      <!-- Produits associés -->
      <div v-if="relatedProducts.length > 0" class="mb-16">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Produits similaires</h2>
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-1 md:gap-4">
          <div v-for="relatedProduct in relatedProducts" :key="relatedProduct.id"
            class="border rounded-md bg-white overflow-hidden shadow-sm shadow-slate-100 hover:shadow-md transition-shadow">
            <NuxtLink :to="`/produit/${relatedProduct.slug}`">
              <div class="aspect-square bg-white">
                <img v-if="relatedProduct.image" :src="relatedProduct.image.src"
                  :alt="relatedProduct.image.alt || relatedProduct.name" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                  <span>Aucune image</span>
                </div>
              </div>
              <div class="p-4">
                <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">{{ relatedProduct.name }}</h3>
                <div class="flex flex-col items-start">
                  <span v-if="relatedProduct.sale_price" class="text-red-600 font-bold">
                    {{ formatPrice(relatedProduct.sale_price) }}
                  </span>
                  <span
                    :class="relatedProduct.sale_price ? 'line-through text-gray-500 text-sm' : 'text-gray-700 font-semibold'">
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
    <div v-if="lightboxOpen" class="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
      @click="closeLightbox">
      <div class="relative max-w-4xl max-h-full">
        <img :src="selectedImage?.src" :alt="selectedImage?.alt" class="max-w-full max-h-full object-contain" />
        <button @click="closeLightbox"
          class="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full w-10 h-10 flex items-center justify-center">
          ✕
        </button>

        <!-- Navigation des images -->
        <button v-if="product.images.length > 1 && selectedImageIndex > 0" @click.stop="selectedImageIndex--"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full w-12 h-12 flex items-center justify-center">
          ‹
        </button>
        <button v-if="product.images.length > 1 && selectedImageIndex < product.images.length - 1"
          @click.stop="selectedImageIndex++"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full w-12 h-12 flex items-center justify-center">
          ›
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const productSlug = route.params.slug as string

// Données du produit avec cache
const { data, pending: loading, error: fetchError } = await useLazyFetch(`/api/woocommerce/product/${productSlug}`, {
  key: `product-${productSlug}`,
  server: true,
  default: () => ({ product: null, relatedProducts: [], categories: [] })
})

const product = computed(() => (data.value as any)?.product)
const relatedProducts = computed(() => (data.value as any)?.relatedProducts || [])
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
  return product.value?.attributes?.filter((attr: any) => attr.visible) || []
})

// Formatage du prix
const formatPrice = (price: string | number) => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price

  return new Intl.NumberFormat("en-US", {
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

  // Préparer les données du produit pour le panier, en incluant l'image correctement formatée
  const cartProduct = {
    ...product.value,
    image: getProductImageData(product.value)
  }

  cartStore.addItem(cartProduct, quantity.value)
  cartStore.openCart()

  // Google Analytics - Add to Cart Event
  if (process.client) {
    // Initialiser dataLayer si nécessaire
    ;(window as any).dataLayer = (window as any).dataLayer || []

    // Déterminer le prix à utiliser (sale_price si en promotion, sinon regular_price ou price)
    const finalPrice = product.value.on_sale 
      ? (product.value.sale_price || product.value.price || 0)
      : (product.value.regular_price || product.value.price || 0)
    
    // Convertir en nombre si c'est une string
    const productPrice = typeof finalPrice === 'string' ? parseFloat(finalPrice) : (finalPrice || 0)
    
    // Extraire la catégorie
    const categories = product.value.categories || []
    const productCategory = categories.length > 0 ? (categories[0].name || 'Non renseigné') : 'Non renseigné'
    
    // Obtenir le lien du produit
    const productLink = window.location.href

    // Envoyer l'événement add_to_cart à dataLayer
    ;(window as any).dataLayer.push({
      event: 'add_to_cart',
      ecommerce: {
        currency: 'XOF',
        value: productPrice * quantity.value,
        items: [
          {
            item_id: String(product.value.sku || product.value.id),
            item_name: product.value.name,
            item_category: productCategory,
            item_url: productLink,
            price: productPrice,
            quantity: quantity.value
          }
        ]
      }
    })

    console.log('🛒 add_to_cart envoyé :', {
      nom: product.value.name,
      prix: productPrice,
      lien: productLink,
      quantité: quantity.value,
      stock_quantity: product.value.stock_quantity
    })
  }
}

const orderViaWhatsapp = () => {
  if (!product.value) return;

  const phoneNumber = '2250556160699'; // Numéro WhatsApp
  const productName = product.value.name;
  const productPrice = product.value.on_sale ? formatPrice(product.value.sale_price) : formatPrice(product.value.price);
  const productLink = window.location.href;

  const message = `Bonjour, je souhaite commander le produit suivant :%0A%0A*Nom du produit:* ${productName}%0A*Prix:* ${productPrice}%0A*Lien du produit:* ${productLink}%0A%0AMerci.`;

  window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
};

// Récupérer les données d'image pour le panier
const getProductImageData = (product: any) => {
  // Priorité 1: L'image actuellement sélectionnée sur la page produit
  if (selectedImage.value) {
    return {
      src: selectedImage.value.src,
      alt: selectedImage.value.alt || product.name
    }
  }

  // Priorité 2: La première image du tableau d'images du produit
  if (product.images && product.images.length > 0) {
    return {
      src: product.images[0]?.src || '/images/placeholder-product.jpg',
      alt: product.images[0]?.alt || product.name
    }
  }

  // Priorité 3: Le champ thumbnail du produit (s'il existe)
  if (product.thumbnail) {
    return {
      src: product.thumbnail,
      alt: product.name
    }
  }

  // Fallback: Image de remplacement
  return {
    src: '/images/placeholder-product.jpg',
    alt: product.name
  }
}

const openLightbox = () => {
  lightboxOpen.value = true
}

const closeLightbox = () => {
  lightboxOpen.value = false
}

const logoMethodePaiement = [
  {
    name: 'Cash',
    logo: '/logo/cash.webp'
  },

  {
    name: 'OM',
    logo: '/logo/methodeOM.webp'
  },
  {
    name: 'Momo',
    logo: '/logo/lgomomo.jpg'
  },
  {
    name: 'Wave',
    logo: '/logo/wave.webp'
  },
  {
    name: 'Visa',
    logo: '/logo/visa.webp'
  }
]

// Google Analytics - View Item Event via dataLayer
onMounted(() => {
  // Attendre que le produit soit chargé
  const sendViewItemEvent = () => {
    if (!product.value || loading.value) return
    
    if (process.client) {
      // Initialiser dataLayer si nécessaire
      ;(window as any).dataLayer = (window as any).dataLayer || []
      
      // Déterminer le prix à utiliser (sale_price si en promotion, sinon regular_price ou price)
      const finalPrice = product.value.on_sale 
        ? (product.value.sale_price || product.value.price || 0)
        : (product.value.regular_price || product.value.price || 0)
      
      // Convertir en nombre si c'est une string
      const productPrice = typeof finalPrice === 'string' ? parseFloat(finalPrice) : (finalPrice || 0)
      
      // Extraire la catégorie
      const categories = product.value.categories || []
      const productCategory = categories.length > 0 ? (categories[0].name || '') : ''
      
      // Envoyer l'événement à dataLayer
      ;(window as any).dataLayer.push({
        event: 'view_item',
        ecommerce: {
          currency: 'XOF',
          value: productPrice,
          items: [
            {
              item_id: product.value.id,
              item_name: product.value.name,
              item_category: productCategory,
              price: productPrice,
              quantity: 1
            }
          ]
        }
      })
    }
  }
  
  // Si le produit est déjà chargé, envoyer immédiatement
  if (product.value && !loading.value) {
    sendViewItemEvent()
  } else {
    // Sinon, attendre que le produit soit chargé en observant les changements
    const unwatch = watch([product, loading], () => {
      if (product.value && !loading.value) {
        sendViewItemEvent()
        unwatch() // Arrêter de surveiller une fois que l'événement est envoyé
      }
    }, { immediate: true })
  }
});
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

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  color: #111827;
  font-weight: 600;
}

.prose p {
  margin-bottom: 1rem;
}

.prose ul,
.prose ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.prose li {
  margin-bottom: 0.25rem;
}
</style>
