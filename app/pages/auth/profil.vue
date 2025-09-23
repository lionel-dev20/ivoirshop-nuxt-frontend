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
import axios from 'axios'
import { useRouter } from 'vue-router'

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

const user = ref<User | null>(null)
const orders = ref<Order[]>([])
const loading = ref(true)

const firstName = ref('')
const lastName = ref('')
const email = ref('')

const router = useRouter()

onMounted(() => {
  const token = localStorage.getItem('wc_token')
  if (!token) {
    router.push('/auth/login')
  } else {
    fetchProfile(token)
    fetchOrders(token)
  }
})

const fetchProfile = async (token: string) => {
  try {
    const { data } = await axios.get('/api/woocommerce/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    user.value = data
    firstName.value = data.first_name
    lastName.value = data.last_name
    email.value = data.email
  } catch (err) {
    console.error('Erreur récupération profil :', err)
    localStorage.removeItem('wc_token')
    router.push('/auth/login')
  }
}

const fetchOrders = async (token: string) => {
  try {
    const { data } = await axios.get('/api/woocommerce/my-orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
    orders.value = data
  } catch (err) {
    console.error('Erreur récupération commandes :', err)
  } finally {
    loading.value = false
  }
}

const updateProfile = async () => {
  const token = localStorage.getItem('wc_token')
  if (!token) return

  try {
    const { data } = await axios.put(
      '/api/woocommerce/update-user',
      {
        first_name: firstName.value,
        last_name: lastName.value,
        email: email.value,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    user.value = data
    alert('Profil mis à jour avec succès !')
  } catch (err) {
    console.error('Erreur mise à jour :', err)
    alert("Impossible de mettre à jour le profil.")
  }
}

const logout = () => {
  localStorage.removeItem('wc_token')
  user.value = null
  router.push('/auth/login')
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}
</script>
