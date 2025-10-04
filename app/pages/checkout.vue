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
                  Prénom *
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
                  Nom *
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

            <div class="mt-4">
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                id="email"
                v-model="orderForm.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div class="mt-4">
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                Téléphone *
              </label>
              <input
                id="phone"
                v-model="orderForm.phone"
                type="tel"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Les champs d'adresse sont maintenant automatiquement remplis par la sélection de zone de livraison -->
            <div class="bg-[#ff990013] border border-[#ff990013] rounded-lg p-4 mt-4">
              <h3 class="font-medium text-[#e98d03] mb-2 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Adresse de livraison
              </h3>
              <div class="text-sm text-[#e98d03]">
                <p v-if="deliveryStore.hasSelectedDelivery">
                  <span class="font-medium">Ville:</span> {{ deliveryStore.selectedDelivery.city_name }}
                </p>
                <p v-if="deliveryStore.hasSelectedDelivery">
                  <span class="font-medium">Commune:</span> {{ deliveryStore.selectedDelivery.commune_name }}
                </p>
                <p v-else class="text-blue-600">
                  Veuillez sélectionner une zone de livraison ci-dessous
                </p>
              </div>
            </div>

            <div class="mt-4">
              <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">
                Notes de commande (optionnel)
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

          <!-- Zones de livraison -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Zone de livraison</h2>
            
            <div class="space-y-4">
              <!-- Sélection de la ville -->
              <div>
                <label for="deliveryCity" class="block text-sm font-medium text-gray-700 mb-1">
                  Ville de livraison *
                </label>
                <select
                  id="deliveryCity"
                  v-model="selectedCityId"
                  @change="onCityChange"
                  required
                  :disabled="deliveryStore.isLoadingCities"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">
                    {{ deliveryStore.isLoadingCities ? 'Chargement...' : 'Sélectionner une ville' }}
                  </option>
                  <option v-for="city in deliveryStore.cities" :key="city.id" :value="city.id">
                    {{ city.name }}
                  </option>
                </select>
              </div>

              <!-- Sélection de la commune -->
              <div v-if="selectedCityId">
                <label for="commune" class="block text-sm font-medium text-gray-700 mb-1">
                  Commune *
                </label>
                <select
                  id="commune"
                  v-model="selectedCommuneId"
                  @change="onCommuneChange"
                  required
                  :disabled="deliveryStore.isLoadingCommunes"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">
                    {{ deliveryStore.isLoadingCommunes ? 'Chargement...' : 'Sélectionner une commune' }}
                  </option>
                  <option v-for="commune in deliveryStore.communes" :key="commune.id" :value="commune.id">
                    {{ commune.name }}
                  </option>
                </select>
              </div>

              <!-- Type de produit -->
              <div v-if="selectedCommuneId">
                <label class="block text-sm font-medium text-gray-700 mb-3">
                  Type de produit (pour calculer la livraison) *
                </label>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    v-for="type in productTypes"
                    :key="type.value"
                    class="relative flex cursor-pointer rounded-lg border p-4 focus:outline-none transition-colors"
                    :class="selectedProductType === type.value ? 'border-blue-600 ring-2 ring-blue-600 bg-blue-50' : 'border-gray-300 hover:border-gray-400'"
                  >
                    <input
                      v-model="selectedProductType"
                      :value="type.value"
                      @change="onProductTypeChange"
                      type="radio"
                      name="product-type"
                      class="sr-only"
                    />
                    <div class="flex flex-col">
                      <span class="block text-sm font-medium text-gray-900">{{ type.label }}</span>
                      <span class="block text-xs text-gray-500 mb-2">{{ type.description }}</span>
                      <span v-if="selectedCommuneId" class="block text-sm font-semibold text-blue-600">
                        {{ formatPrice(getPrice(type.value)) }}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Récapitulatif livraison -->
              <div v-if="deliveryStore.hasSelectedDelivery" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <h3 class="font-medium text-blue-900 mb-2 flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Récapitulatif livraison
                </h3>
                <div class="text-sm text-blue-800 space-y-1">
                  <p><span class="font-medium">Ville de facturation:</span> {{ deliveryStore.selectedDelivery.city_name }}</p>
                  <p><span class="font-medium">Adresse de livraison:</span> {{ deliveryStore.selectedDelivery.commune_name }}</p>
                  <p><span class="font-medium">Type de produit:</span> {{ getProductTypeLabel(deliveryStore.selectedDelivery.product_type) }}</p>
                  <p class="text-base font-semibold text-blue-900 mt-2">
                    <span class="font-medium">Frais de livraison:</span> {{ deliveryStore.formattedShippingCost }}
                  </p>
                </div>
              </div>
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
                <div v-if="deliveryStore.isApplyingCoupon" class="animate-pulse">
                  <div class="h-4 w-4 bg-white rounded"></div>
                </div>
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
            
            <div class="space-y-3">
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
                <div class="ml-auto">
                  <!-- <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg> -->
                  <p class="text-green-800 font-bold">FCFA</p>
                </div>
              </label>

              <!-- <label class="flex items-center p-3 border border-gray-200 rounded-md cursor-not-allowed opacity-50">
                <input
                  type="radio"
                  value="card"
                  disabled
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div class="ml-3 flex-1">
                  <div class="font-medium text-gray-900">Carte bancaire</div>
                  <div class="text-sm text-gray-500">Bientôt disponible</div>
                </div>
                <div class="ml-auto">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </label> -->
            </div>
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
                <span>Livraison - {{ deliveryStore.selectedDelivery.commune_name }}</span>
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
              class="w-full mt-6 bg-[#ff9b02] cursor-pointer hover:bg-[#ff9b02]/80 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-sm transition-colors flex items-center justify-center space-x-2"
            >
              <div v-if="isSubmitting" class="animate-pulse">
                <div class="h-5 w-5 bg-white rounded"></div>
              </div>
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
              <li>• Service client: +225 XX XX XX XX XX</li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

