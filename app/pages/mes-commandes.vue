<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- En-tête -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Mes commandes</h1>
      <p class="mt-2 text-gray-600">Consultez l'historique de toutes vos commandes</p>
    </div>

    <!-- État de chargement -->
    <div v-if="loading" class="text-center py-16">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff9900]"></div>
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
          class="mt-4 bg-[#ff9900] hover:bg-[#e68a00] text-white px-6 py-2 rounded-lg transition-colors"
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
          class="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#ff9900] hover:bg-[#e68a00]"
        >
          Commencer mes achats
        </NuxtLink>
      </div>
    </div>

    <!-- Liste des commandes -->
    <div v-else>
      <!-- Statistiques rapides -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-orange-100 rounded-md p-3">
              <svg class="h-6 w-6 text-[#ff9900]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <!-- Tableau des commandes -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <!-- Desktop table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">N°</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Produit(s)</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                <th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Montant total</th>
                <th class="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="order in paginatedOrders" :key="order.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{{ order.id }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-700">
                  <div class="max-w-xs">
                    <p v-for="(item, i) in order.items" :key="item.product_id" class="truncate">
                      <span v-if="i < 2">{{ item.name }} <span class="text-gray-400">x{{ item.quantity }}</span></span>
                    </p>
                    <p v-if="order.items.length > 2" class="text-xs text-gray-400 mt-0.5">
                      + {{ order.items.length - 2 }} autre(s) article(s)
                    </p>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(order.date_created) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getStatusClass(order.status)"
                    class="px-2.5 py-1 rounded-full text-xs font-medium"
                  >
                    {{ getStatusText(order.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                  {{ formatPrice(order.total) }} FCFA
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    @click="openOrderDetail(order)"
                    class="inline-flex items-center gap-1.5 text-[#ff9900] hover:text-[#e68a00] font-medium text-sm transition-colors cursor-pointer"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Voir
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile cards -->
        <div class="md:hidden divide-y divide-gray-200">
          <div v-for="order in paginatedOrders" :key="'m-' + order.id" class="p-4 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-gray-900">#{{ order.id }}</span>
              <span
                :class="getStatusClass(order.status)"
                class="px-2.5 py-1 rounded-full text-xs font-medium"
              >
                {{ getStatusText(order.status) }}
              </span>
            </div>
            <div class="text-sm text-gray-700">
              <p v-for="(item, i) in order.items" :key="item.product_id" class="truncate">
                <span v-if="i < 2">{{ item.name }} <span class="text-gray-400">x{{ item.quantity }}</span></span>
              </p>
              <p v-if="order.items.length > 2" class="text-xs text-gray-400">
                + {{ order.items.length - 2 }} autre(s)
              </p>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">{{ formatDate(order.date_created) }}</span>
              <span class="font-semibold text-gray-900">{{ formatPrice(order.total) }} FCFA</span>
            </div>
            <button
              @click="openOrderDetail(order)"
              class="inline-flex items-center gap-1.5 text-[#ff9900] hover:text-[#e68a00] font-medium text-sm transition-colors cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Voir le résumé
            </button>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p class="text-sm text-gray-500">
              Affichage de {{ (currentPage - 1) * perPage + 1 }} à {{ Math.min(currentPage * perPage, orders.length) }} sur {{ orders.length }} commandes
            </p>
            <div class="flex items-center gap-1">
              <button
                @click="currentPage = 1"
                :disabled="currentPage === 1"
                class="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <template v-for="page in visiblePages" :key="page">
                <button
                  v-if="page !== '...'"
                  @click="currentPage = Number(page)"
                  :class="[
                    'px-3 py-1.5 text-sm rounded-md border transition-colors',
                    currentPage === page
                      ? 'bg-[#ff9900] text-white border-[#ff9900]'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  {{ page }}
                </button>
                <span v-else class="px-2 text-gray-400">...</span>
              </template>

              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                @click="currentPage = totalPages"
                :disabled="currentPage === totalPages"
                class="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== MODAL DETAIL COMMANDE ========== -->
    <Teleport to="body">
      <div v-if="selectedOrder" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="selectedOrder = null">
        <!-- Overlay -->
        <div class="fixed inset-0 bg-black/50" @click="selectedOrder = null"></div>

        <!-- Modal -->
        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto z-10">
          <!-- Header -->
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900">Commande #{{ selectedOrder.id }}</h3>
            <button @click="selectedOrder = null" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-5 space-y-5">
            <!-- Statut + Date -->
            <div class="flex items-center justify-between">
              <span
                :class="getStatusClass(selectedOrder.status)"
                class="px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ getStatusText(selectedOrder.status) }}
              </span>
              <span class="text-sm text-gray-500">{{ formatDate(selectedOrder.date_created) }}</span>
            </div>

            <!-- Articles -->
            <div>
              <h4 class="text-sm font-semibold text-gray-700 mb-3">Articles commandés</h4>
              <div class="space-y-3">
                <div
                  v-for="item in selectedOrder.items"
                  :key="item.product_id"
                  class="flex items-center gap-3"
                >
                  <div class="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      v-if="item.image"
                      :src="item.image"
                      :alt="item.name"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</p>
                    <p class="text-xs text-gray-500">Quantité: {{ item.quantity }}</p>
                  </div>
                  <p class="text-sm font-semibold text-gray-900">{{ formatPrice(item.total) }} FCFA</p>
                </div>
              </div>
            </div>

            <!-- Infos livraison -->
            <div v-if="selectedOrder.billing && (selectedOrder.billing.address_1 || selectedOrder.billing.city)">
              <h4 class="text-sm font-semibold text-gray-700 mb-2">Livraison</h4>
              <div class="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 space-y-1">
                <p v-if="selectedOrder.billing.first_name || selectedOrder.billing.last_name">
                  {{ selectedOrder.billing.first_name }} {{ selectedOrder.billing.last_name }}
                </p>
                <p v-if="selectedOrder.billing.address_1">{{ selectedOrder.billing.address_1 }}</p>
                <p v-if="selectedOrder.billing.city">{{ selectedOrder.billing.city }}</p>
                <p v-if="selectedOrder.billing.phone">Tel: {{ selectedOrder.billing.phone }}</p>
              </div>
            </div>

            <!-- Paiement -->
            <div v-if="selectedOrder.payment_method_title">
              <h4 class="text-sm font-semibold text-gray-700 mb-2">Paiement</h4>
              <div class="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 space-y-1">
                <p>{{ selectedOrder.payment_method_title }}</p>
                <p v-if="selectedOrder.shipping_total && parseFloat(selectedOrder.shipping_total) > 0">
                  Frais de livraison: {{ formatPrice(selectedOrder.shipping_total) }} FCFA
                </p>
                <p v-if="selectedOrder.discount_total && parseFloat(selectedOrder.discount_total) > 0" class="text-green-600">
                  Réduction: -{{ formatPrice(selectedOrder.discount_total) }} FCFA
                </p>
              </div>
            </div>

            <!-- Note -->
            <div v-if="selectedOrder.customer_note">
              <h4 class="text-sm font-semibold text-gray-700 mb-2">Note</h4>
              <p class="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{{ selectedOrder.customer_note }}</p>
            </div>

            <!-- Total -->
            <div class="border-t-2 border-gray-200 pt-4 flex items-center justify-between">
              <span class="text-lg font-bold text-gray-900">Total</span>
              <span class="text-xl font-bold text-[#ff9900]">{{ formatPrice(selectedOrder.total) }} FCFA</span>
            </div>
          </div>

          <!-- Footer -->
          <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl flex gap-3">
            <button
              @click="selectedOrder = null"
              class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Fermer
            </button>
            <a
              :href="`/api/orders/invoice/${selectedOrder.id}`"
              target="_blank"
              class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#ff9900] text-white rounded-lg text-sm font-medium hover:bg-[#e68a00] transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Télécharger la facture
            </a>
          </div>
        </div>
      </div>
    </Teleport>
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
const currentPage = ref(1)
const perPage = 15
const selectedOrder = ref<Order | null>(null)

// Modal
function openOrderDetail(order: Order) {
  selectedOrder.value = order
}

// Pagination
const totalPages = computed(() => Math.ceil(orders.value.length / perPage))

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return orders.value.slice(start, start + perPage)
})

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i)
    }
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }
  return pages
})

