<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

      <!-- En-tête profil -->
      <div class="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden mb-6">
        <!-- Bannière -->
        <div class="h-32 bg-gradient-to-r from-[#ff9900] to-[#e68a00]"></div>

        <div class="px-6 pb-6">
          <!-- Avatar + infos -->
          <div class="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <!-- Avatar avec bouton modifier -->
            <div class="relative group">
              <div class="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
                <img
                  v-if="avatarPreview"
                  :src="avatarPreview"
                  alt="Avatar"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center bg-[#ff9900] text-white text-3xl font-bold">
                  {{ userInitials }}
                </div>
              </div>
              <label
                class="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
              >
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="onAvatarChange"
                />
              </label>
            </div>

            <div class="flex-1 sm:pb-1">
              <h1 class="text-2xl font-bold text-gray-900">
                {{ user?.first_name }} {{ user?.last_name }}
              </h1>
              <p class="text-gray-500">{{ user?.email }}</p>
            </div>

            <button
              @click="logout"
              class="self-start sm:self-end inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Se déconnecter
            </button>
          </div>
        </div>
      </div>

      <!-- Onglets -->
      <div class="flex gap-1 mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-1">
        <button
          @click="activeTab = 'profile'"
          :class="[
            'flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all',
            activeTab === 'profile'
              ? 'bg-[#ff9900] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Mon profil
        </button>
        <button
          @click="activeTab = 'orders'"
          :class="[
            'flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all',
            activeTab === 'orders'
              ? 'bg-[#ff9900] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Mes commandes
        </button>
      </div>

      <!-- ========== TAB: PROFIL ========== -->
      <div v-show="activeTab === 'profile'">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 class="text-lg font-bold text-gray-900 mb-6">Informations personnelles</h2>

          <!-- Message succès / erreur -->
          <div v-if="successMessage" class="mb-6 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg flex items-center gap-2">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {{ errorMessage }}
          </div>

          <form @submit.prevent="updateProfile" class="space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <!-- Prénom -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Prénom</label>
                <input
                  v-model="firstName"
                  type="text"
                  placeholder="Votre prénom"
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff9900]/20 focus:border-[#ff9900] transition-all"
                />
              </div>

              <!-- Nom -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
                <input
                  v-model="lastName"
                  type="text"
                  placeholder="Votre nom"
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff9900]/20 focus:border-[#ff9900] transition-all"
                />
              </div>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Adresse e-mail</label>
              <input
                v-model="email"
                type="email"
                placeholder="exemple@email.com"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff9900]/20 focus:border-[#ff9900] transition-all"
              />
            </div>

            <!-- Bouton -->
            <div class="flex justify-end pt-2">
              <button
                type="submit"
                :disabled="saving"
                class="inline-flex items-center gap-2 bg-[#ff9900] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#e68a00] focus:outline-none focus:ring-2 focus:ring-[#ff9900]/50 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <svg v-if="saving" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ saving ? 'Mise à jour...' : 'Enregistrer les modifications' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- ========== TAB: COMMANDES ========== -->
      <div v-show="activeTab === 'orders'">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <!-- Chargement -->
          <div v-if="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff9900]"></div>
            <p class="mt-3 text-sm text-gray-500">Chargement des commandes...</p>
          </div>

          <!-- Pas de commandes -->
          <div v-else-if="orders.length === 0" class="text-center py-12 px-6">
            <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 class="mt-4 text-lg font-semibold text-gray-900">Aucune commande</h3>
            <p class="mt-1 text-sm text-gray-500">Vous n'avez pas encore passé de commande.</p>
            <NuxtLink
              to="/"
              class="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#ff9900] rounded-lg hover:bg-[#e68a00] transition-colors"
            >
              Commencer mes achats
            </NuxtLink>
          </div>

          <!-- Tableau commandes récentes -->
          <template v-else>
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 class="text-lg font-bold text-gray-900">Commandes récentes</h2>
              <NuxtLink
                to="/mes-commandes"
                class="text-sm text-[#ff9900] hover:text-[#e68a00] font-medium transition-colors"
              >
                Voir tout
              </NuxtLink>
            </div>

            <!-- Desktop -->
            <div class="hidden sm:block overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">N°</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                    <th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">#{{ order.id }}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(order.date_created) }}</td>
                    <td class="px-6 py-4">
                      <span
                        :class="getStatusClass(order.status)"
                        class="px-2.5 py-1 rounded-full text-xs font-medium"
                      >
                        {{ getStatusText(order.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                      {{ formatPrice(order.total) }} FCFA
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mobile -->
            <div class="sm:hidden divide-y divide-gray-200">
              <div v-for="order in recentOrders" :key="'m-' + order.id" class="px-4 py-3 flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">#{{ order.id }}</p>
                  <p class="text-xs text-gray-500">{{ formatDate(order.date_created) }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-semibold text-gray-900">{{ formatPrice(order.total) }} FCFA</p>
                  <span
                    :class="getStatusClass(order.status)"
                    class="px-2 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ getStatusText(order.status) }}
                  </span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

useSeoMeta({
  title: 'Mon profil - IvoirShop',
  description: 'Gérez votre profil et consultez vos commandes'
})

definePageMeta({
  middleware: 'auth'
})

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
}

interface OrderItem {
  product_id: number
  name: string
  quantity: number
  total: string
  image: string | null
}

interface Order {
  id: number
  status: string
  date_created: string
  total: string
  currency: string
  payment_method_title: string
  shipping_total: string
  discount_total: string
  customer_note: string
  items: OrderItem[]
}

const { user: authUser, logout: authLogout, fetchUser } = useAuth()

const user = ref<User | null>(null)
const orders = ref<Order[]>([])
const loading = ref(true)
const saving = ref(false)
const activeTab = ref('profile')

const firstName = ref('')
const lastName = ref('')
const email = ref('')

const successMessage = ref('')
const errorMessage = ref('')

// Avatar
const avatarPreview = ref<string | null>(null)
const avatarFile = ref<File | null>(null)

const userInitials = computed(() => {
  const f = user.value?.first_name?.[0] || ''
  const l = user.value?.last_name?.[0] || ''
  return (f + l).toUpperCase() || '?'
})

const recentOrders = computed(() => orders.value.slice(0, 5))

const stripHtml = (text: string) => text.replace(/<[^>]*>/g, '')

// Avatar change — sauvegarde immédiate
function onAvatarChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  // Limiter la taille (max 500KB)
  if (file.size > 500 * 1024) {
    errorMessage.value = 'L\'image est trop lourde (max 500 Ko). Veuillez en choisir une plus petite.'
    return
  }

  avatarFile.value = file
  const reader = new FileReader()
  reader.onload = async (e) => {
    const base64 = e.target?.result as string
    avatarPreview.value = base64

    // Sauvegarder immédiatement sur le serveur
    if (user.value?.id) {
      try {
        await $fetch('/api/auth/avatar', {
          method: 'POST',
          body: { userId: user.value.id, avatar: base64 },
          credentials: 'include'
        })
        successMessage.value = 'Photo de profil mise à jour !'
        setTimeout(() => { successMessage.value = '' }, 3000)
      } catch {
        errorMessage.value = 'Erreur lors de la sauvegarde de la photo.'
        setTimeout(() => { errorMessage.value = '' }, 3000)
      }
    }
  }
  reader.readAsDataURL(file)
}

// Charger les données
onMounted(async () => {
  await fetchUser()

  if (!authUser.value?.id) {
    await navigateTo('/auth/login')
    return
  }

  await loadProfileData()

  // Charger l'avatar depuis les données utilisateur (stocké dans WooCommerce meta_data)
  if (authUser.value?.avatar) {
    avatarPreview.value = authUser.value.avatar
  }
})

const loadProfileData = async () => {
  loading.value = true
  try {
    if (authUser.value) {
      user.value = authUser.value as User
      firstName.value = authUser.value.first_name || ''
      lastName.value = authUser.value.last_name || ''
      email.value = authUser.value.email || ''
    }

    if (user.value?.id) {
      const userEmail = authUser.value?.email ? encodeURIComponent(authUser.value.email) : ''
      const ordersResponse = await $fetch<Order[]>(`/api/orders/user/${user.value.id}?email=${userEmail}`)
      orders.value = ordersResponse
    } else {
      orders.value = []
    }
  } catch (err: any) {
    orders.value = []
  } finally {
    loading.value = false
  }
}

const updateProfile = async () => {
  successMessage.value = ''
  errorMessage.value = ''
  saving.value = true

  try {
    if (!user.value?.id) {
      errorMessage.value = 'ID utilisateur manquant.'
      return
    }

    const response = await $fetch<{ success: boolean; message?: string }>(`/api/auth/update-user/${user.value.id}`, {
      method: 'PUT',
      body: {
        first_name: firstName.value,
        last_name: lastName.value,
        email: email.value,
      },
      credentials: 'include'
    })

    if (response.success) {
      await fetchUser()
      if (authUser.value) {
        user.value = authUser.value as User
      }
      successMessage.value = 'Profil mis à jour avec succès !'
      setTimeout(() => { successMessage.value = '' }, 3000)
    } else {
      errorMessage.value = stripHtml(response.message || 'Impossible de mettre à jour le profil.')
    }
  } catch (err: any) {
    errorMessage.value = stripHtml(err.statusMessage || err.message || 'Impossible de mettre à jour le profil.')
  } finally {
    saving.value = false
  }
}

const logout = async () => {
  await authLogout()
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
</script>