const cartStore = useCartStore()
const deliveryStore = useDeliveryStore()

// SEO
useSeoMeta({
  title: 'Checkout - Ma Boutique',
  description: 'Finalisez votre commande en toute sécurité'
})

// Redirection si panier vide (uniquement côté client)
if (process.client && cartStore.isEmpty) {
  await navigateTo('/categorie')
}

// État du formulaire simplifié (adresse automatique via zone de livraison)
const orderForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  notes: '',
  paymentMethod: 'cod'
})

const isSubmitting = ref(false)

// États pour les zones de livraison
const selectedCityId = ref<number | null>(null)
const selectedCommuneId = ref<number | null>(null)
const selectedProductType = ref<'light' | 'medium' | 'heavy'>('medium')

// État pour les coupons
const couponCode = ref('')

// Types de produits
const productTypes = [
  { value: 'light', label: 'Léger', description: 'Moins de 2kg' },
  { value: 'medium', label: 'Moyen', description: '2kg à 10kg' },
  { value: 'heavy', label: 'Lourd', description: 'Plus de 10kg' }
]

// Calculs
const finalTotal = computed(() => {
  let total = cartStore.totalPrice
  
  // Ajouter frais de livraison
  if (deliveryStore.hasSelectedDelivery) {
    total += deliveryStore.selectedDelivery.shipping_cost
  }
  
  // Soustraire coupon
  if (deliveryStore.hasCoupon) {
    total -= deliveryStore.couponDiscount
  }
  
  return Math.max(0, total) // Ne peut pas être négatif
})

const canSubmit = computed(() => {
  return deliveryStore.hasSelectedDelivery && 
         orderForm.value.firstName && 
         orderForm.value.lastName && 
         orderForm.value.email && 
         orderForm.value.phone && 
         !isSubmitting.value
})

// Fonctions utilitaires
const formatPrice = (price: string | number) => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price

  return new Intl.NumberFormat("en-US",  {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice) + " FCFA"
}

const getPrice = (productType: string) => {
  const commune = deliveryStore.selectedCommune
  if (!commune) return 0
  
  switch (productType) {
    case 'light': return commune.price_light
    case 'medium': return commune.price_medium
    case 'heavy': return commune.price_heavy
    default: return 0
  }
}

