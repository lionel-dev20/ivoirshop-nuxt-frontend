<!-- pages/checkout.vue -->
<template>
  <div class="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Redirection si panier vide -->
    <div v-if="cartStore.isEmpty" class="text-center py-16">
      <div class="max-w-md mx-auto">
        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M34 6l4 24H10l4-24m4 0V4a2 2 0 012-2h4a2 2 0 012 2v2m-6 12a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
        <h2 class="mt-4 text-xl font-semibold text-gray-900">Votre panier est vide</h2>
        <p class="mt-2 text-gray-600">Ajoutez des produits pour passer commande.</p>
        <NuxtLink
          to="/categorie"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Voir les produits
        </NuxtLink>
      </div>
    </div>

    <!-- Formulaire de commande -->
    <div v-else>
      <h1 class="text-2xl font-bold text-gray-900 mb-8">Finaliser la commande</h1>

      <form @submit.prevent="submitOrder" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Informations de livraison -->
        <div class="space-y-6">
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations de livraison</h2>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
                  Prénom <span class="text-red-600">*</span>
                </label>
                <input
                  id="firstName"
                  v-model="orderForm.firstName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
                  Nom <span class="text-red-600">*</span>
                </label>
                <input
                  id="lastName"
                  v-model="orderForm.lastName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                  Email (optionnel)
                </label>
                <input
                  id="email"
                  v-model="orderForm.email"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone <span class="text-red-600">*</span>
                </label>
                <input
                  id="phone"
                  v-model="orderForm.phone"
                  type="tel"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
              <h3 class="font-medium text-orange-700 mb-2 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Adresse de livraison
              </h3>
              <div class="text-sm text-orange-700">
                <p v-if="orderForm.city && orderForm.commune">
                  <span class="font-medium">Ville:</span> {{ orderForm.city }}
                </p>
                <p v-if="orderForm.city && orderForm.commune">
                  <span class="font-medium">Commune:</span> {{ orderForm.commune }}
                </p>
                <p v-else class="text-blue-600">
                  Veuillez sélectionner une ville et un quartier ci-dessous
                </p>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label for="city" class="block text-sm font-medium text-gray-700 mb-1">
                  Région <span class="text-red-600">*</span>
                </label>
                <select
                  id="city"
                  v-model="orderForm.city"
                  @change="onCityChange"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une ville</option>
                  <option v-for="city in cities" :key="city.id" :value="city.name">
                    {{ city.name }}
                  </option>
                </select>
              </div>
              <div>
                <label for="commune" class="block text-sm font-medium text-gray-700 mb-1">
                  Commune/ville <span class="text-red-600">*</span>
                </label>
                <select
                  id="commune"
                  v-model="orderForm.commune"
                  @change="onCommuneChange"
                  :disabled="!orderForm.city"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">Sélectionner un quartier</option>
                  <option v-for="commune in filteredCommunes" :key="commune.id" :value="commune.name">
                    {{ commune.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Type de produit - Automatique selon le panier -->
            <div v-if="orderForm.commune" class="mt-4">
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-blue-900 mb-1">
                      Type de livraison déterminé automatiquement
                    </h4>
                    <p class="text-sm text-blue-700">
                      Catégorie: <span class="font-semibold">{{ getProductTypeLabel(selectedProductType) }}</span>
                    </p>
                    <p class="text-xs text-blue-600 mt-1">
                      <!-- Basé sur les produits de votre panier (classe de livraison WooCommerce) -->
                    </p>
                    <div v-if="orderForm.city && orderForm.commune" class="mt-2 space-y-1">
                      <p class="text-sm text-blue-700">
                        <span class="font-medium">Ville:</span> {{ orderForm.city }}
                      </p>
                      <p class="text-sm text-blue-700">
                        <span class="font-medium">Quartier:</span> {{ orderForm.commune }}
                      </p>
                      <p class="text-sm text-blue-700">
                        <span class="font-medium">Type:</span> {{ selectedProductType }}
                      </p>
                      <p class="text-base font-semibold text-blue-900 mt-2 bg-white px-3 py-2 rounded">
                        Frais de livraison: {{ formatPrice(getPrice(orderForm.city, orderForm.commune, selectedProductType)) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Récapitulatif livraison -->
            <!-- <div v-if="deliveryStore.hasSelectedDelivery" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <h3 class="font-medium text-blue-900 mb-2 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Récapitulatif livraison
              </h3>
              <div class="text-sm text-blue-800 space-y-1">
                <p><span class="font-medium">Ville:</span> {{ orderForm.city }}</p>
                <p><span class="font-medium">Commune:</span> {{ orderForm.commune }}</p>
                <p><span class="font-medium">Type:</span> {{ getProductTypeLabel(selectedProductType) }}</p>
                <p class="text-base font-semibold text-blue-900 mt-2">
                  <span class="font-medium">Frais:</span> {{ deliveryStore.formattedShippingCost }}
                </p>
              </div>
            </div> -->

            <div v-if="orderForm.commune" class="mt-4">
              <label for="deliveryAddressDetails" class="block text-sm font-medium text-gray-700 mb-1">
                Où souhaitez-vous être livré exactement ? (Rue, numéro, indications spécifiques...) <span class="text-red-600">*</span>
              </label>
              <textarea
                id="deliveryAddressDetails"
                v-model="orderForm.deliveryAddressDetails"
                rows="3"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Rue des Jardins, Immeuble Alpha, 2ème étage, porte B. Près du supermarché."
              ></textarea>
            </div>

            <div class="mt-4">
              <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">
                Notes de commande <span class="text-red-600">(optionnel)</span>
              </label>
              <textarea
                id="notes"
                v-model="orderForm.notes"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Instructions spéciales, informations complémentaires..."
              ></textarea>
            </div>
          </div>

          <!-- Code coupon -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Code promotionnel
            </h2>
            
            <div v-if="!deliveryStore.hasCoupon" class="flex space-x-2">
              <input
                v-model="couponCode"
                type="text"
                placeholder="Entrez votre code coupon"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @keypress.enter.prevent="applyCoupon"
              />
              <button
                type="button"
                @click="applyCoupon"
                :disabled="!couponCode.trim() || deliveryStore.isApplyingCoupon"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <span v-if="deliveryStore.isApplyingCoupon" class="animate-spin">⏳</span>
                <span>{{ deliveryStore.isApplyingCoupon ? 'Vérification...' : 'Appliquer' }}</span>
              </button>
            </div>

            <div v-else class="bg-green-50 border border-green-200 rounded-md p-4">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <p class="font-medium text-green-900">Code coupon appliqué</p>
                  </div>
                  <p class="text-sm text-green-700 mt-1">{{ deliveryStore.appliedCoupon?.code }}</p>
                  <p v-if="deliveryStore.appliedCoupon?.description" class="text-sm text-green-600 mt-1">
                    {{ deliveryStore.appliedCoupon.description }}
                  </p>
                  <p class="font-semibold text-green-900 mt-2">
                    Réduction: {{ deliveryStore.appliedCoupon?.formatted_discount }}
                  </p>
                </div>
                <button
                  type="button"
                  @click="removeCoupon"
                  class="text-red-600 hover:text-red-800 p-1 ml-4"
                  title="Supprimer le coupon"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Méthode de paiement -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Méthode de paiement</h2>
            
            <label class="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
              <input
                v-model="orderForm.paymentMethod"
                type="radio"
                value="cod"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <div class="ml-3 flex-1">
                <div class="font-medium text-gray-900">Paiement à la livraison</div>
                <div class="text-sm text-gray-500">Payez en espèces lors de la réception</div>
              </div>
              <p class="text-green-800 font-bold">FCFA</p>
            </label>
          </div>
        </div>

        <!-- Récapitulatif de commande -->
        <div class="space-y-6">
          <div class="bg-white rounded-lg shadow p-6 sticky top-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h2>
            
            <!-- Articles -->
            <div class="space-y-4 mb-6">
              <div v-for="item in cartStore.items" :key="item.id" class="flex items-center space-x-4 py-3 border-b border-gray-200 last:border-b-0">
                <div class="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    v-if="item.image"
                    :src="item.image.src"
                    :alt="item.image.alt"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    Aucune image
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</h3>
                  <p class="text-sm text-gray-500">Quantité: {{ item.quantity }}</p>
                  <p class="text-sm font-medium text-gray-900">
                    {{ cartStore.formatPrice((item.sale_price || item.price) * item.quantity) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Totaux -->
            <div class="space-y-2 py-4 border-t border-gray-200">
              <div class="flex justify-between text-sm text-gray-600">
                <span>Sous-total</span>
                <span>{{ cartStore.formattedTotal }}</span>
              </div>
              
              <div v-if="deliveryStore.hasSelectedDelivery" class="flex justify-between text-sm text-gray-600">
                <span>Livraison - {{ orderForm.commune }}</span>
                <span>{{ deliveryStore.formattedShippingCost }}</span>
              </div>
              
              <div v-if="deliveryStore.hasCoupon" class="flex justify-between text-sm text-green-600">
                <span>Réduction ({{ deliveryStore.appliedCoupon?.code }})</span>
                <span>-{{ deliveryStore.appliedCoupon?.formatted_discount }}</span>
              </div>
              
              <div class="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{{ formatPrice(finalTotal) }}</span>
              </div>
            </div>

            <!-- Bouton de commande -->
            <button
              type="submit"
              :disabled="isSubmitting || !canSubmit"
              class="w-full mt-6 bg-orange-500 cursor-pointer hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
            >
              <span v-if="isSubmitting" class="animate-spin">⏳</span>
              <span>{{ isSubmitting ? 'Traitement...' : `Confirmer la commande - ${formatPrice(finalTotal)}` }}</span>
            </button>

            <!-- Informations légales -->
            <div class="mt-4 text-xs text-gray-500 space-y-1">
              <p class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Paiement sécurisé à la livraison
              </p>
              <p class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Livraison sous 2-3 jours ouvrés
              </p>
              <p class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Retour gratuit sous 14 jours
              </p>
            </div>
          </div>

          <!-- Politique de livraison -->
          <div class="bg-blue-50 rounded-lg p-4">
            <h3 class="text-sm font-semibold text-blue-900 mb-2">Information livraison</h3>
            <ul class="text-sm text-blue-800 space-y-1">
              <li>• Tarifs de livraison selon la zone et le poids</li>
              <li>• Délai de livraison: 2-3 jours ouvrés</li>
              <li>• Paiement à la réception de votre commande</li>
              <li>• Service client: +225 07 01 51 88 45</li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import deliveryZones from '~/data/delivery-zones.json'
// Nuxt 3 automatically imports ref, computed, onMounted, watch
import { useAuth } from '~/composables/useAuth'

const cartStore = useCartStore()
const deliveryStore = useDeliveryStore()
const { user: authUser } = useAuth() // Récupérer l'utilisateur connecté

// SEO
useSeoMeta({
  title: 'Checkout - Ma Boutique',
  description: 'Finalisez votre commande en toute sécurité'
})

// Google Analytics (gtag.js)
useHead({
  script: [
    {
      src: 'https://www.googletagmanager.com/gtag/js?id=G-SRMB4DV3VY',
      async: true,
      type: 'text/javascript'
    },
    {
      innerHTML: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-SRMB4DV3VY');
      `,
      type: 'text/javascript'
    }
  ]
})

// Redirection si panier vide (uniquement côté client)
if (process.client && cartStore.isEmpty) {
  await navigateTo('/categorie')
}

// État du formulaire
const orderForm = ref({
  firstName: authUser.value?.first_name || '',
  lastName: authUser.value?.last_name || '',
  email: authUser.value?.email || '',
  phone: '',
  notes: '',
  paymentMethod: 'cod',
  city: '',
  commune: '',
  deliveryAddressDetails: ''
})

const isSubmitting = ref(false)

// États pour les zones de livraison
const cities = ref(deliveryZones.map(zone => ({ id: zone.id, name: zone.name })))
const filteredCommunes = ref<{ id: number; name: string, price_light: number, price_medium: number, price_heavy: number }[]>([])

// Utiliser automatiquement le shipping_class le plus lourd du panier
const selectedProductType = computed(() => {
  const heaviest = cartStore.heaviestShippingClass
  console.log('🎯 Shipping class le plus lourd du panier:', heaviest)
  console.log('📦 Articles dans le panier:', cartStore.items.map(item => ({
    name: item.name,
    shipping_class: item.shipping_class,
    weight: item.weight
  })))
  return heaviest
})

// État pour les coupons
const couponCode = ref('')

// Types de produits disponibles
const allProductTypes = [
  { value: 'light', label: 'Léger', description: 'Moins de 2kg' },
  { value: 'medium', label: 'Moyen', description: '2kg à 10kg' },
  { value: 'heavy', label: 'Lourd', description: 'Plus de 10kg' }
]

// Filtrer les types de produits en fonction des produits du panier
const productTypes = computed(() => {
  const cartShippingClasses = new Set<string>()
  
  cartStore.items.forEach(item => {
    if (item.shipping_class) {
      cartShippingClasses.add(item.shipping_class)
    }
  })
  
  if (cartShippingClasses.size === 0) {
    return allProductTypes
  }
  
  return allProductTypes.filter(type => cartShippingClasses.has(type.value))
})

// Calculs
const finalTotal = computed(() => {
  let total = cartStore.totalPrice
  
  if (deliveryStore.hasSelectedDelivery) {
    total += deliveryStore.selectedDelivery.shipping_cost
  }
  
  if (deliveryStore.hasCoupon) {
    total -= deliveryStore.couponDiscount
  }
  
  return Math.max(0, total)
})

const canSubmit = computed(() => {
  return deliveryStore.hasSelectedDelivery && 
         orderForm.value.firstName && 
         orderForm.value.lastName && 
         orderForm.value.phone && 
         orderForm.value.city && 
         orderForm.value.commune && 
         !isSubmitting.value
})

// Fonctions utilitaires
const formatPrice = (price: string | number) => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice) + " FCFA"
}

const getPrice = (cityName: string, communeName: string, productType: 'light' | 'medium' | 'heavy') => {
  console.log('💵 getPrice appelé:', { cityName, communeName, productType })
  
  if (!cityName || !communeName || !productType) {
    console.log('⚠️ Paramètres manquants:', { cityName, communeName, productType })
    return 0
  }
  
  const city = deliveryZones.find(c => c.name === cityName)
  if (!city) {
    console.log('❌ Ville non trouvée:', cityName)
    console.log('🔍 Villes disponibles:', deliveryZones.map(z => z.name))
    return 0
  }
  
  console.log('✅ Ville trouvée:', city.name, '- Nombre de communes:', city.communes.length)
  
  const commune = city.communes.find(c => c.name === communeName)
  if (!commune) {
    console.log('❌ Commune non trouvée:', communeName)
    console.log('🔍 Communes disponibles:', city.communes.map(c => c.name))
    return 0
  }
  
  console.log('✅ Commune trouvée:', commune.name, '- Prix:', {
    light: commune.price_light,
    medium: commune.price_medium,
    heavy: commune.price_heavy
  })
  
  let price = 0
  const priceKey = `price_${productType}` as 'price_light' | 'price_medium' | 'price_heavy'
  price = commune[priceKey] || 0
  
  console.log(`💰 Prix final pour type "${productType}" (clé: ${priceKey}):`, price)
  
  if (price === 0) {
    console.warn('⚠️ ATTENTION: Prix de livraison = 0! Vérifiez les données dans delivery-zones.json')
  }
  
  return price
}

const getProductTypeLabel = (type: string) => {
  const productType = allProductTypes.find((t: any) => t.value === type)
  return productType ? productType.label : type
}

// Actions pour les zones de livraison
const onCityChange = () => {
  const selectedCity = deliveryZones.find(c => c.name === orderForm.value.city)
  if (selectedCity) {
    filteredCommunes.value = selectedCity.communes
    deliveryStore.selectCityByName(selectedCity.name)
    orderForm.value.commune = ''
  } else {
    filteredCommunes.value = []
    orderForm.value.commune = ''
    deliveryStore.selectCityByName('')
  }
}

const onCommuneChange = () => {
  const selectedCity = deliveryZones.find(c => c.name === orderForm.value.city)
  const selectedCommune = selectedCity?.communes.find(c => c.name === orderForm.value.commune)

  console.log('🏙️ onCommuneChange appelé:', {
    city: orderForm.value.city,
    commune: orderForm.value.commune,
    selectedCity: selectedCity?.name,
    selectedCommune: selectedCommune?.name
  })

  if (selectedCity && selectedCommune) {
    // Utiliser le shipping_class le plus lourd du panier
    const productType = selectedProductType.value
    
    console.log('📦 Type de produit détecté:', productType)
    console.log('🛒 Articles dans le panier:', cartStore.items.map(item => ({
      name: item.name,
      shipping_class: item.shipping_class,
      weight: item.weight
    })))
    
    const shippingCost = getPrice(selectedCity.name, selectedCommune.name, productType)
    
    console.log('💰 Calcul frais de livraison:', {
      city: selectedCity.name,
      commune: selectedCommune.name,
      productType: productType,
      commune_data: {
        price_light: selectedCommune.price_light,
        price_medium: selectedCommune.price_medium,
        price_heavy: selectedCommune.price_heavy
      },
      shippingCost: shippingCost
    })
    
    // Mettre à jour le type de produit dans le store
    deliveryStore.setProductType(productType)
    // Mettre à jour les frais de livraison
    deliveryStore.selectCommuneByName(selectedCommune.name, shippingCost)
    
    console.log('✅ Store mis à jour:', {
      product_type: deliveryStore.selectedDelivery.product_type,
      shipping_cost: deliveryStore.selectedDelivery.shipping_cost,
      formatted: deliveryStore.formattedShippingCost
    })
  } else {
    console.log('❌ Ville ou commune non trouvée')
    deliveryStore.selectCommuneByName('', 0)
  }
}

// onProductTypeChange n'est plus nécessaire - le type est automatiquement déterminé par le panier

// Actions pour les coupons
const applyCoupon = async () => {
  if (!couponCode.value.trim()) return
  
  try {
    await deliveryStore.applyCoupon(couponCode.value, cartStore.totalPrice)
    couponCode.value = ''
  } catch (error: any) {
    alert(error.message)
  }
}

const removeCoupon = () => {
  deliveryStore.removeCoupon()
}

// Soumission de commande
const submitOrder = async () => {
  if (!deliveryStore.hasSelectedDelivery) {
    alert('Veuillez sélectionner une zone de livraison')
    return
  }
  
  isSubmitting.value = true
  
  try {
    const orderData = {
      customer: orderForm.value,
      customer_id: authUser.value?.id || 0, // Ajouter l'ID de l'utilisateur connecté
      items: cartStore.items,
      total: finalTotal.value,
      shipping_cost: deliveryStore.selectedDelivery.shipping_cost,
      payment_method: orderForm.value.paymentMethod,
      billing: {
        first_name: orderForm.value.firstName,
        last_name: orderForm.value.lastName,
        email: orderForm.value.email,
        phone: orderForm.value.phone,
        address_1: orderForm.value.commune, // Commune/Quartier
        city: orderForm.value.city, // Région
        state: '',
        postcode: '',
        country: 'CI'
      },
      shipping: {
        first_name: orderForm.value.firstName,
        last_name: orderForm.value.lastName,
        email: orderForm.value.email,
        phone: orderForm.value.phone,
        address_1: orderForm.value.commune, // Commune/Quartier pour address_1
        city: orderForm.value.city, // Région pour city
        state: '',
        postcode: '',
        country: 'CI',
        address_2: orderForm.value.deliveryAddressDetails // Détails supplémentaires
      },
      delivery_info: {
        city_name: orderForm.value.city, // Région
        commune_name: orderForm.value.commune, // Commune/Quartier
        product_type: deliveryStore.selectedDelivery.product_type
      },
      coupon: deliveryStore.appliedCoupon ? {
        code: deliveryStore.appliedCoupon.code,
        discount: deliveryStore.appliedCoupon.discount
      } : null
    }

    // Log pour debug
    console.log('📦 Données commande envoyées:', {
      billing_city: orderData.billing.city,
      billing_address_1: orderData.billing.address_1,
      shipping_city: orderData.shipping.city,
      shipping_address_1: orderData.shipping.address_1,
      shipping_address_2: orderData.shipping.address_2
    })

    const response = await $fetch('/api/orders/create', {
      method: 'POST',
      body: orderData
    })

    if (response.success) {
      const thankYouData = {
        order_id: (response as any).order_id,
        order_number: (response as any).order_number,
        order_status: (response as any).order_status,
        total: finalTotal.value,
        date: new Date().toISOString(),
        customer: { ...orderForm.value },
        items: cartStore.items.map(item => ({
          product_id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.sale_price || item.price,
          image: item.image
        })),
        shipping_cost: deliveryStore.selectedDelivery.shipping_cost,
        delivery_info: deliveryStore.selectedDelivery,
        coupon: deliveryStore.appliedCoupon,
        payment_method: orderForm.value.paymentMethod,
        customer_id: authUser.value?.id || 0, // Ajouter l'ID client au thankYouData
      }
      
      if (process.client) {
        sessionStorage.setItem('lastOrder', JSON.stringify(thankYouData))
      }
      
      cartStore.clearCart()
      deliveryStore.resetDelivery()
      deliveryStore.removeCoupon()
      
      try {
        await navigateTo('/thank-you', { 
          replace: true,
          external: false
        })
      } catch (navError) {
        console.error('Erreur de navigation:', navError)
        if (process.client) {
          window.location.href = '/thank-you'
        }
      }
    } else {
      throw new Error((response as any).message || 'Erreur lors de la création de la commande')
    }
  } catch (error: any) {
    console.error('Erreur complète commande:', error)
    
    let errorMessage = 'Erreur inconnue'
    if (error.data?.message) {
      errorMessage = error.data.message
    } else if (error.message) {
      errorMessage = error.message
    }
    
    alert('Erreur lors de la création de la commande: ' + errorMessage)
  } finally {
    isSubmitting.value = false
  }
}

// Le selectedProductType est maintenant automatiquement déterminé par le panier via computed
// Plus besoin de watcher car il est réactif

// Initialisation
onMounted(async () => {
  console.log('🚀 Initialisation page checkout')
  
  // Charger le panier depuis localStorage
  cartStore.loadFromStorage()
  console.log('🛒 Panier chargé:', cartStore.items.length, 'articles')
  
  // Charger les infos de livraison depuis localStorage
  deliveryStore.loadFromStorage()
  
  if (deliveryStore.selectedDelivery.city_name) {
    orderForm.value.city = deliveryStore.selectedDelivery.city_name
    const selectedCity = deliveryZones.find(c => c.name === orderForm.value.city)
    if (selectedCity) {
      filteredCommunes.value = selectedCity.communes
    }
    
    if (deliveryStore.selectedDelivery.commune_name) {
      orderForm.value.commune = deliveryStore.selectedDelivery.commune_name
    }
  }

  // Le selectedProductType est maintenant automatiquement déterminé par le panier
  console.log('📦 Type de produit détecté au montage:', selectedProductType.value)

  // Recalculate shipping cost if city and commune are already selected on mount
  if (orderForm.value.city && orderForm.value.commune) {
    console.log('🔄 Recalcul initial des frais de livraison...')
    onCommuneChange()
  }
})

// Sauvegarde automatique des sélections et recalcul des frais
watch([() => orderForm.value.city, () => orderForm.value.commune, () => cartStore.heaviestShippingClass], ([city, commune, shippingClass], [oldCity, oldCommune, oldShippingClass]) => {
  console.log('👀 Watcher déclenché:', { 
    city, 
    commune, 
    shippingClass,
    oldShippingClass,
    changed: shippingClass !== oldShippingClass 
  })
  
  deliveryStore.saveToStorage()
  // Recalculer les frais de livraison quand le shipping class change ou quand la ville/commune change
  if (city && commune) {
    console.log('🔄 Recalcul des frais de livraison...')
    onCommuneChange()
  }
})
const config = useRuntimeConfig()
const storeUrl = config.public.wcStoreUrl
</script>