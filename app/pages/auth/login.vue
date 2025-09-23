<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md bg-white p-8 rounded shadow">
      <h1 class="text-2xl font-bold mb-6 text-center">Connexion</h1>

      <div class="mb-4">
        <label class="block font-semibold mb-1">Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="Entrez votre email"
          class="w-full border px-3 py-2 rounded"
        />
      </div>

      <div class="mb-4">
        <label class="block font-semibold mb-1">Mot de passe</label>
        <input
          v-model="password"
          type="password"
          placeholder="Mot de passe"
          class="w-full border px-3 py-2 rounded"
        />
      </div>

      <button
        @click="login"
        :disabled="loading"
        class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        <span v-if="!loading">Se connecter</span>
        <span v-else>Connexion...</span>
      </button>

      <p class="mt-4 text-sm text-center text-red-500" v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const login = async () => {
  loading.value = true
  error.value = ''

  try {
    const { data } = await axios.post('/api/woocommerce/login', {
      username: email.value,
      password: password.value
    })

    if (data.success && data.token) {
      // Stocker le token JWT dans localStorage
      localStorage.setItem('wc_token', data.token)
      // Rediriger vers la page profil
      router.push('/auth/profil')
    } else {
      error.value = data.error || 'Email ou mot de passe incorrect'
    }
  } catch (err) {
    console.error(err)
    error.value = 'Erreur de connexion'
  } finally {
    loading.value = false
  }
}
</script>