const getProductTypeLabel = (type: string) => {
  const productType = productTypes.find(t => t.value === type)
  return productType ? productType.label : type
}

// Actions pour les zones de livraison
const onCityChange = async () => {
  if (selectedCityId.value) {
    await deliveryStore.selectCity(selectedCityId.value)
    selectedCommuneId.value = null
  }
}

const onCommuneChange = async () => {
  if (selectedCommuneId.value) {
    await deliveryStore.selectCommune(selectedCommuneId.value)
  }
}

const onProductTypeChange = () => {
  deliveryStore.setProductType(selectedProductType.value)
}

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
  // Validation des zones de livraison
  if (!deliveryStore.hasSelectedDelivery) {
    alert('Veuillez sélectionner une zone de livraison')
    return
  }
  
  isSubmitting.value = true
  
  try {
    const orderData = {
      customer: orderForm.value,
      items: cartStore.items,
      total: finalTotal.value,
      shipping_cost: deliveryStore.selectedDelivery.shipping_cost,
      payment_method: orderForm.value.paymentMethod,
      billing: {
        first_name: orderForm.value.firstName,
        last_name: orderForm.value.lastName,
        email: orderForm.value.email,
        phone: orderForm.value.phone,
        address_1: deliveryStore.selectedDelivery.commune_name, // Commune comme adresse
        city: deliveryStore.selectedDelivery.city_name, // Ville sélectionnée
        state: '', // Pas de région pour la Côte d'Ivoire
        postcode: '', // Pas de code postal
        country: 'CI' // Côte d'Ivoire par défaut
      },
      delivery_info: {
        city_id: deliveryStore.selectedDelivery.city_id,
        city_name: deliveryStore.selectedDelivery.city_name,
        commune_id: deliveryStore.selectedDelivery.commune_id,
        commune_name: deliveryStore.selectedDelivery.commune_name,
        product_type: deliveryStore.selectedDelivery.product_type
      },
      coupon: deliveryStore.appliedCoupon ? {
        code: deliveryStore.appliedCoupon.code,
        discount: deliveryStore.appliedCoupon.discount
      } : null
    }

    console.log('Envoi de la commande:', orderData)

    const response = await $fetch('/api/orders/create', {
      method: 'POST',
      body: orderData
    })

    console.log('Réponse reçue:', response)

    if (response.success) {
      // Prépare les données pour la page de remerciements
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
        payment_method: orderForm.value.paymentMethod
      }
      
      console.log('Données pour page remerciements:', thankYouData)
      
      // Sauvegarde dans sessionStorage
      if (process.client) {
        sessionStorage.setItem('lastOrder', JSON.stringify(thankYouData))
        console.log('Données sauvegardées dans sessionStorage')
      }
      
      // Vide le panier et reset les données
      cartStore.clearCart()
      deliveryStore.resetDelivery()
      deliveryStore.removeCoupon()
      console.log('Panier et données vidés')
      
      // Redirection avec gestion d'erreur
      try {
        console.log('Redirection vers /merci...')
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

// Initialisation
onMounted(async () => {
  // Charge les villes disponibles
  try {
    await deliveryStore.loadCities()
  } catch (error) {
    console.error('Erreur chargement villes:', error)
  }
  
  // Restaure les données depuis le localStorage
  deliveryStore.loadFromStorage()
  
  // Synchronise les sélections avec les données restaurées
  if (deliveryStore.selectedDelivery.city_id) {
    selectedCityId.value = deliveryStore.selectedDelivery.city_id
    await deliveryStore.loadCommunes(deliveryStore.selectedDelivery.city_id)
    
    if (deliveryStore.selectedDelivery.commune_id) {
      selectedCommuneId.value = deliveryStore.selectedDelivery.commune_id
    }
    
    selectedProductType.value = deliveryStore.selectedDelivery.product_type
  }
})

// Sauvegarde automatique des sélections
watch([selectedCityId, selectedCommuneId, selectedProductType], () => {
  deliveryStore.saveToStorage()
})
</script>