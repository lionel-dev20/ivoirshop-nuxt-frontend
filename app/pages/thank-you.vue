<!-- pages/merci.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Chargement des détails de votre commande...</p>
      </div>

      <!-- Message si pas de données -->
      <div v-else-if="!orderData" class="text-center py-16">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
          <svg class="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.863-.833-2.633 0L4.138 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Informations de commande indisponibles</h1>
        <p class="text-gray-600 mb-6">
          Nous n'avons pas pu récupérer les détails de votre commande.<br>
          Vous devriez recevoir un email de confirmation sous peu.
        </p>
        <NuxtLink
          to="/"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Retour à l'accueil
        </NuxtLink>
      </div>
      <!-- En-tête de succès -->
      <div class="text-center mb-8">
        <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
          <svg class="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Merci pour votre commande !</h1>
        <p class="text-lg text-gray-600">
          Votre commande a été enregistrée avec succès et sera traitée dans les plus brefs délais.
        </p>
      </div>

      <!-- Détails de la commande -->
      <div v-if="orderData" class="bg-white rounded-lg shadow-sm border p-8 mb-8">
        <div class="border-b border-gray-200 pb-6 mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Détails de votre commande</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p class="text-sm font-medium text-gray-500">Numéro de commande</p>
              <p class="text-lg font-semibold text-gray-900">#{{ orderData.order_number }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Date</p>
              <p class="text-gray-900">{{ formatDate(orderData.date || new Date()) }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Total</p>
              <p class="text-lg font-semibold text-gray-900">{{ formatPrice(orderData.total) }}</p>
            </div>
          </div>
        </div>

        <!-- Informations client -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Informations de livraison</h3>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="font-medium">{{ orderData.customer?.firstName }} {{ orderData.customer?.lastName }}</p>
              <p class="text-gray-600 mt-1">{{ orderData.customer?.address }}</p>
              <p class="text-gray-600">{{ orderData.customer?.postalCode }} {{ orderData.customer?.city }}</p>
              <p class="text-gray-600">{{ getCountryName(orderData.customer?.country) }}</p>
              <div class="mt-3 pt-3 border-t border-gray-200">
                <p class="text-sm text-gray-600">
                  <span class="font-medium">Email:</span> {{ orderData.customer?.email }}
                </p>
                <p class="text-sm text-gray-600">
                  <span class="font-medium">Téléphone:</span> {{ orderData.customer?.phone }}
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Méthode de paiement</h3>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center">
                <svg class="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <div>
                  <p class="font-medium text-gray-900">Paiement à la livraison</p>
                  <p class="text-sm text-gray-600">Vous paierez lors de la réception de votre commande</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Articles commandés -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Articles commandés</h3>
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <div class="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-medium text-gray-500">
                <span>Produit</span>
                <span class="text-center">Prix unitaire</span>
                <span class="text-center">Quantité</span>
                <span class="text-right">Total</span>
              </div>
            </div>
            <div class="divide-y divide-gray-200">
              <div v-for="item in orderData.items" :key="item.product_id" class="px-6 py-4">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                      <img
                        v-if="item.image"
                        :src="item.image.src"
                        :alt="item.name"
                        class="w-full h-full object-cover"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        <span>—</span>
                      </div>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">{{ item.name }}</p>
                    </div>
                  </div>
                  <div class="text-center text-gray-900">
                    {{ formatPrice(item.price) }}
                  </div>
                  <div class="text-center text-gray-900">
                    {{ item.quantity }}
                  </div>
                  <div class="text-right font-medium text-gray-900">
                    {{ formatPrice(item.price * item.quantity) }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Récapitulatif des totaux -->
            <div class="bg-gray-50 px-6 py-4">
              <div class="space-y-2">
                <div class="flex justify-between text-sm text-gray-600">
                  <span>Sous-total</span>
                  <span>{{ formatPrice(subtotal) }}</span>
                </div>
                <div v-if="orderData.shipping_cost > 0" class="flex justify-between text-sm text-gray-600">
                  <span>Livraison</span>
                  <span>{{ formatPrice(orderData.shipping_cost) }}</span>
                </div>
                <div class="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>{{ formatPrice(orderData.total) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Prochaines étapes -->
      <div class="bg-blue-50 rounded-lg p-6 mb-8">
        <h3 class="text-lg font-medium text-blue-900 mb-4">Prochaines étapes</h3>
        <div class="space-y-3">
          <div class="flex items-start">
            <div class="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <span class="text-white text-sm font-bold">1</span>
            </div>
            <div>
              <p class="text-blue-900 font-medium">Confirmation par email</p>
              <p class="text-blue-700 text-sm">Vous recevrez un email de confirmation à {{ orderData?.customer?.email }}</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <span class="text-white text-sm font-bold">2</span>
            </div>
            <div>
              <p class="text-blue-900 font-medium">Préparation</p>
              <p class="text-blue-700 text-sm">Votre commande sera préparée et expédiée sous 1-2 jours ouvrés</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <span class="text-white text-sm font-bold">3</span>
            </div>
            <div>
              <p class="text-blue-900 font-medium">Livraison</p>
              <p class="text-blue-700 text-sm">Réception et paiement à la livraison (2-3 jours ouvrés)</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="text-center space-y-4">
        <div class="space-x-4">
          <NuxtLink
            to="/"
            class="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Retour à l'accueil
          </NuxtLink>
          
          <NuxtLink
            to="/categories"
            class="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7H6L5 9z" />
            </svg>
            Continuer les achats
          </NuxtLink>
        </div>
        
        <p class="text-sm text-gray-500 mt-4">
          Vous avez des questions ? 
          <a href="mailto:contact@ma-boutique.com" class="text-blue-600 hover:text-blue-800 font-medium">
            Contactez-nous
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// SEO
useSeoMeta({
  title: 'Merci pour votre commande - Ma Boutique',
  description: 'Votre commande a été enregistrée avec succès',
  robots: 'noindex, nofollow' // Page privée
})

// Récupération des données de commande depuis la query ou le sessionStorage
const orderData = ref(null)

onMounted(() => {
  // Essaie de récupérer depuis les paramètres de query
  if (route.query.data) {
    try {
      orderData.value = JSON.parse(decodeURIComponent(route.query.data as string))
    } catch (e) {
      console.error('Erreur parsing order data:', e)
    }
  }
  
  // Sinon depuis sessionStorage
  if (!orderData.value && process.client) {
    const savedOrderData = sessionStorage.getItem('lastOrder')
    if (savedOrderData) {
      try {
        orderData.value = JSON.parse(savedOrderData)
        // Nettoie après récupération
        sessionStorage.removeItem('lastOrder')
      } catch (e) {
        console.error('Erreur parsing saved order data:', e)
      }
    }
  }
  
  // Redirection si aucune donnée
  if (!orderData.value) {
    console.log('Aucune donnée de commande, redirection...')
    navigateTo('/')
  }
})

// Calculs
const subtotal = computed(() => {
  if (!orderData.value?.items) return 0
  return orderData.value.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

// Fonctions utilitaires
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

const getCountryName = (code: string) => {
  const countries = {
    'FR': 'France',
    'BE': 'Belgique',
    'CH': 'Suisse',
    'LU': 'Luxembourg'
  }
  return countries[code] || code
}
</script>