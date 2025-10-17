<template>
  <div class="md:min-h-screen flex md:items-center mx-auto my-10 md:my-0 px-3 md:px-0 justify-center bg-gray-50">
    <div class="w-full max-w-md bg-white p-8 rounded shadow">
      <h1 class="text-2xl font-bold md:mb-6 text-center">Connexion</h1>

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
        class="w-full bg-[#ff9900] text-white py-2 rounded hover:bg-[#ff9900de]"
      >
        <span v-if="!loading">Se connecter</span>
        <span v-else>Connexion...</span>
      </button>

      <p class="mt-4 text-sm text-center text-red-500" v-if="localError || error">
        {{ localError || error }}
      </p>
      
      <div class="mt-4 text-center">
        <p class="text-sm text-gray-600">
          Pas encore de compte ? 
          <NuxtLink to="/auth/signup" class="text-[#ff9900] hover:underline">
            S'inscrire
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { signin, loading, error } = useAuth()

const email = ref('')
const password = ref('')
const localError = ref('')

const login = async () => {
  localError.value = ''
  
  if (!email.value || !password.value) {
    localError.value = 'Veuillez remplir tous les champs'
    return
  }

  try {
    const result = await signin({
      username: email.value,
      password: password.value
    })
    
    if (result && result.user) {
      // Connexion réussie, redirection vers le profil
      await navigateTo('/auth/profil')
    }
  } catch (err: any) {
    console.error('Erreur de connexion:', err)
    localError.value = err.message || error.value || 'Erreur lors de la connexion'
  }
}
</script>
