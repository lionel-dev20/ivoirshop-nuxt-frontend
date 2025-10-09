<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Mon Profil</h1>

    <!-- Informations utilisateur -->
    <div v-if="user" class="mb-6">
      <p class="text-lg font-semibold">
        {{ user.first_name }} {{ user.last_name }}
      </p>
      <p class="text-gray-600">{{ user.email }}</p>

      <button
        @click="logout"
        class="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Se déconnecter
      </button>
    </div>

    <!-- Formulaire mise à jour -->
    <div v-if="user" class="mb-10">
      <div class="mb-4">
        <label class="block font-semibold mb-1">Prénom</label>
        <input
          v-model="firstName"
          type="text"
          class="w-full border px-3 py-2 rounded"
        />
      </div>

      <div class="mb-4">
        <label class="block font-semibold mb-1">Nom</label>
        <input
          v-model="lastName"
          type="text"
          class="w-full border px-3 py-2 rounded"
        />
      </div>

      <div class="mb-4">
        <label class="block font-semibold mb-1">Email</label>
        <input
          v-model="email"
          type="email"
          class="w-full border px-3 py-2 rounded"
        />
      </div>

      <button
        @click="updateProfile"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Mettre à jour
      </button>
    </div>

    <!-- Commandes -->
    <h2 class="text-xl font-bold mb-4">Mes commandes récentes</h2>

    <div v-if="loading">Chargement...</div>

    <template v-else>
      <table v-if="orders.length" class="w-full border border-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-4 py-2">Commande #</th>
            <th class="border px-4 py-2">Date</th>
            <th class="border px-4 py-2">Total</th>
            <th class="border px-4 py-2">Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td class="border px-4 py-2">{{ order.id }}</td>
            <td class="border px-4 py-2">{{ formatDate(order.date_created) }}</td>
            <td class="border px-4 py-2">{{ order.total }} FCFA</td>
            <td class="border px-4 py-2">{{ order.status }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else>Aucune commande pour le moment.</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

// Middleware d'authentification
definePageMeta({
  middleware: 'auth'
})

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
}

interface Order {
  id: number
  status: string
  total: string
  date_created: string
}

const { user: authUser, logout: authLogout, fetchUser } = useAuth()

const user = ref<User | null>(null)
const orders = ref<Order[]>([])
const loading = ref(true)

const firstName = ref('')
const lastName = ref('')
const email = ref('')

onMounted(async () => {
  // Vérifier si l'utilisateur est connecté
  await fetchUser()
  
  if (!authUser.value) {
    await navigateTo('/auth/login')
    return
  }

  // Charger les données du profil
  await loadProfileData()
})

const loadProfileData = async () => {
  try {
    // Récupérer les données WooCommerce du profil
    const response = await $fetch('/api/woocommerce/me', {
      credentials: 'include'
    })
    
    if (response.data && !response.error) {
      user.value = response.data
      firstName.value = response.data.first_name || ''
      lastName.value = response.data.last_name || ''
      email.value = response.data.email || ''
    } else if (response.error) {
      console.error('Erreur profil:', response.error)
      // Utiliser les données de base depuis authUser
      if (authUser.value) {
        user.value = authUser.value as User
        firstName.value = authUser.value.first_name || ''
        lastName.value = authUser.value.last_name || ''
        email.value = authUser.value.email || ''
      }
    }

    // Récupérer les commandes
    const ordersResponse = await $fetch('/api/woocommerce/my-orders', {
      credentials: 'include'
    })
    
    if (ordersResponse.data && !ordersResponse.error) {
      orders.value = ordersResponse.data
    } else if (ordersResponse.error) {
      console.error('Erreur commandes:', ordersResponse.error)
      orders.value = []
    }
  } catch (err) {
    console.error('Erreur chargement profil :', err)
    // Utiliser les données de base depuis authUser en cas d'erreur
    if (authUser.value) {
      user.value = authUser.value as User
      firstName.value = authUser.value.first_name || ''
      lastName.value = authUser.value.last_name || ''
      email.value = authUser.value.email || ''
    }
  } finally {
    loading.value = false
  }
}

const updateProfile = async () => {
  try {
    const response = await $fetch('/api/woocommerce/update-user', {
      method: 'PUT',
      body: {
        first_name: firstName.value,
        last_name: lastName.value,
        email: email.value,
      },
      credentials: 'include'
    })
    
    if (response.data && !response.error) {
      user.value = response.data
      // Mettre à jour aussi l'utilisateur dans le composable
      await fetchUser()
      alert('Profil mis à jour avec succès !')
    } else {
      alert(response.error || "Impossible de mettre à jour le profil.")
    }
  } catch (err: any) {
    console.error('Erreur mise à jour :', err)
    alert(err?.data?.error || "Impossible de mettre à jour le profil.")
  }
}

const logout = async () => {
  await authLogout()
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}
</script>
