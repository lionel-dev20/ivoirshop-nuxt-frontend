<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- En-tête -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Mes commandes</h1>
      <p class="mt-2 text-gray-600">Consultez l'historique de toutes vos commandes</p>
    </div>

    <!-- État de chargement -->
    <div v-if="loading" class="text-center py-16">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">Chargement de vos commandes...</p>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="text-center py-16">
      <div class="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="mt-4 text-xl font-semibold text-red-800">Erreur de chargement</h2>
        <p class="mt-2 text-red-600">{{ error }}</p>
        <button
          @click="loadOrders"
          class="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>

    <!-- Pas de commandes -->
    <div v-else-if="orders.length === 0" class="text-center py-16">
      <div class="max-w-md mx-auto">
        <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 class="mt-6 text-2xl font-semibold text-gray-900">Aucune commande</h2>
        <p class="mt-2 text-gray-600">Vous n'avez pas encore passé de commande.</p>
        <NuxtLink
          to="/"
          class="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Commencer mes achats 
        </NuxtLink>
      </div>
    </div>

    <!-- Liste des commandes -->
    <div v-else class="space-y-6">
      <!-- Statistiques rapides -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total commandes</p>
              <p class="text-2xl font-semibold text-gray-900">{{ orders.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-100 rounded-md p-3">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Commandes livrées</p>
              <p class="text-2xl font-semibold text-gray-900">{{ completedOrdersCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-orange-100 rounded-md p-3">
              <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">En cours</p>
              <p class="text-2xl font-semibold text-gray-900">{{ pendingOrdersCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Cartes de commandes -->
      <div class="space-y-4">
        <div
          v-for="order in orders"
          :key="order.id"
          class="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <!-- En-tête de la commande -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div class="flex items-center space-x-4">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    Commande #{{ order.id }}
                  </h3>
                  <p class="text-sm text-gray-500">
                    {{ formatDate(order.date_created) }}
                  </p>
                </div>
              </div>
              <div class="mt-4 sm:mt-0 flex items-center space-x-4">
                <span
                  :class="getStatusClass(order.status)"
                  class="px-3 py-1 rounded-full text-sm font-medium"
                >
                  {{ getStatusText(order.status) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Corps de la commande -->
          <div class="px-6 py-4">
            <!-- Articles -->
            <div class="space-y-3 mb-4">
              <h4 class="text-sm font-medium text-gray-700">Articles commandés</h4>
              <div class="space-y-2">
                <div
                  v-for="item in order.items"
                  :key="item.product_id"
                  class="flex items-center space-x-4 py-2 border-b border-gray-100 last:border-0"
                >
                  <div class="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                    <img
                      v-if="item.image"
                      :src="item.image"
                      :alt="item.name"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</p>
                    <p class="text-sm text-gray-500">Quantité: {{ item.quantity }}</p>
                  </div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ formatPrice(item.total) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Informations de livraison et paiement -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
              <!-- Livraison -->
              <div v-if="order.billing">
                <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Adresse de livraison
                </h4>
                <div class="text-sm text-gray-600 space-y-1">
                  <p>{{ order.billing.first_name }} {{ order.billing.last_name }}</p>
                  <p>{{ order.billing.address_1 }}</p>
                  <p>{{ order.billing.city }}</p>
                  <p v-if="order.billing.phone">{{ order.billing.phone }}</p>
                </div>
              </div>

              <!-- Paiement -->
              <div>
                <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Informations de paiement
                </h4>
                <div class="text-sm text-gray-600 space-y-1">
                  <p>Méthode: {{ order.payment_method_title }}</p>
                  <p v-if="order.shipping_total > 0">
                    Frais de livraison: {{ formatPrice(order.shipping_total) }}
                  </p>
                  <p v-if="order.discount_total > 0" class="text-green-600">
                    Réduction: -{{ formatPrice(order.discount_total) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Note client -->
            <div v-if="order.customer_note" class="mt-4 pt-4 border-t border-gray-200">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Note de commande</h4>
              <p class="text-sm text-gray-600">{{ order.customer_note }}</p>
            </div>

            <!-- Total -->
            <div class="mt-6 pt-4 border-t-2 border-gray-200 flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-900">Total</span>
              <span class="text-2xl font-bold text-blue-600">
                {{ formatPrice(order.total) }} {{ order.currency }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

// SEO
useSeoMeta({
  title: 'Mes commandes - IvoirShop',
  description: 'Consultez l\'historique de toutes vos commandes'
})

// Middleware d'authentification
definePageMeta({
  middleware: 'auth'
})

interface OrderItem {
  product_id: number
  name: string
  quantity: number
  total: string
  image: string | null
}

interface OrderBilling {
  first_name: string
  last_name: string
  email: string
  phone: string
  address_1: string
  city: string
  postcode: string
  country: string
}

interface Order {
  id: number
  order_number: string
  status: string
  date_created: string
  total: string
  currency: string
  payment_method: string
  payment_method_title: string
  shipping_total: string
  discount_total: string
  customer_note: string
  billing: OrderBilling
  items: OrderItem[]
}

const { user: authUser, fetchUser } = useAuth()

const orders = ref<Order[]>([])
const loading = ref(true)
const error = ref('')

// Statistiques
const completedOrdersCount = computed(() => {
  return orders.value.filter(order => 
    ['completed', 'delivered'].includes(order.status)
  ).length
})

const pendingOrdersCount = computed(() => {
  return orders.value.filter(order => 
    ['processing', 'pending', 'on-hold'].includes(order.status)
  ).length
})

// Charger les commandes
const loadOrders = async () => {
  loading.value = true
  error.value = ''
  
  try {
    console.log('==========================================')
    console.log('📱 CHARGEMENT COMMANDES (CLIENT)')
    console.log('==========================================')
    console.log('Utilisateur connecté:', authUser.value)
    console.log('ID utilisateur:', authUser.value?.id)
    
    if (!authUser.value?.id) {
      console.log('❌ Pas d\'utilisateur connecté, redirection vers login')
      await navigateTo('/auth/login')
      return
    }

    console.log('🌐 Appel API:', `/api/orders/user/${authUser.value.id}`)
    const response = await $fetch<Order[]>(`/api/orders/user/${authUser.value.id}`)
    
    console.log('✅ Réponse API reçue')
    console.log('Type:', typeof response)
    console.log('Est un tableau:', Array.isArray(response))
    console.log('Nombre de commandes:', Array.isArray(response) ? response.length : 'N/A')
    
    if (Array.isArray(response) && response.length > 0) {
      console.log('📦 Première commande:', response[0])
    }
    
    orders.value = response
    console.log('📋 Orders value assigné:', orders.value.length, 'commandes')
    console.log('==========================================')
  } catch (err: any) {
    console.error('==========================================')
    console.error('❌ ERREUR CHARGEMENT COMMANDES')
    console.error('==========================================')
    console.error('Erreur complète:', err)
    console.error('Message:', err.message)
    console.error('Status:', err.statusCode || err.status)
    console.error('Data:', err.data)
    console.error('==========================================')
    error.value = err.statusMessage || err.message || 'Impossible de charger les commandes'
  } finally {
    loading.value = false
  }
}

// Formatage
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price: string | number) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numPrice)
}

// Classes de statut
const getStatusClass = (status: string) => {
  const classes: { [key: string]: string } = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'processing': 'bg-blue-100 text-blue-800',
    'on-hold': 'bg-orange-100 text-orange-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'refunded': 'bg-gray-100 text-gray-800',
    'failed': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status: string) => {
  const texts: { [key: string]: string } = {
    'pending': 'En attente',
    'processing': 'En cours de traitement',
    'on-hold': 'En attente',
    'completed': 'Terminée',
    'cancelled': 'Annulée',
    'refunded': 'Remboursée',
    'failed': 'Échouée'
  }
  return texts[status] || status
}

// Initialisation
onMounted(async () => {
  await fetchUser()
  await loadOrders()
})
</script>

<style scoped>
/* Animations */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>