// Statistiques
const completedOrdersCount = computed(() => {
  return orders.value.filter((order: Order) =>
    ['completed', 'delivered'].includes(order.status)
  ).length
})

const pendingOrdersCount = computed(() => {
  return orders.value.filter((order: Order) =>
    ['processing', 'pending', 'on-hold'].includes(order.status)
  ).length
})

// Charger les commandes
const loadOrders = async () => {
  loading.value = true
  error.value = ''

  try {
    if (!authUser.value?.id) {
      await navigateTo('/auth/login')
      return
    }

    const email = authUser.value.email ? encodeURIComponent(authUser.value.email) : ''
    const response = await $fetch<Order[]>(`/api/orders/user/${authUser.value.id}?email=${email}`)
    orders.value = response
  } catch (err: any) {
    error.value = err.statusMessage || err.message || 'Impossible de charger les commandes'
  } finally {
    loading.value = false
  }
}

// Formatage
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
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
    'failed': 'bg-red-100 text-red-800',
    'paye-par-mobile-money': 'bg-purple-100 text-purple-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status: string) => {
  const texts: { [key: string]: string } = {
    'pending': 'En attente',
    'processing': 'En traitement',
    'on-hold': 'En attente',
    'completed': 'Livrée',
    'cancelled': 'Annulée',
    'refunded': 'Remboursée',
    'failed': 'Échouée',
    'paye-par-mobile-money': 'Payée (Mobile Money)',
  }
  return texts[status] || status
}

// Initialisation
onMounted(async () => {
  await fetchUser()
  await loadOrders()
})
</script>
