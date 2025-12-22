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
            <th class="border px-4 py-2">Détails</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td class="border px-4 py-2">{{ order.id }}</td>
            <td class="border px-4 py-2">{{ formatDate(order.date_created) }}</td>
            <td class="border px-4 py-2">{{ order.total }} {{ order.currency }}</td>
            <td class="border px-4 py-2">{{ order.status }}</td>
            <td class="border px-4 py-2">
              <details>
                <summary class="cursor-pointer text-blue-600 hover:text-blue-800">Voir</summary>
                <ul class="mt-2 space-y-1">
                  <li v-for="item in order.items" :key="item.product_id" class="flex items-center space-x-2">
                    <img v-if="item.image" :src="item.image" :alt="item.name" class="w-10 h-10 object-cover rounded"/>
                    <div class="flex-1">
                      <p class="text-sm font-medium">{{ item.name }} (x{{ item.quantity }})</p>
                      <p class="text-xs text-gray-500">{{ item.total }} {{ order.currency }}</p>
                    </div>
                  </li>
                </ul>
              </details>
            </td>
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

interface OrderItem {
  product_id: number;
  name: string;
  quantity: number;
  total: string;
  image: string | null;
}
interface Order {
  id: number;
  status: string;
  date_created: string;
  total: string;
  currency: string;
  payment_method_title: string;
  shipping_total: string;
  discount_total: string;
  customer_note: string;
  items: OrderItem[];
}

const { user: authUser, logout: authLogout, fetchUser } = useAuth()

const user = ref<User | null>(null) // Utilisez l'interface User définie en haut
const orders = ref<Order[]>([])
const loading = ref(true)

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const activeTab = ref('profile') // Nouvelle ref pour gérer l'onglet actif (profil ou commandes)

onMounted(async () => {
  await fetchUser() // Toujours récupérer l'utilisateur pour s'assurer qu'il est à jour
  
  if (!authUser.value || !authUser.value.id) {
    await navigateTo('/auth/login')
    return
  }

  await loadProfileData()
})

const loadProfileData = async () => {
  loading.value = true
  try {
    // Mettre à jour les refs locaux avec les données d'authUser
    if (authUser.value) {
      user.value = authUser.value as User
      firstName.value = authUser.value.first_name || ''
      lastName.value = authUser.value.last_name || ''
      email.value = authUser.value.email || ''
    }

    // Récupérer les commandes de l'utilisateur via le nouvel endpoint Nuxt API
    if (user.value?.id) {
      const ordersResponse = await $fetch<Order[]>(`/api/orders/user/${user.value.id}`)
      orders.value = ordersResponse
    } else {
      orders.value = []
    }
  } catch (err: any) {
    // Gérer l'erreur d'API
    alert(err.statusMessage || err.message || 'Erreur lors du chargement du profil ou des commandes.')
    orders.value = []
  } finally {
    loading.value = false
  }
}

const updateProfile = async () => {
  loading.value = true // Activer le chargement pour le bouton
  try {
    if (!user.value?.id) {
      alert("ID utilisateur manquant. Impossible de mettre à jour le profil.")
      return
    }

    const response = await $fetch(`/api/auth/update-user/${user.value.id}`, {
      method: 'PUT',
      body: {
        first_name: firstName.value,
        last_name: lastName.value,
        email: email.value,
      },
      credentials: 'include'
    })
    
    if (response.success) {
      // Ré-fetch l'utilisateur pour mettre à jour l'état global et local
      await fetchUser()
      alert('Profil mis à jour avec succès !')
    } else {
      alert(response.message || "Impossible de mettre à jour le profil.")
    }
  } catch (err: any) {
    alert(err.statusMessage || err.message || "Impossible de mettre à jour le profil.")
  } finally {
    loading.value = false // Désactiver le chargement
  }
}

const logout = async () => {
  await authLogout()
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

// Exposer explicitement au template (peut aider certains linters)
// Bien que script setup le fasse automatiquement, cette étape est ajoutée pour la robustesse
// et pour s'assurer que toutes les variables sont reconnues.
// On n'a pas besoin de faire ça normalement avec Nuxt 3 et script setup.
// Cependant, si les erreurs de linter persistent, cela peut être un workaround.
defineExpose({
  user,
  orders,
  loading,
  firstName,
  lastName,
  email,
  activeTab,
  updateProfile,
  logout,
  formatDate
})
</script>
